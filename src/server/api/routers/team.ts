import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { notificationsTable, teamMembersTable, teamRecordTable, teams, users } from "@/server/db/schema";

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
            userEmail: z.string().min(1),
            teamId: z.string().min(1)
        }))
        .mutation(async ({ ctx, input}) => {
            try {
                await ctx.db.delete(teamMembersTable).where(and(eq(teamMembersTable.teamId, input.teamId),eq(teamMembersTable.userId, input.userEmail)));

                return "User has left team"
            } catch (error) {
                throw new Error(error as string)
            }
            
        }),

    sendTeamInvite: publicProcedure
        .input(z.object({
          inviteeUserName: z.string().min(1),
          invitedBy: z.string().min(1),
          invitedByUserName: z.string().min(1),
          teamName: z.string().min(1),
          teamId: z.string().min(1),
          game: z.string().min(1)
        }))
        .mutation(async ({ ctx, input }) => {
          try {
            // grab all users friends
            // const following = await ctx.db.query.followsTables.findMany({
            //   where: eq(users.username, input.username)
            // })
    
            // check if user is already a friend
            // const isFriend = await ctx.db.query.followsTables.findFirst({
            //   where: eq(followsTables.targetUser, input.userName)
            // })
    
            const isUserActive = await ctx.db.select().from(users).where(eq(users.username, input.inviteeUserName))
    
            if (isUserActive.length <= 0) throw new Error("No user found")
            
            const sentTeamInvite = await ctx.db.insert(notificationsTable).values({
              userId: isUserActive[0].id, // target
              from: input.invitedBy,
              isRead: false,
              type: "team-invite",
              id: crypto.randomUUID(),
              userName: input.invitedByUserName,
              metaData: {teamName: input.teamName, game: input.game, teamId: input.teamId}
            })
    
            return sentTeamInvite;
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