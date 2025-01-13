import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";

export function SaveButton({ workflowId }) {
  const toastId = `save-workflow-${workflowId}`;
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (result) => {
      if (result?.errorMessage) throw new Error(result?.errorMessage);
      toast.success("Workflow saved.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(
    (id, definition) => {
      toast.loading("Saving workflow...", { id: toastId });
      mutate({ id, definition });
    },
    [mutate]
  );

  return (
    <Button
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        onSubmit(workflowId, workflowDefinition);
      }}
      disabled={isPending}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Check size={16} className="stroke-primary" /> Save
    </Button>
  );
}
