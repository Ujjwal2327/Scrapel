"use client";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layers2, Loader2 } from "lucide-react";
import { renameWorkflowSchema } from "@/schemas/workflows";
import { renameWorkflow } from "@/actions/workflows/renameWorkflow";
import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RenameWorkflowDialog({
  open,
  setOpen,
  workflowId,
  workflowName,
  workflowDescription,
}) {
  const toastId = "rename-workflow";

  const form = useForm({
    resolver: zodResolver(renameWorkflowSchema),
    defaultValues: {
      name: workflowName,
      description: workflowDescription,
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: renameWorkflow,
    onSuccess: (result) => {
      if (result?.errorMessage) throw new Error(result?.errorMessage);
      toast.success("Workflow renamed.", { id: toastId });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(
    (form) => {
      toast.loading("Renaming workflow...", { id: toastId });
      mutate(form);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        !open && form.reset(); // Reset the form when closing the dialog
        setOpen(open);
      }}
    >
      <DialogContent className="px-0">
        <CustomDialogHeader icon={Layers2} title="Rename workflow" />
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Name
                      <span className="text-xs text-primary">(required)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Description
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br />
                      This is optional but can help you remember the
                      workflow&apos;s purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {!isPending ? "Proceed" : <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
