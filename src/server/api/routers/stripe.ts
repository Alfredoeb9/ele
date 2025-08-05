import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeAccount, transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { stripe } from "@/lib/stripe";

export const stripeRouter = createTRPCRouter({
  updateStripeBalance: protectedProcedure
    .input(
      z.object({
        stripeId: z.string().min(1),
        paymentIntent: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Step 1: Get the current balance from the database
        const currentAccount = await ctx.db.query.stripeAccount.findFirst({
          where: (account, { eq }) => eq(account.stripeId, input.stripeId),
        });

        if (!currentAccount) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Stripe account not found",
          });
        }

        // Get current balance, defaulting to 0 if null/undefined
        const currentBalance = currentAccount.balance
          ? parseFloat(currentAccount.balance.toString())
          : 0;

        // Step 2: Calculate new balance by adding payment amount
        // Convert payment amount from cents to dollars if needed
        const paymentAmountDollars = input.paymentIntent;
        const newBalance = currentBalance + paymentAmountDollars;

        console.log("newBalance", newBalance);

        // Step 3: Update the stripe account with the new balance
        await ctx.db
          .update(stripeAccount)
          .set({ balance: newBalance })
          .where(eq(stripeAccount.stripeId, input.stripeId));

        // Step 4: Record the transaction
        await ctx.db.insert(transactions).values({
          transactionId: crypto.randomUUID(),
          accountId: input.stripeId,
          withdrawAmt: 0,
          depositAmt: paymentAmountDollars,
          balance: newBalance,
          transactionsDate: new Date(),
        });

        return {
          success: true,
          previousBalance: currentBalance,
          deposit: paymentAmountDollars,
          newBalance: newBalance,
        };
      } catch (error) {
        console.error("Error updating stripe balance:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update balance",
        });
      }

      // Step 3: Record the transaction in your database
      // Using the current balance + new amount
      // const newBalance = currentBalance + amountValue;

      // await db.insert(transactions).values({
      //   transactionId: crypto.randomUUID(),
      //   accountId: stripeId,
      //   withdrawAmt: 0, // Your schema uses text for these fields
      //   depositAmt: (paymentIntent.amount / 100), // Convert cents to dollars as string
      //   balance: newBalance, // Convert the new balance to string
      // });
    }),

  withdrawCash: protectedProcedure
    .input(
      z.object({
        stripeId: z.string().min(1),
        amount: z.number().positive(),
        currentBalance: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("input", input.amount);
      const currBalanceInCents = input.currentBalance * 100;
      const currWithDrawAmountInCents = input.amount * 100;

      console.log("currWithDraw", currBalanceInCents);
      console.log("currWithDrawAmountInCents", currWithDrawAmountInCents);
      try {
        //   // Step 1: Validate account and inputs
        if (currWithDrawAmountInCents < 100) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Withdrawal amount must be at least $1.00",
          });
        }
        
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        const FEE_PERCENTAGE: number = 3.5; // 3.5%
        const feeAmount: number = parseFloat(
          (input.amount * (FEE_PERCENTAGE / 100)).toFixed(2),
        );
        console.log("feeAmount", feeAmount * 100);
        const amountAfterFeeInCents =
          currWithDrawAmountInCents - feeAmount * 100;

        const newBalance = currBalanceInCents - amountAfterFeeInCents;

        console.log("amountAfterFee", amountAfterFeeInCents);
        console.log("newBalance", newBalance);

        //   // Ensure minimum withdrawal is still met after fee
        if (amountAfterFeeInCents < 100) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `After ${FEE_PERCENTAGE}% fee, withdrawal amount must be at least $1.00. Please withdraw a larger amount.`,
          });
        }

        // const stripeBalance = await stripe.balance.retrieve({
        //   stripeAccount: input.stripeId,
        // });

        //   console.log("stipeAccount", stripeBalance);

        //   // Calculate total available balance in cents
        //   const availableBalance = stripeBalance.available.reduce(
        //     (sum, bal) => sum + (bal.currency === "usd" ? bal.amount : 0),
        //     0,
        //   );

        if (newBalance < currWithDrawAmountInCents) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient available balance. Available: $${(newBalance / 100).toFixed(2)}, Requested: $${(currWithDrawAmountInCents * 100).toFixed(2)}`,
          });
        }

        //   // Also update our database with the real available balance
        // const realBalanceInDollars = newBalance;

        // console.log("reaLbALANCE", realBalanceInDollars);

        //   // create a payout to transer funds from the connected account to their bank account
        const payout = await stripe.payouts.create(
          {
            amount: amountAfterFeeInCents, // convert dollars to cents and  ensure it's an integer
            currency: "usd",
            description: `Withdrawal from Ele platform (${FEE_PERCENTAGE}% fee applied)`,
            metadata: {
              userId: ctx.session.user.id,
              originalAmount: input.amount,
              feeAmount: feeAmount,
              feePercentage: FEE_PERCENTAGE,
            },
            method: "standard",
          },
          {
            stripeAccount: input.stripeId,
          },
        );

        console.log("payout", payout);

        await ctx.db
          .update(stripeAccount)
          .set({ balance: newBalance })
          .where(eq(stripeAccount.stripeId, input.stripeId));

        //   // Step 5: Create a transfer to collect the fee to your platform account
        const feeTransfer = await stripe.transfers.create({
          amount: feeAmount * 100,
          currency: "usd",
          destination: env.STRIPE_PLATFORM_ACCOUNT_ID,
          description: `${FEE_PERCENTAGE}% fee for withdrawal`,
          metadata: {
            userId: ctx.session.user.id,
            connectedAccountId: input.stripeId,
            withdrawalAmount: input.amount,
            feePercentage: FEE_PERCENTAGE,
          },
          transfer_group: `withdrawal_${crypto.randomUUID()}`,
        });

        console.log("Fee transfer created:", feeTransfer);

        //   // Step 5: Get the current balance from our database
        // const currentAccount = await ctx.db.query.stripeAccount.findFirst({
        //   where: (account, { eq }) => eq(account.stripeId, input.stripeId),
        // });

        // if (!currentAccount) {
        //   throw new TRPCError({
        //     code: "NOT_FOUND",
        //     message: "Stripe account not found in database",
        //   });
        // }

        //   // Get current balance, defaulting to 0 if null/undefined
        // const currentBalance = currentAccount.balance
        //   ? parseFloat(currentAccount.balance?.toString())
        //   : 0;

        // console.log("current", currentBalance);

        //   // Step 6: Update the balance in database
        //   // Note: Deduct the full amount (including fee) from user's balance
        // const newBalance = realBalanceInDollars - amountAfterFeeInCents;

        // await ctx.db
        //   .update(stripeAccount)
        //   .set({ balance: newBalance })
        //   .where(eq(stripeAccount.stripeId, input.stripeId));

        //   // Record the transaction
        await ctx.db.insert(transactions).values({
          transactionId: crypto.randomUUID(),
          accountId: input.stripeId,
          withdrawAmt: input.amount,
          depositAmt: 0,
          balance: newBalance,
          transactionsDate: new Date(), // Unix timestamp in seconds
        });

        return {
          success: true,
          payoutId: payout.id,
          newBalance: newBalance / 100,
        };
      } catch (error) {
        console.error("Withdrawal error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to process withdrawal",
        });
      }
    }),
});
