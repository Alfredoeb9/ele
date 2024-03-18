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
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { now } from "moment";
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
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 })
    .unique()
    .default(`anon${crypto.randomUUID()}`),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  isVerified: boolean("isVerified").default(false),
  isAdmin: varchar("isAdmin", { length: 25 }).default("user"),
  role: varchar("role", { length: 35 }).default("user"),
  profileViews: int("profile_views").default(0),
  email: varchar("email", { length: 255 }).notNull(),
  credits: int("credits").default(15),
  teamId: json("team_id").$type<string[]>().default([]),
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
  teamMembers: many(teamMembersTable),
  follows: many(followsTables),
  notifications: many(notificationsTable),
  matches: many(matches),
  payments: many(payments),
  gamerTags: many(gamerTags),
  moneyMatch: many(moneyMatch),
  subscription: one(subscription),
  userRecord: one(usersRecordTable),
}));

export const gamerTags = createTable("gamer_tags", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  gamerTag: varchar("gamer_tag", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const gamerTagsRelation = relations(gamerTags, ({ one }) => ({
  user: one(users, {
    fields: [gamerTags.userId],
    references: [users.id],
  }),
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
  }),
);

// A account can only have one user id
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
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
  }),
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
  }),
);

export const gameCategory = createTable("gameCategory", {
  id: varchar("id", { length: 256 }).notNull(),
  game: varchar("game", { length: 256 }).notNull(),
  platforms: json("platforms").notNull(),
  category: json("category").$type<string[]>().default([]),
});

export type GameCategoryType = typeof gameCategory.$inferSelect;

export const tournaments = createTable(
  "tournaments",
  {
    id: varchar("id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    game: varchar("game", { length: 255 }).notNull(),
    prize: int("prize").notNull().default(0),
    category: varchar("category", { length: 255 }),
    tournament_type: varchar("tournament_type", { length: 100 }).notNull(),
    platform: json("platform").notNull(),
    entry: varchar("entry", { length: 150 }).notNull(),
    team_size: varchar("team_size", { length: 50 }).notNull(),
    max_teams: int("max_teams").default(0),
    enrolled: int("enrolled").default(0),
    start_time: varchar("start_time", { length: 300 }).default(
      "2024-02-07 05:00:00",
    ),
    rules: json("rules").notNull(),
    created_by: varchar("created_by", { length: 256 }).notNull(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.id),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export type TournamentType = typeof tournaments.$inferSelect;

// A gameCategory can have many tournaments
export const tournamentRelations = relations(gameCategory, ({ many }) => ({
  tournaments: many(tournaments),
}));

// tournament can only have one id
export const gameRelations = relations(tournaments, ({ one }) => ({
  tournaments: one(gameCategory, {
    fields: [tournaments.game],
    references: [gameCategory.game],
  }),
}));

export const moneyMatch = createTable(
  "money_match",
  {
    matchId: varchar("match_id", { length: 255 }).notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    matchName: varchar("match_name", { length: 255 }).notNull(),
    matchType: varchar("match_type", { length: 255 }).notNull(),
    entry: int("entry").notNull(),
    teamSize: varchar("team_size", { length: 255 }).notNull(),
    startTime: varchar("start_time", { length: 300 }).notNull(),
    rules: json("rules").notNull().notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (match) => ({
    // makes sure a player can only create a match for the same given time
    groupGameIdWithNameIdx: unique().on(match.createdBy, match.createdAt),
  }),
);

// the team.id will reference the moneyMatch.createdBy
export const moneyMatchRelation = relations(moneyMatch, ({ one }) => ({
  teams: one(teams, {
    fields: [moneyMatch.createdBy],
    references: [teams.id],
  }),
}));

export const teams = createTable(
  "team",
  {
    id: varchar("id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    gameId: varchar("game_id", { length: 255 }).notNull(),
    gameTitle: varchar("game_title", { length: 255 }).notNull(),
    team_name: varchar("team_name", { length: 255 }).notNull(),
    teamCategory: varchar("team_category", { length: 50 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (team) => ({
    // userIdIdx: index("team_userId_idx").on(team.id),
    // makes sure name coming in is unique based on gameId
    groupGameIdWithNameIdx: unique().on(team.gameId, team.team_name),
  }),
);

export const usersRecordTable = createTable(
  "users_record",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    wins: int("wins").default(0),
    losses: int("losses").default(0),
  },
  // (user) => ({
  //   userIdIdx: uniqueIndex("user_id_idx").on(user.userId)
  // })
);

export type UsersRecordType = typeof usersRecordTable.$inferSelect;

// This is needed for a one-one realtion
export const usersRecordRelations = relations(usersRecordTable, ({ one }) => ({
  user: one(users, {
    fields: [usersRecordTable.userId],
    references: [users.id],
  }),
}));

export const teamRecordTable = createTable(
  "team_record",
  {
    teamId: varchar("team_id", { length: 255 }).notNull(),
    wins: int("wins").default(0),
    losses: int("losses").default(0),
  },
  (team) => ({
    compoundKey: primaryKey({ columns: [team.teamId] }),
  }),
);

export type TeamRecordType = typeof teamRecordTable.$inferSelect;

// This is needed for a one-one realtion
export const teamRecordRelations = relations(teamRecordTable, ({ one }) => ({
  user: one(teamMembersTable, {
    fields: [teamRecordTable.teamId],
    references: [teamMembersTable.teamId],
  }),
}));

export const teamMembersTable = createTable("team_members", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  teamId: varchar("team_id", { length: 255 }).notNull(),
  game: varchar("game", { length: 100 }).notNull(),
  teamName: varchar("team_name", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"])
    .default("member")
    .notNull(),
  inviteId: varchar("inviteId", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const usersToGroupsRelations = relations(
  teamMembersTable,
  ({ one }) => ({
    group: one(teams, {
      fields: [teamMembersTable.teamId],
      references: [teams.id],
    }),
    user: one(users, {
      fields: [teamMembersTable.userId],
      references: [users.email],
    }),
    invite: one(teamInvites, {
      fields: [teamMembersTable.inviteId],
      references: [teamInvites.id],
    }),
    record: one(teamRecordTable, {
      fields: [teamMembersTable.teamId],
      references: [teamRecordTable.teamId],
    }),
  }),
);

export type Team = typeof teams.$inferSelect;
export type TeamMembersType = typeof teamMembersTable.$inferSelect;
export type Users = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferInsert;

// // A team can have many team Members, invites to the team, and moneyMatches
export const teamsRelations = relations(teams, ({ one, many }) => ({
  members: many(teamMembersTable),
  invites: many(teamInvites),
  matches: many(matches),
  moneyMatches: many(moneyMatch),
  tournamentsEnrolled: many(tournamentsToTeams),

  // A team can only have one team record
  record: one(teamRecordTable, {
    fields: [teams.id],
    references: [teamRecordTable.teamId],
  }),
  user: one(users, {
    fields: [teams.userId],
    references: [users.id],
  }),
}));

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
// export const teamssRelations = relations(teams, ({ one }) => ({

// }));

export const teamInvites = createTable("team_invites", {
  id: varchar("id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  teamId: varchar("team_id", { length: 255 }).notNull(),
  invitedAt: timestamp("invited_at", { mode: "date" }).notNull(),
  invitedById: varchar("invited_by_id", { length: 255 }).notNull(),
  respondedAt: timestamp("responded_at", { mode: "date" }),
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
  "tournament_teams_enrolled",
  {
    id: varchar("id", { length: 255 }).notNull(),
    teamId: varchar("team_id", { length: 255 }).notNull(),
    teamName: varchar("team_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (team) => ({
    // makes sure name coming in is unique
    // teamNameIdx: uniqueIndex("team_name_idx").on(team.teamId)
  }),
);

export type TournamentTeamsEnrolled =
  typeof tournamentTeamsEnrolled.$inferSelect;
// CREATE TOURNAMENT ROUND
export const tournamentStages = createTable("tournament_stages", {
  id: varchar("id", { length: 255 }).primaryKey(),
});

export const tournamentStagesRelations = relations(
  tournamentStages,
  ({ many }) => ({
    teams: many(tournamentStagesToTeams),
  }),
);

export type TournamentStage = typeof tournamentStages.$inferSelect;
export type TournamentStageInsert = typeof tournamentStages.$inferInsert;

// TEAMS PER ROUND
export const tournamentStagesToTeams = createTable("tournament_stages_teams", {
  tournament_stage_id: varchar("tournament_stage_id", {
    length: 255,
  }).notNull(),
  team_id: varchar("team_id", { length: 255 }).notNull(),
});

export const tournamentStagesToTeamsRelations = relations(
  tournamentStagesToTeams,
  ({ one }) => ({
    tournament_stage: one(tournamentStages, {
      fields: [tournamentStagesToTeams.tournament_stage_id],
      references: [tournamentStages.id],
    }),
    team: one(teams, {
      fields: [tournamentStagesToTeams.team_id],
      references: [teams.id],
    }),
  }),
);

export type TournamentStagesToTeams =
  typeof tournamentStagesToTeams.$inferSelect;
export type TournamentStagesToTeamsInsert =
  typeof tournamentStagesToTeams.$inferInsert;

// THIS MIGHT BE A DUPLICATE TABLE CREATED
export const tournamentsToTeams = createTable("tournaments_teams", {
  tournament_id: varchar("tournament_id", { length: 255 }).notNull(),
  team_id: varchar("team_id", { length: 255 }).notNull(),
});

export const tournamentsToTeamsRelations = relations(
  tournamentsToTeams,
  ({ one }) => ({
    tournament: one(tournaments, {
      fields: [tournamentsToTeams.tournament_id],
      references: [tournaments.id],
    }),
    team: one(teams, {
      fields: [tournamentsToTeams.team_id],
      references: [teams.id],
    }),
  }),
);

export type TournamentsToTeams = typeof tournamentsToTeams.$inferSelect;
export type TournamentsToTeamsInsert = typeof tournamentsToTeams.$inferInsert;

export const followsTables = createTable("follows", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  targetUser: varchar("target_user", { length: 255 }).notNull(),
});

export type FollowsType = typeof followsTables.$inferSelect;

export const notificationsTable = createTable("notifications", {
  id: varchar("id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["invite", "team-invite"]).notNull(),
  from: varchar("from", { length: 255 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  isRead: boolean("is_read").default(false),
  metaData: json("meta_data"),
});

export type NotificationType = typeof notificationsTable.$inferSelect;

export const usersToFollowsRelations = relations(followsTables, ({ one }) => ({
  user: one(users, {
    fields: [followsTables.targetUser],
    references: [users.id],
  }),
}));

export const usersToNotificationsRelations = relations(
  notificationsTable,
  ({ one }) => ({
    group: one(followsTables, {
      fields: [notificationsTable.userId],
      references: [followsTables.userId],
    }),
    user: one(users, {
      fields: [notificationsTable.userId],
      references: [users.id],
    }),
  }),
);

export const matches = createTable("matches", {
  id: varchar("id", { length: 255 }).primaryKey(),
  teamId: varchar("team_id", { length: 255 }),
});

export const matchesRelations = relations(matches, ({ one, many }) => ({
  teams: many(teamsToMatches),
  users: many(usersToMatches),
  moneyMatches: many(moneyMatch),
  author: one(teams, {
    fields: [matches.teamId],
    references: [teams.id], // TODO: FIX THIS WTO WHERE IT GRABS THE TEAM_ID
  }),
}));

export type Match = typeof matches.$inferSelect;
export type MatchInsert = typeof matches.$inferInsert;

export const usersToMatches = createTable(
  "users_matches",
  {
    user_id: varchar("user_id", { length: 255 }).notNull(),
    match_id: varchar("match_id", { length: 255 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.match_id],
    }),
  }),
);

export const usersToMatchesRelations = relations(usersToMatches, ({ one }) => ({
  usersMatches: one(users, {
    fields: [usersToMatches.user_id],
    references: [users.id],
  }),
  match: one(matches, {
    fields: [usersToMatches.match_id],
    references: [matches.id],
  }),
}));

export const teamsToMatches = createTable(
  "teams_matches",
  {
    team_id: varchar("team_id", { length: 255 }).notNull(),
    match_id: varchar("match_id", { length: 255 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.match_id],
    }),
  }),
);

export const teamsToMatchesRelations = relations(teamsToMatches, ({ one }) => ({
  teams: one(teams, {
    fields: [teamsToMatches.team_id],
    references: [teams.id],
  }),
  match: one(matches, {
    fields: [teamsToMatches.match_id],
    references: [matches.id],
  }),
}));

export type TeamsToMatches = typeof teamsToMatches.$inferSelect;
export type TeamsToMatchesInsert = typeof teamsToMatches.$inferInsert;

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

export const subscription = createTable("subscription", {
  id: varchar("id", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
  stripePriceId: varchar("stripe_price_id", { length: 191 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
  stripeCurrentPeriodEnd: int("stripe_current_period_end"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(users, {
    fields: [subscription.userId],
    references: [users.id],
  }),
}));

export const payments = createTable("payments", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  stripeAccountCreatedAt: int("stripe_account_created_at"),
  stripeAccountExpiresAt: int("stripe_account_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// export const paymentsRelations = relations(payments, ({ one }) => ({
//   user: one(stores, {
//     fields: [payments.storeId],
//     references: [stores.id]
//   }),
// }))
