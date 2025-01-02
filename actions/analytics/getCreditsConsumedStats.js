"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { periodToDateRange } from "@/lib/utils";
import { ExecutionPhaseStatus } from "@/lib/types";
import { eachDayOfInterval, format } from "date-fns";

export async function getCreditsConsumedStats(period) {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const { startDate, endDate } = periodToDateRange(period);

      const phases = await prisma.executionPhase.findMany({
        where: {
          userId,
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
          },
        },
        select: {
          creditsConsumed: true,
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

      phases.forEach((phase) => {
        const date = format(phase.startedAt, dateFormat);
        switch (phase.status) {
          case ExecutionPhaseStatus.COMPLETED:
            stats[date].success += phase.creditsConsumed;
            break;
          case ExecutionPhaseStatus.FAILED:
            stats[date].failed += phase.creditsConsumed;
            break;
        }
      });

      const result = Object.entries(stats).map(([date, info]) => ({
        date,
        ...info,
      }));

      return result;
    },
    "getCreditsConsumedStats",
    "fetch credits consumption stats"
  );
}
