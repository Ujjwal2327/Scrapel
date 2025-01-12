import "server-only";
export const dynamic = "force-dynamic";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";
import { isValidAuthorization } from "@/lib/utils";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!isValidAuthorization(authHeader))
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");
    const executionId = searchParams.get("executionId");

    if (!workflowId)
      return Response.json(
        { error: "Bad request: Missing workflowId" },
        { status: 400 }
      );
    if (!executionId)
      return Response.json(
        { error: "Bad request: Missing executionId" },
        { status: 400 }
      );

    await executeWorkflow(executionId, workflowId);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
