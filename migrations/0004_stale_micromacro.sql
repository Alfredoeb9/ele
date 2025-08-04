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
ALTER TABLE `ele_team_record` ALTER COLUMN "team_name" TO "team_name" text(255) NOT NULL DEFAULT 'anon053aacaf-480b-4ad4-9353-dd32af85a767';--> statement-breakpoint
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
ALTER TABLE `ele_user` ALTER COLUMN "username" TO "username" text(255) DEFAULT 'anon94a4e280-d62b-4f4d-9a14-9f8eefb58d5a';--> statement-breakpoint
ALTER TABLE `ele_post` ADD `message` text(256);