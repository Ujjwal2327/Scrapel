import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/lib/types";

const indicatorColors = {
  [WorkflowExecutionStatus.PENDING]: "bg-slate-400",
  [WorkflowExecutionStatus.RUNNING]: "bg-yellow-400",
  [WorkflowExecutionStatus.FAILED]: "bg-destructive",
  [WorkflowExecutionStatus.COMPLETED]: "bg-emerald-600",
};

const labelColors = {
  [WorkflowExecutionStatus.PENDING]: "text-slate-400",
  [WorkflowExecutionStatus.RUNNING]: "text-yellow-400",
  [WorkflowExecutionStatus.FAILED]: "text-destructive",
  [WorkflowExecutionStatus.COMPLETED]: "text-emerald-600",
};

export function ExecutionStatusIndicator({ status }) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

export function ExecutionStatusLabel({ status }) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
