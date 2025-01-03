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
  url: "libsql://ele-alfredoeb9.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjMyNDEzNTMsImlkIjoiOTg2ODQ5YzgtOWNjZC00OWQzLTlmYzUtNTNmZTFjN2FkMjMxIn0.Dlkh0GC7yCwbJQ8n6Ev7WZ_gq3EFLzlcBLbaEolbXzOXMC__binVZXDovBsVAcT34ki5HzuwyyCYvznT_OlqCw",
});

console.log("client", client);

export const db = drizzle(client, { schema, logger: true });
