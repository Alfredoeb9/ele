/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts, PostsTypes } from "@/server/db/schema";
import { desc } from "drizzle-orm/sql";

interface MyEvents {
  add: (data: PostsTypes) => void;
  isTypingUpdate: () => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();

// who is currently typing, key is `name`
const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

// every 1s, clear old "isTyping"
const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit("isTypingUpdate");
  }
}, 3e3);
process.on("SIGTERM", () => {
  clearInterval(interval);
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // Custom routers
  add: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log("add", ctx.session.user.user);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const user = ctx.session.user.user.username;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const userId = ctx.session.user.user.id;

      console.log("UserId", userId);

      await ctx.db.insert(posts).values({
        message: input.text,
        createdById: userId,
        name: user,
      });

      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.createdById, userId),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });

      // es
      ee.emit("add", post as PostsTypes);
      delete currentlyTyping[user];
      ee.emit("isTypingUpdate");

      return post;
    }),

  infinite: publicProcedure
    .input(
      z.object({
        cursor: z.date().nullish(),
        take: z.number().min(1).max(50).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const take = input.take ?? 10;
      const cursor = input.cursor;

      const page = await ctx.db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)], // Corrected the orderBy syntax.
        limit: take + 1, // Fetch one extra record to check for pagination.
        offset: 0, // Keep the offset as 0 (you can omit this if not needed).
        where: cursor // Apply cursor-based filtering if provided.
          ? (posts, { lt }) => lt(posts.createdAt, cursor) // Assuming cursor is the timestamp you are using for pagination.
          : undefined, // If no cursor, fetch without the where condition.
      });

      // const page = await ctx.db.posts.findMany({
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      //   cursor: cursor ? { createdAt: cursor } : undefined,
      //   take: take + 1,
      //   skip: 0,
      // });

      const items = page.reverse();
      let nextCursor: typeof cursor | null = null;
      if (items.length > take) {
        const prev = items.shift();

        nextCursor = prev!.createdAt;
      }
      return {
        items,
        nextCursor,
      };
    }),

  isTyping: protectedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const user = ctx.session.username;

      if (!input.typing) {
        delete currentlyTyping[user];
      } else {
        currentlyTyping[user] = {
          lastTyped: new Date(),
        };
      }

      ee.emit("isTypingUpdate");
    }),

  onAdd: publicProcedure.subscription(() => {
    return observable<PostsTypes>((emit) => {
      const onAdd = (data: PostsTypes) => {
        emit.next(data);
      };
      ee.on("add", onAdd);
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),

  whoIsTyping: publicProcedure.subscription(() => {
    let prev: string[] | null = null;

    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const newData = Object.keys(currentlyTyping);

        if (!prev || prev.toString() !== newData.toString()) {
          emit.next(newData);
        }
        prev = newData;
      };
      ee.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        ee.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
});
