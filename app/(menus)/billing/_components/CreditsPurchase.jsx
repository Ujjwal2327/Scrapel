"use client";
import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coins, CreditCard } from "lucide-react";
import { CreditsPacks } from "@/lib/constants";
import { updateCredits } from "@/actions/billing/updateCredits";
import { PackId } from "@/lib/types";
import { getAppUrl } from "@/lib/utils";
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
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);
  const toastId = "update-credits";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined")
      window.Razorpay = window.Razorpay || undefined;
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: updateCredits,
    onSuccess: () => {
      toast.success("Credits updated.", { id: toastId });
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  const updateDB = useCallback(() => {
    toast.loading("Updating credits...", { id: toastId });
    mutate(selectedPack);
  }, [mutate, selectedPack]);

  const onSubmit = async () => {
    setIsProcessing(true);
    try {
      const amount =
        CreditsPacks[selectedPack].price &&
        CreditsPacks[selectedPack].price * 100;

      if (!amount) throw new Error("Invalid amount");

      // create order
      const triggeredApiUrl = getAppUrl(`api/razorpay/create-order`);

      const response = await fetch(triggeredApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packId: selectedPack,
        }),
      });
      const { order_id } = await response.json();

      // initialize razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        Currency: "INR",
        name: "Scrapel",
        description: "Test transaction description",
        order_id,
        handler: function (response) {
          //  invoke when payment is successful
          console.log("payment successful");
          updateDB();
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#8ec25d",
        },
      };

      if (window?.Razorpay) {
        const rzpl = new window.Razorpay(options);
        rzpl.open();
      } else {
        throw new Error("Razorpay SDK is not loaded.");
      }
    } catch (error) {
      console.log("Payment failed with error: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Load Razorpay checkout script for payment processing */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

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
            onValueChange={(value) =>
              mounted && !isProcessing && !isPending && setSelectedPack(value)
            }
          >
            {Object.entries(CreditsPacks).map(([key, pack]) => (
              <div
                key={key}
                onClick={() =>
                  mounted && !isProcessing && !isPending && setSelectedPack(key)
                }
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
          <Button
            onClick={onSubmit}
            disabled={!mounted || isProcessing || isPending}
            className="w-full"
          >
            <CreditCard className="mr-2 h-5 w-5" /> Purchase credits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
