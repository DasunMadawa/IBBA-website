CREATE TABLE `content_entry_traditions` (
	`entryId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `content_entry_traditions_entryId_tradition_pk` PRIMARY KEY(`entryId`,`tradition`)
);
--> statement-breakpoint
CREATE TABLE `event_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(255) NOT NULL,
	`eventDate` bigint NOT NULL,
	`startTime` varchar(16) NOT NULL,
	`endTime` varchar(16) NOT NULL,
	`timeZone` varchar(100) NOT NULL DEFAULT 'America/Los_Angeles',
	`region` varchar(160) NOT NULL,
	`city` varchar(160),
	`venueName` varchar(255) NOT NULL,
	`address` varchar(512),
	`description` text NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`zoomUrl` varchar(1024),
	`youtubeUrl` varchar(512),
	`youtubeTitle` varchar(255),
	`imageMediaId` int,
	`publishedAt` bigint,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `event_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `event_entry_traditions` (
	`eventId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `event_entry_traditions_eventId_tradition_pk` PRIMARY KEY(`eventId`,`tradition`)
);
--> statement-breakpoint
CREATE TABLE `staff_admin_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`status` enum('active','disabled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_admin_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_admin_accounts_email_unique` UNIQUE(`email`),
	CONSTRAINT `staff_admin_accounts_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `staff_admin_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`tokenHash` varchar(64) NOT NULL,
	`expiresAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staff_admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_admin_sessions_token_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
ALTER TABLE `content_entry_traditions` ADD CONSTRAINT `content_entry_traditions_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_entries` ADD CONSTRAINT `event_entries_imageMediaId_media_assets_id_fk` FOREIGN KEY (`imageMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_entries` ADD CONSTRAINT `event_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_entry_traditions` ADD CONSTRAINT `event_entry_traditions_eventId_event_entries_id_fk` FOREIGN KEY (`eventId`) REFERENCES `event_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_admin_accounts` ADD CONSTRAINT `staff_admin_accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_admin_sessions` ADD CONSTRAINT `staff_admin_sessions_accountId_staff_admin_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `staff_admin_accounts`(`id`) ON DELETE cascade ON UPDATE no action;