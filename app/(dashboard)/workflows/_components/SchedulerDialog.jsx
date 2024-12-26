"use client";
import { useCallback, useEffect, useState } from "react";
import parser from "cron-parser";
import cronstrue from "cronstrue";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { scheduleWorkflow } from "@/actions/workflows/scheduleWorkflow";
import { unscheduleWorkflow } from "@/actions/workflows/unscheduleWorkflow";
import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Separator } from "@/components/ui/separator";

export function SchedulerDialog({ workflowId, initialCron }) {
  const [open, setOpen] = useState(false);
  const [cron, setCron] = useState(initialCron || "");
  const [readableCron, setReadableCron] = useState(null);
  const scheduleToastId = "schedule-workflow";
  const unscheduleToastId = "unschedule-workflow";
  const initialReadableCron =
    initialCron &&
    parser.parseExpression(initialCron) &&
    cronstrue.toString(initialCron);

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const readableCron = cronstrue.toString(cron);
      setReadableCron(readableCron);
    } catch (error) {
      setReadableCron(null);
    }
  }, [cron]);

  const scheduleMutation = useMutation({
    mutationFn: scheduleWorkflow,
    onSuccess: () => {
      toast.success("Workflow scheduled.", { id: scheduleToastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: scheduleToastId });
    },
  });

  const unscheduleMutation = useMutation({
    mutationFn: unscheduleWorkflow,
    onSuccess: () => {
      toast.success("Workflow unscheduled.", { id: unscheduleToastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: unscheduleToastId });
    },
  });

  const onSchedule = useCallback(() => {
    toast.loading("Scheduling workflow...", { id: scheduleToastId });
    scheduleMutation.mutate({ id: workflowId, cron });
  }, [scheduleMutation, workflowId, cron]);

  const onUnschedule = useCallback(() => {
    toast.loading("Unscheduling workflow...", { id: unscheduleToastId });
    unscheduleMutation.mutate(workflowId);
  }, [unscheduleMutation, workflowId]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        !open && setCron(initialCron);
        setOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "text-sm p-0 h-auto",
            !initialCron && "text-orange-500"
          )}
        >
          <TooltipWrapper content={initialReadableCron} delay={700}>
            <div className="flex items-center gap-2">
              {initialCron ? (
                <>
                  <Clock /> {initialCron}
                </>
              ) : (
                <>
                  <TriangleAlert /> Set schedule
                </>
              )}
            </div>
          </TooltipWrapper>
        </Button>
      </DialogTrigger>

      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Calendar}
          title="Schedule workflow execution"
        />

        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm text-balance text-center">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            placeholder="E.g. * * * * *"
          />

          <div
            className={cn(
              "rounded-md p-4 border text-sm",
              readableCron
                ? "bg-accent border-primary text-primary"
                : "bg-destructive/10 border-destructive text-destructive"
            )}
          >
            {readableCron ? readableCron : "Invalid cron expression"}
          </div>

          {initialCron && (
            <DialogClose asChild>
              <div>
                <Button
                  onClick={onUnschedule}
                  disabled={
                    scheduleMutation.isPending || unscheduleMutation.isPending
                  }
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive/90 border-destructive"
                >
                  Remove schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>

        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={onSchedule}
              disabled={
                scheduleMutation.isPending ||
                unscheduleMutation.isPending ||
                !readableCron ||
                cron === initialCron
              }
              className="w-full"
            >
              Schedule
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
