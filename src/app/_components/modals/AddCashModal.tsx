"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";

import { addCashSelectOptions } from "@/lib/sharedData";
import { addCashToAccount } from "../actions/actions";
import getStripe from "@/lib/utils/get-stripejs";
import { api } from "@/trpc/react";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  userId: string;
  stripeId: string | null | undefined;
}

type StripePaymentFormTypes = {
  userId: string;
  stripeId: string | null | undefined;
  amount: string;
  onSuccess: () => void;
};

// Add this component to your AddCashModal.tsx file
export function StripePaymentForm({
  userId,
  stripeId,
  amount,
  onSuccess,
}: StripePaymentFormTypes) {
  const stripe = useStripe();
  const elements = useElements();
  const utils = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const updateBalance = api.stripe.updateStripeBalance.useMutation({
    onSuccess: () => {
      // Invalidate the query that fetches user data with stripe balance
      utils.user.getSingleUser.invalidate();
    },
  });

  // Get client secret when component mounts
  useEffect(() => {
    async function createPaymentIntent() {
      if (!stripeId) {
        toast.error("Stripe account is required for payment processing");
        return;
      }

      setIsLoading(true);

      try {
        // Make sure addCashToAccount is properly awaited and returns the expected data
        const result = await addCashToAccount(amount, userId, stripeId);
        if (result && result.client_secret) {
          setClientSecret(result.client_secret);
        } else {
          throw new Error("Failed to create payment intent");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    createPaymentIntent().catch(console.error);
  }, [amount, userId, stripeId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        console.log("payment", paymentIntent);
        // payment successful - now update the stipe balance
        if (stripeId) {
          // call the mutation to update stripe balance
          await updateBalance.mutateAsync({
            stripeId: stripeId,
            paymentIntent: paymentIntent.amount,
          });
          console.log("Balance updated successfully");
        }
        toast.success("Payment successful!");
        onSuccess();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
        <button
          type="button"
          className="text-red-500"
          // onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          // FIX: Make sure stripe is not a Promise
          disabled={!stripe || isLoading}
          className={`rounded-2xl bg-green-500 p-3 text-white ${isLoading ? "opacity-50" : ""}`}
        >
          {isLoading ? "Processing..." : "Add Cash"}
        </button>
      </div>
    </form>
  );
}

export default function AddCashModal({
  open,
  onOpenChange,
  userId,
  stripeId,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [selectedAmount, setSelectedAmount] = useState<string>("$ 10");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const stripePromise = getStripe();

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setShowPaymentForm(true);
  };

  const handleModalClose = () => {
    setShowPaymentForm(false);
    onOpenChange();
  };

  const amountOptions = ["$ 5", "$ 10", "$ 25", "$ 50", "$ 100"];

  return (
    <Modal
      size={size as any}
      isOpen={open}
      onClose={handleModalClose}
      classNames={{ wrapper: "h-[50dvh] sm:h-[100dvh]" }}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xl text-black sm:text-2xl">
              Add Cash to Your Account
              <p className="sm:text-md text-sm text-gray-600">
                {showPaymentForm
                  ? "Enter your payment details to complete the transaction"
                  : "Select an amount to add to your account"}
              </p>
            </ModalHeader>
            <ModalBody>
              {!showPaymentForm ? (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {amountOptions.map((amount) => (
                      <button
                        key={amount}
                        className={`rounded-lg border p-2 ${
                          selectedAmount === amount
                            ? "bg-green-500 text-white"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="text-red-500" onClick={handleModalClose}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    userId={userId}
                    stripeId={stripeId}
                    amount={selectedAmount}
                    onSuccess={handleModalClose}
                  />
                </Elements>
              )}
            </ModalBody>
            <ToastContainer position="bottom-right" />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
