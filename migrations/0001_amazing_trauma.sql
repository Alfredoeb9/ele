CREATE TABLE IF NOT EXISTS `ele_non_cash_match` (
	`match_id` text(255) NOT NULL,
	`game_title` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`created_by` text(255) NOT NULL,
	`platforms` text NOT NULL,
	`match_name` text(255) NOT NULL,
	`match_type` text(255) NOT NULL,
	`team_size` text(255) NOT NULL,
	`start_time` text(300) NOT NULL,
	`rules` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `non_cash_match_createdBy_unique_idx` ON `ele_non_cash_match` (`created_by`,`start_time`);--> statement-breakpoint
ALTER TABLE `ele_user` ALTER COLUMN "username" TO "username" text(255) DEFAULT 'anonb7488038-db08-4242-9dc3-dc3bb21c7ce4';
