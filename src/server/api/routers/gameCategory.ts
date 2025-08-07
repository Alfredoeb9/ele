import { z } from "zod";
import { desc, gte, eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory, moneyMatch, tournaments, nonCashMatch } from "@/server/db/schema";

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
      throw new Error("Error occurred, please reach out to support");

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
          const gameData = await ctx.db.select().from(gameCategory).where(eq(gameCategory.game, input.gameName))

          if (!gameData) {
            throw new Error("Please select a game we support");
          }

          const currentDateTime = new Date().toISOString().slice(0, 16)
          const [tournamentsData, moneyMatchesData, nonCashMatchesData] = await Promise.all([
            ctx.db.select().from(tournaments)
              .where(and(gte(tournaments.start_time, currentDateTime), eq(tournaments.game, input.gameName))),
            ctx.db.select().from(moneyMatch)
              .where(and(gte(moneyMatch.startTime, currentDateTime), eq(moneyMatch.gameTitle, input.gameName)))
              .orderBy(desc(moneyMatch.createdAt)),
            ctx.db.select().from(nonCashMatch)
              .where(and(gte(nonCashMatch.startTime, currentDateTime), eq(nonCashMatch.gameTitle, input.gameName)))
              .orderBy(desc(nonCashMatch.createdAt)),
          ]);

          return {
            game: gameData[0],                   
            tournaments: tournamentsData,  
            moneyMatches: moneyMatchesData,
            nonCashMatches: nonCashMatchesData,
          };
        } catch (error) {
          console.log('error', error)
          throw new Error(error as string);
        }
      
    }),

    getGameWithMatches: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const game = await ctx.db.query.gameCategory.findFirst({
          where: eq(gameCategory.id, input.gameId),
        });

        if (!game) {
          throw new Error("Game not found");
        }

        // Get all related matches separately
        const [tournamentsData, moneyMatchesData, nonCashMatchesData] = await Promise.all([
          ctx.db.select().from(tournaments).where(eq(tournaments.game, game.game)),
          ctx.db.select().from(moneyMatch).where(eq(moneyMatch.gameTitle, game.game)),
          ctx.db.select().from(nonCashMatch).where(eq(nonCashMatch.gameTitle, game.game)),
        ]);

        return {
          game,
          tournaments: tournamentsData,
          moneyMatches: moneyMatchesData,
          nonCashMatches: nonCashMatchesData,
        };
      } catch (error) {
        throw new Error(error as string);
      }
    }),
});