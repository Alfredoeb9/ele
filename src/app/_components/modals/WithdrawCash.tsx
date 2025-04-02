"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

interface WithdrawCashProps {
  open: boolean;
  onOpenChange: () => void;
  userId: string;
  balance: string;
  stripeId: string;
}

// Add this utility function
function parseMoneyString(str: string): number {
  if (!str) return 0;

  // Remove all non-numeric characters except period
  const cleaned = str.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

export default function WithDrawCash({
  open,
  onOpenChange,
  userId,
  balance,
  stripeId,
}: WithdrawCashProps) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [amount, setAmount] = useState<string>("");
  const utils = api.useUtils();

  // Create withdrawal mutation
  const withdrawMutation = api.stripe.withdrawCash.useMutation({
    onSuccess: (data) => {
      toast.success(`Successfully withdrew $${parseFloat(amount).toFixed(2)}`);
      setAmount("");
      onClose();

      // Invalidate queries to refresh the data
      utils.user.getSingleUser.invalidate();
    },
    onError: (error) => {
      toast.error(`Withdrawal failed: ${error.message}`);
    },
  });

  // Handle withdraw action
  const handleWithdraw = () => {
    // Validate amount
    const withdrawAmount = Number(parseFloat(amount).toFixed(2));
    // Validate amount
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Use the utility function to parse balance
    const numericBalance = parseMoneyString(balance);

    const balanceIsStoredInCents = false; // Set this based on your application logic

    const balanceInCorrectUnit = balanceIsStoredInCents
      ? numericBalance / 100
      : numericBalance;

    // try {
    //   // Remove any formatting (commas, dollar signs) and parse as float
    //   const cleanBalance = balance.replace(/[$,]/g, "");
    //   numericBalance = parseFloat(cleanBalance);

    //   // Check for invalid parsing
    //   if (isNaN(numericBalance)) {
    //     console.error("Failed to parse balance:", balance);
    //     toast.error("Error reading your balance");
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Balance parsing error:", error);
    //   toast.error("Error processing your balance");
    //   return;
    // }

    // const numericAmount = parseFloat(amount);

    // Debug information
    console.log("Original balance string:", balance);
    console.log("balanceInCorrectUnit:", balanceInCorrectUnit);
    console.log("Withdrawal amount:", withdrawAmount);
    console.log(
      "Withdrawal amount - balance:",
      balanceInCorrectUnit - withdrawAmount,
    );

    if (withdrawAmount > balanceInCorrectUnit) {
      toast.error("Insufficient balance for withdrawal");
      return;
    }

    // Proceed with withdrawal
    withdrawMutation.mutate({
      stripeId,
      amount: withdrawAmount,
      currentBalance: balanceInCorrectUnit,
    });
  };

  console.log("amount", amount);

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          onClose();
        }}
        classNames={{ wrapper: "h-[50dvh] sm:h-[100dvh]" }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl text-red-600 sm:text-2xl">
                Withdraw Cash{" "}
                <p className="sm:text-md text-sm">
                  Available Balance:{" "}
                  {balance ||
                    (balance === undefined && "Err") ||
                    (balance === null && "Err")}
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Amount to Withdraw"
                  placeholder="0"
                  minLength={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">$</span>
                    </div>
                  }
                />

                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 text-white"
                    disabled={
                      withdrawMutation.isPending ||
                      balance === undefined ||
                      balance === null
                    }
                    onClick={handleWithdraw}
                  >
                    {withdrawMutation.isPending ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </ModalBody>
              <ToastContainer containerId={"withdraw-cash-toast"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
