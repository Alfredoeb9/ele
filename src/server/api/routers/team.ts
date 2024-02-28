import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { teamMembersTable, teamRecordTable, teams } from "@/server/db/schema";

export const teamRouter = createTRPCRouter({
    getSingleTeam: publicProcedure
        .input(z.object({
            id: z.string().min(1)
        }))
        .query(async ({ ctx, input }) => {
            try {
                const team = await ctx.db.query.teams.findFirst({
                    where: eq(teams.id, input.id),
                    with: {
                        members: true,
                        record: true
                    }
                })

                if (!team) throw new Error("Team does not exist")

                return team
            } catch (error) {
                throw new Error(error as string)
            }
        }),

    leaveTeam: publicProcedure
        .input(z.object({
            userEmail: z.string().min(1)
        }))
        .mutation(async ({ ctx, input}) => {
            try {
                await ctx.db.delete(teamMembersTable).where(eq(teamMembersTable.userId, input.userEmail));

                return "User has left team"
            } catch (error) {
                throw new Error(error as string)
            }
            
        }),

    disbandTeam: publicProcedure
        .input(z.object({
            teamId: z.string().min(1)
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.transaction(async (tx) => {
                try {
                    await tx.delete(teamMembersTable).where(eq(teamMembersTable.teamId, input.teamId))
                    await tx.delete(teams).where(eq(teams.id, input.teamId))
                    await tx.delete(teamRecordTable).where(eq(teamRecordTable.teamId, input.teamId))
    
                    return "team has been deleted"
                } catch (error) {
                    throw new Error(error as string)
                }
            })
            
        })

})