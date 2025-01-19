"use server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { demoInitialFlow } from "@/lib/constants";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/lib/types";
import { createWorkflowSchema } from "@/schemas/workflows";

export async function createWorkflow(form) {
  return withErrorHandling(
    async () => {
      const { success, data } = createWorkflowSchema.safeParse(form);
      if (!success)
        throw new UserError("Invalid form data. Please check your inputs.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const { isDemo, ...workflowData } = data;

      let initialFlow;
      if (isDemo) initialFlow = demoInitialFlow;
      else
        initialFlow = {
          nodes: [createFlowNode(TaskType.LAUNCH_BROWSER)],
          edges: [],
        };

      const workflow = await prisma.workflow.create({
        data: {
          userId,
          definition: JSON.stringify(initialFlow),
          ...workflowData,
        },
      });

      redirect(`/workflow/editor/${workflow.id}`);
    },
    "createWorkflow",
    "create workflow"
  );
}
