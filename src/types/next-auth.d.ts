import NextAuth, { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        id: string
        username: string
        firstName: string
        lastName: string
        role: string
    }
    interface Session {
        user: User & {
            id: string
            username: string
            firstName: string
            lastName: string
            role: string
        }
        token: {
            id: string
            username: string
            firstName: string
            lastName: string
            role: string
        } 
        account: {
            username: string
            firstName: string
            lastName: string
            role: string
        } & DefaultSession["user"]
    }
}