"use client";
import Link from "next/link";
import React from "react";
import SubscriptionCards from "./SubscriptionCards";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Pricing() {
    const { data: user, status } = useSession();
    const router = useRouter()

    // status could === 
    // unauthenticated || authenticated

    if (status === "unauthenticated") return router.push('/sign-in')

    return (
        <section className="flex justify-center items-center flex-col max-w-7xl w-full p-8 text-white">
            <h1 className="text-3xl mb-2 text-bold">Buy Credits!</h1>
            <p className="mb-2">Purchase credits to enter into tournaments or cash matches</p>
            <p className="mb-2">Please review our <Link className="text-blue-500 hover:text-blue-600 transition-all" href={"/refund-policy"}>Refund Policy</Link> before buying credits. We do not issue refunds at this time.</p>
            <SubscriptionCards userId={user?.user.id as string} />
        </section>
    )
}