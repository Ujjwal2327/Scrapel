"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteCredential } from "@/actions/credentials/deleteCredential";
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

export function DeleteCredentialDialog({
  open,
  setOpen,
  credentialId,
  credentialName,
}) {
  const [confirmText, setConfirmText] = useState("");
  const toastId = `delete-credential-${credentialId}`;

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCredential,
    onSuccess: (result) => {
      if (result?.errorMessage) throw new Error(result?.errorMessage);
      toast.success("Credential deleted.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Deleting credential...", { id: toastId });
    mutate(credentialId);
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
            If you delete this credential, you will not be able to recover it.
            <div className="flex flex-col gap-2 py-4">
              <p>
                If you are sure, enter <strong>{credentialName}</strong> to
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
            disabled={confirmText !== credentialName || isPending}
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
