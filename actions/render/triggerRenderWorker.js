import { executeWorkflow } from "@/lib/workflow/executeWorkflow";

export async function triggerRenderWorker(
  executionId,
  workflowId,
  nextRunAt = null
) {
  // run in background
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const RENDER_WORKER_TRIGGER_URL = `${process.env.RENDER_WORKER_URL}/trigger`;

  if (DEV_MODE) executeWorkflow(executionId, workflowId, nextRunAt);
  else
    fetch(RENDER_WORKER_TRIGGER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        executionId,
        workflowId,
        nextRunAt,
      }),
    }).catch((error) => {
      console.error("Error triggering the render worker:", error);
    });
}
