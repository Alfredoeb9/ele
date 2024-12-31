import { relations, sql } from "drizzle-orm";

import {
  index,
  int,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `ele_${name}`);

export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    createdById: text("createdById", { length: 255 }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

// bigInt --> int
// text --> text
// timestamp --. int

export const users = createTable("user", {
  id: text("id", { length: 255 }).notNull().primaryKey(),
  username: text("username", { length: 255 }).default(
    `anon${crypto.randomUUID()}`,
  ),
  firstName: text("firstName", { length: 255 }),
  lastName: text("lastName", { length: 255 }),
  password: text("password", { length: 255 }).notNull(),
  isVerified: int("isVerified", { mode: "boolean" }).default(false),
  isAdmin: text("isAdmin", { length: 25 }).default("user"),
  role: text("role", { length: 35 }).default("user"),
  profileViews: int("profile_views", { mode: "number" }).default(0),
  email: text("email", { length: 255 }).notNull(),
  credits: int("credits", { mode: "number" }).default(15),
  teamId: text("team_id", { mode: "json" }),
  emailVerified: int("emailVerified", {
    mode: "timestamp",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image", { length: 255 }),
});

export const stripeAccount = createTable("stripe_account", {
  userId: text("user_id", { length: 255 }),
  stripeId: text("stripe_id", { length: 255 }),
  username: text("username", { length: 255 }),
  balance: int("balance", { mode: "number" }).default(0),
});

export const stripeAccountRelation = relations(stripeAccount, ({ one }) => ({
  user: one(users, {
    fields: [stripeAccount.userId],
    references: [users.id],
  }),
}));

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
  socialMediaTags: many(socialTags),
  nonCashMatch: many(nonCashMatch),
  moneyMatch: many(moneyMatch),
  transactions: many(transactions),
  tickets: many(tickets),
  stripeAccount: one(stripeAccount),
  subscription: one(subscription),
  userRecord: one(usersRecordTable),
}));

export const gamerTags = createTable("gamer_tags", {
  userId: text("user_id", { length: 255 }).notNull(),
  type: text("type", { length: 255 }).notNull(),
  gamerTag: text("gamer_tag", { length: 255 }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updatedAt", { mode: "timestamp" }),
});

export const gamerTagsRelation = relations(gamerTags, ({ one }) => ({
  user: one(users, {
    fields: [gamerTags.userId],
    references: [users.id],
  }),
}));

export const socialTags = createTable("social_tags", {
  userId: text("user_id", { length: 255 }).notNull(),
  type: text("type", { length: 255 }).notNull(),
  socialTag: text("social_tag", { length: 255 }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updatedAt", { mode: "timestamp" }),
});

export const socialTagsRelation = relations(socialTags, ({ one }) => ({
  user: one(users, {
    fields: [socialTags.userId],
    references: [users.id],
  }),
}));

export type SocialTagsTypes = typeof socialTags.$inferSelect;

export const accounts = createTable(
  "account",
  {
    userId: text("userId", { length: 255 }).notNull(),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

// // A account can only have one user id
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
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
    id: text("id", { length: 255 }).notNull(),
    token: text("token", { length: 384 }).notNull(),
    createdAt: int("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  }),
);

export const transactions = createTable("transactions", {
  transactionId: text("transaction_id", { length: 255 }).notNull(),
  transactionsDate: int("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  withdrawAmt: text("withdraw_amount"),
  depositAmt: text("deposit_amount").notNull().default("0"),
  balance: text("balance"),
  accountId: text("account_id", { length: 255 }).notNull(),
});

export const transcationRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.accountId],
    references: [users.id],
  }),
}));

export const gameCategory = createTable("gameCategory", {
  id: text("id", { length: 256 }).primaryKey().notNull(),
  game: text("game", { length: 256 }).notNull(),
  platforms: text("platforms", { mode: "json" }).notNull(),
  category: text("category", { mode: "json" }).$type<string[]>(),
});

export type GameCategoryType = typeof gameCategory.$inferSelect;

export const tournaments = createTable(
  "tournaments",
  {
    id: text("id", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    game: text("game", { length: 255 }).notNull(),
    prize: int("prize").notNull().default(0),
    category: text("category", { length: 255 }),
    tournament_type: text("tournament_type", { length: 100 }).notNull(),
    platform: text("platform", { mode: "json" }).notNull(),
    entry: text("entry", { length: 150 }).notNull(),
    team_size: text("team_size", { length: 50 }).notNull(),
    max_teams: int("max_teams").default(0),
    enrolled: int("enrolled").default(0),
    start_time: text("start_time", { length: 300 }).default(
      "2024-02-07 05:00:00",
    ),
    rules: text("rules", { mode: "json" }).$type<[{ foo: string }]>().notNull(),
    created_by: text("created_by", { length: 256 }).notNull(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_tournamentIDX").on(example.id),
    nameIndex: index("name_tournamentIDX").on(example.name),
  }),
);

export type TournamentType = typeof tournaments.$inferSelect;

// A gameCategory can have many tournaments
export const tournamentRelations = relations(gameCategory, ({ many }) => ({
  tournaments: many(tournaments),
  moneyMatch: many(moneyMatch),
  nonCashMatch: many(nonCashMatch),
}));

// tournament can only have one id
export const gameRelations = relations(tournaments, ({ one }) => ({
  tournaments: one(gameCategory, {
    fields: [tournaments.game],
    references: [gameCategory.game],
  }),
}));

export const nonCashMatch = createTable(
  "non_cash_match",
  {
    matchId: text("match_id", { length: 255 }).notNull(),
    gameTitle: text("game_title", { length: 255 }).notNull(),
    teamName: text("team_name", { length: 255 }).notNull(),
    createdBy: text("created_by", { length: 255 }).notNull(),
    platform: text("platforms", { mode: "json" }).notNull(),
    matchName: text("match_name", { length: 255 }).notNull(),
    matchType: text("match_type", { length: 255 }).notNull(),
    teamSize: text("team_size", { length: 255 }).notNull(),
    startTime: text("start_time", { length: 300 }).notNull(),
    rules: text("rules", { mode: "json" }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: int("updated_at", { mode: "timestamp" }),
  },
  (nonCashMatch) => [
    // makes sure a player can only create a match for the same given time
    unique("non_cash_match_createdBy_unique_idx").on(
      nonCashMatch.createdBy,
      nonCashMatch.startTime,
    ),
  ],
);

// the team.id will reference the moneyMatch.createdBy
export const nonCashMatchRelation = relations(nonCashMatch, ({ one }) => ({
  teams: one(teams, {
    fields: [nonCashMatch.createdBy],
    references: [teams.id],
  }),
  nonCashMatch: one(gameCategory, {
    fields: [nonCashMatch.gameTitle],
    references: [gameCategory.game],
  }),
}));

export const moneyMatch = createTable(
  "money_match",
  {
    matchId: text("match_id", { length: 255 }).notNull(),
    gameTitle: text("game_title", { length: 255 }).notNull(),
    teamName: text("team_name", { length: 255 }).notNull(),
    createdBy: text("created_by", { length: 255 }).notNull(),
    platform: text("platforms", { mode: "json" }).notNull(),
    matchName: text("match_name", { length: 255 }).notNull(),
    matchType: text("match_type", { length: 255 }).notNull(),
    matchEntry: int("entry").notNull(),
    teamSize: text("team_size", { length: 255 }).notNull(),
    startTime: text("start_time", { length: 300 }).notNull(),
    rules: text("rules", { mode: "json" }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: int("updated_at", { mode: "timestamp" }),
  },
  (match) => ({
    // makes sure a player can only create a match for the same given time
    groupGameIdWithNameIdx: unique().on(match.createdBy, match.startTime),
  }),
);

export type MoneyMatchType = typeof moneyMatch.$inferSelect;

// the team.id will reference the moneyMatch.createdBy
export const moneyMatchRelation = relations(moneyMatch, ({ one }) => ({
  teams: one(teams, {
    fields: [moneyMatch.createdBy],
    references: [teams.id],
  }),
  moneyMatch: one(gameCategory, {
    fields: [moneyMatch.gameTitle],
    references: [gameCategory.game],
  }),
}));

export const teams = createTable(
  "team",
  {
    id: text("id", { length: 255 }).notNull(),
    userId: text("user_id", { length: 255 }).notNull(),
    gameId: text("game_id", { length: 255 }).notNull(),
    gameTitle: text("game_title", { length: 255 }).notNull(),
    team_name: text("team_name", { length: 255 }).notNull(),
    teamCategory: text("team_category", { length: 50 }).notNull(),
    createdAt: int("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (team) => ({
    // userIdIdx: index("team_userId_idx").on(team.id),
    // makes sure name coming in is unique based on gameId
    groupGameIdWithNameIdx: unique().on(
      team.gameId,
      team.team_name,
      team.teamCategory,
    ),
  }),
);

export const usersRecordTable = createTable("users_record", {
  id: text("cuid").notNull(),
  userId: text("user_id", { length: 255 }).notNull(),
  userName: text("user_name", { length: 255 }).notNull(),
  wins: int("wins").default(0),
  losses: int("losses").default(0),
  matchType: text("match_type"),
});

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
    teamId: text("team_id", { length: 255 }).notNull(),
    teamName: text("team_name", { length: 255 })
      .default(`anon${crypto.randomUUID()}`)
      .notNull(),
    wins: int("wins").default(0),
    losses: int("losses").default(0),
    matchType: text("match_type"),
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
  userId: text("user_id", { length: 255 }).notNull(),
  userName: text("user_name", { length: 255 }).notNull(),
  teamId: text("team_id", { length: 255 }).notNull(),
  game: text("game", { length: 100 }).notNull(),
  teamName: text("team_name", { length: 100 }).notNull(),
  role: text("role", { enum: ["owner", "admin", "member"] })
    .default("member")
    .notNull(),
  inviteId: text("inviteId", { length: 255 }),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
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

export type TeamTypes = typeof teams.$inferSelect;
export type TeamMembersType = typeof teamMembersTable.$inferSelect;
export type UsersType = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferInsert;

// // A team can have many team Members, invites to the team, and moneyMatches
export const teamsRelations = relations(teams, ({ one, many }) => ({
  members: many(teamMembersTable),
  invites: many(teamInvites),
  matches: many(matches),
  nonCashMatch: many(nonCashMatch),
  moneyMatches: many(moneyMatch),
  tournamentsEnrolled: many(tournamentsToTeams),

  // A team can only have one team record
  record: one(teamRecordTable, {
    fields: [teams.id],
    references: [teamRecordTable.teamId],
  }),
  users: one(users, {
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
  id: text("id", { length: 255 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  teamId: text("team_id", { length: 255 }).notNull(),
  invitedAt: int("invited_at", { mode: "timestamp" }).notNull(),
  invitedById: text("invited_by_id", { length: 255 }).notNull(),
  respondedAt: int("responded_at", { mode: "timestamp" }),
  accepted: int("accepted", { mode: "boolean" }),
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
    id: text("id", { length: 255 }).notNull(),
    teamId: text("team_id", { length: 255 }).notNull(),
    teamName: text("team_name", { length: 255 }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }),
  },
);

export type TournamentTeamsEnrolled =
  typeof tournamentTeamsEnrolled.$inferSelect;
// CREATE TOURNAMENT ROUND
export const tournamentStages = createTable("tournament_stages", {
  id: text("id", { length: 255 }).primaryKey(),
});

export const tournamentStagesRelations = relations(
  tournamentStages,
  ({ many }) => ({
    teams: many(tournamentStagesToTeams),
  }),
);

export type TournamentStage = typeof tournamentStages.$inferSelect;
export type TournamentStageInsert = typeof tournamentStages.$inferInsert;

// // TEAMS PER ROUND
export const tournamentStagesToTeams = createTable("tournament_stages_teams", {
  tournament_stage_id: text("tournament_stage_id", {
    length: 255,
  }).notNull(),
  team_id: text("team_id", { length: 255 }).notNull(),
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

// // THIS MIGHT BE A DUPLICATE TABLE CREATED
export const tournamentsToTeams = createTable("tournaments_teams", {
  tournament_id: text("tournament_id", { length: 255 }).notNull(),
  team_id: text("team_id", { length: 255 }).notNull(),
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
  userId: text("user_id", { length: 255 }).notNull(),
  targetUser: text("target_user", { length: 255 }).notNull(),
});

export type FollowsType = typeof followsTables.$inferSelect;

export const notificationsTable = createTable("notifications", {
  id: text("id", { length: 255 }).notNull(),
  userId: text("user_id", { length: 255 }).notNull(),
  userName: text("user_name", { length: 255 }).notNull(),
  type: text("type", { enum: ["invite", "team-invite"] }).notNull(),
  from: text("from", { length: 255 }).notNull(),
  resourceId: text("resource_id", { length: 255 }),
  isRead: int("is_read", { mode: "boolean" }).default(false),
  metaData: text("meta_data", { mode: "json" }),
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
  id: text("id", { length: 255 }).primaryKey(),
  teamId: text("team_id", { length: 255 }),
});

export const matchesRelations = relations(matches, ({ one, many }) => ({
  teams: many(teamsToMatches),
  users: many(usersToMatches),
  nonCashMatch: many(nonCashMatch),
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
    user_id: text("user_id", { length: 255 }).notNull(),
    match_id: text("match_id", { length: 255 }).notNull(),
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
    team_id: text("team_id", { length: 255 }).notNull(),
    match_id: text("match_id", { length: 255 }).notNull(),
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

export const teamMembersRelations = relations(teams, ({ one }) => ({
  team: one(teams, {
    fields: [teams.id],
    references: [teams.id],
  }),
  users: one(users, {
    fields: [teams.id],
    references: [users.id],
  }),
}));

export const subscription = createTable("subscription", {
  id: text("id", { length: 256 }).notNull(),
  userId: text("user_id", { length: 256 }),
  stripeSubscriptionId: text("stripe_subscription_id", { length: 191 }),
  stripePriceId: text("stripe_price_id", { length: 191 }),
  stripeCustomerId: text("stripe_customer_id", { length: 191 }),
  stripeCurrentPeriodEnd: int("stripe_current_period_end"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
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
  id: text("id").primaryKey(),
  userId: int("user_id").notNull(),
  stripeAccountCreatedAt: int("stripe_account_created_at"),
  stripeAccountExpiresAt: int("stripe_account_expires_at"),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// export const paymentsRelations = relations(payments, ({ one }) => ({
//   user: one(stores, {
//     fields: [payments.storeId],
//     references: [stores.id]
//   }),
// }))

export const tickets = createTable(
  "tickets",
  {
    id: text("id", { length: 255 }).primaryKey(),
    userId: text("user_id", { length: 255 }).notNull(),
    userEmail: text("user_email", { length: 255 }).notNull(),
    createdById: text("created_by_id", { length: 255 }).notNull(),
    body: text("body").notNull(),
    category: text("category", { length: 255 }).notNull(),
    status: text("status", { enum: ["open", "closed"] })
      .default("open")
      .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }),
  },
  (ticket) => ({
    createdByIdIdx: index("createdById_TicketsIDX").on(ticket.createdById),
    nameIndex: index("name_TicketsIDX").on(ticket.createdById),
  }),
);

export const ticketRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));
