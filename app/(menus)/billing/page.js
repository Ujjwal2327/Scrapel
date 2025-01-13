export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Coins } from "lucide-react";
import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { CreditsPurchase } from "./_components/CreditsPurchase";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ReactCountUpWrapper } from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<BillingCardSkeleton />}>
        <BillingCard />
      </Suspense>
    </div>
  );
}

function BillingCardSkeleton() {
  return (
    <div className="h-full py-6 flex flex-col gap-4">
      <Skeleton className="h-[166px] w-full rounded-xl" />
      <Skeleton className="h-[326px] w-full rounded-xl" />
    </div>
  );
}

async function BillingCard() {
  const credits = await getAvailableCredits();

  if (credits?.errorMessage)
    return (
      <div className="py-6">
        <ErrorAlert message={credits?.errorMessage} />
      </div>
    );

  return (
    <div className="h-full py-6 flex flex-col gap-4">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex flex-col justify-between overflow-hidden">
        <CardContent className="p-6 relative items-center">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Available Credits
              </h3>
              <p className="text-4xl font-bold text-primary">
                <ReactCountUpWrapper value={credits} />
              </p>
            </div>
            <Coins
              size={140}
              className="text-primary opacity-20 absolute bottom-0 right-0"
            />
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          When your credits balance reaches zero, your workflows will stop
          working.
        </CardFooter>
      </Card>
      <CreditsPurchase />
    </div>
  );
}
