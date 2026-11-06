CREATE TABLE `temple_directory_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`verificationStatus` enum('pending','verified') NOT NULL DEFAULT 'pending',
	`tradition` varchar(120) NOT NULL,
	`lineage` varchar(255),
	`description` text NOT NULL,
	`addressLine1` varchar(255),
	`addressLine2` varchar(255),
	`city` varchar(160) NOT NULL,
	`stateRegion` varchar(160) NOT NULL,
	`postalCode` varchar(32),
	`country` varchar(120) NOT NULL DEFAULT 'United States',
	`websiteUrl` varchar(1024),
	`publicEmail` varchar(320),
	`legacyUrl` varchar(1024),
	`verifiedAt` bigint,
	`verifiedBy` int,
	`publishedAt` bigint,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `temple_directory_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `temple_directory_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `temple_directory_entries` ADD CONSTRAINT `temple_directory_entries_verifiedBy_users_id_fk` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `temple_directory_entries` ADD CONSTRAINT `temple_directory_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;