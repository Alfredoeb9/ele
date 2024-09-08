import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";
import { createClient } from "@libsql/client";

// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema, logger: true }
// );

export const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });
