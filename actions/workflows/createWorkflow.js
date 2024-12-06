"use server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/lib/types";
import { createWorkflowSchema } from "@/schemas/workflows";

export async function createWorkflow(form) {
  return withErrorHandling(
    async () => {
      const { success, data } = createWorkflowSchema.safeParse(form);
      if (!success)
        throw new UserError("Invalid form data. Please check your input.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const initialFlow = {
        nodes: [createFlowNode(TaskType.LAUNCH_BROWSER)],
        edges: [],
      };

      const workflow = await prisma.workflow.create({
        data: {
          userId,
          definition: JSON.stringify(initialFlow),
          ...data,
        },
      });

      redirect(`/workflow/editor/${workflow.id}`);
    },
    "createWorkflow",
    "create workflow"
  );
}
