import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";
import { FlowToExecutionPlanError } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { timingSafeEqual } from "crypto";

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

export function getAppUrl(path) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${appUrl}/${path}`;
}

export function formatToNumberString(
  input,
  min = null,
  max = null,
  defaultValue = "0"
) {
  // Convert input to a number
  let numericValue = parseFloat(input);

  // If the input is not a valid number, use the default value
  if (isNaN(numericValue)) numericValue = parseFloat(defaultValue);

  // Clamp the number to the specified range, if provided
  if (min !== null && numericValue < min) numericValue = min;
  if (max !== null && numericValue > max) numericValue = max;

  // Convert the number back to a string and return it
  return numericValue.toString();
}

export function convertToString(input) {
  if (typeof input === "object" && input !== null) {
    try {
      // If the object is a function, symbol, or contains circular references
      if (typeof input === "function" || typeof input === "symbol")
        return input.toString();

      return JSON.stringify(input);
    } catch (error) {
      throw new Error("Unable to convert JSON to string");
    }
  }

  // Handle primitive values
  return String(input);
}

export function normalizeJsonValue(value) {
  // value is string
  try {
    let parsedValue = value;

    // // Ensure any backticks-wrapped strings are treated properly (no effect on value)
    // parsedValue = parsedValue.replace(/`([^`]+)`/g, '"$1"');

    // Check if the value is wrapped in backticks (``) and remove them
    if (/^`.*`$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the backticks
    }

    // Check if the value is wrapped in single quotes and remove them
    if (/^'.*'$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the single quotes
    }

    // Check if the value is wrapped in double quotes and remove them
    if (/^".*"$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the double quotes
    }

    // Remove any trailing commas before closing brackets or braces
    parsedValue = parsedValue.replace(/,\s*([\]}])/g, "$1");

    // Normalize the string to valid JSON format by adding quotes around object keys
    parsedValue = parsedValue.replace(/(\w+):/g, '"$1":'); // Add quotes around keys for object-like strings

    // Replace single quotes with double quotes for string values in object or array
    parsedValue = parsedValue.replace(/'([^']+)'/g, '"$1"'); // Replace single quotes with double quotes for values

    // Handle array-like structures with JSON-compliant replacements
    parsedValue = parsedValue.replace(/undefined/g, "null"); // Replace undefined with null
    parsedValue = parsedValue.replace(/\bNaN\b/g, "null"); // Replace NaN with null

    // Parse the normalized value if it looks like an array or object
    if (/^[{\[][\s\S]*[}\]]$/.test(parsedValue)) {
      parsedValue = JSON.parse(parsedValue); // Parse it as JSON
    } else {
      // Handle edge cases (e.g., converting to primitive values)
      if (parsedValue === "true" || parsedValue === "false") {
        parsedValue = parsedValue === "true"; // Convert to boolean
      } else if (!isNaN(parsedValue)) {
        parsedValue = Number(parsedValue); // Convert to number
      } else if (parsedValue === "null") {
        parsedValue = null; // Convert to null if it's the string "null"
      } else if (parsedValue === "undefined") {
        parsedValue = undefined; // Convert to undefined if it's the string "undefined"
      }
    }

    return parsedValue;
  } catch (error) {
    // Return original value if parsing fails
    return value;
  }
}

export function periodToDateRange(period) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));
  return { startDate, endDate };
}

export function isValidAuthorization(authHeader) {
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
