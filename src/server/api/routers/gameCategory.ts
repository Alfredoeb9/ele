import { z } from "zod";
import { and, eq, gte } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory, moneyMatch, tournaments } from "@/server/db/schema";

export const gameCategoryRouter = createTRPCRouter({
  getAllGames: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.select().from(gameCategory);
    } catch (error) {
      throw new Error(error as string);
    }
  }),

  getOnlyGames: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.select().from(gameCategory);

    if (games.length <= 0)
      throw new Error("Error occured, please reach out to support");

    return games;
  }),

  getSingleGame: publicProcedure
    .input(
      z.object({
        gameName: z.string().min(1)
          .transform((val) => decodeURIComponent(val))
          .transform((val) => val
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.gameCategory.findMany({
          where: eq(gameCategory.game, input.gameName),
          with: {
            tournaments: {
              where: gte(
                tournaments.start_time,
                new Date().toISOString().slice(0, -8) as unknown as string,
              ),
            },
            moneyMatch: {
              where:
                (and(eq(moneyMatch.gameTitle, input.gameName)),
                gte(
                  moneyMatch.startTime,
                  new Date().toISOString().slice(0, -8) as unknown as string,
                )),
            },
          },
        });

        if (data.length <= 0)
          throw new Error("Please select a game we support");

        return data;
      } catch (error) {
        throw new Error(error as string);
      }
    }),
});
