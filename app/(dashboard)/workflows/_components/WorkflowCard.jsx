"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, MoreVertical, Play, Shuffle, Trash } from "lucide-react";
import { WorkflowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DeleteWorkflowDialog } from "./DeleteWorkflowDialog";
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
import { TooltipWrapper } from "@/components/TooltipWrapper";

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
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline w-full !line-clamp-1 break-all"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <Badge className="rounded-full font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-2">
                  Draft
                </Badge>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden xs:flex items-center gap-2"
            )}
          >
            <Shuffle size={16} /> Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowActions({ workflowName, workflowId }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
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
              setShowDeleteDialog((prev) => !prev);
            }}
            className="text-destructive space-x-2"
          >
            <Trash size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
    </>
  );
}
