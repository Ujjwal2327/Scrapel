"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coins, CreditCard } from "lucide-react";
import { CreditsPacks } from "@/lib/constants";
import { purchaseCredits } from "@/actions/billing/purchaseCredits";
import { PackId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);
  const toastId = "purchase-credits";
  const { mutate, isPending } = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {
      toast.success("Credits purchased.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Purchasing credits...", { id: toastId });
    mutate(selectedPack);
  }, [mutate, selectedPack]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Coins className="h-6 w-6 stroke-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPack}
          onValueChange={(value) => setSelectedPack(value)}
        >
          {Object.entries(CreditsPacks).map(([key, pack]) => (
            <div
              key={key}
              onClick={() => setSelectedPack(key)}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary cursor-pointer"
            >
              <RadioGroupItem value={key} id={key} />
              <Label className="flex justify-between xs:items-center w-full cursor-pointer flex-col xs:flex-row gap-y-2">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  $ {(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isPending} className="w-full">
          <CreditCard className="mr-2 h-5 w-5" /> Purchase credits
        </Button>
      </CardFooter>
    </Card>
  );
}
