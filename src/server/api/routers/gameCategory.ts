import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory } from "@/server/db/schema";

export const gameCategoryRouter = createTRPCRouter({
    getAllGames: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.select().from(gameCategory)
    }),

    getOnlyGames: publicProcedure.query(async({ ctx }) => {
        const games = await ctx.db.select().from(gameCategory)

        if (games.length <= 0) throw new Error("Error occured, please refresh")

        return games
    })
})