"use server";

import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";

export async function checkoutSubscriptionAction(plan: number, userId: string) {
  const session = await getServerSession();

  if (!session?.user.email) {
    throw new Error("You must be logged in to checkout!");
  }

  const priceIds: Record<number, string> = {
    5: env.SUB_PRICE_ID_PRICE,
  };
  const priceId = priceIds[plan];

  if (!priceId) {
    throw new Error("invalid price id");
  }
  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card", "us_bank_account"],
    metadata: {
      userId: userId,
      email: session.user.email,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.REACT_APP_BASE_URL}/`,
    cancel_url: `${env.REACT_APP_BASE_URL}/subscription`,
  });
}
