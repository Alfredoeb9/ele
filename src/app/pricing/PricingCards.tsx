"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { checkoutAction } from "./actions";
import getStripe from "@/lib/utils/get-stripejs";
import { pricingCards } from "@/lib/PricingCards";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';


export default function PricingCards() {

    return (
        <div>
            <div className="gap-5 grid grid-cols-2 sm:grid-cols-4">
                {pricingCards.map((card: any) => (
                    <Card key={card.id} isPressable onPress={() => {
                        checkoutAction(card.credits).then(async (session) => {
                            const stripe = await getStripe();
                            if (stripe === null) return toast('Stripe service down, please reach out to customer support', {
                                position: "bottom-right",
                                autoClose: false,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 11                          
                            });
                            await stripe.redirectToCheckout({
                                sessionId: session.id,
                            });
                        }).catch(() => {
                            toast('You much be loggin in to buy credits', {
                                position: "bottom-right",
                                autoClose: false,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 1                          
                            })
                        })
                    }}>
                        <CardBody className="flex justify-center items-center">
                            <Image src={"/images/mw3.png"} alt={""} width={200} height={200} />
                            
                            
                        </CardBody>

                        <CardFooter className="flex justify-center items-center">
                                <p className="mr-2">{card.credits} Credits</p>

                                <span className="bg-blue-400 px-3 py-4 rounded-md text-white hover:scale-105 shadow-xl">
                                    Buy for ${card.cost}
                                </span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <ToastContainer />
        </div>
    )
}