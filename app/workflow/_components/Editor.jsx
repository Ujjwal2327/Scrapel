"use client";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowValidationContextProvider } from "@/context/FlowValidationContext";
import { WorkflowStatus } from "@/lib/types";
import { FlowEditor } from "./FlowEditor";
import { TaskMenu } from "./TaskMenu";
import { Topbar } from "./topbar/Topbar";

export function Editor({ workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex flex-col sm:flex-row h-full w-full overflow-hidden">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}
