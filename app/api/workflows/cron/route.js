import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types";
import { getAppUrl } from "@/lib/utils";

export async function GET(request) {
  try {
    const now = new Date();

    // Fetch workflows that are ready to be triggered
    const workflows = await prisma.workflow.findMany({
      where: {
        status: WorkflowStatus.PUBLISHED,
        cron: {
          not: null,
        },
        nextRunAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        nextRunAt: true,
      },
    });

    if (workflows.length === 0)
      return Response.json({ workflowsLength: 0 }, { status: 200 });

    // Trigger workflows in parallel
    await Promise.allSettled(
      workflows.map((workflow) => triggerWorkflow(workflow.id))
    );

    return Response.json(
      { workflowsLength: workflows.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in api/workflows/cron GET handler:", error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function triggerWorkflow(workflowId) {
  try {
    const API_SECRET = process.env.API_SECRET;

    if (!API_SECRET) throw new Error("API_SECRET is not defined.");

    const triggeredApiUrl = getAppUrl(
      `api/workflows/executeCron?workflowId=${workflowId}`
    );

    const response = await fetch(triggeredApiUrl, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
      cache: "no-store",
      // signal: AbortSignal.timeout(15000), // Uncomment if timeout is required
    });

    if (!response.ok)
      throw new Error(
        `Failed to trigger workflow (ID: ${workflowId}): ${response.statusText}`
      );

    console.log(`Workflow ${workflowId} triggered successfully.`);
  } catch (error) {
    console.error(
      `Error in triggerWorkflow with workflowId: ${workflowId}, message: ${error.message}`
    );
  }
}
