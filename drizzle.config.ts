import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.AUTH_TOKEN,
  },
  tablesFilter: ["ele_*"],
} satisfies Config;
