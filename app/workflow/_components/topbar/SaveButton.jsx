import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";

export function SaveButton({ workflowId }) {
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved.", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "save-workflow" });
    },
  });

  const onSubmit = useCallback(
    (id, definition) => {
      toast.loading("Saving workflow...", { id: "save-workflow" });
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
      <Save size={16} className="stroke-primary" /> Save
    </Button>
  );
}
