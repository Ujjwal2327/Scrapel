"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { periodToDateRange } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/lib/types";
import { eachDayOfInterval, format } from "date-fns";

export async function getWorkflowExecutionStats(period) {
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
          startedAt: true,
          status: true,
        },
      });

      const dateFormat = "yyyy-MM-dd";

      const stats = eachDayOfInterval({ start: startDate, end: endDate })
        .map((date) => format(date, dateFormat))
        .reduce((acc, date) => {
          acc[date] = { success: 0, failed: 0 };
          return acc;
        }, {});

      executions.forEach((execution) => {
        const date = format(execution.startedAt, dateFormat);

        switch (execution.status) {
          case WorkflowExecutionStatus.COMPLETED:
            stats[date].success++;
            break;
          case WorkflowExecutionStatus.FAILED:
            stats[date].failed++;
            break;
        }
      });

      const result = Object.entries(stats).map(([date, info]) => ({
        date,
        ...info,
      }));

      return result;
    },
    "getWorkflowExecutionStats",
    "fetch workflow execution stats"
  );
}
