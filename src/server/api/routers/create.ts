import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { posts, teams } from "@/server/db/schema";

export const createRouter = createTRPCRouter({
    createTeam: protectedProcedure
        .input(z.object({
            game: z.string().min(1),
            teamName: z.string().min(1)

        }))
        .mutation(async ({ ctx, input })=> {
            await ctx.db.insert(teams).values({
                game: input.game,
                team_name: input.teamName,
                id: crypto.randomUUID()
            });
        })
})