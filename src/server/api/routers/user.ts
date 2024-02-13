import { z } from "zod";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts, sessions, users, verificationTokens } from "@/server/db/schema";
import { db } from "@/server/db";
import { createToken, emailRegx } from "@/lib/utils/utils";
import { sentVerifyUserEmail } from "@/app/api/auth/[...nextauth]/mailer";

export const userRouter = createTRPCRouter({
  // getUser: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  create: publicProcedure
    .input(z.object({ 
      email: z.string().min(1), 
      password: z.string().min(1), 
      username: z.string().min(1),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      if (input.email.length <= 0) throw new Error("Please provide a proper email")
      if (input.password.length <= 0) throw new Error("Please provide a proper password");
      if (input.username.length <= 0) throw new Error("Please provide a proper username");
      if (input.firstName.length <= 0) throw new Error("Please provide a proper first name");
      if (input.lastName.length <= 0) throw new Error("Please provide a proper last name");

      try {

        const isEmailValid = await emailRegx(input.email);

        if (!isEmailValid) {
            throw new Error("Please provide a proper email")
        }

        // const existingUserByEmail = await db.user.findUnique({
        //     where: { email: input.email }
        // });

        // if (existingUserByEmail?.email === input.email) {
        //     throw Error("Looks like an email is set up with us, try logging in!");            
        // };

        // const existingUserByUsername = await db.user.findUnique({
        //     where: {
        //         username: input.username
        //     }
        // })

        // if (existingUserByUsername?.username === input.username) {
        //     throw Error("Username is taken")
        // }

        const salt = await bcrypt.genSalt();
        
        const hashedPassword = await bcrypt.hash(input.password, salt);
        
        // const newUser = await db.user.create({
        //     data: {
        //         firstName,
        //         lastName,
        //         username,
        //         email,
        //         password: hashedPassword,
        //         isAdmin
        //     }
        // });

        await ctx.db.insert(users).values({
          id: crypto.randomUUID(),
          email: input.email,
          password: hashedPassword,
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
        })

        const newUser = await ctx.db.select().from(users).where(eq(users.email, input.email))

        console.log("newUser", newUser)

        if (newUser[0] === null || newUser[0] === undefined) throw new Error("Error occured signing up")

        const token = await createToken(newUser[0].id);

        const link = `${process.env.REACT_APP_BASE_URL}/verify-email/${token}`;
        const fullName = newUser[0].firstName + " " + newUser[0].lastName;
        // await ctx.db.insert(activateToken)
        await ctx.db.insert(verificationTokens).values({
          token: token,
          id: newUser[0].id,
        });
        // await db.activateToken.create({
        //     data: {
        //         token: token,
        //         userId: newUser.id
        //     }
        // })
        await sentVerifyUserEmail(newUser[0].email, fullName, link)
        // return NextResponse.json({ firstName, lastName, username, email, isAdmin, message: "User created Successfully"}, { status: 201 });

        // return newUser

        // const awaitUser = await newUser;
        // //@ts-ignore
        // const token = await createToken(awaitUser.id, isAdmin);

        // // send verification function

        // const link = `${process.env.REACT_APP_BASE_URL}/auth/verify-email/${token}`;
        // const fullName = awaitUser.firstName + " " + awaitUser.lastName;
        // await db.activateToken.create({
        //     data: {
        //         token: token,
        //         userId: awaitUser.id
        //     }
        // })
        // await sentVerifyUserEmail(awaitUser.email, fullName, link)
        // return NextResponse.json({ user: awaitUser, message: "User created Successfully"}, { status: 201 });
    } catch (error) {
      throw new Error(error as string)
        // return NextResponse.json({ message: `${error}`}, { status: 500 })
    } 
  }),

  verifyUser: publicProcedure
    .input(z.object({ 
      token: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const dbUser = await ctx.db.select().from(verificationTokens).where(eq(verificationTokens.token, input.token))
        if (!dbUser[0]) throw new Error("Error: New such user found Please sign up")
  
        await ctx.db
          .update(users)
          .set({ isVerified: true })
          .where(eq(users.id, dbUser[0].id))

          
        await ctx.db
          .update(verificationTokens)
          .set({updatedAt: new Date()})
          .where(eq(verificationTokens.token, input.token));
        
        return "success"
      } catch (error) {
        throw new Error(error as string)
      }
      
    }),
    
  getSingleUser: publicProcedure
    .input(z.object({
      email: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const currentUser = await ctx.db.select().from(users).where(eq(users.email, input.email))

        if (!currentUser[0]) throw new Error("No user with such credentials")
        return {
          id: currentUser[0].id,
          username: currentUser[0].username,
          firstName: currentUser[0].firstName,
          lastName: currentUser[0].lastName,
          isVerified: currentUser[0].isVerified,
          role: currentUser[0].role,
          email: currentUser[0].email,
          credits: currentUser[0].credits,
          teamId: currentUser[0].teamId
        }
      } catch (error) {
        throw new Error(error as string)
      }
    }),
  
  getSingleUserByTeamId: publicProcedure
    .input(z.object({
      email: z.string().min(1),
      gameId: z.string().min(1)
    }))
    .mutation(async({ ctx, input }) => {
      try { 
        const userWithSpecificTeam = await ctx.db.query.users.findFirst({
          with: {
            teams: {
              where: (teams, {eq}) => eq(teams.id, input.gameId)
            }
          }
        });

        // return data that is only needed
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
          teams: userWithSpecificTeam?.teams       
        }
      } catch (error) {
        throw new Error(error as string)
      }
    }),

  getSingleUserWithTeams: publicProcedure
    .input(z.object({
      email: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const currentUser = await ctx.db.query.users.findFirst({
          with: {
            teams: true
          }
        });

        if (!currentUser) throw new Error("No user with such credentials")

        return currentUser;
      } catch (error) {
        throw new Error(error as string)
      }
    }),

  getSingleUserWithTeamMembers: publicProcedure
    .input(z.object({
      email: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const currentUserWithTeamMembers = await ctx.db.query.users.findFirst({
          with: {
            teamMembers: true
          }
        })

        if (!currentUserWithTeamMembers) throw new Error("Error occured getting user data")

        return currentUserWithTeamMembers;
      } catch (error) {
        throw new Error(error as string)
      }
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
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