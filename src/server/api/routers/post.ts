import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts, type PostsTypes } from "@/server/db/schema";
import { desc } from "drizzle-orm/sql";
import { on } from "node:events";
import { useCallback } from "react";
// import { debounce } from "lodash";

type EventMap<T> = Record<keyof T, any[]>;

class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as any, eventName, opts) as any;
  }
}

interface MyEvents {
  add: [PostsTypes];
  isTypingUpdate: [];
}

// In a real app, you'd probably use Redis or something
const ee = new IterableEventEmitter<MyEvents>();

// Use a Map instead of a plain object for better performance with frequent additions/deletions
const currentlyTyping = new Map<
  string,
  { lastTyped: number; timeoutId?: NodeJS.Timeout }
>();

// Replace global interval with individual timeouts
function setTypingTimeout(username: string) {
  // Clear any existing timeout
  if (currentlyTyping.has(username)) {
    const existing = currentlyTyping.get(username);
    if (existing?.timeoutId) clearTimeout(existing.timeoutId);
  }

  // Set new timeout
  const timeoutId = setTimeout(() => {
    currentlyTyping.delete(username);
    ee.emit("isTypingUpdate");
  }, 3000);

  currentlyTyping.set(username, {
    lastTyped: Date.now(),
    timeoutId,
  });
}

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
      const userId = ctx.session.user.id;
      const username = ctx.session.user.username;

      const [post] = await ctx.db
        .insert(posts)
        .values({
          message: input.text,
          createdById: userId,
          name: username,
        })
        .returning();

      // console.log("post", post);

      // const post = await ctx.db.query.posts.findFirst({
      //   where: (posts, { eq }) => eq(posts.createdById, userId),
      //   orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      // });

      // Convert the timestamp to a Date object before emitting
      const formattedPost = {
        ...post,
        // Convert Unix timestamp to Date object
        createdAt: new Date(Number(post.createdAt) * 1000), // Multiply by 1000 to convert seconds to milliseconds
      };

      console.log("emitting post: ", formattedPost);

      ee.emit("add", post);
      // delete currentlyTyping[username];
      const userData = currentlyTyping.get(username);
      if (userData?.timeoutId) clearTimeout(userData.timeoutId);
      currentlyTyping.delete(username);
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
      // Only use the cursor from the client, not a new date
      const cursor = input.cursor;
      const dateString = new Date().toISOString();

      console.log("cursor", cursor);

      const page = await ctx.db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)], // Corrected the orderBy syntax.
        limit: take + 1, // Fetch one extra record to check for pagination.
        offset: 0, // Keep the offset as 0 (you can omit this if not needed).
        where: dateString // Apply cursor-based filtering if provided.
          ? (posts, { lt }) => lt(posts.createdAt, dateString) // Assuming cursor is the timestamp you are using for pagination.
          : undefined, // If no cursor, fetch without the where condition.
      });

      let nextCursor: Date | null = null;

      if (page.length > take) {
        const nextItem = page.pop();
        // Convert the string date from the database back to a Date object
        nextCursor = nextItem?.createdAt ? new Date(nextItem.createdAt) : null;
      }

      console.log("page", page);

      return {
        items: page,
        nextCursor,
      };
    }),

  isTyping: protectedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const user = ctx.session.user.username;

      // Use the debounced version for emitting updates
      // const debouncedEmit = useCallback(
      //   debounce(() => {
      //     ee.emit("isTypingUpdate");
      //   }, 300),
      //   []
      // );

      if (!input.typing) {
        const userData = currentlyTyping.get(user);

        if (userData?.timeoutId) clearTimeout(userData.timeoutId);
        currentlyTyping.delete(user);
      } else {
        setTypingTimeout(user);
      }

      ee.emit("isTypingUpdate");
    }),

  onAdd: publicProcedure.subscription(() => {
    console.log("Client subscribed to post.onAdd"); // Add debugging

    return observable<PostsTypes>((emit) => {
      const onAdd = (data: PostsTypes) => {
        console.log("Post received in subscription:", data); // Add debugging

        emit.next(data);
      };

      ee.on("add", onAdd);

      return () => {
        ee.off("add", onAdd);
      };
    });
  }),

  whoIsTyping: publicProcedure.subscription(() => {
    // Use Set for more efficient comparison
    let prevTyping = new Set<string>();

    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        // const newData = Object.keys(currentlyTyping);
        const newData = Array.from(currentlyTyping.keys());
        const newTyping = new Set(newData);

        // More efficient comparison with Sets
        if (
          prevTyping.size !== newTyping.size ||
          !Array.from(prevTyping).every((user) => newTyping.has(user))
        ) {
          emit.next(newData);
          prevTyping = newTyping;
        }
      };
      // Initial emit
      emit.next(Array.from(currentlyTyping.keys()));
      ee.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        ee.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
});
