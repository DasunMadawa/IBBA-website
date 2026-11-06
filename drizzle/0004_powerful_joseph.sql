CREATE TABLE `meeting_minutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(255) NOT NULL,
	`meetingDate` bigint NOT NULL,
	`hostTemple` varchar(255) NOT NULL,
	`locationLabel` varchar(255) NOT NULL,
	`city` varchar(160),
	`stateRegion` varchar(160),
	`summary` text NOT NULL,
	`minutesBody` mediumtext NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`youtubeUrl` varchar(512),
	`youtubeTitle` varchar(255),
	`photoMediaId` int,
	`legacyUrl` varchar(1024),
	`publishedAt` bigint,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meeting_minutes_id` PRIMARY KEY(`id`),
	CONSTRAINT `meeting_minutes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `meeting_minutes_traditions` (
	`meetingMinutesId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `meeting_minutes_traditions_meetingMinutesId_tradition_pk` PRIMARY KEY(`meetingMinutesId`,`tradition`)
);
--> statement-breakpoint
ALTER TABLE `meeting_minutes` ADD CONSTRAINT `meeting_minutes_photoMediaId_media_assets_id_fk` FOREIGN KEY (`photoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meeting_minutes` ADD CONSTRAINT `meeting_minutes_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meeting_minutes_traditions` ADD CONSTRAINT `meeting_minutes_traditions_minutes_fk` FOREIGN KEY (`meetingMinutesId`) REFERENCES `meeting_minutes`(`id`) ON DELETE cascade ON UPDATE no action;
