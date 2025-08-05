import { z } from "zod";
import { type SQLWrapper, eq, sql, gt } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  type TournamentType,
  matches,
  moneyMatch,
  nonCashMatch,
  posts,
  teamsToMatches,
  tournamentTeamsEnrolled,
  tournaments,
  tournamentsToTeams,
} from "@/server/db/schema";

export const matchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        game: z.string().min(1),
        tournament_type: z.string().min(1),
        platforms: z.string().min(1),
        entry: z.string().min(1),
        team_size: z.string().min(1),
        max_teams: z.number().min(1),
        enrolled: z.number().min(1),
        start_time: z.string().min(1),
        rules: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user?.id,
      });
    }),

  getAllTournaments: publicProcedure
  .input(z.void())
  .query(({ ctx }) => {
    return ctx.db
      .select()
      .from(tournaments)
      .where(gt(tournaments.start_time, new Date().toISOString().slice(0, -8)));
  }),

  getAllMoneyMatches: publicProcedure
  .input(z.void())
  .query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(moneyMatch)
      .where(gt(moneyMatch.startTime, new Date().toISOString().slice(0, -8)));
  }),

  getAllNonMoneyMatches: publicProcedure
  .input(z.void())
  .query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(nonCashMatch)
      .where(gt(nonCashMatch.startTime, new Date().toISOString().slice(0, -8)));
  }),

  getSingleTournament: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const tournament = await ctx.db
          .select()
          .from(tournaments)
          .where(eq(tournaments.id, input.id));

        if (tournament.length <= 0)
          throw new Error(
            "Tournament was not found, please try again or create a support ticket.",
          );

        if (!tournament)
          throw new Error(
            "Tournament was not found, please try again or create a support ticket.",
          );

        return tournament;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleMoneyMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const moneyMatchData = await ctx.db
          .select()
          .from(moneyMatch)
          .where(eq(moneyMatch.matchId, input.matchId));

        if (moneyMatchData.length <= 0)
          throw new Error(
            "Money Match was not found, please try again or create a support ticket.",
          );

        if (!moneyMatchData)
          throw new Error(
            "Money Match was not found, please try again or create a support ticket.",
          );

        return moneyMatchData;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const matchData = await ctx.db
          .select()
          .from(nonCashMatch)
          .where(eq(nonCashMatch.matchId, input.matchId));

        if (matchData.length <= 0)
          throw new Error(
            "Money Match was not found, please try again or create a support ticket.",
          );

        if (!matchData)
          throw new Error(
            "Money Match was not found, please try again or create a support ticket.",
          );

        return matchData;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  // getSingle: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.tournaments.findFirst({
  //     where: (tournament, { desc }) => [desc(tournament.id)],
  //   });
  // }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),

  // Make this into the money match query
  getLatestUsersMatches: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        tournamentId: z.any(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data: TournamentType[] | PromiseLike<[]> = [];

      input.tournamentId.map(async (id: { id: string | SQLWrapper }) => {
        const tourneyMatches = ctx.db.query.tournaments.findMany({
          where: eq(tournaments.id, id.id),
        });
        return data.push(...(await tourneyMatches));
      });

      return data;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  enrollTeamToMoneyMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string().min(1),
        createrTeamId: z.string().min(1),
        acceptingTeamId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(matches).values({
            id: input.matchId,
            teamId: input.createrTeamId,
          });

          await tx.insert(matches).values({
            id: input.matchId,
            teamId: input.acceptingTeamId,
          });

          await tx.insert(teamsToMatches).values({
            match_id: input.matchId,
            team_id: input.acceptingTeamId,
          });
          await tx.insert(teamsToMatches).values({
            match_id: input.matchId,
            team_id: input.createrTeamId,
          });
        });
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  enrollTeamToTournament: publicProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        teamId: z.string().min(1),
        teamName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        try {
          // check if team is already enrolled and if not then allow them to enroll

          const teamEnrolled = await tx.insert(tournamentTeamsEnrolled).values({
            id: input.tournamentId,
            teamId: input.teamId,
            teamName: input.teamName,
          });

          if (!teamEnrolled) throw new Error("Teams is already Enrolled");

          // update enroll number for tournament
          await tx
            .update(tournaments)
            .set({ enrolled: sql`${tournaments.enrolled} + 1` })
            .where(eq(tournaments.id, input.tournamentId));

          await tx.insert(tournamentsToTeams).values({
            tournament_id: input.tournamentId,
            team_id: input.teamId,
          });

          return true;
        } catch (error) {
          throw new Error(
            "Error cannot enroll team in tournament" + (error as Error).message,
          );
        }
      });
    }),

  getEnrolledTeams: publicProcedure
    .input(
      z.object({
        tournamentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(tournamentTeamsEnrolled)
        .where(eq(tournamentTeamsEnrolled.id, input.tournamentId));
    }),
});
