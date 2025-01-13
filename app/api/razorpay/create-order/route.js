import "server-only";
export const dynamic = "force-dynamic";
import Razorpay from "razorpay";
import { CreditsPacks } from "@/lib/constants";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const requestBody = await request.json(); // Parses the incoming JSON body
    const { packId } = requestBody;

    if (!packId)
      return Response.json(
        { error: "Bad request: Missing packId" },
        { status: 400 }
      );

    if (!CreditsPacks[packId]?.price)
      return Response.json(
        { error: "Bad request: Invalid packId" },
        { status: 400 }
      );

    const amount = CreditsPacks[packId].price * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    });

    return Response.json({ order_id: order.id }, { status: 200 });
  } catch (error) {
    console.error("Error in api/razorpay/create-order POST handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
