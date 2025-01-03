import { WebSocketServer } from "ws";
// import { createContext } from "";
import type { NextApiRequest, NextApiResponse } from "next";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
// import { createContext } from './trpc';
import { api } from "@/trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { getSession } from "next-auth/react";
import { type IncomingHttpHeaders } from "http";
import { db } from "@/server/db";
import { getServerSession, type Session } from "next-auth";
import { createTRPCContext } from "@/server/api/trpc";
import { getServerAuthSession } from "@/server/auth";
import Header from "@/app/_components/header";
import { appRouter } from "@/server/api/root";
// import { createContext } from "../trpc/[trpc]/route";

// interface User {
//   id: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// interface Context {
//   headers: Headers;
//   db: typeof db;
//   session: User | null;
// }

// /**
//  * Creates context for an incoming request
//  * @see https://trpc.io/docs/v11/context
//  */
// export const createContext = async (
//   opts: CreateNextContextOptions | CreateWSSContextFnOptions,
// ): Promise<Context> => {
//   const session = await getSession(opts);

//   const headers = "req" in opts ? opts.req.headers : new Headers();

//   return {
//     headers,
//     db,
//     session: session
//       ? {
//           id: session.user.id,
//           username: session.user.name,
//           firstName: session.user.firstName,
//           lastName: session.user.lastName,
//           role: session.user.role,
//         }
//       : null,
//   };
// };

// export type Contextt = Awaited<ReturnType<typeof creatseContext>>;
// const wss = new WebSocketServer({
//   port: 3001,
// });

// const handler = applyWSSHandler({ wss, router: appRouter, createContext });

// interface User {
//   id: string;
//   username: string;
//   firstName?: string;
//   lastName?: string;
//   role?: string;
// }

// interface ContextTypes {
//   headers: any;
//   db: typeof db;
//   session: User | null;
// }

// export const createContext = async (
//   opts: CreateWSSContextFnOptions,
// ): Promise<ContextTypes> => {
//   const session = await getServerAuthSession();

//   // const headers =
//   //   "req" in opts
//   //     ? new Headers(Object.entries(opts.req.headers))
//   //     : new Headers();

//   const headers =
//     "req" in opts
//       ? new Headers(
//           Object.entries(opts.req.headers).filter(
//             ([, value]) => value !== undefined,
//           ) as [string, string][],
//         )
//       : new Headers();

//   return {
//     headers,
//     db,
//     session,
//   };
// };

// export type Context = Awaited<ReturnType<typeof createContext>>;

const wss = new WebSocketServer({
  port: 3001,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: async ({ req, res, ...rest }) => {
    // try {
    const session = await getSession({ req });

    console.log("session in try", session);

    const headers = new Headers(
      Object.entries(req.headers).filter(
        ([, value]) => value !== undefined,
      ) as [string, string][],
    );

    console.log("headers", headers);

    return { ...rest, req, res, session, db: db, headers };
  },

  onError: (err) => {
    console.log("error", err);
    wss.close();
  },
});
wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
