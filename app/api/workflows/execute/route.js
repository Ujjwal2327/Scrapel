import parser from "cron-parser";
import { timingSafeEqual } from "crypto";
import prisma from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/lib/types";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!isValidAuthorization(authHeader))
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");
    if (!workflowId)
      return Response.json(
        { error: "Bad request: Missing workflowId" },
        { status: 400 }
      );

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!workflow)
      return Response.json(
        { error: "Bad request: Workflow not found" },
        { status: 400 }
      );

    const executionPlan = JSON.parse(workflow.executionPlan);
    if (!executionPlan) {
      return Response.json(
        { error: "Bad request: Invalid execution plan" },
        { status: 400 }
      );
    }

    const cron = parser.parseExpression(workflow.cron, { utc: true });
    const nextRunAt = cron.next().toDate();
    if (!nextRunAt)
      return Response.json(
        { error: "Internal Server Error: Invalid cron expression" },
        { status: 500 }
      );

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          // Example syntax for executionPlan: [{ phase: 1, nodes: [entryPoint] }]
          create: executionPlan.flatMap(({ phase, nodes }) => {
            return nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    await executeWorkflow(execution.id, workflowId, nextRunAt);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function isValidAuthorization(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const secret = authHeader.slice("Bearer ".length);

  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    console.error("API_SECRET is not defined in the environment.");
    return false;
  }

  try {
    // to prevent from timing attacks also
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}
