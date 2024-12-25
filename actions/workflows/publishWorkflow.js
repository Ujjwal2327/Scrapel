"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { flowToExecutionPlan } from "@/lib/workflow/flowToExecutionPlan";
import { WorkflowStatus } from "@/lib/types";
import {
  calculateWorkflowCost,
  getFlowToExecutionPlanErrorMessage,
  validateExecutionPlan,
} from "@/lib/utils";

export async function publishWorkflow({ id, definition }) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");
      if (!definition || typeof definition !== "string")
        throw new UserError("Invalid flow.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });

      if (workflow.status !== WorkflowStatus.DRAFT)
        throw new UserError("Workflow must be in draft status.");

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

      const creditsCost = calculateWorkflowCost(flow.nodes);

      await prisma.workflow.update({
        where: {
          id,
          userId,
        },
        data: {
          definition,
          executionPlan: JSON.stringify(executionPlan),
          creditsCost,
          status: WorkflowStatus.PUBLISHED,
        },
      });

      revalidatePath(`/workflow/editor/${id}`);
    },
    "publishWorkflow",
    "publish workflow"
  );
}
