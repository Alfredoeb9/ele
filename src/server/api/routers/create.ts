import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { posts, teamMembersTable, teams, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";

export const createRouter = createTRPCRouter({
    createTeam: protectedProcedure
        .input(z.object({
            game: z.string().min(1),
            teamName: z.string().min(1),
            email: z.string().min(1),
            gameText: z.string().min(1)
        }))
        .mutation(async ({ ctx, input })=> {
            await ctx.db.transaction(async (tx) => {
                const teamRandomId = crypto.randomUUID()

                // create the team
                await ctx.db.insert(teams).values({
                    game: input.game,
                    team_name: input.teamName,
                    id: teamRandomId
                });

                // creat user to the team Members table 
                // this allows me to get multiple teams user is part of
                await ctx.db.insert(teamMembersTable).values({
                    teamId: teamRandomId,
                    userId: input.email,
                    game: input.gameText,
                    role: "member"
                })
    
                // await ctx.db.update(users).set({ teamId: teamRandomId as unknown as string[]}).where(eq(users.email, input.email))
    
                // this works to update the teamId but in single values ... not ideal
                // await ctx.db
                //     .update(users)
                //     .set({
                //         teamId: teamRandomId
                //     })
                //     .where(eq(users.email, input.email));
    
                // trying to update users teamId: <Array>
                // await ctx.db.update(users)
                //     .set({
                //         teamId: sql`${users.teamId } || '["c"]'`,
                //     })
                //     .where(eq(users.email, input.email));
            })
            
        })
})