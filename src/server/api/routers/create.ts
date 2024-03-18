import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { teamMembersTable, teamRecordTable, teams } from "@/server/db/schema";

export const createRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        gameId: z.string().min(1),
        teamName: z.string().min(1),
        email: z.string().min(1),
        gameText: z.string().min(1),
        userName: z.string().min(1),
        userId: z.string().min(1),
        teamCategory: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const teamRandomId = crypto.randomUUID();

        // create the team
        await tx.insert(teams).values({
          teamCategory: input.teamCategory,
          userId: input.userId,
          gameId: input.gameId,
          gameTitle: input.gameText,
          team_name: input.teamName,
          id: teamRandomId,
        });

        // creat user to the team Members table
        // this allows me to get multiple teams user is part of
        await tx.insert(teamMembersTable).values({
          teamId: teamRandomId,
          userId: input.email,
          game: input.gameText,
          teamName: input.teamName,
          role: "owner",
          userName: input.userName,
        });

        await tx.insert(teamRecordTable).values({
          teamId: teamRandomId,
        });

        return true;
      });
    }),
});
