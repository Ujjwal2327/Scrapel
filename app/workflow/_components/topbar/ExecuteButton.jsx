import { useCallback } from "react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { useExecutionPlan } from "@/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";

export function ExecuteButton({ workflowId }) {
  const toastId = `start-workflow-execution-${workflowId}`;
  const generateExecutionPlan = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: runWorkflow,
    onSuccess: (result) => {
      if (result?.errorMessage) throw new Error(result?.errorMessage);
      toast.success("Execution started.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(
    (id, definition) => {
      toast.loading("Starting execution...", { id: toastId });
      mutate({ id, definition });
    },
    [mutate]
  );

  return (
    <Button
      onClick={() => {
        const executionPlan = generateExecutionPlan();
        if (!executionPlan) return; // client side validation
        const workflowDefinition = JSON.stringify(toObject());
        onSubmit(workflowId, workflowDefinition);
      }}
      disabled={isPending}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <Play size={16} className="stroke-primary" /> Run
    </Button>
  );
}
