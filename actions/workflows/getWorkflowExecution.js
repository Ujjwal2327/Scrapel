"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getWorkflowExecution(id) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow execution ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflowExecution =
        await prisma.workflowExecution.findUniqueOrThrow({
          where: {
            id,
            userId,
          },
          include: {
            phases: {
              orderBy: {
                number: "asc",
              },
              include: {
                logs: {
                  orderBy: {
                    timestamp: "asc",
                  },
                },
              },
            },
          },
        });

      // Custom sorting logic for phases after fetching data
      workflowExecution.phases.sort((a, b) => {
        if (a.number === b.number) {
          const aStartedAt = a.startedAt ? new Date(a.startedAt) : Infinity;
          const bStartedAt = b.startedAt ? new Date(b.startedAt) : Infinity;
          return aStartedAt - bStartedAt; // Ascending order (earlier phases first)
        }
        return a.number - b.number;
      });

      return workflowExecution;
    },
    "getWorkflowExecution",
    "fetch workflow execution"
  );
}
