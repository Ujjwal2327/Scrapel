import { useCallback } from "react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { useExecutionPlan } from "@/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";

export function PublishButton({ workflowId }) {
  const generateExecutionPlan = useExecutionPlan();
  const { toObject } = useReactFlow();
  const toastId = `publish-workflow-${workflowId}`;

  const { mutate, isPending } = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(
    (id, definition) => {
      toast.loading("Publishing workflow...", { id: toastId });
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
      <Upload size={16} className="stroke-primary" /> Publish
    </Button>
  );
}
