import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  followsTables,
  gamerTags,
  notificationsTable,
  socialTags,
  stripeAccount,
  teamMembersTable,
  // teams,
  tickets,
  users,
  usersRecordTable,
  verificationTokens,
} from "@/server/db/schema";
import { createToken, emailRegx } from "@/lib/utils/utils";
import { sentVerifyUserEmail } from "@/app/api/auth/[...nextauth]/mailer";
import { env } from "@/env";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
        username: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.email.length <= 0)
        throw new Error("Please provide a proper email");
      if (input.password.length <= 0)
        throw new Error("Please provide a proper password");
      if (input.username.length <= 0)
        throw new Error("Please provide a proper username");
      if (input.firstName.length <= 0)
        throw new Error("Please provide a proper first name");
      if (input.lastName.length <= 0)
        throw new Error("Please provide a proper last name");

      try {
        const isEmailValid = await emailRegx(input.email);

        if (!isEmailValid) {
          throw new Error("Please provide a proper email");
        }

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(input.password, salt);

        await ctx.db.insert(users).values({
          id: crypto.randomUUID(),
          email: input.email,
          password: hashedPassword,
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
        });

        const newUser = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, input.email));

        if (newUser[0] === null || newUser[0] === undefined)
          throw new Error("Error occured signing up");

        const token = await createToken(newUser[0].id);

        const link = `${env.REACT_APP_BASE_URL}/verify-email/${token}`;
        const fullName = newUser[0].firstName + " " + newUser[0].lastName;

        await ctx.db.insert(verificationTokens).values({
          token: token,
          id: newUser[0].id,
        });

        // create stripeAccountTable after they verify account
        await ctx.db.insert(stripeAccount).values({
          stripeId: crypto.randomUUID(),
          username: newUser[0].username,
          userId: newUser[0].id,
          balance: 0,
        });

        await sentVerifyUserEmail(newUser[0].email, fullName, link);
        return "success";
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  verifyUser: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const dbUser = await ctx.db
          .select()
          .from(verificationTokens)
          .where(eq(verificationTokens.token, input.token));

        if (!dbUser[0])
          throw new Error("Error: New such user found Please sign up");

        const userInfo = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, dbUser[0].id));

        if (!userInfo[0]) throw new Error("Error: Service error!");

        await ctx.db
          .update(users)
          .set({ isVerified: true })
          .where(eq(users.id, dbUser[0].id));

        await ctx.db
          .update(verificationTokens)
          .set({ updatedAt: new Date() })
          .where(eq(verificationTokens.token, input.token));

        const userId = dbUser[0].id;
        const userName = userInfo[0]?.username;

        if (!userId || !userName) {
          throw new Error("Invalid user data");
        }

        await ctx.db.insert(usersRecordTable).values({
          userId: userId,
          userName: userName,
        });

        return "success";
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleUser: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const currentUser = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
          columns: {
            password: false,
          },
          with: {
            subscription: true,
            stripeAccount: true,
          },
        });

        if (!currentUser) throw new Error("No user with such credentials");

        return currentUser;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleUserByTeamId: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        gameId: z.string().min(1),
        pathname: z.string().min(1).optional(),
        cat: z.string().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        if (input.pathname === "enroll") {
          const userWithSpecificTeam = await ctx.db.query.users.findFirst({
            where: eq(users.email, input.email),
            columns: {
              password: false,
            },
            with: {
              teams: {
                where: (teams, { eq, and }) =>
                  and(
                    eq(teams.gameTitle, input.gameId),
                    eq(teams.teamCategory, input.cat!),
                  ),
                with: {
                  //@ts-expect-error members should be here
                  members: {
                    with: {
                      user: {
                        columns: {
                          password: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (!userWithSpecificTeam)
            throw new Error("Error occured getting team data");

          return userWithSpecificTeam;
        } else {
          const userWithSpecificTeam = await ctx.db.query.users.findFirst({
            where: eq(users.email, input.email),
            columns: {
              password: false,
            },
            with: {
              teamMembers: {
                where: (teamMembers, { eq }) =>
                  eq(teamMembers.game, input.gameId),
              },
            },
          });
          return {
            id: userWithSpecificTeam?.id,
            username: userWithSpecificTeam?.username,
            firstName: userWithSpecificTeam?.firstName,
            lastName: userWithSpecificTeam?.lastName,
            isVerified: userWithSpecificTeam?.isVerified,
            role: userWithSpecificTeam?.role,
            email: userWithSpecificTeam?.email,
            credits: userWithSpecificTeam?.credits,
            teamId: userWithSpecificTeam?.teamId,
            teams: userWithSpecificTeam?.teamMembers,
          };
        }

        // return data that is only needed
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleUserWithTeams: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).optional(),
        username: z.string().min(1).optional(),
        path: z.string().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        if (input.username) {
          if (input.path === "profile") {
            const currentUser = await ctx.db.query.users.findFirst({
              where: eq(users.username, input.username),
              columns: {
                password: false,
              },
              with: {
                gamerTags: true,
                follows: true,
                userRecord: true,
                teams: {
                  with: {
                    //@ts-expect-error tournamentsEnrolled should be here
                    tournamentsEnrolled: true,
                  },
                },
                stripeAccount: true,
                // matches: true,
              },
            });

            if (!currentUser) throw new Error("No user with such credentials");

            await ctx.db
              .update(users)
              .set({
                profileViews: sql`${users.profileViews} + 1`,
              })
              .where(eq(users.username, input.username));

            return currentUser;
          } else {
            const currentUser = await ctx.db.query.users.findFirst({
              where: eq(users.username, input.username),
              with: {
                teams: true,
              },
            });

            if (!currentUser) throw new Error("No user with such credentials");

            return currentUser;
          }
        } else if (input.email) {
          const currentUser = await ctx.db.query.users.findFirst({
            where: eq(users.email, input.email),
            columns: {
              password: false,
            },
            with: {
              teams: true,
            },
          });

          if (!currentUser) throw new Error("No user with such credentials");

          return currentUser;
        }
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleUserWithTeamMembers: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const currentUserWithTeamMembers = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
          columns: {
            password: false,
          },
          with: {
            teams: {
              with: {
                //@ts-expect-error members should be here
                members: true,
                record: true,
              },
            },
          },
        });

        if (!currentUserWithTeamMembers)
          throw new Error("Error occured getting user data");

        return currentUserWithTeamMembers;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getSingleUserWithAccountInfo: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const currentUserWithAccountInfo = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
          columns: {
            password: false,
          },
          with: {
            gamerTags: true,
          },
        });

        if (!currentUserWithAccountInfo)
          throw new Error("No user with such credentials");

        return currentUserWithAccountInfo;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getAllUsersRecords: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(usersRecordTable);
  }),

  sendFriendRequest: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1),
        id: z.string().min(1),
        senderUserName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserActive = await ctx.db
          .select()
          .from(users)
          .where(eq(users.username, input.userName));

        if (isUserActive.length <= 0) throw new Error("No user found");

        const isFriendRequestSent = await ctx.db
          .select()
          .from(notificationsTable)
          .where(
            and(
              eq(notificationsTable.type, "invite"),
              eq(notificationsTable.from, input.id),
              eq(notificationsTable.userName, input.senderUserName),
            ),
          );

        if (isFriendRequestSent)
          throw new Error("You have already sent user a friend request");

        const sentRequest = await ctx.db.insert(notificationsTable).values({
          userId: isUserActive[0].id, // target
          from: input.id,
          isRead: false,
          type: "invite",
          id: crypto.randomUUID(),
          userName: input.senderUserName,
        });

        return sentRequest;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  acceptFriendRequest: publicProcedure
    .input(
      z.object({
        targetId: z.string().min(1),
        userId: z.string().min(1),
        id: z.string().min(1),
        type: z.string().min(1),
        teamName: z.string().min(1),
        game: z.string().min(1),
        teamId: z.string().min(1),
        targetEmail: z.string().min(1),
        userName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        switch (input.type) {
          case "invite":
            await ctx.db.insert(followsTables).values({
              targetUser: input.targetId,
              userId: input.userId,
            });

            // remove from notification table

            await ctx.db
              .delete(notificationsTable)
              .where(eq(notificationsTable.id, input.id));

            return "user is now your friend";
            break;

          case "team-invite":
            const t = await ctx.db.insert(teamMembersTable).values({
              userId: input.targetEmail,
              inviteId: input.userId,
              teamName: input.teamName,
              game: input.game,
              teamId: input.teamId,
              userName: input.userName,
            });

            // remove from notification table

            await ctx.db
              .delete(notificationsTable)
              .where(eq(notificationsTable.id, input.id));

            return t;
            break;
          default:
            break;
        }
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  declineRequest: publicProcedure
    .input(
      z.object({
        targetId: z.string().min(1),
        userId: z.string().min(1),
        notificationID: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // remove from notification table
        await ctx.db
          .delete(notificationsTable)
          .where(eq(notificationsTable.id, input.notificationID));

        return "user declined request";
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getNotifications: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const getNotification = await ctx.db
          .select()
          .from(notificationsTable)
          .where(eq(notificationsTable.userId, input.id));

        return getNotification;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  messageRead: publicProcedure
    .input(
      z.object({
        isRead: z.boolean(),
        notificationId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db
          .update(notificationsTable)
          .set({
            isRead: input.isRead,
          })
          .where(eq(notificationsTable.id, input.notificationId));
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getUserWithFriends: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userWithFriends = await ctx.db
          .select()
          .from(followsTables)
          .where(eq(followsTables.userId, input.id));

        if (!userWithFriends) {
          throw new Error("No friends found");
        }

        // get all users profiles
        const allFriendsProfiles = await Promise.all(
          userWithFriends.map(async (followingUser) => {
            return await ctx.db
              .select()
              .from(users)
              .where(eq(users.id, followingUser.targetUser)); // change this to
          }),
        );

        return allFriendsProfiles;
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getUserDataWithTickets: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userWithTickets = await ctx.db
          .select()
          .from(tickets)
          .where(eq(tickets.userId, input.id));

        if (!userWithTickets) {
          throw new Error("No friends found");
        }

        return userWithTickets;
      } catch (error) {
        throw new Error(error as string);
      }
    }),
  getUniqueTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const ticketData = await ctx.db
          .select()
          .from(tickets)
          .where(eq(tickets.id, input.ticketId));

        if (!ticketData) throw new Error("Ticket does not exist");

        return ticketData[0];
      } catch (error) {
        throw new Error(
          "There was a service error: " + (error as Error).message,
        );
      }
    }),
  deleteUniqueTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db
          .delete(tickets)
          .where(eq(tickets.id, input.ticketId));
      } catch (error) {
        throw new Error(
          "There was a problem deleting ticket" + (error as Error).message,
        );
      }
    }),

  // updateUsersStripeData: publicProcedure
  //   .input(
  //     z.object({
  //       userId: z.string().min(1),
  //       stripeId: z.string().min(1),
  //       userName: z.string().min(1),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const user = await ctx.db
  //         .select()
  //         .from(users)
  //         .where(eq(users.id, input.userId));

  //       if (!user) throw new Error("User does not exist");

  //       await ctx.db.insert(stripeAccount).values({
  //         userId: input.userId,
  //         stripeId: input.stripeId,
  //         username: input.userName,
  //       });
  //     } catch (error) {
  //       throw new Error(error as string);
  //     }
  //   }),

  updateUsersSocialMedia: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        socialMedia: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const currentUserWithSocialMedia = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
          columns: {
            password: false,
          },
          with: {
            socialMediaTags: true,
          },
        });

        if (!currentUserWithSocialMedia)
          throw new Error("No user with such credentials");

        if (currentUserWithSocialMedia.socialMediaTags.length <= 0) {
          await Promise.all(
            input.socialMedia.map(
              async (tag: { value: string; label: string }) => {
                return await ctx.db.insert(socialTags).values({
                  userId: currentUserWithSocialMedia.id,
                  socialTag: tag.value,
                  type: tag.label,
                });
              },
            ),
          );
        } else if (currentUserWithSocialMedia.socialMediaTags.length > 0) {
          await Promise.all(
            input.socialMedia.map(
              async (tag: { value: string; label: string }) => {
                return await ctx.db
                  .update(socialTags)
                  .set({
                    userId: currentUserWithSocialMedia.id,
                    socialTag: tag.value,
                    type: tag.label,
                  })
                  .where(
                    and(
                      eq(socialTags.type, tag.label),
                      eq(socialTags.userId, currentUserWithSocialMedia.id),
                    ),
                  );
              },
            ),
          );
        }
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  updateUsersGamerTags: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        gamerTags: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const currentUserWithGamerTags = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
          columns: {
            password: false,
          },
          with: {
            gamerTags: true,
          },
        });

        if (!currentUserWithGamerTags)
          throw new Error("No user with such credentials");

        if (currentUserWithGamerTags.gamerTags.length <= 0) {
          await Promise.all(
            input.gamerTags.map(
              async (tag: { value: string; label: string }) => {
                return await ctx.db.insert(gamerTags).values({
                  userId: currentUserWithGamerTags.id,
                  gamerTag: tag.value,
                  type: tag.label,
                });
              },
            ),
          );
        } else if (currentUserWithGamerTags.gamerTags.length > 0) {
          await Promise.all(
            input.gamerTags.map(
              async (tag: { value: string; label: string }) => {
                return await ctx.db
                  .update(gamerTags)
                  .set({
                    userId: currentUserWithGamerTags.id,
                    gamerTag: tag.value,
                    type: tag.label,
                  })
                  .where(
                    and(
                      eq(gamerTags.type, tag.label),
                      eq(gamerTags.userId, currentUserWithGamerTags.id),
                    ),
                  );
              },
            ),
          );
        }
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  updateUsersUsername: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        newUserName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const doesUserExist = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, input.userId));

        if (!doesUserExist) throw new Error("User does not exist");

        return await ctx.db
          .update(users)
          .set({
            username: input.newUserName,
            credits: sql`${users.credits} - 5`,
          })
          .where(eq(users.id, input.userId));
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  updateUsersEmail: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        newEmail: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const doesUserExist = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, input.userId));

        if (!doesUserExist) throw new Error("User does not exist");

        return await ctx.db
          .update(users)
          .set({ username: input.newEmail })
          .where(eq(users.id, input.userId));
      } catch (error) {
        throw new Error(error as string);
      }
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  removeFriend: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userExist = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, input.email));

        if (!userExist) throw new Error("User does not exist");

        const friendRemoved = ctx.db
          .delete(followsTables)
          .where(eq(followsTables.targetUser, userExist[0].id));

        return friendRemoved;
      } catch (error) {
        throw new Error(error as string);
      }
    }),
});

/*

// create a user
const user = await db.insert(users).values({
  name: 'Nilu',
  email: 'nilu@prisma.io',
})

// update a user
const user = await db
  .update(users)
  .set({ name: 'Another Nilu' })
  .where(eq(users.email, 'nilu@prisma.io'))
  .returning()

// delete a user
const deletedUser = await db
  .delete(users)
  .where(eq(users.email, 'nilu@prisma.io'))
  .returning()

  // case sensitive filter
const posts = await db
  .select()
  .from(posts)
  .where(like(posts.title, 'Hello World'))

// case insensitive filter
const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, 'Hello World'))

  // contains
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, '%Hello World%'))

  // starts with
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, 'Hello World%'))

  // ends with
  const posts = await db
  .select()
  .from(posts)
  .where(ilike(posts.title, '%Hello World'))

  // limit-offset pagination (cursor-based not currently possible)
  const postPage = await db
  .select()
  .from(users)
  .where(ilike(posts.title, 'Hello World%'))
  .limit(3)
  .offset(6)
  */
