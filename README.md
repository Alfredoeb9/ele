# ELE Main App

This is a ELE Main App

## What's next? How do I make an app with this?

- [x] - Transfer from prisma to drizzle
- [x] - Fix typings
- [x] - Implement create teams table and respectable relations to other tables
- [x] - Implement users able to invite players to teams
  - [x] - Let users accept incoming invite
- [x] - Implement users able to invite players as friends
  - [x] - Let users accept incoming friend invite
- [x] - let user create teams in teams settings
  - [x] - Get all games user can create teams in
  - [x] - Check if team name is taken for that game
  - [x] - Fix error message on create a team page
- [] - Fix public and private prodecures from trpc
- [x] - Implement tournament bracket algo
  - [] - Create Page where teams can submit scores
  - [] - Update following tournament/id to next round
  - [] - Create disputed tournaments use case functionility / good chance to use AI to help medigate disputed match
- [x] - Convert from MySQL to SQLite and move from planetscale to turso due to planetscale removing free tier plan

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Turso](https://turso.tech/)

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
