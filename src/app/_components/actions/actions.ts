"use server";

import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";

export async function withdrawMoney(account: { id: string }) {
  await stripe.transfers.create({
    amount: 1000,
    currency: "usd",
    destination: account.id,
  });
}

export async function addCashToAccount(cashAmount: string, userId: string) {
  const session = await getServerSession();
  if (!session?.user.email) {
    throw new Error("You must be logged in to checkout!");
  }

  const priceExtracted = cashAmount.split("$ ")[1];

  const priceIds: Record<number, string> = {
    5: env.ADD_CASH_5,
    10: env.ADD_CASH_10,
    15: env.ADD_CASH_15,
    25: env.ADD_CASH_25,
    50: env.ADD_CASH_50,
    75: env.ADD_CASH_75,
    100: env.ADD_CASH_100,
  };

  const priceId = priceIds[Number(priceExtracted)];

  if (!priceId) {
    throw new Error("invalid price id");
  }
  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "us_bank_account"],
    metadata: {
      email: session.user.email,
      depositAmount: cashAmount,
      userId: userId,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.REACT_APP_BASE_URL}/`,
    cancel_url: `${process.env.REACT_APP_BASE_URL}/`,
  });
}
