"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getPeriods() {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const earliestExecution = await prisma.workflowExecution.aggregate({
        where: {
          userId,
        },
        _min: {
          startedAt: true,
        },
      });

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const earliestStartedAt = earliestExecution._min.startedAt || new Date();
      const earliestMonth = earliestStartedAt.getMonth();
      const earliestYear = earliestStartedAt.getFullYear();

      const periods = [];
      for (let year = earliestYear; year <= currentYear; year++) {
        const startMonth = year === earliestYear ? earliestMonth : 0;
        const endMonth = year === currentYear ? currentMonth : 11;

        for (let month = startMonth; month <= endMonth; month++)
          periods.push({ year, month });
      }

      return periods;
    },
    "getPeriods",
    "fetch periods"
  );
}
