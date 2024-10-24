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
import { ToastContainer, toast } from "react-toastify";

import { addCashSelectOptions } from "@/lib/sharedData";
import { addCashToAccount } from "../actions/actions";
import getStripe from "@/lib/utils/get-stripejs";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  userId: string;
}

export default function AddCashModal({
  open,
  onOpenChange,
  userId,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [selectedCategory, setSelectedCategory] = useState("");

  // const utils = api.useUtils();

  // const createTicket = api.create.createNewTicket.useMutation({
  //   onSuccess: async () => {
  //     await utils.user.getUserDataWithTickets.invalidate();
  //     onClose();
  //     toast(`Ticket has been created`, {
  //       position: "bottom-right",
  //       autoClose: 4500,
  //       closeOnClick: true,
  //       draggable: false,
  //       type: "success",
  //       toastId: 86,
  //     });
  //   },

  //   onError: (e) => {
  //     if (e.data?.zodError) {
  //       e.data?.zodError?.fieldErrors.userName?.map((error) => {
  //         if (error.includes("String must contain at least 1")) {
  //           toast("Please insert a text in the body", {
  //             position: "bottom-right",
  //             autoClose: 4500,
  //             closeOnClick: true,
  //             draggable: false,
  //             type: "error",
  //             toastId: 85,
  //           });
  //         }
  //       });
  //     } else if (e.message.includes("already sent user a friend request")) {
  //       toast("You have already sent user a friend request", {
  //         position: "bottom-right",
  //         autoClose: 4500,
  //         closeOnClick: true,
  //         draggable: false,
  //         type: "error",
  //         toastId: 83,
  //       });
  //     } else if (e.message.includes("No user found")) {
  //       toast(`User does not exist`, {
  //         position: "bottom-right",
  //         autoClose: 4500,
  //         closeOnClick: true,
  //         draggable: false,
  //         type: "error",
  //         toastId: 84,
  //       });
  //     }
  //   },
  // });

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
                Add Cash to Your Account{" "}
                <p className="sm:text-md text-sm">
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
                      textValue={option.value}
                      onPress={
                        (e) =>
                          setSelectedCategory(
                            (e.target as HTMLElement).innerText,
                          )
                        // handleAddCashChange((e.target as HTMLElement).innerText)
                      }
                    >
                      $ {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 text-white"
                    // disabled={createTicket.isPending}
                    onClick={() => {
                      addCashToAccount(selectedCategory, userId)
                        .then(async (session) => {
                          const stripe = await getStripe();
                          if (stripe === null)
                            return toast(
                              "Stripe service down, please reach out to customer support",
                              {
                                position: "bottom-right",
                                autoClose: 3000,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 81,
                              },
                            );
                          await stripe.redirectToCheckout({
                            sessionId: session.id,
                          });
                        })
                        .catch(() => {
                          toast(
                            "Seems to be a service error please try again",
                            {
                              position: "bottom-right",
                              autoClose: 3000,
                              closeOnClick: true,
                              draggable: false,
                              type: "error",
                              toastId: 82,
                            },
                          );
                        });
                    }}
                  >
                    Add Cash
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
