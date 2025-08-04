"use server";
// import db from "@/lib/db";
import { headers } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { stripeAccount } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { env } from "@/env";

type Metadata = {
  userId: string;
  credits: string;
};

// export async function POST(req: NextRequest) {
//   const body = await req.text();
//   const signature = headers().get("Stripe-Signature") ?? "";

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       env.SRIPE_WEBHOOK_SECRET,
//     );
//   } catch (err) {
//     return new Response(
//       `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
//       { status: 400 },
//     );
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const completedEvent = event.data.object as Stripe.Checkout.Session & {
//         metadata: Metadata;
//       };

//       // const userEmail = completedEvent.metadata.email;
//       const userId = completedEvent.metadata.userId;
//       const depositAmount = completedEvent.metadata.depositAmount;

//       // need to create the stripeAccountId
//       await db
//         .update(stripeAccount)
//         .set({
//           balance: sql`${parseInt(depositAmount)} + ${stripeAccount?.balance}`,
//         })
//         .where(eq(stripeAccount.userId, userId));

//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   return new Response(null, { status: 200 });
// }

export async function POST(req: NextRequest) {
  const { amount, userId } = await req.json(); // Amount the user wants to deposit, user Stripe account ID
  const feePercentage = 0.03; // Optional: If you want to take a fee, you can do so here
  const feeAmount = amount * feePercentage;
  const amountAfterFee = amount - feeAmount;

  try {
    // Step 1: Create a Payment Intent for the user to deposit funds into their Stripe account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount is in cents
      currency: "usd", // Currency you want to charge in
      payment_method_types: ["card"], // Supported payment method types (e.g., card)
      transfer_data: {
        destination: userId, // The connected Stripe account to deposit funds into
      },
      description: "Deposit into your account",
    });

    // Step 2: Return the client secret to the frontend to complete the payment
    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amountAfterFee: amountAfterFee,
      feeAmount: feeAmount,
    });
  } catch (error) {
    // Fix: Use the Response object instead of res (which doesn't exist in App Router)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
