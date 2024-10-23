"use client";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import type { EnhancedStore } from "@reduxjs/toolkit";
import type { UserAuthProps } from "@/redux/features/AuthContext";
import { updateUser } from "@/redux/features/AuthContext";
import { type User } from "next-auth";

type AppStore = EnhancedStore<{ authXReducer: { user: UserAuthProps } }>;

export default function ReduxProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    if (user && user?.email) {
      const userAuthProps: UserAuthProps = {
        user: {
          id: user.id,
          username: user.name || "",
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role || "",
        },
      };
      storeRef.current.dispatch(updateUser(userAuthProps));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
