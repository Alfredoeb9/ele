import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";
import { Client, createClient } from "@libsql/client";

// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema, logger: true }
// );

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.AUTH_TOKEN,
  });
if (env.NODE_ENV !== "production") globalForDb.client = client;

// export const db = drizzle(client, { schema });

// export const client = createClient({

// });

export const db = drizzle(client, { schema, logger: true });
