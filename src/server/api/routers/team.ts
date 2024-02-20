import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { teams } from "@/server/db/schema";

export const teamRouter = createTRPCRouter({
    getSingleTeam: publicProcedure
        .input(z.object({
            id: z.string().min(1)
        }))
        .query(async ({ ctx, input }) => {
            try {
                const team = await ctx.db.query.teams.findFirst({
                    where: eq(teams.id, input.id)
                })

                if (!team) throw new Error("Team does not exist")

                return team
            } catch (error) {
                throw new Error()
            }
        })
})