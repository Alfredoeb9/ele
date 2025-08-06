import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { desc, eq, gt } from "drizzle-orm";
import { 
  gameCategory, 
  moneyMatch, 
  nonCashMatch, 
  tournaments 
} from "@/server/db/schema";

export const homeRouter = createTRPCRouter({
  getHomePageData: publicProcedure.query(async ({ ctx }) => {
    try {
      // Run all queries in parallel for better performance
      const [
        gamesData,
        moneyMatchesData,
        nonMoneyMatchesData,
        tournamentsData
      ] = await Promise.all([
        // Get featured games (using gameCategory table)
        ctx.db.select().from(gameCategory).limit(10),
        // Get recent money matches
        // ctx.db.query.moneyMatch.findMany({
        //   limit: 10,
        //   orderBy: [desc(moneyMatch.createdAt)],
        //   columns: {
        //     matchId: true,
        //     gameTitle: true,
        //     teamName: true,
        //     createdBy: true,
        //     platform: true,
        //     matchName: true,
        //     matchType: true,
        //     matchEntry: true,
        //     teamSize: true,
        //     startTime: true,
        //     createdAt: true,
        //   },
        //   with: {
        //     teams: {
        //       columns: {
        //         id: true,
        //         team_name: true,
        //         userId: true,
        //       },
        //       with: {
        //         users: {
        //           columns: {
        //             id: true,
        //             username: true,
        //           }
        //         }
        //       }
        //     },
        //     gameCategory: {
        //       columns: {
        //         game: true,
        //         platforms: true,
        //         category: true,
        //       }
        //     }
        //   }
        // }),

        ctx.db.select().from(moneyMatch).where(gt(moneyMatch.startTime, new Date().toISOString().slice(0, -8))),

        // Get recent non-money matches
        ctx.db.select().from(nonCashMatch).where(gt(nonCashMatch.startTime, new Date().toISOString().slice(0, -8))),
        // ctx.db.query.nonCashMatch.findMany({
        //   limit: 10,
        //   orderBy: [desc(nonCashMatch.createdAt)],
        //   columns: {
        //     matchId: true,
        //     gameTitle: true,
        //     teamName: true,
        //     createdBy: true,
        //     platform: true,
        //     matchName: true,
        //     matchType: true,
        //     teamSize: true,
        //     startTime: true,
        //     createdAt: true,
        //   },
        //   with: {
        //     teams: {
        //       columns: {
        //         id: true,
        //         team_name: true,
        //         userId: true,
        //       },
        //       with: {
        //         users: {
        //           columns: {
        //             id: true,
        //             username: true,
        //           }
        //         }
        //       }
        //     },
        //     gameCategory: {
        //       columns: {
        //         game: true,
        //         platforms: true,
        //         category: true,
        //       }
        //     }
        //   }
        // }),

        // Get recent tournaments
        ctx.db
              .select()
              .from(nonCashMatch)
              .where(gt(nonCashMatch.startTime, new Date().toISOString().slice(0, -8))),
        // ctx.db.query.tournaments.findMany({
        //   limit: 10,
        //   orderBy: [desc(tournaments.created_by)], // Using created_by since no createdAt
        //   columns: {
        //     id: true,
        //     name: true,
        //     game: true,
        //     prize: true,
        //     category: true,
        //     tournament_type: true,
        //     platform: true,
        //     entry: true,
        //     team_size: true,
        //     max_teams: true,
        //     enrolled: true,
        //     start_time: true,
        //     created_by: true,
        //   }
        // }),
      ]);

      return {
        games: gamesData,
        moneyMatches: moneyMatchesData,
        nonMoneyMatches: nonMoneyMatchesData,
        tournaments: tournamentsData,
      };
    } catch (error) {
      console.error("Error fetching home page data:", error);
      throw new Error("Failed to fetch home page data");
    }
  }),
});