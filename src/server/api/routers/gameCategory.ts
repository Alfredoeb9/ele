import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory } from "@/server/db/schema";

export const gameCategoryRouter = createTRPCRouter({
    getAllGames: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.db.select().from(gameCategory)
        } catch (error) {
            throw new Error(error as string)
        }
    }),

    getOnlyGames: publicProcedure.query(async({ ctx }) => {
        const games = await ctx.db.select().from(gameCategory)

        if (games.length <= 0) throw new Error("Error occured, please refresh")

        return games
    }),
    
    getSingleGame: publicProcedure
        .input(z.object({
            gameName: z.string().min(1)
        }))
        .query(async ({ ctx, input }) => {
            try {
                const data = await ctx.db.query.gameCategory.findMany({
                    where: eq(gameCategory.game, input.gameName),
                    with: {
                        tournaments: true
                    }
                })

                if (data.length <= 0) throw new Error("Please select a game we support")

                return data
            } catch (error) {
                throw new Error("Error retrieving game information")
            }
        })
})