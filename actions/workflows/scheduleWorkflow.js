"use server";
import { revalidatePath } from "next/cache";
import parser from "cron-parser";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function scheduleWorkflow({ id, cron }) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");
      if (!cron || typeof cron !== "string")
        throw new UserError("Invalid schedule expression.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const interval = parser.parseExpression(cron, { utc: true });

      await prisma.workflow.update({
        where: {
          id,
          userId,
        },
        data: {
          cron,
          nextRunAt: interval.next().toDate(),
        },
      });

      revalidatePath("/workflows");
    },
    "scheduleWorkflow",
    "schedule workflow"
  );
}
