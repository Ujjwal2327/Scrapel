"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}) {
  const [confirmText, setConfirmText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted.", {
        id: `delete-workflow-${workflowId}`,
      });
    },
    onError: (error) => {
      toast.error(error.message, { id: `delete-workflow-${workflowId}` });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Deleting workflow...", {
      id: `delete-workflow-${workflowId}`,
    });
    mutate(workflowId);
  }, [mutate]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        !open && setConfirmText(""); // Reset the input when closing the dialog
        setOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col gap-2 py-4">
              <p>
                If you are sure, enter <strong>{workflowName}</strong> to
                confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || isPending}
            onClick={onSubmit}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 "
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
