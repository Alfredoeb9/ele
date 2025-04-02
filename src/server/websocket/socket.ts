import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { db } from "@/server/db";
import { appRouter } from "@/server/api/root";
import { getUserFromRequest } from "@/lib/utils/utils";

const wss = new WebSocketServer({
  port: 3001,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: async ({ req, res, ...rest }) => {
    try {
      const user = await getUserFromRequest(req);

      const headers = new Headers(
        Object.entries(req.headers)
          .filter(([, value]) => value !== undefined)
          .map(([k, v]) => [k, v!.toString()]) as [string, string][],
      );

      return { ...rest, req, res, session: user, db, headers };
    } catch {
      return {
        ...rest,
        req,
        res,
        session: null,
        db,
        headers: new Headers(),
      };
    }
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

export default wss;
