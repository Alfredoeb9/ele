import { z } from "zod";
import { and, eq, gte } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory, moneyMatch, tournaments, nonCashMatch } from "@/server/db/schema";
import { capitalizeWords } from "@/lib/utils/capitalizeString";

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
          const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

          const gameData = await ctx.db.select().from(gameCategory).where(eq(gameCategory.game, input.gameName))

          console.log('gameData from api', gameData)

          if (!gameData) {
            throw new Error("Please select a game we support");
          }

          const [tournamentsData, moneyMatchesData, nonCashMatchesData] = await Promise.all([
            ctx.db.select().from(tournaments)
              .where(eq(tournaments.game, input.gameName)),
            ctx.db.select().from(moneyMatch)
              .where(eq(moneyMatch.gameTitle, input.gameName)),
            ctx.db.select().from(nonCashMatch)
              .where(eq(nonCashMatch.gameTitle, input.gameName)),
          ]);

        console.log('Final return data:', {
          gameData,
          tournamentsData,
          moneyMatchesData,
          nonCashMatchesData,
        });

          // const [tournamentsData, moneyMatchesData, nonCashMatchesData] = await Promise.all([
          //   // Get tournaments for this game
          //   ctx.db.query.tournaments.findMany({
          //     where: and(
          //       eq(tournaments.game, input.gameName),
          //       gte(tournaments.start_time, currentDateTime)
          //     ),
          //   }),

          //   console.log('input', input.gameName),
          //   console.log('moneyMatch', moneyMatch.gameTitle),


          //   // Get money matches for this game
          //   ctx.db.select().from(moneyMatch).where(eq(moneyMatch.gameTitle, input.gameName)),
          //     // with: {
          //     //   teams: {
          //     //     with: {
          //     //       users: {
          //     //         columns: {
          //     //           id: true,
          //     //           username: true,
          //     //         }
          //     //       }
          //     //     }
          //     //   }
          //     // }
          //   // }),

          //   // Get non-cash matches for this game
          //   ctx.db.query.nonCashMatch.findMany({
          //     where: and(
          //       eq(nonCashMatch.gameTitle, input.gameName),
          //       gte(nonCashMatch.startTime, currentDateTime)
          //     ),
          //     with: {
          //       teams: {
          //         with: {
          //           users: {
          //             columns: {
          //               id: true,
          //               username: true,
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }),
          // ]);


          return {
            game: gameData[0],                    // ✅ Match frontend expectation
            tournaments: tournamentsData,  // ✅ Match frontend expectation
            moneyMatches: moneyMatchesData, // ✅ Match frontend expectation
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