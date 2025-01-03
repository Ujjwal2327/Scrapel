"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { duplicateWorkflowSchema } from "@/schemas/workflows";

export async function renameWorkflow(form) {
  return withErrorHandling(
    async () => {
      const { success, data } = duplicateWorkflowSchema.safeParse(form);
      if (!success)
        throw new UserError("Invalid form data. Please check your inputs.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const { workflowId, ...workflowData } = data;

      await prisma.workflow.update({
        where: {
          id: workflowId,
          userId,
        },
        data: {
          ...workflowData,
        },
      });

      revalidatePath(`/workflows`);
    },
    "renameWorkflow",
    "rename workflow"
  );
}
