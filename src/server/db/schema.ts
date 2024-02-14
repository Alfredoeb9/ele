import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `ele_${name}`);

export const posts = createTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 }).unique().default(`anon${crypto.randomUUID()}`),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  isVerified: boolean("isVerified").default(false),
  isAdmin: varchar("isAdmin", { length: 25 }).default("user"),
  role: varchar("role", { length: 35 }).default("user"),
  email: varchar("email", { length: 255 }).notNull(),
  credits: int("credits").default(15),
  teamId: json('team_id').$type<string[]>().default([]),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

// a user can have many accounts, sessions, teams
export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  teams: many(teams),
  teamMembers: many(teamMembersTable)
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  })
);

// A account can only have one user id
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "activateToken",
  {
    id: varchar("id", { length: 255 }).notNull(),
    token: varchar("token", { length: 384 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const gameCategory = createTable(
  "gameCategory",
  {
    id: varchar("id", { length: 256 }).notNull(),
    game: varchar("game", { length: 256 }).notNull(),
    platforms: json("platforms").notNull()
  }
)

// tournament can only have one id
export const gameRelations = relations(gameCategory, ({ one }) => ({
  gameCategory: one(tournaments, {
    fields: [gameCategory.id], 
    references: [tournaments.id]
  }),
}));

export const tournaments = createTable(
  "tournaments",
  {
    id: varchar("id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    game: varchar("game", { length: 255 }).notNull(),
    prize: int("prize").notNull().default(0),
    tournament_type: varchar("tournament_type", { length: 100 }).notNull(),
    platform: json("platform").notNull(),
    entry: varchar("entry", { length: 150 }).notNull(),
    team_size: varchar("team_size", { length: 50 }).notNull(),
    max_teams: int("max_teams").default(0),
    enrolled: int("enrolled").default(0),
    start_time: varchar("start_time", { length: 300 }).default('2024-02-07 05:00:00'),
    rules: json("rules").notNull(),
    created_by: varchar("created_by", { length: 256 }).notNull()
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.id),
    nameIndex: index("name_idx").on(example.name),
  })
);

// A gameCategory can have many tournaments
export const tournamentRelations = relations(gameCategory, ({ many }) => ({
  tournaments: many(tournaments)
}));

export const teams = createTable(
  "team",
  {
    id: varchar("id", { length: 255 }).notNull(),
    game: varchar("game", { length: 255 }).notNull(),
    team_name: varchar("team_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (team) => ({
    // userIdIdx: index("team_userId_idx").on(team.id),
    // makes sure name coming in is unique
    teamNameIdx: uniqueIndex("team_name_idx").on(team.team_name)
  })
)

// export const teamMembersTable = createTable(
// 	'team_members',
// 	{
// 		userId: varchar('user_id', {
// 			length: 42,
// 		}).notNull(),
// 		teamId: varchar('team_id', { length: 255 }).notNull(),
// 		role: mysqlEnum('role', ['owner', 'admin', 'member']).default('member').notNull(),
// 		createdAt: timestamp('created_at').defaultNow(),
// 		updatedAt: timestamp('updated_at').onUpdateNow(),
// 	}
// )

export const teamMembersTable = createTable(
  'team_members', 
  {
    userId: varchar('user_id', { length: 255 }).notNull(),
    teamId: varchar('team_id', { length: 255 }).notNull(),
    game: varchar('game', { length: 100 }).notNull(),
    teamName: varchar('team_name', { length: 100 }).notNull(),
    role: mysqlEnum('role', ['owner', 'admin', 'member']).default('member').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').onUpdateNow(),
  }
);

export const usersToGroupsRelations = relations(teamMembersTable, ({ one }) => ({
  group: one(teams, {
    fields: [teamMembersTable.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembersTable.userId],
    references: [users.email],
  }),
}));

export type Team = typeof teams.$inferSelect;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferInsert;

// // A team can have many team Members
export const teamsRelations = relations(teams, ({ many }) => ({
	members: many(teamMembersTable),
  invites: many(teamInvites)
}))

// // A member can 
// export const teamMembersRelations = relations(teamMembersTable, ({ one }) => ({
// 	team: one(teams, {
// 		fields: [teamMembersTable.teamId],
// 		references: [teams.id],
// 	}),
// 	user: one(users, {
// 		fields: [teamMembersTable.userId],
// 		references: [users.id],
// 	}),
// }))

// // A team can only have one user per id 
export const teamssRelations = relations(teams, ({ one }) => ({
  user: one(users, { 
    fields: [teams.id], 
    references: [users.teamId] 
  }),
}));

export const teamInvites = createTable(
  "team_invites", 
  {
    id: text("id").notNull(),
    email: text("email").notNull(),
    teamId: text("teamId")
      .notNull(),
    invitedAt: timestamp("invitedAt", { mode: "date" }).notNull(),
    invitedById: text("invitedById")
      .notNull(),
    respondedAt: timestamp("respondedAt", { mode: "date" }),
    accepted: boolean("accepted"),
});

export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvites.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [teamInvites.invitedById],
    references: [users.id],
    relationName: "invitedBy",
  }),
}));

export const tournamentTeamsEnrolled = createTable(
  'tournament_teams_enrolled', 
  {
    id: varchar("id", { length: 255 }).notNull(),
    teamId: varchar("team_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
  },
  (team) => ({
    // makes sure name coming in is unique
    teamNameIdx: uniqueIndex("team_name_idx").on(team.teamId)
  })
)


// export const teamMembersRelations = relations(teams, ({ one }) => ({
// 	team: one(teams, {
// 		fields: [users.teamId as any],
// 		references: [teams.id],
// 	}),
// 	user: one(users, { 
//     fields: [teams.id], 
//     references: [users.id] 
//   }),
// }))

/*
  SUBSCRIPTION SCHEMA

export const subscription = mysqlTable("subscription", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  status: subscriptionStatus('status'),
  metadata: jsonb('metadat'),
  cancelAt:
  updatedAt: timestamp("updated_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));


*/