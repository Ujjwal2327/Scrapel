"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { periodToDateRange } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/lib/types";

export async function getStatsCardsValues(period) {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const { startDate, endDate } = periodToDateRange(period);

      const executions = await prisma.workflowExecution.findMany({
        where: {
          userId,
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: [
              WorkflowExecutionStatus.COMPLETED,
              WorkflowExecutionStatus.FAILED,
            ],
          },
        },
        select: {
          creditsConsumed: true,
          _count: {
            select: {
              phases: {
                where: {
                  creditsConsumed: {
                    not: 0,
                  },
                },
              },
            },
          },
        },
      });

      const values = {
        workflowExecutions: executions.length,
        phaseExecutions: executions.reduce(
          (sum, execution) => sum + execution._count.phases,
          0
        ),
        creditsConsumed: executions.reduce(
          (sum, execution) => sum + execution.creditsConsumed,
          0
        ),
      };

      return values;
    },
    "getStatsCardsValues",
    "fetch stats"
  );
}
