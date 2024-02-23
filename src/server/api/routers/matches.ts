import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { matches, posts, teamsToMatches, tournamentTeamsEnrolled, tournaments, tournamentsToTeams, usersToMatches } from "@/server/db/schema";

export const matchRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({ 
        id: z.string().min(1) ,
        name: z.string().min(1),
        game: z.string().min(1),
        tournament_type: z.string().min(1),
        platforms: z.string().min(1),
        entry: z.string().min(1),
        team_size: z.string().min(1),
        max_teams: z.number().min(1),
        enrolled: z.number().min(1),
        start_time: z.string().min(1),
        rules: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),
  
  getAllMatches: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tournaments);
  }),

  getSingleMatch: publicProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {

    try {
      const tournament = await ctx.db.select().from(tournaments).where(eq(tournaments.id, input.id))

      return tournament;
    } catch (error) {
      throw new Error("Error retrieving tournament information")
    }
    
  }),

  // getSingle: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.tournaments.findFirst({
  //     where: (tournament, { desc }) => [desc(tournament.id)],
  //   });
  // }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getLatestUsersMatches: publicProcedure
    .input(z.object({
      userId: z.string().min(1),
      tournamentId: z.any()
    }))
    .query(async ({ ctx, input }) => {

      const data: any[] | PromiseLike<any[]> = []

       input.tournamentId.map(async (id: any) => {
        
        const house =  ctx.db.query.tournaments.findMany({
          where: eq(tournaments.id, id.id)
        })
        return data.push(house)
      })

      return data
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  enrollTeamToTournament: publicProcedure
    .input(z.object({ tournamentId: z.string(), teamId: z.string().min(1), teamName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        try {
          // check if team is already enrolled and if not then allow them to enroll
  
          const teamEnrolled = await tx.insert(tournamentTeamsEnrolled).values({
            id: input.tournamentId,
            teamId: input.teamId,
            teamName: input.teamName
          })
  
          if (!teamEnrolled) throw new Error("Teams is already Enrolled")
  
          // update enroll number for tournament
          await tx
            .update(tournaments)
            .set({ enrolled: sql`${tournaments.enrolled} + 1`})
            .where(eq(tournaments.id, input.tournamentId))
          
          const tournamentId = crypto.randomUUID()

          await tx
            .insert(tournamentsToTeams)
            .values({
              tournament_id: input.tournamentId,
              team_id: input.teamId
            })
          
          // insert new enrolled team into respectable team tables
          const matchId = crypto.randomUUID()
          await tx
            .insert(matches)
            .values({
              id: matchId,
              teamId: input.teamId
            })
          
          await tx
            .insert(teamsToMatches)
            .values({
              match_id: matchId,
              team_id: input.teamId
            })
  
          return true
        } catch (error) {
          throw new Error("Error cannot enroll team in tournament")
        }
      })
    })
});
