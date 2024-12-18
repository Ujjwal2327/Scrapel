"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { WorkflowStatus } from "@/lib/types";

export async function updateWorkflow({ id, definition }) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");
      if (!definition || typeof definition !== "string")
        throw new UserError("Invalid flow.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });

      if (workflow.status !== WorkflowStatus.DRAFT)
        throw new UserError("Workflow must be in draft status.");

      await prisma.workflow.update({
        data: {
          definition,
        },
        where: {
          id,
          userId,
        },
      });

      revalidatePath("/workflows");
    },
    "updateWorkflow",
    "save workflow"
  );
}
