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
      const earliestYear = earliestExecution._min.startedAt
        ? earliestExecution._min.startedAt.getFullYear()
        : currentYear;

      const periods = [];
      for (let year = earliestYear; year < currentYear; year++) {
        for (let month = 0; month <= 11; month++) periods.push({ year, month });
      }
      for (let month = 0; month <= currentMonth; month++)
        periods.push({ year: currentYear, month });

      return periods;
    },
    "getPeriods",
    "fetch periods"
  );
}
