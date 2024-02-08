import NextAuth, { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        id: string
        username: string
        firstName: string
        lastName: string
    }
    interface Session {
        user: User & {
            id: string
            username: string
            firstName: string
            lastName: string
        }
        token: {
            id: string
            username: string
            firstName: string
            lastName: string
        } 
        account: {
            username: string
            firstName: string
            lastName: string
        } & DefaultSession["user"]
    }
}