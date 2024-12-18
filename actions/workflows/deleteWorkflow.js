"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function deleteWorkflow(id) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid workflow ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      await prisma.workflow.delete({
        where: {
          id,
          userId,
        },
      });

      revalidatePath(`/workflow`);
    },
    "deleteWorkflow",
    "delete workflow"
  );
}
