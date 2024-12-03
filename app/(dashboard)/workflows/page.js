export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Inbox } from "lucide-react";
import { getUserWorkflows } from "@/actions/workflows/getUserWorkflows";
import { CreateWorkflowDialog } from "./_components/CreateWorkflowDialog";
import { WorkflowCard } from "./_components/WorkflowCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";

export default function WorkflowsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between flex-wrap gap-x-10 gap-y-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await getUserWorkflows().catch((error) => ({
    errorMessage: error.message,
  }));

  if (workflows.errorMessage)
    return <ErrorAlert message={workflows.errorMessage} />;

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <div className="flex items-center justify-center rounded-full bg-accent w-20 h-20">
          <Inbox size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
