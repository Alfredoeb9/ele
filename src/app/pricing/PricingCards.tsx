"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { checkoutAction } from "./actions";
import getStripe from "@/lib/utils/get-stripejs";
import { pricingCards } from "@/lib/PricingCards";
import { ToastContainer, toast } from "react-toastify";
import NextImage from "next/image";

export default function PricingCards() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {pricingCards.map((card) => (
          <Card
            key={card.id}
            isPressable
            onPress={() => {
              checkoutAction(card.credits)
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
            <CardBody className="flex items-center justify-center overflow-visible p-0">
              <Image
                as={NextImage}
                shadow="sm"
                src={"/images/credits-md.png"}
                alt={"pricing credits image"}
                width={250}
                height={250}
              />
            </CardBody>

            <CardFooter className="flex items-center justify-center">
              <p className="mr-2">{card.credits} Credits</p>

              <span className="rounded-md bg-blue-400 px-3 py-4 text-white shadow-xl hover:scale-105">
                Buy for ${card.cost}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ToastContainer containerId={"pricing-card-toast-id"} />
    </div>
  );
}
