import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getWorkflowExecution } from "@/actions/workflows/getWorkflowExecution";
import { Topbar } from "@/app/workflow/_components/topbar/Topbar";
import { ExecutionViewer } from "./_components/ExecutionViewer";
import { ErrorAlert } from "@/components/ErrorAlert";

export default function ExecutionViewerPage({ params }) {
  const { workflowId, executionId } = params;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        title="Workflow execution details"
        subtitle={`Execution ID: ${executionId}`}
        workflowId={workflowId}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={<ExecutionViewerWrapperFallback />}>
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

function ExecutionViewerWrapperFallback() {
  return (
    <div className="flex w-full items-center justify-center">
      <Loader2 className="h-10 w-10 stroke-primary animate-spin" />
    </div>
  );
}

async function ExecutionViewerWrapper({ executionId }) {
  const workflowExecution = await getWorkflowExecution(executionId).catch(
    (error) => ({
      errorMessage: error.message,
    })
  );

  if (workflowExecution.errorMessage)
    return <ErrorAlert message={workflowExecution.errorMessage} />;

  return <ExecutionViewer initialData={workflowExecution} />;
}
