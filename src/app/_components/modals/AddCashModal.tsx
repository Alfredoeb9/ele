"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { addCashSelectOptions } from "@/lib/sharedData";
import { addCashToAccount } from "../actions/actions";
import getStripe from "@/lib/utils/get-stripejs";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  UserId: string;
}

export default function AddCashModal({
  open,
  onOpenChange,
  UserId,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [selectedCategory, setSelectedCategory] = useState("");

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
        toastId: 76,
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
              toastId: 73,
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
          toastId: 74,
        });
      } else if (e.message.includes("No user found")) {
        toast(`User does not exist`, {
          position: "bottom-right",
          autoClose: 4500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 75,
        });
      }
    },
  });

  function handleAddCashChange(e: string) {
    setSelectedCategory(e);
  }

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          onClose();
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl text-red-600">
                Add Cash to Your Account{" "}
                <p className="text-md sm:text-sm">
                  Note: After selecting amount to deposit you will redirected to
                  a stripe checkout
                </p>
              </ModalHeader>
              <ModalBody>
                <Select label="Select Cash to deposit" className="max-w-xs">
                  {addCashSelectOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      onPress={(e) =>
                        handleAddCashChange((e.target as HTMLElement).innerText)
                      }
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 text-white"
                    disabled={createTicket.isPending}
                    onClick={() => {
                      addCashToAccount(Number(selectedCategory), UserId)
                        .then(async (session) => {
                          const stripe = await getStripe();
                          if (stripe === null)
                            return toast(
                              "Stripe service down, please reach out to customer support",
                              {
                                position: "bottom-right",
                                autoClose: false,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 11,
                              },
                            );
                          await stripe.redirectToCheckout({
                            sessionId: session.id,
                          });
                        })
                        .catch(() => {
                          toast("You much be loggin in to buy credits", {
                            position: "bottom-right",
                            autoClose: 3500,
                            closeOnClick: true,
                            draggable: false,
                            type: "error",
                            toastId: 1,
                          });
                        });
                    }}
                  >
                    Create Ticket
                  </button>
                </div>
              </ModalBody>
              <ToastContainer containerId={"create-ticket-toast"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
