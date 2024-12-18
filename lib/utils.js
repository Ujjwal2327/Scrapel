import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { intervalToDuration } from "date-fns";
import { FlowToExecutionPlanError } from "@/lib/types";

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
