"use client";
import { useEffect, useRef, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CircleDashed,
  Clock,
  Coins,
  Copy,
  Loader2,
  PanelLeft,
  WorkflowIcon,
} from "lucide-react";
import { getWorkflowExecution } from "@/actions/workflows/getWorkflowExecution";
// import { getExecutionPhase } from "@/actions/workflows/getExecutionPhase";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/lib/types";
import { cn, datesToDurationString, getPhasesTotalCost } from "@/lib/utils";
import { PhaseStatusBadge } from "./PhaseStatusBadge";
import { ReactCountUpWrapper } from "@/components/ReactCountUpWrapper";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExecutionViewer({ initialData }) {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [open, setOpen] = useState(true);

  const { data: workflowExecution } = useQuery({
    queryKey: ["execution", initialData.id],
    initialData,
    queryFn: () => getWorkflowExecution(initialData.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const errorMessage = workflowExecution?.errorMessage;
  const toastShown = useRef(false);

  if (errorMessage && !toastShown.current) {
    toast.error(errorMessage);
    toastShown.current = true; // Ensure the toast is only shown once
  }

  const { data: executionPhase } = useQuery({
    queryKey: ["phase", selectedPhase, workflowExecution?.status],
    enabled: !!selectedPhase,
    queryFn: async () =>
      workflowExecution?.phases?.find((phase) => phase.id === selectedPhase), // can become inefficient with a large number of phases
    // queryFn: () => getExecutionPhase(selectedPhase),
  });

  const errorMessage2 = executionPhase?.errorMessage;
  const toastShown2 = useRef(false);

  if (errorMessage2 && !toastShown2.current) {
    toast.error(errorMessage2);
    toastShown2.current = true; // Ensure the toast is only shown once
  }

  const isRunning =
    workflowExecution?.status === WorkflowExecutionStatus.RUNNING;
  const isPending =
    workflowExecution?.status === WorkflowExecutionStatus.PENDING;
  const isSelectedPhaseCompleted =
    executionPhase?.status === ExecutionPhaseStatus.COMPLETED ||
    executionPhase?.status === ExecutionPhaseStatus.FAILED;

  // runs once on component mount
  useEffect(() => {
    if (isPending) {
      setSelectedPhase(null);
      sessionStorage.removeItem("selectedPhase");
      return;
    }

    const phases = workflowExecution?.phases || [];
    if (!phases.length) return;

    const phaseToSelect = isRunning
      ? phases.find((phase) => phase.status === ExecutionPhaseStatus.RUNNING)
      : phases.find((phase) => phase.status === ExecutionPhaseStatus.FAILED) ||
        phases.at(-1);

    if (phaseToSelect?.id && phaseToSelect.id !== selectedPhase)
      setSelectedPhase(phaseToSelect.id);
  }, []);

  // automatic phase selection logic
  useEffect(() => {
    if (isPending) {
      setSelectedPhase(null);
      sessionStorage.removeItem("selectedPhase");
      return;
    }

    if (!selectedPhase) {
      sessionStorage.removeItem("selectedPhase");
      if (!isRunning) return;
    } else if (sessionStorage.getItem("selectedPhase")) return;

    const phases = workflowExecution?.phases || [];
    if (!phases.length) return;

    const phaseToSelect = isRunning
      ? phases.find((phase) => phase.status === ExecutionPhaseStatus.RUNNING)
      : phases.find((phase) => phase.status === ExecutionPhaseStatus.FAILED) ||
        phases.at(-1);

    if (phaseToSelect?.id && phaseToSelect.id !== selectedPhase)
      setSelectedPhase(phaseToSelect.id);
  }, [workflowExecution, selectedPhase]);

  // in small devices, if phase is selected, set open false
  useEffect(() => {
    const isSmallScreen = window?.matchMedia("(max-width: 640px)")?.matches;

    if (selectedPhase && isSmallScreen) setOpen(false);
  }, [selectedPhase]);

  return (
    <div className="flex w-full h-full">
      <Sidebar
        workflowExecution={workflowExecution}
        selectedPhase={selectedPhase}
        setSelectedPhase={setSelectedPhase}
        open={open}
        setOpen={setOpen}
      />

      <div className="flex flex-1 h-full overflow-auto">
        {executionPhase && isSelectedPhaseCompleted ? (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant="outline" className="space-x-4">
                <div className="flex gap-1 items-center">
                  <Coins size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{executionPhase.creditsConsumed}</span>
              </Badge>
              <Badge variant="outline" className="space-x-4">
                <div className="flex gap-1 items-center">
                  <Clock size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {datesToDurationString(
                    executionPhase.completedAt,
                    executionPhase.startedAt
                  )}
                </span>
              </Badge>
            </div>

            <ParameterViewer
              title="Inputs"
              subtitle="Inputs used for this phase"
              paramsJson={executionPhase.inputs}
            />

            <ParameterViewer
              title="Outputs"
              subtitle="Outputs generated by this phase"
              paramsJson={executionPhase.outputs}
              forOutputs
            />

            <LogViewer logs={executionPhase.logs} />
          </div>
        ) : isRunning || isPending ? (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold text-balance">
              Run is in progress, please wait...
            </p>
          </div>
        ) : (
          !selectedPhase && (
            <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
              <div className="flex flex-col gap-1 text-center">
                <p className="font-bold">No phase selected</p>
                <p className="font-sm text-muted-foreground">
                  Select a phase to view details
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Sidebar({
  workflowExecution,
  selectedPhase,
  setSelectedPhase,
  open,
  setOpen,
}) {
  const startedAt = workflowExecution?.startedAt
    ? formatDistanceToNow(new Date(workflowExecution?.startedAt), {
        addSuffix: true,
      })
    : "-";

  const duration = datesToDurationString(
    workflowExecution?.completedAt,
    workflowExecution?.startedAt
  );

  const creditsConsumed = getPhasesTotalCost(workflowExecution?.phases);

  const labels = [
    {
      icon: CircleDashed,
      label: "Status",
      value: (
        <div className="font-semibold capitalize flex gap-2 items-center">
          <PhaseStatusBadge status={workflowExecution?.status} />
          <span>{workflowExecution?.status}</span>
        </div>
      ),
    },
    {
      icon: Calendar,
      label: "Started at",
      value: <span className="lowercase">{startedAt}</span>,
    },
    {
      icon: Clock,
      label: "Duration",
      value:
        duration != "N/A" ? (
          duration
        ) : (
          <Loader2 size={20} className="animate-spin" />
        ),
    },
    {
      icon: Coins,
      label: "Credits consumed",
      value: <ReactCountUpWrapper value={creditsConsumed} />,
    },
  ];

  return (
    <div
      // Reset selectedPhase on any sidebar click
      onClick={() => setSelectedPhase(null)}
      className={cn(
        "max-h-full overflow-y-auto",
        open ? "border-r-2" : "overflow-hidden h-10 w-10 absolute"
      )}
    >
      <TooltipWrapper content="Toggle menu" side="right" delay={700}>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent resetting `selectedPhase`
            setOpen((prev) => !prev);
          }}
          variant="secondary"
          size="icon"
          className="self-start sticky top-0"
        >
          <PanelLeft />
        </Button>
      </TooltipWrapper>

      <aside
        className={cn(
          "transition-all duration-300 ease-in-out -mt-3",
          open ? "w-full sm:w-90 opacity-100" : "w-0 h-0 opacity-0"
        )}
      >
        <div className="py-4 px-2">
          {labels.map(({ icon, label, value }, index) => (
            <ExecutionLabel
              key={index}
              icon={icon}
              label={label}
              value={value}
            />
          ))}
        </div>
        <Separator />

        <div className="flex justify-center items-center text-muted-foreground gap-x-2 py-2 px-4">
          <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
          <span className="font-semibold">Phases</span>
        </div>
        <Separator />

        <div className="overflow-auto px-2 py-4">
          {Array.isArray(workflowExecution?.phases) &&
            workflowExecution?.phases.map((phase, index) => {
              const isPhaseCompleted =
                phase?.status === ExecutionPhaseStatus.COMPLETED ||
                phase?.status === ExecutionPhaseStatus.FAILED;

              return (
                <Button
                  key={phase.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent resetting `selectedPhase`
                    if (!isPhaseCompleted) {
                      setSelectedPhase(null);
                      return;
                    }
                    setSelectedPhase(phase.id);
                    sessionStorage.setItem("selectedPhase", phase.id);
                  }}
                  variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between",
                    !isPhaseCompleted && "cursor-default"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-1.5">
                      {index + 1}
                    </Badge>
                    <p className="font-semibold">{phase.name}</p>
                  </div>
                  <PhaseStatusBadge status={phase.status} />
                </Button>
              );
            })}
        </div>
      </aside>
    </div>
  );
}

function ExecutionLabel({ icon: Icon, label, value }) {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

function ParameterViewer({ title, subtitle, paramsJson, forOutputs }) {
  const params = paramsJson ? JSON.parse(paramsJson) : undefined;

  const handleCopy = async (textToCopy) => {
    const toastId = `copy-${textToCopy}`;
    toast.loading("Copying...", { id: toastId });

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Value copied to clipboard.", { id: toastId });
    } catch (err) {
      toast.error("Failed to copy value.", { id: toastId });
    }
  };

  return (
    <Card>
      <CardHeader className="rounded-t-xl border-b py-4 bg-secondary dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {!params || Object.keys(params).length === 0 ? (
            <p className="text-sm">No parameters generated by this phase</p>
          ) : (
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between sm:items-center space-y-1 flex-col sm:flex-row"
              >
                <p className="text-sm text-muted-foreground sm:flex-1 sm:basis-1/3">
                  {key}
                </p>
                <div className="flex justify-center items-center sm:flex-1 sm:basis-2/3 ">
                  <Input value={value} readOnly className="text-sm" />
                  {forOutputs && (
                    <Button
                      onClick={() => handleCopy(value)}
                      variant="ghost"
                      size="icon"
                      className="self-start"
                    >
                      <Copy />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }) {
  if (!logs || logs.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader className="rounded-t-xl border-b py-4 bg-secondary dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead className="pl-4 font-semibold">Time</TableHead>
              <TableHead className="pl-4 font-semibold">Label</TableHead>
              <TableHead className="pl-4 font-semibold">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={145}
                  className="text-xs text-muted-foreground p-0.5 pl-4"
                >
                  {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-1 pl-4",
                    log.label === "error" && "text-destructive",
                    log.label === "info" && "text-primary"
                  )}
                >
                  {log.label}
                </TableCell>
                <TableCell className="text-sm flex-1 p-1 pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
