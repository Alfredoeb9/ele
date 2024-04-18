"use client";
import Link from "next/link";
import React from "react";
import SubscriptionCards from "./SubscriptionCards";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const { data: user, status } = useSession();
  const router = useRouter();

  // status could ===
  // unauthenticated || authenticated

  if (status === "unauthenticated") return router.push("/sign-in");

  return (
    <section className="m-auto flex w-full max-w-7xl flex-col items-center justify-center p-8 text-white">
      <h1 className="text-bold mb-2 text-4xl">ELITE MEMBERSHIP!</h1>
      <p className="mb-2">
        Please review our{" "}
        <Link
          className="text-blue-500 transition-all hover:text-blue-600"
          href={"/refund-policy"}
        >
          Refund Policy
        </Link>{" "}
        before buying credits. We do not issue refunds at this time.
      </p>
      <SubscriptionCards userId={user?.user.id as string} />
    </section>
  );
}
