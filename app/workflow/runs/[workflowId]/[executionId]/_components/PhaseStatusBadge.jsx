import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Loader2,
  StickyNote,
} from "lucide-react";
import { ExecutionPhaseStatus } from "@/lib/types";

export function PhaseStatusBadge({ status }) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashed size={20} className="stroke-muted-foreground" />;
    case ExecutionPhaseStatus.RUNNING:
      return <Loader2 size={20} className="stroke-yellow-500 animate-spin" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleX size={20} className="stroke-destructive" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheck size={20} className="stroke-green-500" />;
    case ExecutionPhaseStatus.CREATED:
      return <StickyNote size={20} className="stroke-muted-foreground/80" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
