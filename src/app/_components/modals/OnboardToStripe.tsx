"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

import { addCashSelectOptions } from "@/lib/sharedData";
import {
  addCashToAccount,
  createStripeConnectedAccount,
} from "../actions/actions";
import getStripe from "@/lib/utils/get-stripejs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  userId: string;
}

export default function OnboardToStripe({
  open,
  onOpenChange,
  userId,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const session = useSession();
  const router = useRouter();
  const [size] = useState<string>("md");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [zipCodeValue, setZipCodeValue] = useState("");
  const [stateValue, setStateValue] = useState("");

  const utils = api.useUtils();

  const sessionUser = session.data?.user;

  const CustomToastWithLink = () => (
    <div>
      There was a problem adding cash to account please create a{" "}
      <Link href="/tickets" className="text-blue-600 hover:text-blue-500">
        Tickets
      </Link>{" "}
      in which one of our team members will help.
    </div>
  );

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
        classNames={{ wrapper: "h-[50dvh] sm:h-[100dvh]" }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl text-red-600 sm:text-2xl">
                Cash Payout Onboarding
              </ModalHeader>
              <ModalBody>
                Seems you haven't onboarded for cash payout, please finish
                onboard process to receive cash payouts
                <Input
                  type="text"
                  label="zip code"
                  variant="bordered"
                  onChange={(event) => {
                    setZipCodeValue(event?.target.value);
                  }}
                  required
                />
                <Select
                  name="state"
                  id="state"
                  label="Select a State"
                  onChange={(event) => {
                    setStateValue(event.target.value);
                  }}
                >
                  <SelectItem value="AL" key={"AL"}>
                    Alabama
                  </SelectItem>
                  <SelectItem value="AK" key={"AK"}>
                    Alaska
                  </SelectItem>
                  <SelectItem value="AZ" key={"AZ"}>
                    Arizona
                  </SelectItem>
                  <SelectItem value="AR" key={"AR"}>
                    Arkansas
                  </SelectItem>
                  <SelectItem value="CA" key={"CA"}>
                    California
                  </SelectItem>
                  <SelectItem value="CO" key={"CO"}>
                    Colorado
                  </SelectItem>
                  <SelectItem value="CT" key={"CT"}>
                    Connecticut
                  </SelectItem>
                  <SelectItem value="DE" key={"DE"}>
                    Delaware
                  </SelectItem>
                  <SelectItem value="DC" key={"DC"}>
                    District Of Columbia
                  </SelectItem>
                  <SelectItem value="FL" key={"FL"}>
                    Florida
                  </SelectItem>
                  <SelectItem value="GA" key={"GA"}>
                    Georgia
                  </SelectItem>
                  <SelectItem value="HI" key={"HI"}>
                    Hawaii
                  </SelectItem>
                  <SelectItem value="ID" key={"ID"}>
                    Idaho
                  </SelectItem>
                  <SelectItem value="IL" key={"IL"}>
                    Illinois
                  </SelectItem>
                  <SelectItem value="IN" key={"IN"}>
                    Indiana
                  </SelectItem>
                  <SelectItem value="IA" key={"IA"}>
                    Iowa
                  </SelectItem>
                  <SelectItem value="KS" key={"KS"}>
                    Kansas
                  </SelectItem>
                  <SelectItem value="KY" key={"KY"}>
                    Kentucky
                  </SelectItem>
                  <SelectItem value="LA" key={"LA"}>
                    Louisiana
                  </SelectItem>
                  <SelectItem value="ME" key={"ME"}>
                    Maine
                  </SelectItem>
                  <SelectItem value="MD" key={"MD"}>
                    Maryland
                  </SelectItem>
                  <SelectItem value="MA" key={"MA"}>
                    Massachusetts
                  </SelectItem>
                  <SelectItem value="MI" key={"MI"}>
                    Michigan
                  </SelectItem>
                  <SelectItem value="MN" key={"MN"}>
                    Minnesota
                  </SelectItem>
                  <SelectItem value="MS" key={"MS"}>
                    Mississippi
                  </SelectItem>
                  <SelectItem value="MO" key={"MO"}>
                    Missouri
                  </SelectItem>
                  <SelectItem value="MT" key={"MT"}>
                    Montana
                  </SelectItem>
                  <SelectItem value="NE" key={"NE"}>
                    Nebraska
                  </SelectItem>
                  <SelectItem value="NV" key={"NV"}>
                    Nevada
                  </SelectItem>
                  <SelectItem value="NH" key={"NH"}>
                    New Hampshire
                  </SelectItem>
                  <SelectItem value="NJ" key={"NJ"}>
                    New Jersey
                  </SelectItem>
                  <SelectItem value="NM" key={"NM"}>
                    New Mexico
                  </SelectItem>
                  <SelectItem value="NY" key={"NY"}>
                    New York
                  </SelectItem>
                  <SelectItem value="NC" key={"NC"}>
                    North Carolina
                  </SelectItem>
                  <SelectItem value="ND" key={"ND"}>
                    North Dakota
                  </SelectItem>
                  <SelectItem value="OH" key={"OH"}>
                    Ohio
                  </SelectItem>
                  <SelectItem value="OK" key={"OK"}>
                    Oklahoma
                  </SelectItem>
                  <SelectItem value="OR" key={"OR"}>
                    Oregon
                  </SelectItem>
                  <SelectItem value="PA" key={"PA"}>
                    Pennsylvania
                  </SelectItem>
                  <SelectItem value="RI" key={"RI"}>
                    Rhode Island
                  </SelectItem>
                  <SelectItem value="SC" key={"SC"}>
                    South Carolina
                  </SelectItem>
                  <SelectItem value="SD" key={"SD"}>
                    South Dakota
                  </SelectItem>
                  <SelectItem value="TN" key={"TN"}>
                    Tennessee
                  </SelectItem>
                  <SelectItem value="TX" key={"TX"}>
                    Texas
                  </SelectItem>
                  <SelectItem value="UT" key={"UT"}>
                    Utah
                  </SelectItem>
                  <SelectItem value="VT" key={"VT"}>
                    Vermont
                  </SelectItem>
                  <SelectItem value="VA" key={"VA"}>
                    Virginia
                  </SelectItem>
                  <SelectItem value="WA" key={"WA"}>
                    Washington
                  </SelectItem>
                  <SelectItem value="WV" key={"WV"}>
                    West Virginia
                  </SelectItem>
                  <SelectItem value="WI" key={"WI"}>
                    Wisconsin
                  </SelectItem>
                  <SelectItem value="WY" key={"WY"}>
                    Wyoming
                  </SelectItem>
                </Select>
                <div className="border-2 p-2">
                  <h3 className="font-semibold">PAYMENT INFORMATION</h3>
                  <p className="text-sm">
                    We use Stripe to make sure you get paid on time and to keep
                    your personal bank and details secure. Click Begin
                    Onboarding to set up your payouts with Stripe.
                  </p>
                </div>
                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 font-semibold text-black"
                    disabled={
                      stateValue.length <= 0 || zipCodeValue.length <= 0
                    }
                    onClick={() => {
                      createStripeConnectedAccount(
                        sessionUser?.email!,
                        sessionUser?.firstName!,
                        sessionUser?.lastName!,
                        zipCodeValue,
                        stateValue,
                        sessionUser?.username!,
                      )
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
                                toastId: 92,
                              },
                            );
                          router.push(session.url);
                          console.log("session", session.url);
                          // await stripe.redirectToCheckout({
                          //   sessionId: session.url,
                          // });
                        })
                        .catch((error) => {
                          if (error.message.includes("You must be logged in")) {
                            toast(CustomToastWithLink, {
                              position: "bottom-right",
                              autoClose: false,
                              closeOnClick: true,
                              draggable: false,
                              type: "error",
                              toastId: 93,
                            });
                          } else {
                            toast(
                              "Stripe error occured, please try again or create a support ticket",
                              {
                                position: "bottom-right",
                                autoClose: false,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 94,
                              },
                            );
                          }
                        });
                      toast(CustomToastWithLink, {
                        position: "bottom-right",
                        autoClose: 4500,
                        closeOnClick: true,
                        draggable: false,
                        type: "error",
                        toastId: 87,
                      });
                    }}
                  >
                    Begin Onboarding
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
