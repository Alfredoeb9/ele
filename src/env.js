import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    EMAIL_SERVER: z.string(),
    EMAIL_FROM: z.string(),
    JWT_SECRET: z.string(),
    EMAIL_PWD: z.string(),
    JWT_EXPIRATION_MINUTES: z.string(),
    STRIPE_API_KEY: z.string(),
    PRICE_ID_25: z.string(),
    PRICE_ID_50: z.string(),
    PRICE_ID_100: z.string(),
    PRICE_ID_250: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    SRIPE_WEBHOOK_SECRET: z.string(),
    AUTH_TOKEN: z.string(),
    // DISCORD_CLIENT_ID: z.string(),
    // DISCORD_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_PWD: process.env.EMAIL_PWD,
    JWT_EXPIRATION_MINUTES: process.env.JWT_EXPIRATION_MINUTES,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    PRICE_ID_25: process.env.PRICE_ID_25,
    PRICE_ID_50: process.env.PRICE_ID_50,
    PRICE_ID_100: process.env.PRICE_ID_100,
    PRICE_ID_250: process.env.PRICE_ID_250,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SRIPE_WEBHOOK_SECRET: process.env.SRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: true,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
