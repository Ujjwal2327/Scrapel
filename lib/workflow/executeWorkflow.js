// "use server"; // Indicates that this file or component should only run on the server
import "server-only"; // Ensures the entire file and its dependencies are server-only and excluded from the client bundle
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import {
  ExecutionPhaseStatus,
  TaskParamType,
  WorkflowExecutionStatus,
} from "@/lib/types";
import { createLogCollector } from "@/lib/utils";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutorRegistry } from "@/lib/workflow/executor/registry";
import { handleError } from "../withErrorHandling";

export async function executeWorkflow(executionId, workflowId) {
  // setup execution environment
  /*
  environment syntax -
    {
      phases: {
        [nodeId]: {
          inputs: { [name]: value },
          outputs: { [name]: value },
        },
      },
      browser,
      page,
    }
  */
  const environment = { phases: {} };
  let creditsConsumed = 0;
  let executionFailed = false;

  try {
    if (!executionId || typeof executionId !== "string")
      throw new UserError("Invalid workflow execution ID.");

    const { userId } = await auth();
    if (!userId) throw new UserError("Authentication required. Please log in.");

    const execution = await prisma.workflowExecution.findUniqueOrThrow({
      where: {
        id: executionId,
        userId,
      },
      include: {
        phases: {
          orderBy: {
            number: "asc",
          },
        },
      },
    });

    const { edges } = JSON.parse(execution.definition);

    // initialize workflow, execution and phases - update workflow, execution and phases details
    await initializeWorkflowExecution(execution);

    // execute phase
    for (const phase of execution.phases) {
      // execute phase
      const phaseExecution = await executeWorkflowPhase(
        phase,
        environment,
        edges,
        userId
      );
      // consume credits
      creditsConsumed += phaseExecution.creditsConsumed;
      if (!phaseExecution.success) {
        executionFailed = true;
        break; // no need to execute next phases
      }
    }
  } catch (error) {
    executionFailed = true;
    handleError(error, "executeWorkflow", "execute workflow phases", false);
  } finally {
    // finalize workflow and execution - update workflow and execution details
    await finalizeWorkflowExecution(
      executionId,
      workflowId,
      executionFailed,
      creditsConsumed
    );

    // Clean up environment
    await cleanUpEnvironment(environment);

    // Revalidate path
    revalidatePath("/workflow/runs");
  }
}

async function initializeWorkflowExecution(execution) {
  const startedAt = new Date(); // Mark start time for tracking

  try {
    // Update workflow execution status to RUNNING and set start time
    await prisma.workflowExecution.update({
      where: {
        id: execution.id,
      },
      data: {
        status: WorkflowExecutionStatus.RUNNING,
        startedAt,
      },
    });

    // Update the workflow's last run details
    await prisma.workflow.update({
      where: {
        id: execution.workflowId,
      },
      data: {
        lastRunId: execution.id,
        lastRunStatus: WorkflowExecutionStatus.RUNNING,
        lastRunAt: startedAt,
      },
    });

    // Update all phases to PENDING status
    await prisma.executionPhase.updateMany({
      where: {
        id: {
          in: execution.phases.map((phase) => phase.id),
        },
      },
      data: {
        status: ExecutionPhaseStatus.PENDING,
      },
    });
  } catch (error) {
    throw new UserError("Failed to initialize workflow execution.");
  }
}

async function executeWorkflowPhase(phase, environment, edges, userId) {
  const logCollector = createLogCollector(); // { getAll, info, error } - all are functions
  const startedAt = new Date(); // Track the start time
  const node = JSON.parse(phase.node);
  let success = true;

  // add environment.phases[nodeId].inputs and environment.phases[nodeId].outputs
  setupEnvironmentForNode(node, environment, edges, logCollector);

  // update phase details
  try {
    // Update the phase status to RUNNING
    await prisma.executionPhase.update({
      where: {
        id: phase.id,
      },
      data: {
        status: ExecutionPhaseStatus.RUNNING,
        startedAt,
        inputs: JSON.stringify(environment.phases[node.id].inputs),
      },
    });
  } catch (error) {
    logCollector.error("Error in updating phase:", error.message);
    success = false;
  }

  // Decrement user credits if the phase update was successful
  const creditsRequired = TaskRegistry[node.data.type].credits;
  if (success) {
    const decrementCreditsSuccess = await decrementCredits(
      userId,
      creditsRequired,
      logCollector
    );
    if (!decrementCreditsSuccess) success = false;
  }
  const creditsConsumed = success ? creditsRequired : 0;

  // execute node if credits are sufficient
  if (success) success = await executeTask(node, environment, logCollector);

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    userId,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}

// for a node of particular phase, add inputs obj and outputs obj inside environment.phases[nodeId]
function setupEnvironmentForNode(node, environment, edges, logCollector) {
  // Initialize the node phase inputs and outputs
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const taskInputs = TaskRegistry[node.data.type].inputs;

  for (const taskInput of taskInputs) {
    const { name: taskInputName, type: taskInputType } = taskInput;

    // Skip BROWSER_INSTANCE type inputs (as defined in TaskParamType)
    if (taskInputType === TaskParamType.BROWSER_INSTANCE) continue;

    const inputValue = node.data.inputs[taskInputName];

    // Case 1: Input value is provided by the user
    if (inputValue) {
      environment.phases[node.id].inputs[taskInputName] = inputValue;
      continue;
    }

    // Case 2: Input value is coming from another node output
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === taskInputName
    );

    // If no connected edge, log an error
    if (!connectedEdge) {
      console.warn(
        `No connected edge found for node ${node.id}, input ${taskInputName}`
      );
      logCollector.error(`No connected edge found for input ${taskInputName}`);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle
      ];

    environment.phases[node.id].inputs[taskInputName] = outputValue;
  }
}

async function decrementCredits(userId, creditsRequired, logCollector) {
  try {
    // Find the user balance
    const userBalance = await prisma.userBalance.findUniqueOrThrow({
      where: {
        userId,
      },
    });

    // If insufficient balance
    if (userBalance.credits < creditsRequired) {
      logCollector.error("Insufficient balance.");
      return false; // Not enough credits or user not found
    }

    // Decrement the user's credits
    await prisma.userBalance.update({
      where: {
        userId,
      },
      data: {
        credits: {
          decrement: creditsRequired,
        },
      },
    });

    return true; // Successful credit decrement
  } catch (error) {
    logCollector.error("Error in database query while decrementing credits.");
    return false; // Failed to decrement credits due to an error
  }
}

async function executeTask(node, environment, logCollector) {
  // Check if the executor function exists for the given node type
  const runFunction = ExecutorRegistry[node.data.type];
  if (typeof runFunction !== "function") {
    logCollector.error(
      `No executor function found for node type: ${node.data.type}`
    );
    return false;
  }

  /*
  executorEnvironment Syntax: 
    {
      getInput: (name){}, setOutput: (name,value){},
      setBrowser: (browser){}, getBrowser: (){},
      setPage: (page){}, getPage: (){},
      log: { getAll: (){}, info: (message){}, error: (message){} }
    }
  */
  const executorEnvironment = createExecutorEnvironment(
    node,
    environment,
    logCollector
  );

  try {
    await runFunction(executorEnvironment);
    return true;
  } catch (error) {
    logCollector.error(error.message);
    return false;
  }
}

function createExecutorEnvironment(node, environment, logCollector) {
  // Ensure the node exists in the environment phases
  if (!environment.phases[node.id]) {
    logCollector.error(`Node not found in environment phases.`);
    return null;
  }

  return {
    // Access phase inputs and outputs safely
    getInput: (name) => {
      if (environment.phases[node.id].inputs[name] === undefined) {
        logCollector.error(`Input '${name}' not found for this node`);
        return undefined;
      }
      return environment.phases[node.id].inputs[name];
    },

    setOutput: (name, value) => {
      environment.phases[node.id].outputs[name] = value;
    },

    setBrowser: (browser) => (environment.browser = browser),
    getBrowser: () => environment.browser,

    setPage: (page) => (environment.page = page),
    getPage: () => environment.page,

    log: logCollector,
  };
}

async function finalizePhase(
  phaseId,
  userId,
  success,
  outputs,
  logCollector,
  creditsConsumed
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  try {
    await prisma.executionPhase.update({
      where: {
        id: phaseId,
        userId,
      },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        outputs: JSON.stringify(outputs),
        creditsConsumed,
        logs: {
          createMany: {
            data: logCollector.getAll().map((log) => ({
              label: log.label,
              message: log.message,
              timestamp: log.timestamp,
            })),
          },
        },
      },
    });
  } catch (error) {
    logCollector.error("Error in database query.");
  }
}

async function finalizeWorkflowExecution(
  executionId,
  workflowId,
  executionFailed,
  creditsConsumed
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;
  try {
    await prisma.workflowExecution.update({
      where: {
        id: executionId,
      },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        creditsConsumed,
      },
    });
  } catch (error) {
    throw new UserError("Failed to finalize workflow execution.");
  }

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      // ignore - because it may happen that we triggered other executions for this workflow while a past execution was running
    });
}

async function cleanUpEnvironment(environment) {
  try {
    if (environment.browser) await environment.browser.close();
  } catch (error) {
    console.error("Cannot close browser. Reason:", error);
  }
}
