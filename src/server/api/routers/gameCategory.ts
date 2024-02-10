import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { gameCategory } from "@/server/db/schema";

export const gameCategoryRouter = createTRPCRouter({
    getAllGames: publicProcedure.query(({ ctx }) => {
        return ctx.db.select().from(gameCategory)
    }),

    getOnlyGames: publicProcedure.query(({ ctx }) => {
        const games = ctx.db.select().from(gameCategory)

        console.log("games", games)

        if (!games) throw new Error("Error occured, please refresh ")

        return games
    })
})