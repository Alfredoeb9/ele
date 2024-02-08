"use client";
import Link from "next/link";
import React from "react";
import PricingCards from "./PricingCards";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Pricing() {
    const { data: user, status } = useSession();
    const router = useRouter()

    // status could === 
    // unauthenticated || authenticated

    if (status === "unauthenticated") return router.push('/auth/sign-in')

    return (
        <section className="flex justify-center items-center flex-col max-w-7xl w-full p-8">
            <h1 className="text-3xl mb-2">Buy Credits!</h1>
            <p className="mb-2">Purchase credits to enter into tournaments or cash matches</p>
            <p className="mb-2">Please review our <Link href={"/refund-policy"}>Refund Policy</Link> before buying credits. We do not issue refunds at this time.</p>
            <PricingCards />
        </section>
    )
}