CREATE TABLE IF NOT EXISTS `ele_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_follows` (
	`user_id` text(255) NOT NULL,
	`target_user` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_gameCategory` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`game` text(256) NOT NULL,
	`platforms` text NOT NULL,
	`category` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_gamer_tags` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`gamer_tag` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_matches` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`team_id` text(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_money_match` (
	`match_id` text(255) NOT NULL,
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
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_notifications` (
	`id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`user_name` text(255) NOT NULL,
	`type` text NOT NULL,
	`from` text(255) NOT NULL,
	`resource_id` text(255),
	`is_read` integer DEFAULT false,
	`meta_data` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`stripe_account_created_at` integer,
	`stripe_account_expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdById` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_social_tags` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`social_tag` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_stripe_account` (
	`user_id` text(255),
	`stripe_id` text(255),
	`username` text(255),
	`balance` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_subscription` (
	`id` text(256) NOT NULL,
	`user_id` text(256),
	`stripe_subscription_id` text(191),
	`stripe_price_id` text(191),
	`stripe_customer_id` text(191),
	`stripe_current_period_end` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_team_invites` (
	`id` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	`invited_at` integer NOT NULL,
	`invited_by_id` text(255) NOT NULL,
	`responded_at` integer,
	`accepted` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_team_members` (
	`user_id` text(255) NOT NULL,
	`user_name` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	`game` text(100) NOT NULL,
	`team_name` text(100) NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`inviteId` text(255),
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_team_record` (
	`team_id` text(255) PRIMARY KEY NOT NULL,
	`wins` integer DEFAULT 0,
	`losses` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_team` (
	`id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`game_id` text(255) NOT NULL,
	`game_title` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`team_category` text(50) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_teams_matches` (
	`team_id` text(255) NOT NULL,
	`match_id` text(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_tickets` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`user_email` text(255) NOT NULL,
	`created_by_id` text(255) NOT NULL,
	`body` text NOT NULL,
	`category` text(255) NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_tournament_stages` (
	`id` text(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_tournament_stages_teams` (
	`tournament_stage_id` text(255) NOT NULL,
	`team_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_tournament_teams_enrolled` (
	`id` text(255) NOT NULL,
	`team_id` text(255) NOT NULL,
	`team_name` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_tournaments` (
	`id` text(255) NOT NULL,
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
CREATE TABLE IF NOT EXISTS `ele_tournaments_teams` (
	`tournament_id` text(255) NOT NULL,
	`team_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_transactions` (
	`transaction_id` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`withdraw_amount` text,
	`deposit_amount` text DEFAULT '0' NOT NULL,
	`balance` text,
	`account_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`username` text(255) DEFAULT 'anonccb651c0-dabe-436b-8a97-420b6fbf18c5',
	`firstName` text(255),
	`lastName` text(255),
	`password` text(255) NOT NULL,
	`isVerified` integer DEFAULT false,
	`isAdmin` text(25) DEFAULT 'user',
	`role` text(35) DEFAULT 'user',
	`profile_views` integer DEFAULT 0,
	`email` text(255) NOT NULL,
	`credits` integer DEFAULT 15,
	`team_id` text,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP,
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_users_record` (
	`user_id` text(255) NOT NULL,
	`wins` integer DEFAULT 0,
	`losses` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_users_matches` (
	`user_id` text(255) NOT NULL,
	`match_id` text(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ele_activateToken` (
	`id` text(255) NOT NULL,
	`token` text(384) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	PRIMARY KEY(`id`, `token`)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `accounts_userId_idx` ON `ele_account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `ele_money_match_created_by_start_time_unique` ON `ele_money_match` (`created_by`,`start_time`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `createdById_idx` ON `ele_post` (`createdById`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `name_idx` ON `ele_post` (`name`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `session_userId_idx` ON `ele_session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `ele_team_game_id_team_name_team_category_unique` ON `ele_team` (`game_id`,`team_name`,`team_category`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `createdById_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `name_TicketsIDX` ON `ele_tickets` (`created_by_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS`createdById_tournamentIDX` ON `ele_tournaments` (`id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `name_tournamentIDX` ON `ele_tournaments` (`name`);