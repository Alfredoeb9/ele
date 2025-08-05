ALTER TABLE `ele_post` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
DROP INDEX "accounts_userId_idx";--> statement-breakpoint
DROP INDEX "ele_money_match_created_by_start_time_unique";--> statement-breakpoint
DROP INDEX "non_cash_match_createdBy_unique_idx";--> statement-breakpoint
DROP INDEX "createdById_idx";--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "ele_team_game_id_team_name_team_category_unique";--> statement-breakpoint
DROP INDEX "createdById_TicketsIDX";--> statement-breakpoint
DROP INDEX "name_TicketsIDX";--> statement-breakpoint
DROP INDEX "createdById_tournamentIDX";--> statement-breakpoint
DROP INDEX "name_tournamentIDX";--> statement-breakpoint
ALTER TABLE `ele_post` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `ele_account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ele_money_match_created_by_start_time_unique` ON `ele_money_match` (`created_by`,`start_time`);--> statement-breakpoint
CREATE UNIQUE INDEX `non_cash_match_createdBy_unique_idx` ON `ele_non_cash_match` (`created_by`,`start_time`);--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `ele_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `ele_post` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `ele_session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ele_team_game_id_team_name_team_category_unique` ON `ele_team` (`game_id`,`team_name`,`team_category`);--> statement-breakpoint
CREATE INDEX `createdById_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `name_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `createdById_tournamentIDX` ON `ele_tournaments` (`id`);--> statement-breakpoint
CREATE INDEX `name_tournamentIDX` ON `ele_tournaments` (`name`);--> statement-breakpoint
ALTER TABLE `ele_post` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `ele_subscription` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
ALTER TABLE `ele_team_record` ALTER COLUMN "team_name" TO "team_name" text(255) NOT NULL DEFAULT 'anon3b09a910-b622-46ce-9831-d68643d9bd20';--> statement-breakpoint
ALTER TABLE `ele_transactions` ALTER COLUMN "withdraw_amount" TO "withdraw_amount" integer;--> statement-breakpoint
ALTER TABLE `ele_transactions` ALTER COLUMN "deposit_amount" TO "deposit_amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `ele_transactions` ALTER COLUMN "deposit_amount" TO "deposit_amount" integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `ele_transactions` ALTER COLUMN "balance" TO "balance" integer;--> statement-breakpoint
ALTER TABLE `ele_user` ALTER COLUMN "username" TO "username" text(255) DEFAULT 'anon30c52bcf-86df-41f2-8c87-740294cbf88b';--> statement-breakpoint
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