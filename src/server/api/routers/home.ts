import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { desc, eq, gt, gte } from "drizzle-orm";
import { 
  gameCategory, 
  moneyMatch, 
  nonCashMatch, 
  tournaments 
} from "@/server/db/schema";

export const homeRouter = createTRPCRouter({
  getHomePageData: publicProcedure.query(async ({ ctx }) => {
    try {
      const currentDateTime = new Date().toISOString().slice(0, 16)

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
        ctx.db.select().from(moneyMatch)
          .where(gte(moneyMatch.startTime, currentDateTime))
          .orderBy(desc(moneyMatch.createdAt)),

        ctx.db.select().from(nonCashMatch)
          .where(gte(nonCashMatch.startTime, nonCashMatch))
          .orderBy(desc(nonCashMatch.createdAt)),

        // Get recent tournaments
        ctx.db.select().from(tournaments)
          .where(gte(tournaments.start_time, currentDateTime))
          .limit(10),
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