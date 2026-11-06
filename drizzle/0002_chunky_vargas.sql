CREATE TABLE `content_entry_media` (
	`entryId` int NOT NULL,
	`mediaId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `content_entry_media_entryId_mediaId_pk` PRIMARY KEY(`entryId`,`mediaId`)
);
--> statement-breakpoint
ALTER TABLE `content_entry_media` ADD CONSTRAINT `content_entry_media_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_entry_media` ADD CONSTRAINT `content_entry_media_mediaId_media_assets_id_fk` FOREIGN KEY (`mediaId`) REFERENCES `media_assets`(`id`) ON DELETE cascade ON UPDATE no action;