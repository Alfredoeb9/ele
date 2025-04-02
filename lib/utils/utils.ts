import moment from "moment";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { getSession } from "next-auth/react";
import { type IncomingMessage } from "http";
import { type User } from "@/types/next-auth";

export async function emailRegx(value: string) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const isValidEmail = emailRegex.test(value);
  return isValidEmail;
}

export async function getCurrentDateTime() {
  return moment().toISOString();
}

export async function createToken(id: string) {
  const token1 = jwt.sign({ id }, env.JWT_SECRET);
  const token2 = jwt.sign({ id }, env.JWT_SECRET);
  const secureToken = token1 + token2;
  return secureToken;
}

export function createRandomUUID() {
  const uuid = crypto.randomUUID();
  return uuid;
}

/**
 * Gets user from request session, handles both HTTP and WebSocket contexts
 */
export async function getUserFromRequest(
  req: IncomingMessage,
): Promise<User | null> {
  try {
    const session = await getSession({ req });

    if (!session?.user) {
      return null;
    }

    // Transform session user to your User type
    const user: User = {
      id: session.user.id,
      username: session.user.name || session.user.username,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role || "user",
      email: session.user.email as string,
      // Add any other fields you need
    };

    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

export function formatStripeBalance(
  balance: number | null | undefined,
): string {
  return balance
    ? new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(balance.toString()) / 100)
    : "0.00";
}

// In your React component
function formatTimestamp(timestamp: number, timezone: string) {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// import { format, fromUnixTime } from 'date-fns';
// import { formatInTimeZone } from 'date-fns-tz';

// function formatPostTimePST(timestamp: number) {
//   return formatInTimeZone(
//     fromUnixTime(timestamp),
//     'America/Los_Angeles',
//     'MMM d, yyyy h:mm a z'
//   );
// }

// function formatPostTimeEST(timestamp: number) {
//   return formatInTimeZone(
//     fromUnixTime(timestamp),
//     'America/New_York',
//     'MMM d, yyyy h:mm a z'
//   );
// }

// Usage examples
// const pstTime = formatTimestamp(post.createdAt, 'America/Los_Angeles'); // PST
// const estTime = formatTimestamp(post.createdAt, 'America/New_York');    // EST

// module.exports = {
//     emailRegex: async (value: string) => {
//         const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//         const isValidEmail = emailRegex.test(value);
//         return isValidEmail;
//     },
//     getCurrentDateTime() {
//         return moment().toISOString();
//     },
// }
