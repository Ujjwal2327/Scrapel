"use client";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Coins,
  Copy,
  CornerDownRight,
  FileText,
  MoreVertical,
  MoveRight,
  Play,
  Shuffle,
  Trash,
} from "lucide-react";
import { WorkflowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DeleteWorkflowDialog } from "./DeleteWorkflowDialog";
import { DuplicateWorkflowDialog } from "./DuplicateWorkflowDialog";
import { ExecutePublishedWorkflowButton } from "./ExecutePublishedWorkflowButton";
import { SchedulerDialog } from "./SchedulerDialog";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import {
  ExecutionStatusIndicator,
  ExecutionStatusLabel,
} from "@/components/ExecutionStatusComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkflowCard({ workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center !flex-shrink-0",
              isDraft ? "bg-yellow-400 text-yellow-600" : "bg-primary"
            )}
          >
            {isDraft ? (
              <FileText className="h-5 w-5 stroke-primary-foreground" />
            ) : (
              <Play className="h-5 w-5 stroke-primary-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center gap-x-2">
              <TooltipWrapper content={workflow.description} delay={700}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex items-center hover:underline w-full !line-clamp-1 break-all"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {isDraft && (
                <Badge className="rounded-full font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-2">
                  Draft
                </Badge>
              )}
            </h3>
            <ScheduleSection
              workflowId={workflow.id}
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && (
            <ExecutePublishedWorkflowButton workflowId={workflow.id} />
          )}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden xs:flex items-center gap-2"
            )}
          >
            <Shuffle size={16} /> Edit
          </Link>
          <WorkflowActions workflow={workflow} />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} isDraft={isDraft} />
    </Card>
  );
}

function WorkflowActions({ workflow }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const { id, name, description } = workflow;

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="p-0">
            <TooltipWrapper content="More actions">
              <div className="rounded-md p-2">
                <MoreVertical size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setDropdownOpen(false);
              setShowDeleteDialog(true);
            }}
            className="text-destructive focus:text-destructive/90 space-x-2"
          >
            <Trash size={16} /> Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setDropdownOpen(false);
              setShowDuplicateDialog(true);
            }}
            className="space-x-2"
          >
            <Copy size={16} /> Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowId={id}
        workflowName={name}
      />

      <DuplicateWorkflowDialog
        open={showDuplicateDialog}
        setOpen={setShowDuplicateDialog}
        workflowId={id}
        workflowName={name}
        workflowDescription={description}
      />
    </>
  );
}

function ScheduleSection({ workflowId, isDraft, creditsCost, cron }) {
  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRight className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog workflowId={workflowId} initialCron={cron} />
      <MoveRight className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="space-x-2 text-muted-foreground rounded-sm"
        >
          <Coins className="h-4 w-4" />
          <span className="text-sm">{creditsCost}</span>
        </Badge>
      </div>
    </div>
  );
}

function LastRunDetails({ workflow, isDraft }) {
  if (isDraft) return null;

  const { lastRunId, lastRunAt, lastRunStatus, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextSchedule = nextRunAt && format(nextRunAt, "dd-MM-yyyy HH:mm:ss");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-primary/5 px-4 py-1 flex flex-wrap gap-x-6 gap-y-2 justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt ? (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span className="font-semibold">Last run:</span>
            <ExecutionStatusIndicator status={lastRunStatus} />
            <ExecutionStatusLabel status={lastRunStatus} />
            <span>{formattedStartedAt}</span>
            <ChevronRight
              size={14}
              className="-translate-x-0.5 group-hover:translate-x-0 transition"
            />
          </Link>
        ) : (
          <p>No runs yet</p>
        )}
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <Clock size={12} />
          <span className="font-semibold">Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
}
