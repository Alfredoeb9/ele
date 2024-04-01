"use server";

import { stripe } from "@/lib/stripe";
import { getIPAddress } from "@/lib/utils/getIPAddress";
import { api } from "@/trpc/server";
import { Session, User, getServerSession } from "next-auth";
import initStripe from "stripe";

export async function createStripeAccountAction(
  clientSession:
    | (User & {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        role: string;
      })
    | undefined,
) {
  const session = await getServerSession();
  const clientIp = await getIPAddress();
  console.log("clientIp", clientIp);
  if (!session?.user.email) {
    throw new Error("You must be logged in to checkout!");
  }

  //   const stripee = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email: session?.user.email,
    // capabilities: {
    //   card_payments: {
    //     requested: true,
    //   },
    //   transfers: {
    //     requested: true,
    //   },
    // },
    // business_type: "individual",
    // individual: {
    //   first_name: clientSession?.firstName,
    //   last_name: clientSession?.lastName,
    // },
  });

  // Create an account link for the user's Stripe account
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: process.env.REACT_APP_BASE_URL + "/stripe/authorize",
    return_url:
      process.env.REACT_APP_BASE_URL +
      "/stripe/onboarded/" +
      account.id +
      "?userId=" +
      clientSession?.id +
      "&userName=" +
      clientSession?.username,
    type: "account_onboarding",
  });

  // await stripe.accounts.update(account.id, {
  //   tos_acceptance: {
  //     date: Math.floor(Date.now() / 1000),
  //     ip: clientIp.ip,
  //   },
  // });

  return accountLink.url;

  //   await stripee.accounts.create({

  //   });
  // const priceIds: Record<number, string> = {
  //     25: process.env.PRICE_ID_25!,
  //     50: process.env.PRICE_ID_50!,
  //     100: process.env.PRICE_ID_100!,
  //     250: process.env.PRICE_ID_250!,
  // }

  // const priceId = priceIds[credits];

  // if (!priceId) {
  //     throw new Error("invalid price id");
  // }

  // return stripe.checkout.sessions.create({
  //     mode: "payment",
  //     payment_method_types: ["card", "us_bank_account"],
  //     metadata: {
  //         email: session.user.email,
  //         credits: credits
  //     },
  //     line_items: [
  //         {
  //             price: priceId,
  //             quantity: 1,
  //         }
  //     ],
  //     success_url: `${process.env.REACT_APP_BASE_URL}/`,
  //     cancel_url: `${process.env.REACT_APP_BASE_URL}/pricing`,
  // })
}

// export async function checkoutCredits(credits: number) {
//     const session = await getServerSession();
//     if (!session.user.email) {
//         throw new Error("You must be logged in to checkout!")
//     }

//     const priceIds: Record<number, string> = {
//         25: process.env.PRICE_ID_25!,
//         50: process.env.PRICE_ID_50!,
//         100: process.env.PRICE_ID_100!,
//         250: process.env.PRICE_ID_250!,
//     }

//     const priceId = priceIds[credits];

//     if (!priceId) {
//         throw new Error("invalid price id");
//     }

//     return stripe.checkout.sessions.create({
//         mode: "payment",
//         payment_method_types: ["card", "us_bank_account"],
//         metadata: {
//             email: session.user.email,
//             credits: credits
//         },
//         line_items: [
//             {
//                 price: priceId,
//                 quantity: 1,
//             }
//         ],
//         success_url: `${process.env.REACT_APP_BASE_URL}/`,
//         cancel_url: `${process.env.REACT_APP_BASE_URL}/pricing`,
//     })
// }

export async function withdrawMoney(account: { id: string }) {
  await stripe.transfers.create({
    amount: 1000,
    currency: "usd",
    destination: account.id,
  });
}
