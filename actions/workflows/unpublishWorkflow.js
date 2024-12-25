"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { WorkflowStatus } from "@/lib/types";

export async function unpublishWorkflow(id) {
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

      if (workflow.status !== WorkflowStatus.PUBLISHED)
        throw new UserError("Workflow must be in published status.");

      await prisma.workflow.update({
        where: {
          id,
          userId,
        },
        data: {
          executionPlan: null,
          creditsCost: 0,
          status: WorkflowStatus.DRAFT,
        },
      });

      revalidatePath(`/workflow/editor/${id}`);
    },
    "unpublishWorkflow",
    "unpublish workflow"
  );
}
