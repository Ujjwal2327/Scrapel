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
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/lib/types";
import { getFlowToExecutionPlanErrorMessage } from "@/lib/utils";

export async function runWorkflow({ id, definition }) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");
      if (!definition || typeof definition !== "string")
        throw new UserError("Invalid flow.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });

      const flow = JSON.parse(definition);
      const { executionPlan, error } = flowToExecutionPlan(
        flow.nodes,
        flow.edges
      );
      if (error) {
        const errorMessage = getFlowToExecutionPlanErrorMessage(error.type);
        throw new UserError(errorMessage);
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
                  status: ExecutionPhaseStatus.CREATED,
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
    "execute workflow"
  );
}

function validateExecutionPlan(executionPlan) {
  if (!executionPlan) {
    console.log("No execution plan generated.");
    return false;
  }

  if (!Array.isArray(executionPlan)) {
    console.log("Execution plan should be an array.");
    return false;
  }

  for (let i = 0; i < executionPlan.length; i++) {
    const { phase, nodes } = executionPlan[i];

    if (typeof phase !== "number") {
      console.log(`Invalid phase at index ${i}. Phase should be a number.`);
      return false;
    }

    if (!Array.isArray(nodes)) {
      console.log(`Invalid nodes at index ${i}. Nodes should be an array.`);
      return false;
    }

    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];

      if (typeof node !== "object" || node === null) {
        console.log(
          `Invalid node at phase ${phase}, node index ${j}. Expected an object.`
        );
        return false;
      }

      if (typeof node.id !== "string") {
        console.log(
          `Invalid node id at phase ${phase}, node index ${j}. Node id should be a string.`
        );
        return false;
      }

      if (typeof node.type !== "string") {
        console.log(
          `Invalid node type at phase ${phase}, node index ${j}. Node type should be a string.`
        );
        return false;
      }

      if (typeof node.data !== "object" || node.data === null) {
        console.log(
          `Invalid node data at phase ${phase}, node index ${j}. Node data should be an object.`
        );
        return false;
      }

      const taskType = node.data?.type;
      if (
        !taskType ||
        !TaskRegistry[taskType] ||
        !TaskRegistry[taskType].label
      ) {
        console.log(
          `Invalid node data.type at phase ${phase}, node index ${j}. Node data.type should be a valid type.`
        );
        return false;
      }
    }
  }

  return true;
}
