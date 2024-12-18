"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getWorkflow(id) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });

      return workflow;
    },
    "getWorkflow",
    "fetch workflow"
  );
}
