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
ALTER TABLE `ele_user` ALTER COLUMN "username" TO "username" text(255) DEFAULT 'anonfdd21125-fadc-4a96-a575-93d296d73a84';--> statement-breakpoint
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
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ele_users_record` (
	`cuid` text NOT NULL,
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `ele_team_record` ADD `team_name` text(255) DEFAULT 'anon1182a073-1f58-4b30-968c-cdab2635faf6' NOT NULL;--> statement-breakpoint
ALTER TABLE `ele_team_record` ADD `match_type` text;