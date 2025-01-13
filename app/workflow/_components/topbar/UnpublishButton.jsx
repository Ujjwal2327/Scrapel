import { useCallback } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { unpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";

export function UnpublishButton({ workflowId }) {
  const toastId = `unpublish-workflow-${workflowId}`;

  const { mutate, isPending } = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: (result) => {
      if (result?.errorMessage) throw new Error(result?.errorMessage);
      toast.success("Workflow unpublished.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(
    (id) => {
      toast.loading("Unpublishing workflow...", { id: toastId });
      mutate(id);
    },
    [mutate]
  );

  return (
    <Button
      onClick={() => onSubmit(workflowId)}
      disabled={isPending}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <Download size={16} className="stroke-primary" /> Unpublish
    </Button>
  );
}
