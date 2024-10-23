"use client";
import { useState } from "react";
import { type Session } from "next-auth";

export const useGetUser = () => {
  const [error2, setError] = useState<string>("");
  const [isLoading2, setIsLoading] = useState<boolean>(false);

  const getuser = async (session?: Session) => {
    // e.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session?.user.email),
    });

    const json = await response.json();

    if (!response.ok) {
      // if (json.error.includes("not enrolled in a team")) {
      //     setIsLoading(false);
      //     setError(json.error);
      //     return router.push("/create/team")
      // }

      setError(json.error);
      //   console.log("error33", json.error)
    }

    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  };

  return { getuser, error2, isLoading2 };
};
