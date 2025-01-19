import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle } from "lucide-react";
import { CreditsPacks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export async function Pricing() {
  const { userId } = await auth();

  return (
    <div
      id="pricing"
      className="flex flex-col items-center gap-y-8 py-16 sm:py-20 px-7 bg-gradient-to-b from-secondary/70 via-primary/10 to-secondary/20"
    >
      <h2 className="text-3xl sm:text-5xl font-bold text-balance max-w-2xl text-center">
        Simple, Flexible Pricing
      </h2>

      <div className="w-full max-w-4xl grid sm:grid-cols-3 gap-10">
        {Object.entries(CreditsPacks).map(([key, pack], index) => (
          <div
            key={key}
            className={cn(
              "w-full max-w-sm mx-auto flex flex-col gap-y-5 rounded-xl p-5 border-2 border-primary/50",
              index & 1
                ? "bg-gradient-to-br from-white via-primary/10 dark:via-foreground/90 to-white dark:to-white text-black"
                : "bg-gradient-to-br from-primary/30 via-primary/5 to-background"
            )}
          >
            <div className="space-y-1">
              <h5 className="uppercase font-bold">{pack.id}</h5>
              <div className="space-x-2">
                <span className="text-lg">₹</span>
                <span className="text-3xl font-semibold">{pack.price}</span>
              </div>
            </div>
            <p className="flex gap-x-2 items-center">
              <CheckCircle size={15} className="stroke-primary" />
              {pack.label}
            </p>
            <Link
              href={`/billing`}
              className={cn(buttonVariants(), "text-white")}
            >
              {userId ? "Buy Credits Now" : "Start Free Trial"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
