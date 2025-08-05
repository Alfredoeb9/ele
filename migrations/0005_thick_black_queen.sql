ALTER TABLE `ele_activateToken` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
CREATE TABLE `ele_matches_money_matches` (
	`match_id` text(255) NOT NULL,
	`money_match_id` text(255) NOT NULL,
	PRIMARY KEY(`match_id`, `money_match_id`)
);
--> statement-breakpoint
CREATE TABLE `ele_matches_non_cash_matches` (
	`match_id` text(255) NOT NULL,
	`non_cash_match_id` text(255) NOT NULL,
	PRIMARY KEY(`match_id`, `non_cash_match_id`)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ele_gamer_tags` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`gamer_tag` text(255) NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`user_id`, `type`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_gamer_tags`("user_id", "type", "gamer_tag", "created_at", "updated_at") SELECT "user_id", "type", "gamer_tag", "created_at", "updated_at" FROM `ele_gamer_tags`;--> statement-breakpoint
DROP TABLE `ele_gamer_tags`;--> statement-breakpoint
ALTER TABLE `__new_ele_gamer_tags` RENAME TO `ele_gamer_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_ele_post` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(256),
	`message` text(256),
	`createdById` text(255) NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_ele_post`("id", "name", "message", "createdById", "created_at", "updated_at") SELECT "id", "name", "message", "createdById", "created_at", "updated_at" FROM `ele_post`;--> statement-breakpoint
DROP TABLE `ele_post`;--> statement-breakpoint
ALTER TABLE `__new_ele_post` RENAME TO `ele_post`;--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `ele_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `ele_post` (`name`);--> statement-breakpoint
CREATE TABLE `__new_ele_social_tags` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`social_tag` text(255) NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`user_id`, `type`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_social_tags`("user_id", "type", "social_tag", "created_at", "updated_at") SELECT "user_id", "type", "social_tag", "created_at", "updated_at" FROM `ele_social_tags`;--> statement-breakpoint
DROP TABLE `ele_social_tags`;--> statement-breakpoint
ALTER TABLE `__new_ele_social_tags` RENAME TO `ele_social_tags`;--> statement-breakpoint
CREATE TABLE `__new_ele_team` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`game_id` text(255) NOT NULL,
	`game_title` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`team_category` text(50) NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_team`("id", "user_id", "game_id", "game_title", "team_name", "team_category", "created_at", "updated_at") SELECT "id", "user_id", "game_id", "game_title", "team_name", "team_category", "created_at", "updated_at" FROM `ele_team`;--> statement-breakpoint
DROP TABLE `ele_team`;--> statement-breakpoint
ALTER TABLE `__new_ele_team` RENAME TO `ele_team`;--> statement-breakpoint
CREATE UNIQUE INDEX `ele_team_game_id_team_name_team_category_unique` ON `ele_team` (`game_id`,`team_name`,`team_category`);--> statement-breakpoint
DROP INDEX IF EXISTS "accounts_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "ele_money_match_created_by_start_time_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "non_cash_match_createdBy_unique_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "createdById_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "session_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "ele_team_game_id_team_name_team_category_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "createdById_TicketsIDX";--> statement-breakpoint
DROP INDEX IF EXISTS "name_TicketsIDX";--> statement-breakpoint
DROP INDEX IF EXISTS "createdById_tournamentIDX";--> statement-breakpoint
DROP INDEX IF EXISTS "name_tournamentIDX";--> statement-breakpoint
ALTER TABLE `ele_activateToken` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `ele_account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ele_money_match_created_by_start_time_unique` ON `ele_money_match` (`created_by`,`start_time`);--> statement-breakpoint
CREATE UNIQUE INDEX `non_cash_match_createdBy_unique_idx` ON `ele_non_cash_match` (`created_by`,`start_time`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `ele_session` (`userId`);--> statement-breakpoint
CREATE INDEX `createdById_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `name_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `createdById_tournamentIDX` ON `ele_tournaments` (`id`);--> statement-breakpoint
CREATE INDEX `name_tournamentIDX` ON `ele_tournaments` (`name`);--> statement-breakpoint
CREATE TABLE `__new_ele_money_match` (
	`match_id` text(255) PRIMARY KEY NOT NULL,
	`game_title` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`created_by` text(255) NOT NULL,
	`platforms` text NOT NULL,
	`match_name` text(255) NOT NULL,
	`match_type` text(255) NOT NULL,
	`entry` integer NOT NULL,
	`team_size` text(255) NOT NULL,
	`start_time` text(300) NOT NULL,
	`rules` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_money_match`("match_id", "game_title", "team_name", "created_by", "platforms", "match_name", "match_type", "entry", "team_size", "start_time", "rules", "created_at", "updated_at") SELECT "match_id", "game_title", "team_name", "created_by", "platforms", "match_name", "match_type", "entry", "team_size", "start_time", "rules", "created_at", "updated_at" FROM `ele_money_match`;--> statement-breakpoint
DROP TABLE `ele_money_match`;--> statement-breakpoint
ALTER TABLE `__new_ele_money_match` RENAME TO `ele_money_match`;--> statement-breakpoint
CREATE TABLE `__new_ele_non_cash_match` (
	`match_id` text(255) PRIMARY KEY NOT NULL,
	`game_title` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`created_by` text(255) NOT NULL,
	`platforms` text NOT NULL,
	`match_name` text(255) NOT NULL,
	`match_type` text(255) NOT NULL,
	`team_size` text(255) NOT NULL,
	`start_time` text(300) NOT NULL,
	`rules` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_non_cash_match`("match_id", "game_title", "team_name", "created_by", "platforms", "match_name", "match_type", "team_size", "start_time", "rules", "created_at", "updated_at") SELECT "match_id", "game_title", "team_name", "created_by", "platforms", "match_name", "match_type", "team_size", "start_time", "rules", "created_at", "updated_at" FROM `ele_non_cash_match`;--> statement-breakpoint
DROP TABLE `ele_non_cash_match`;--> statement-breakpoint
ALTER TABLE `__new_ele_non_cash_match` RENAME TO `ele_non_cash_match`;--> statement-breakpoint
CREATE TABLE `__new_ele_notifications` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`user_name` text(255) NOT NULL,
	`type` text NOT NULL,
	`from` text(255) NOT NULL,
	`resource_id` text(255),
	`is_read` integer DEFAULT false,
	`meta_data` text
);
--> statement-breakpoint
INSERT INTO `__new_ele_notifications`("id", "user_id", "user_name", "type", "from", "resource_id", "is_read", "meta_data") SELECT "id", "user_id", "user_name", "type", "from", "resource_id", "is_read", "meta_data" FROM `ele_notifications`;--> statement-breakpoint
DROP TABLE `ele_notifications`;--> statement-breakpoint
ALTER TABLE `__new_ele_notifications` RENAME TO `ele_notifications`;--> statement-breakpoint
ALTER TABLE `ele_payments` ALTER COLUMN "user_id" TO "user_id" text(255) NOT NULL;--> statement-breakpoint
CREATE TABLE `__new_ele_subscription` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`user_id` text(256),
	`stripe_subscription_id` text(191),
	`stripe_price_id` text(191),
	`stripe_customer_id` text(191),
	`stripe_current_period_end` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_subscription`("id", "user_id", "stripe_subscription_id", "stripe_price_id", "stripe_customer_id", "stripe_current_period_end", "created_at", "updated_at") SELECT "id", "user_id", "stripe_subscription_id", "stripe_price_id", "stripe_customer_id", "stripe_current_period_end", "created_at", "updated_at" FROM `ele_subscription`;--> statement-breakpoint
DROP TABLE `ele_subscription`;--> statement-breakpoint
ALTER TABLE `__new_ele_subscription` RENAME TO `ele_subscription`;--> statement-breakpoint
CREATE TABLE `__new_ele_team_invites` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`email` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	`invited_at` integer NOT NULL,
	`invited_by_id` text(255) NOT NULL,
	`responded_at` integer,
	`accepted` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_team_invites`("id", "email", "team_id", "invited_at", "invited_by_id", "responded_at", "accepted") SELECT "id", "email", "team_id", "invited_at", "invited_by_id", "responded_at", "accepted" FROM `ele_team_invites`;--> statement-breakpoint
DROP TABLE `ele_team_invites`;--> statement-breakpoint
ALTER TABLE `__new_ele_team_invites` RENAME TO `ele_team_invites`;--> statement-breakpoint
CREATE TABLE `__new_ele_team_members` (
	`user_id` text(255) NOT NULL,
	`user_name` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	`game` text(100) NOT NULL,
	`team_name` text(100) NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`inviteId` text(255),
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`user_id`, `team_id`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_team_members`("user_id", "user_name", "team_id", "game", "team_name", "role", "inviteId", "created_at", "updated_at") SELECT "user_id", "user_name", "team_id", "game", "team_name", "role", "inviteId", "created_at", "updated_at" FROM `ele_team_members`;--> statement-breakpoint
DROP TABLE `ele_team_members`;--> statement-breakpoint
ALTER TABLE `__new_ele_team_members` RENAME TO `ele_team_members`;--> statement-breakpoint
ALTER TABLE `ele_team_record` ALTER COLUMN "team_name" TO "team_name" text(255) NOT NULL DEFAULT 'anon010c6ade-c5a1-4d05-b025-22f735f19a68';--> statement-breakpoint
CREATE TABLE `__new_ele_teams_matches` (
	`team_id` text(255) NOT NULL,
	`match_id` text(255) NOT NULL,
	PRIMARY KEY(`team_id`, `match_id`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_teams_matches`("team_id", "match_id") SELECT "team_id", "match_id" FROM `ele_teams_matches`;--> statement-breakpoint
DROP TABLE `ele_teams_matches`;--> statement-breakpoint
ALTER TABLE `__new_ele_teams_matches` RENAME TO `ele_teams_matches`;--> statement-breakpoint
ALTER TABLE `ele_tickets` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
CREATE TABLE `__new_ele_tournament_teams_enrolled` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`team_id` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_ele_tournament_teams_enrolled`("id", "team_id", "team_name", "created_at", "updated_at") SELECT "id", "team_id", "team_name", "created_at", "updated_at" FROM `ele_tournament_teams_enrolled`;--> statement-breakpoint
DROP TABLE `ele_tournament_teams_enrolled`;--> statement-breakpoint
ALTER TABLE `__new_ele_tournament_teams_enrolled` RENAME TO `ele_tournament_teams_enrolled`;--> statement-breakpoint
CREATE TABLE `__new_ele_tournaments` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`game` text(255) NOT NULL,
	`prize` integer DEFAULT 0 NOT NULL,
	`category` text(255),
	`tournament_type` text(100) NOT NULL,
	`platform` text NOT NULL,
	`entry` text(150) NOT NULL,
	`team_size` text(50) NOT NULL,
	`max_teams` integer DEFAULT 0,
	`enrolled` integer DEFAULT 0,
	`start_time` text(300) DEFAULT '2024-02-07 05:00:00',
	`rules` text NOT NULL,
	`created_by` text(256) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ele_tournaments`("id", "name", "game", "prize", "category", "tournament_type", "platform", "entry", "team_size", "max_teams", "enrolled", "start_time", "rules", "created_by") SELECT "id", "name", "game", "prize", "category", "tournament_type", "platform", "entry", "team_size", "max_teams", "enrolled", "start_time", "rules", "created_by" FROM `ele_tournaments`;--> statement-breakpoint
DROP TABLE `ele_tournaments`;--> statement-breakpoint
ALTER TABLE `__new_ele_tournaments` RENAME TO `ele_tournaments`;--> statement-breakpoint
CREATE TABLE `__new_ele_transactions` (
	`transaction_id` text(255) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`withdraw_amount` integer,
	`deposit_amount` integer DEFAULT 0 NOT NULL,
	`balance` integer,
	`account_id` text(255) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ele_transactions`("transaction_id", "created_at", "withdraw_amount", "deposit_amount", "balance", "account_id") SELECT "transaction_id", "created_at", "withdraw_amount", "deposit_amount", "balance", "account_id" FROM `ele_transactions`;--> statement-breakpoint
DROP TABLE `ele_transactions`;--> statement-breakpoint
ALTER TABLE `__new_ele_transactions` RENAME TO `ele_transactions`;--> statement-breakpoint
ALTER TABLE `ele_user` ALTER COLUMN "username" TO "username" text(255) DEFAULT 'anon264c23c1-c03f-4742-9e4e-c31930298678';--> statement-breakpoint
ALTER TABLE `ele_user` ALTER COLUMN "emailVerified" TO "emailVerified" integer DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
CREATE TABLE `__new_ele_users_record` (
	`cuid` text PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`user_name` text(255) NOT NULL,
	`wins` integer DEFAULT 0,
	`losses` integer DEFAULT 0,
	`match_type` text
);
--> statement-breakpoint
INSERT INTO `__new_ele_users_record`("cuid", "user_id", "user_name", "wins", "losses", "match_type") SELECT "cuid", "user_id", "user_name", "wins", "losses", "match_type" FROM `ele_users_record`;--> statement-breakpoint
DROP TABLE `ele_users_record`;--> statement-breakpoint
ALTER TABLE `__new_ele_users_record` RENAME TO `ele_users_record`;--> statement-breakpoint
CREATE TABLE `__new_ele_users_matches` (
	`user_id` text(255) NOT NULL,
	`match_id` text(255) NOT NULL,
	PRIMARY KEY(`user_id`, `match_id`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_users_matches`("user_id", "match_id") SELECT "user_id", "match_id" FROM `ele_users_matches`;--> statement-breakpoint
DROP TABLE `ele_users_matches`;--> statement-breakpoint
ALTER TABLE `__new_ele_users_matches` RENAME TO `ele_users_matches`;--> statement-breakpoint
CREATE TABLE `__new_ele_follows` (
	`user_id` text(255) NOT NULL,
	`target_user` text(255) NOT NULL,
	PRIMARY KEY(`user_id`, `target_user`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_follows`("user_id", "target_user") SELECT "user_id", "target_user" FROM `ele_follows`;--> statement-breakpoint
DROP TABLE `ele_follows`;--> statement-breakpoint
ALTER TABLE `__new_ele_follows` RENAME TO `ele_follows`;--> statement-breakpoint
CREATE TABLE `__new_ele_tournament_stages_teams` (
	`tournament_stage_id` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	PRIMARY KEY(`tournament_stage_id`, `team_id`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_tournament_stages_teams`("tournament_stage_id", "team_id") SELECT "tournament_stage_id", "team_id" FROM `ele_tournament_stages_teams`;--> statement-breakpoint
DROP TABLE `ele_tournament_stages_teams`;--> statement-breakpoint
ALTER TABLE `__new_ele_tournament_stages_teams` RENAME TO `ele_tournament_stages_teams`;--> statement-breakpoint
CREATE TABLE `__new_ele_tournaments_teams` (
	`tournament_id` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	PRIMARY KEY(`tournament_id`, `team_id`)
);
--> statement-breakpoint
INSERT INTO `__new_ele_tournaments_teams`("tournament_id", "team_id") SELECT "tournament_id", "team_id" FROM `ele_tournaments_teams`;--> statement-breakpoint
DROP TABLE `ele_tournaments_teams`;--> statement-breakpoint
ALTER TABLE `__new_ele_tournaments_teams` RENAME TO `ele_tournaments_teams`;--> statement-breakpoint
ALTER TABLE `ele_matches` ADD `non_cash_match_id` text(255);--> statement-breakpoint
ALTER TABLE `ele_matches` ADD `money_match_id` text(255);--> statement-breakpoint
CREATE TABLE `__new_ele_stripe_account` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text(255),
	`stripe_id` text(255),
	`username` text(255),
	`balance` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_ele_stripe_account`("id", "user_id", "stripe_id", "username", "balance") SELECT "id", "user_id", "stripe_id", "username", "balance" FROM `ele_stripe_account`;--> statement-breakpoint
DROP TABLE `ele_stripe_account`;--> statement-breakpoint
ALTER TABLE `__new_ele_stripe_account` RENAME TO `ele_stripe_account`;