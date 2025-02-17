"use client";
import { useId, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getUserCredentials } from "@/actions/credentials/getUserCredentials";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorAlert } from "@/components/ErrorAlert";

export function CredentialParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}) {
  const id = useId();

  const { data: credentials } = useQuery({
    queryKey: ["credentials"],
    queryFn: () => getUserCredentials(),
  });

  const errorMessage = credentials?.errorMessage;
  const toastShown = useRef(false);

  if (errorMessage && !toastShown.current) {
    toast.error(errorMessage);
    toastShown.current = true; // Ensure the toast is only shown once
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex gap-x-2 flex-wrap">
        {param.name}
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option">
            {credentials?.find((credential) => credential.name === value)
              ?.name || "Select an option"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>

            {errorMessage ? (
              <ErrorAlert message={errorMessage} />
            ) : credentials ? (
              credentials.length ? (
                <ScrollArea className="max-h-36 p-0">
                  {!param.required && (
                    <SelectItem
                      value={undefined}
                      className="text-muted-foreground focus:text-muted-foreground"
                    >
                      None
                    </SelectItem>
                  )}
                  {credentials.map((credential) => (
                    <SelectItem key={credential.id} value={credential.name}>
                      {credential.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  No credential created yet.
                </p>
              )
            ) : (
              <Loader2 className="animate-spin stroke-muted-foreground mx-auto" />
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
