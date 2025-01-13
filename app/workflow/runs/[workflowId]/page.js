import { Suspense } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { ExecutionsTable } from "./_components/ExecutionsTable";
import { Topbar } from "../../_components/topbar/Topbar";
import { ErrorAlert } from "@/components/ErrorAlert";

export default function WorkflowExecutionHistoryPage({ params }) {
  const { workflowId } = params;

  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        title="All runs"
        subtitle="List of all your workflow runs"
        workflowId={workflowId}
        hideButtons
      />
      <Suspense fallback={<ExecutionsTableSkeleton />}>
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

function ExecutionsTableSkeleton() {
  return (
    <div className="flex h-4/5 w-full items-center justify-center overflow-hidden">
      <Loader2 size={30} className="animate-spin stroke-primary" />
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }) {
  const executions = await getWorkflowExecutions(workflowId);

  if (executions?.errorMessage)
    return <ErrorAlert message={executions?.errorMessage} />;

  if (!executions.length)
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <Inbox size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow.
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
