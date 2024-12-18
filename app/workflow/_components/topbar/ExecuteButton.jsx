import { useCallback } from "react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { useExecutionPlan } from "@/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";

export function ExecuteButton({ workflowId }) {
  const generateExecutionPlan = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Execution started.", { id: "start-workflow-execution" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "start-workflow-execution" });
    },
  });

  const onSubmit = useCallback(
    (id, definition) => {
      toast.loading("Starting execution...", {
        id: "start-workflow-execution",
      });
      mutate({ id, definition });
    },
    [mutate]
  );

  return (
    <Button
      onClick={() => {
        const executionPlan = generateExecutionPlan();
        if (!executionPlan) return;
        const workflowDefinition = JSON.stringify(toObject());
        onSubmit(workflowId, workflowDefinition);
      }}
      disabled={isPending}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <Play size={16} className="stroke-primary" /> Execute
    </Button>
  );
}
