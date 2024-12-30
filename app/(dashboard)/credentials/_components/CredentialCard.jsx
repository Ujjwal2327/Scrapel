"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  MoreVertical,
  Trash,
} from "lucide-react";
import { decrypt } from "@/lib/encryption";
import { DeleteCredentialDialog } from "./DeleteCredentialDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipWrapper } from "@/components/TooltipWrapper";

export function CredentialCard({ credential }) {
  const [value, setValue] = useState(null);
  const [show, setShow] = useState(false);

  const createdAt = formatDistanceToNow(credential.createdAt, {
    addSuffix: true,
  });

  const toastId = `show-credential-${credential.id}`;

  const { mutate, isPending } = useMutation({
    mutationFn: decrypt,
    onSuccess: (value) => {
      setValue(value);
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(() => {
    !show && mutate(credential.value);
    setShow((prev) => !prev);
  }, [mutate]);

  const handleCopy = async () => {
    const toastId = `copy-${value}`;
    toast.loading("Copying...", { id: toastId });

    try {
      await navigator.clipboard.writeText(value);
      toast.success("Value copied to clipboard.", { id: toastId });
    } catch (err) {
      toast.error("Failed to copy value.", { id: toastId });
    }
  };

  return (
    <Card className="w-full p-4 flex justify-between gap-x-4 rounded-md">
      <div className="flex flex-1 gap-2 items-center">
        <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
          <LockKeyhole size={18} className="stroke-primary" />
        </div>
        <div className="flex-1">
          <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
            <p className="flex-1 font-bold max-w-full !line-clamp-1 break-all min-w-20">
              {credential.name}
            </p>
            <div className="text-muted-foreground !line-clamp-1 break-all min-w-20">
              <Button
                onClick={onSubmit}
                variant="icon"
                className="p-0.5 h-auto mr-1.5"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : show ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </Button>
              {show && !isPending ? (
                <TooltipWrapper content="Click to copy" side="top">
                  <span onClick={handleCopy} className="cursor-pointer">
                    {value}
                  </span>
                </TooltipWrapper>
              ) : (
                "********"
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{createdAt}</p>
        </div>
      </div>
      <CredentialActions credential={credential} />
    </Card>
  );
}

function CredentialActions({ credential }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { id, name } = credential;

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="p-0">
            <TooltipWrapper content="More actions">
              <div className="rounded-md p-2">
                <MoreVertical size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setDropdownOpen(false);
              setShowDeleteDialog(true);
            }}
            className="text-destructive focus:text-destructive/90 space-x-2"
          >
            <Trash size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCredentialDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        credentialId={id}
        credentialName={name}
      />
    </>
  );
}
