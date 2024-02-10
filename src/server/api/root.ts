import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { matchRouter } from "./routers/matches";
import { gameCategoryRouter } from "./routers/gameCategory";
import { createRouter } from "./routers/create";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  matches: matchRouter,
  games: gameCategoryRouter,
  create: createRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
