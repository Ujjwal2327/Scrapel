import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/lib/types";

const indicatorColors = {
  [WorkflowExecutionStatus.PENDING]: "bg-slate-400",
  [WorkflowExecutionStatus.RUNNING]: "bg-yellow-400",
  [WorkflowExecutionStatus.FAILED]: "bg-destructive",
  [WorkflowExecutionStatus.COMPLETED]: "bg-emerald-600",
};

export function ExecutionStatusIndicator({ status }) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}
