import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tickets } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const ticketRouter = createTRPCRouter({
    createNewTicket: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        userEmail: z.string().min(1),
        userName: z.string().min(1),
        text: z.string().min(1),
        cat: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const ticketId = crypto.randomUUID();
        const newTicket = await ctx.db.insert(tickets).values({
          id: ticketId,
          body: input.text,
          userId: input.userId,
          userEmail: input.userEmail,
          createdById: input.userName,
          category: input.cat,
          status: "Open",
        });

        return newTicket;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

    editTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
        userId: z.string().min(1),
        userEmail: z.string().min(1),
        userName: z.string().min(1),
        text: z.string().min(1),
        cat: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
        const ticket = await ctx.db.update(tickets)
                                .set({ body: input.text })
                                .where(and(eq(tickets.userId, input.userId), 
                                            eq(tickets.id, input.ticketId))).returning();
        
        return ticket;
    })
})