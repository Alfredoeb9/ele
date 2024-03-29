"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { checkoutSubscriptionAction } from "./actions";
import getStripe from "@/lib/utils/get-stripejs";
import { subscriptionCards } from "@/lib/sharedData";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Link from "next/link";

interface SubscribtionTypes {
    userId: string
}

export default function SubscriptionCards({ userId }: SubscribtionTypes) {

    const CustomToastWithLink = () => (
        <div>
            User needs to <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">sign in</Link> to subscribe. 
        </div>
    );

    return (
        <div>
            <div className="container m-auto">
                {subscriptionCards.map((card: {id: number, cost: number, content: string[]}) => (
                    <Card key={card.id} isHoverable={false} isPressable={false} >
                        <CardBody className="flex justify-center items-center m-2">
                            <Image src={"/images/mw3.png"} alt={""} width={200} height={200} />
                            <div>
                                <h3 className="font-semibold">Subscribing gives you the following:</h3>
                                {card.content.map((content, i) => (
                                    <li key={i}>{content}</li>
                                ))}
                            </div>
                        </CardBody>

                        <CardFooter className="flex justify-center items-center flex-col">
                            <span className="bg-blue-400 px-3 py-4 rounded-md text-white hover:scale-105 hover:cursor-pointer shadow-xl transition-all" 
                                onClick={() => {
                                    checkoutSubscriptionAction(card.cost, userId).then(async (session) => {
                                        const stripe = await getStripe();
                                        if (stripe === null) return toast('Stripe service down, please reach out to customer support', {
                                            position: "bottom-right",
                                            autoClose: false,
                                            closeOnClick: true,
                                            draggable: false,
                                            type: "error",
                                            toastId: 32
                                        });
                                        await stripe.redirectToCheckout({
                                            sessionId: session.id,
                                        });
                                    }).catch((error) => {
                                        if (error.message.includes("You must be logged in")){
                                            toast(CustomToastWithLink, {
                                                position: "bottom-right",
                                                autoClose: false,
                                                closeOnClick: true,
                                                draggable: false,
                                                type: "error",
                                                toastId: 33
                                            })
                                        } else {
                                            toast('Stripe error occured, please try again or create a support ticket', {
                                                position: "bottom-right",
                                                autoClose: false,
                                                closeOnClick: true,
                                                draggable: false,
                                                type: "error",
                                                toastId: 34
                                            })
                                        }
                                        
                                    })
                                }}>
                                Buy for ${card.cost}
                            </span>

                            <p className="text-neutral-400 pt-4 sm:w-4/6">Membership will auto-renew at the end of each period. You may cancel at any time.</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <ToastContainer containerId={"sub-toast"}/>
        </div>
    )
}