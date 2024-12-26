"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { duplicateWorkflowSchema } from "@/schemas/workflows";

export async function duplicateWorkflow(form) {
  return withErrorHandling(
    async () => {
      const { success, data } = duplicateWorkflowSchema.safeParse(form);
      if (!success)
        throw new UserError("Invalid form data. Please check your input.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const { workflowId, ...workflowData } = data;

      const sourceWorkflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
          userId,
        },
      });

      const workflow = await prisma.workflow.create({
        data: {
          userId,
          definition: sourceWorkflow.definition,
          ...workflowData,
        },
      });

      revalidatePath(`/workflows`);
    },
    "duplicateWorkflow",
    "duplicate workflow"
  );
}
