import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { intervalToDuration } from "date-fns";
import { FlowToExecutionPlanError } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/registry";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 2000));
}

export function datesToDurationString(end, start) {
  if (!start || !end) return "N/A";

  const timeElapsed = end.getTime() - start.getTime();

  // Return milliseconds if less than 1 second
  if (timeElapsed < 1000) return `${timeElapsed}ms`;

  // Convert time elapsed into a duration object
  const duration = intervalToDuration({ start: 0, end: timeElapsed });
  const units = [
    { unit: "years", value: duration.years },
    { unit: "months", value: duration.months },
    { unit: "days", value: duration.days },
    { unit: "hours", value: duration.hours },
    { unit: "minutes", value: duration.minutes },
    { unit: "seconds", value: duration.seconds },
  ];

  // Filter out null or undefined values and get the top two largest units
  const filteredUnits = units.filter((u) => u.value != null);
  const topTwoUnits = filteredUnits.slice(0, 2);

  // Format the output
  return topTwoUnits
    .map((u) => {
      if (u.unit === "minutes") return `${u.value}m`;
      if (u.unit === "months") return `${u.value}mo`;
      return `${u.value}${u.unit[0]}`;
    })
    .join(" ");
}

export function getPhasesTotalCost(phases = []) {
  return phases.reduce((acc, phase) => acc + phase.creditsConsumed, 0);
}

export function calculateWorkflowCost(nodes) {
  return nodes.reduce(
    (acc, node) => acc + TaskRegistry[node.data.type].credits,
    0
  );
}

export function createLogCollector() {
  const logs = [];
  const getAll = () => logs;
  const logFunctions = {};
  const labels = ["info", "error"];
  labels.forEach(
    (label) =>
      (logFunctions[label] = (message) =>
        logs.push({ label, message, timestamp: new Date() }))
  );

  return {
    getAll,
    ...logFunctions,
  };
}

export function getFlowToExecutionPlanErrorMessage(errorType) {
  const errorMessages = {
    [FlowToExecutionPlanError.NO_ENTRY_POINT]: "No entry point found.",
    [FlowToExecutionPlanError.INVALID_INPUTS]:
      "Please ensure all input values are set.",
  };

  return errorMessages[errorType] || "An unexpected error occurred.";
}

export function validateExecutionPlan(executionPlan) {
  if (!executionPlan) {
    console.warn("No execution plan generated.");
    return false;
  }

  if (!Array.isArray(executionPlan)) {
    console.warn("Execution plan should be an array.");
    return false;
  }

  for (let i = 0; i < executionPlan.length; i++) {
    const { phase, nodes } = executionPlan[i];

    if (typeof phase !== "number") {
      console.warn(`Invalid phase at index ${i}. Phase should be a number.`);
      return false;
    }

    if (!Array.isArray(nodes)) {
      console.warn(`Invalid nodes at index ${i}. Nodes should be an array.`);
      return false;
    }

    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];

      if (typeof node !== "object" || node === null) {
        console.warn(
          `Invalid node at phase ${phase}, node index ${j}. Expected an object.`
        );
        return false;
      }

      if (typeof node.id !== "string") {
        console.warn(
          `Invalid node id at phase ${phase}, node index ${j}. Node id should be a string.`
        );
        return false;
      }

      if (typeof node.type !== "string") {
        console.warn(
          `Invalid node type at phase ${phase}, node index ${j}. Node type should be a string.`
        );
        return false;
      }

      if (typeof node.data !== "object" || node.data === null) {
        console.warn(
          `Invalid node data at phase ${phase}, node index ${j}. Node data should be an object.`
        );
        return false;
      }

      const taskType = node.data?.type;
      if (
        !taskType ||
        !TaskRegistry[taskType] ||
        !TaskRegistry[taskType].label
      ) {
        console.warn(
          `Invalid node data.type at phase ${phase}, node index ${j}. Node data.type should be a valid type.`
        );
        return false;
      }
    }
  }

  return true;
}
