// import db from "@/lib/db";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { stripeAccount, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

type Metadata = {
  userId: string;
  credits: string;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.SRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      const userEmail = completedEvent.metadata.email;
      const userId = completedEvent.metadata.userId;
      const depositAmount = completedEvent.metadata.depositAmount;

      // need to create the stripeAccountId
      await db
        .update(stripeAccount)
        .set({
          balance: sql`${parseInt(depositAmount)} + ${stripeAccount?.balance}`,
        })
        .where(eq(stripeAccount.userId, userId));

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response(null, { status: 200 });
}
