import { useCallback } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";

export function ExecutePublishedWorkflowButton({ workflowId }) {
  const toastId = `start-workflow-execution-${workflowId}`;

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

  const onSubmit = useCallback(() => {
    toast.loading("Starting execution...", { id: toastId });
    mutate({ id: workflowId });
  }, [mutate]);

  return (
    <Button
      onClick={onSubmit}
      disabled={isPending}
      variant="outline"
      siae="sm"
      className="flex items-center gap-2"
    >
      <Play size={16} className="stroke-primary" /> Run
    </Button>
  );
}
