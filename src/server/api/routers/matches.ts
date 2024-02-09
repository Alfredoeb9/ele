import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts, tournaments } from "@/server/db/schema";

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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
