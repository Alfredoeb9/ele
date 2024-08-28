import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { db } from "@/server/db";
import { createTable, users } from "@/server/db/schema";
import { compare } from "bcrypt";

import validator from 'validator';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
// declare module "next-auth" {
//   interface User {
//     id: string
//     username: string
//     firstName: string
//     lastName: string
//   }
//   interface Session extends DefaultSession {
//     user: User & {
//       id: string;
//       // username: string;
//       // firstName: string;
//       // lastName: string
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // callbacks: {
  //   session: ({ session, user }) => ({
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: user.id,
  //     },
  //   }),
  // },
  
  // providers: [
  //   DiscordProvider({
  //     clientId: env.DISCORD_CLIENT_ID,
  //     clientSecret: env.DISCORD_CLIENT_SECRET,
  //   }),
  //   /**
  //    * ...add more providers here.
  //    *
  //    * Most other providers require a bit more work than the Discord provider. For example, the
  //    * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
  //    * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
  //    *
  //    * @see https://next-auth.js.org/providers/github
  //    */
  // ],
  providers: [

		// EmailProvider({
		// 	server: process.env.EMAIL_SERVER,
		// 	from: process.env.EMAIL_FROM
		// })

    CredentialsProvider({
        name: "Credentials",

        credentials: {
          email: { label: "Email", type: "email", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            // Add logic here to look up the user from the credentials supplied
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Email and or password is not registered");
            }

            if (!validator.isEmail(credentials?.email )) throw new Error("Please provide a proper email");

            const existingUserByEmail = await db.select().from(users).where(eq(users.email, credentials.email))
                            
            if (!existingUserByEmail[0]){
                throw new Error("Email and or password is not registered");
            }

            const passwordMatch = await compare(credentials.password, existingUserByEmail[0].password);

            if (!passwordMatch) {
                throw new Error("Email and or password is not registered");
            }

            if (existingUserByEmail[0].isVerified == false) {
                throw new Error('Email is not verified, Please verify email!')
                // return NextResponse.json({ user: null, message: "Email is not verified, Please verify email!"}, { status: 500 })
            };

            return {
                id: `${existingUserByEmail[0].id}`,
                username: existingUserByEmail[0].username!,
                email: existingUserByEmail[0].email,
                firstName: existingUserByEmail[0].firstName!,
                role: existingUserByEmail[0].role!,
                lastName: existingUserByEmail[0].lastName!
            }
        }
    })
	],
  jwt: {
    maxAge: 24 * 60 * 60 * 1000
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db, createTable) as unknown as Adapter,
  session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60* 60
  },
  pages: {
      signIn: "/sign-in"
  },
  callbacks: {
    jwt({token, account, user, trigger, session}) {
        if (user){
            return {
                ...token,
                id: (user as unknown as User).id,
                username: (user as unknown as User).username,
                firstName: (user as unknown as User).firstName,
                lastName: (user as unknown as User).lastName,
                role: user.role
            }
        }  
        if (account) {
            token.accessToken = account.access_token;
            token.id = token.id;
            token.username = (user as unknown as User).username;
            token.firstName = (user as unknown as User).firstName,
            token.lastName = (user as unknown as User).lastName
            token.role = (user as User).role
        }

        if (trigger === "update" && session.username) {
            token.username = session.username
        }

        return token
    },
    session({session, token}) {
        if (token) {            
            return {
                ...session,
                
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    role: token.role
                }
            }
        }
        return session
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
