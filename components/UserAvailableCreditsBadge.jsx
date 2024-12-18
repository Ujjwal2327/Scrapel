import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleAlert, Coins, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { ReactCountUpWrapper } from "./ReactCountUpWrapper";
import { buttonVariants } from "@/components/ui/button";

export function UserAvailableCreditsBadge() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: "user-available-credits",
    queryFn: () => getAvailableCredits(),
    refetchInterval: 30 * 1000,
    // staleTime: 15 * 1000,
  });

  if (isError) toast.error(error.message);

  return (
    <Link
      href="/billing"
      className={cn(
        "flex items-center w-full space-x-2",
        buttonVariants({ variant: "outline" })
      )}
    >
      <Coins size={20} className="stroke-primary" />
      <span className="font-semibold capitalize text-foreground">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : typeof data === "number" && !isNaN(data) ? (
          <ReactCountUpWrapper value={data} />
        ) : (
          <CircleAlert className="stroke-destructive" />
        )}
      </span>
    </Link>
  );
}
