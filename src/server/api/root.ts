import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { matchRouter } from "./routers/matches";
import { gameCategoryRouter } from "./routers/gameCategory";
import { createRouter } from "./routers/create";
import { teamRouter } from "./routers/team";

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
  create: createRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
