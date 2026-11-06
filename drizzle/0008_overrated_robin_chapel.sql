CREATE TABLE `study_circle_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`region` enum('Washington DC Metro Area','Greater Los Angeles Metro Area','San Francisco Bay Area') NOT NULL,
	`meetingMonth` int NOT NULL,
	`meetingYear` int NOT NULL,
	`meetingDate` bigint NOT NULL,
	`startTime` varchar(16),
	`endTime` varchar(16),
	`timeZone` varchar(100) NOT NULL DEFAULT 'America/Los_Angeles',
	`templeName` varchar(255) NOT NULL,
	`nationality` varchar(160) NOT NULL,
	`yana` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	`venueNote` varchar(512),
	`description` text NOT NULL,
	`imageMediaId` int,
	`youtubeUrl` varchar(512),
	`youtubeTitle` varchar(255),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`publishedAt` bigint,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_circle_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_circle_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `study_circle_entries` ADD CONSTRAINT `study_circle_entries_imageMediaId_media_assets_id_fk` FOREIGN KEY (`imageMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_circle_entries` ADD CONSTRAINT `study_circle_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;