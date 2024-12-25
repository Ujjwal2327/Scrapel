"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getWorkflowExecutions(workflowId) {
  return withErrorHandling(
    async () => {
      if (!workflowId || typeof workflowId !== "string")
        throw new UserError("Invalid workflow ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflowExecutions = await prisma.workflowExecution.findMany({
        where: {
          workflowId,
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return workflowExecutions;
    },
    "getWorkflowExecutions",
    "fetch workflow executions"
  );
}
