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

// import { addCashSelectOptions } from "@/lib/sharedData";
// import { addCashToAccount } from "../actions/actions";
// import getStripe from "@/lib/utils/get-stripejs";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  userId: string;
  balance: number;
}

export default function WithDrawCash({
  open,
  onOpenChange,
  userId,
  balance,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");

  const utils = api.useUtils();

  const createTicket = api.create.createNewTicket.useMutation({
    onSuccess: async () => {
      await utils.user.getUserDataWithTickets.invalidate();
      onClose();
      toast(`Ticket has been created`, {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 88,
      });
    },

    onError: (e) => {
      if (e.data?.zodError) {
        e.data?.zodError?.fieldErrors.userName?.map((error) => {
          if (error.includes("String must contain at least 1")) {
            toast("Please insert a text in the body", {
              position: "bottom-right",
              autoClose: 4500,
              closeOnClick: true,
              draggable: false,
              type: "error",
              toastId: 89,
            });
          }
        });
      } else if (e.message.includes("already sent user a friend request")) {
        toast("You have already sent user a friend request", {
          position: "bottom-right",
          autoClose: 4500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 90,
        });
      } else if (e.message.includes("No user found")) {
        toast(`User does not exist`, {
          position: "bottom-right",
          autoClose: 4500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 91,
        });
      }
    },
  });

  // function handleAddCashChange(e: string) {
  //   setSelectedCategory(e);
  // }

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
                  Balance:{" "}
                  {balance ||
                    (balance === undefined && "Err") ||
                    (balance === null && "Err")}
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Price"
                  placeholder="1%"
                  minLength={1}
                  maxLength={100}
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">%</span>
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
                      createTicket.isPending ||
                      balance === undefined ||
                      balance === null
                    }
                  >
                    Add Cash
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
