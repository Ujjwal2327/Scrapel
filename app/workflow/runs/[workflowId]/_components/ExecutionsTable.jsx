"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coins, MoveDown } from "lucide-react";
import { datesToDurationString } from "@/lib/utils";
import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { ExecutionStatusIndicator } from "@/components/ExecutionStatusComponents";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExecutionsTable({ workflowId, initialData }) {
  const router = useRouter();

  const { data: executions } = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 7000,
  });

  const errorMessage = executions?.errorMessage;
  const toastShown = useRef(false);

  if (errorMessage && !toastShown.current) {
    toast.error(errorMessage);
    toastShown.current = true; // Ensure the toast is only shown once
  }

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="flex items-center flex-row-reverse text-right text-muted-foreground min-w-28">
              <MoveDown size={15} />
              <span>Started at</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {Array.isArray(executions) &&
            executions.map((execution) => {
              const duration = datesToDurationString(
                execution.completedAt,
                execution.startedAt
              );
              const formattedStartedAt = execution.startedAt
                ? formatDistanceToNow(execution.startedAt, { addSuffix: true })
                : "N/A";
              return (
                <TableRow
                  key={execution.id}
                  onClick={() => router.push(`${workflowId}/${execution.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{execution.id}</span>
                      <div className="text-muted-foreground text-xs">
                        <span>Triggered via </span>
                        <Badge variant="outline">{execution.trigger}</Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-center">
                        <ExecutionStatusIndicator status={execution.status} />
                        <span className="font-semibold capitalize">
                          {execution.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs mx-4">
                        {duration}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-center">
                        <Coins size={16} className="stroke-primary" />
                        <span className="font-semibold capitalize">
                          {execution.creditsConsumed}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs mx-6">
                        Credits
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {formattedStartedAt}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
