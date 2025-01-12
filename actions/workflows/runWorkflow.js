"use server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { flowToExecutionPlan } from "@/lib/workflow/flowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";
import {
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/lib/types";
import {
  getFlowToExecutionPlanErrorMessage,
  validateExecutionPlan,
} from "@/lib/utils";

export async function runWorkflow({ id, definition = null }) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });

      let executionPlan;
      if (workflow.status === WorkflowStatus.PUBLISHED) {
        executionPlan = JSON.parse(workflow.executionPlan);
        definition = workflow.definition;
      } else {
        if (!definition || typeof definition !== "string")
          throw new UserError("Invalid flow.");
        const flow = JSON.parse(definition);

        const { executionPlan: newExecutionPlan, error } = flowToExecutionPlan(
          flow.nodes,
          flow.edges
        );

        if (error) {
          const errorMessage = getFlowToExecutionPlanErrorMessage(error.type);
          throw new UserError(errorMessage);
        }
        executionPlan = newExecutionPlan;
      }

      const isValidExecutionPlan = validateExecutionPlan(executionPlan);
      if (!isValidExecutionPlan) throw new UserError("Invalid execution plan.");

      const execution = await prisma.workflowExecution.create({
        data: {
          userId,
          workflowId: id,
          definition,
          trigger: WorkflowExecutionTrigger.MANUAL,
          status: WorkflowExecutionStatus.PENDING,
          startedAt: new Date(),
          phases: {
            // Example syntax for executionPlan: [{ phase: 1, nodes: [entryPoint] }]
            create: executionPlan.flatMap(({ phase, nodes }) => {
              return nodes.flatMap((node) => {
                return {
                  userId,
                  number: phase,
                  node: JSON.stringify(node),
                  name: TaskRegistry[node.data.type].label,
                };
              });
            }),
          },
        },
        select: {
          id: true,
          phases: true,
        },
      });

      executeWorkflow(execution.id, id); // run in background

      redirect(`/workflow/runs/${id}/${execution.id}`);
    },
    "runWorkflow",
    "start workflow execution"
  );
}
