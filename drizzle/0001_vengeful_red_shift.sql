CREATE TABLE `content_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	CONSTRAINT `content_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`body` mediumtext NOT NULL,
	`contentType` enum('news','media') NOT NULL DEFAULT 'news',
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`authorName` varchar(160) NOT NULL,
	`publishedAt` bigint,
	`youtubeUrl` varchar(512),
	`youtubeTitle` varchar(255),
	`featuredMediaId` int,
	`legacyUrl` varchar(1024),
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_entry_categories` (
	`entryId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `content_entry_categories_entryId_categoryId_pk` PRIMARY KEY(`entryId`,`categoryId`)
);
--> statement-breakpoint
CREATE TABLE `legacy_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legacyPath` varchar(1024) NOT NULL,
	`destinationPath` varchar(512) NOT NULL,
	`contentEntryId` int,
	`routeType` enum('alias','redirect') NOT NULL DEFAULT 'redirect',
	`httpStatus` int NOT NULL DEFAULT 301,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `legacy_routes_id` PRIMARY KEY(`id`),
	CONSTRAINT `legacy_routes_legacyPath_unique` UNIQUE(`legacyPath`)
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(127) NOT NULL,
	`sizeBytes` bigint NOT NULL,
	`mediaKind` enum('image','document') NOT NULL,
	`altText` text,
	`caption` text,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_assets_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
ALTER TABLE `content_entries` ADD CONSTRAINT `content_entries_featuredMediaId_media_assets_id_fk` FOREIGN KEY (`featuredMediaId`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_entries` ADD CONSTRAINT `content_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_entry_categories` ADD CONSTRAINT `content_entry_categories_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_entry_categories` ADD CONSTRAINT `content_entry_categories_categoryId_content_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `content_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `legacy_routes` ADD CONSTRAINT `legacy_routes_contentEntryId_content_entries_id_fk` FOREIGN KEY (`contentEntryId`) REFERENCES `content_entries`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_assets` ADD CONSTRAINT `media_assets_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;