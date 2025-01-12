import "server-only";
export const dynamic = "force-dynamic";
import { isValidAuthorization } from "@/lib/utils";
import {
  cleanUpEnvironment,
  executeAllWorkflowPhases,
} from "@/lib/workflow/executeWorkflow";

export async function POST(request) {
  const environment = { phases: {} };
  let creditsConsumed = 0;
  let executionFailed = false;

  try {
    const authHeader = request.headers.get("authorization");
    if (!isValidAuthorization(authHeader))
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const requestBody = await request.json(); // Parses the incoming JSON body
    const { phases, edges, userId } = requestBody;

    // == null checks for both null and undefined
    if (phases == null || edges == null || userId == null)
      return Response.json(
        { error: "Bad request: Missing required fields" },
        { status: 400 }
      );

    const obj = await executeAllWorkflowPhases(
      phases,
      environment,
      edges,
      userId,
      creditsConsumed,
      executionFailed
    );
    creditsConsumed = obj.creditsConsumed;
    executionFailed = obj.executionFailed;

    return Response.json({ creditsConsumed, executionFailed }, { status: 200 });
  } catch (error) {
    console.error("Error in api/workflows/executor POST handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    // Clean up environment
    await cleanUpEnvironment(environment);
  }
}
