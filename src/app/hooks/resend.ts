'use client';
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { verifyEmail } from "@/redux/features/AuthContext";

export const useResend = () => {
  const dispatch = useDispatch();
  const [error2, setError] = useState<string>("");
  const [isLoading2, setIsLoading] = useState<boolean>(false);

  const resend = async (e: FormEvent, email: string, path: string) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch(
      '/api/auth/verify-email',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, path: path }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // save to localStorage

      // localStorage.setItem("user", JSON.stringify(json));
      dispatch(verifyEmail(json));
      setIsLoading(false);
    }
  };

  return { resend, error2, isLoading2 };
};