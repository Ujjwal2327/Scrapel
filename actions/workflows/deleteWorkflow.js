"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(id) {
  return withErrorHandling(
    async () => {
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
