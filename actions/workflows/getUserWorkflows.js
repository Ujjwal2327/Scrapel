"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getUserWorkflows() {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflows = await prisma.workflow.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return workflows;
    },
    "getUserWorkflows",
    "fetch workflows"
  );
}
