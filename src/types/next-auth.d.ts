import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  interface Session {
    user: User;
    token: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    account: {
      username: string;
      firstName: string;
      lastName: string;
      role: string;
    } & DefaultSession["user"];
  }
}

// types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // Add other properties as needed
}
