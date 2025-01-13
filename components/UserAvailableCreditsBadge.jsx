"use client";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleAlert, Coins, Loader2 } from "lucide-react";
import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { ReactCountUpWrapper } from "./ReactCountUpWrapper";
import { TooltipWrapper } from "./TooltipWrapper";
import { Button } from "@/components/ui/button";

export function UserAvailableCreditsBadge() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: "user-available-credits",
    queryFn: () => getAvailableCredits(),
    refetchInterval: 30 * 1000,
    // staleTime: 15 * 1000,
  });

  const errorMessage = data?.errorMessage;
  const toastShown = useRef(false);

  if (errorMessage && !toastShown.current) {
    toast.error(errorMessage);
    toastShown.current = true; // Ensure the toast is only shown once
  }

  return (
    <TooltipWrapper content={errorMessage} side="bottom">
      <Button
        onClick={() => {
          toastShown.current = false; // Reset when refetching
          refetch();
        }}
        variant="outline"
        className="flex items-center w-full space-x-2"
      >
        <Coins size={20} className="stroke-primary" />
        <span className="font-semibold capitalize text-foreground">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : !errorMessage && typeof data === "number" && !isNaN(data) ? (
            <ReactCountUpWrapper value={data} />
          ) : (
            <CircleAlert className="stroke-destructive" />
          )}
        </span>
      </Button>
    </TooltipWrapper>
  );
}
