"use server";

import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { getIPAddress } from "@/lib/utils/getIPAddress";
import { getServerSession } from "next-auth";

export async function createStripeConnectedAccount(
  email: string,
  firstName: string,
  lastName: string,
  zipCode: string,
  state: string,
  userName: string,
) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email: email,
    business_type: "individual",
    business_profile: {
      product_description: "Online E-Sports Tournament User",
    },
    capabilities: {
      transfers: {
        requested: true,
      },
    },
    individual: {
      address: {
        postal_code: zipCode,
        state: state,
      },
      metadata: {
        user_name: userName,
      },
      email: email,
      first_name: firstName,
      last_name: lastName,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${env.REACT_APP_BASE_URL}/`,
    return_url: `${env.REACT_APP_BASE_URL}/subscription`,
    type: "account_onboarding",
  });

  // await stripe.accounts.update(account.id, {
  //   tos_acceptance: {
  //     date: Math.floor(Date.now() / 1000),
  //     ip: await getIPAddress(),
  //   },
  // });

  return accountLink;
}

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
