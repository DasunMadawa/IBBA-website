-- IBAA database fresh installation: select a NEW EMPTY utf8mb4 MySQL database first.
-- Do not import into WordPress or an existing live IBAA database. Do not import this schema twice.
-- No staff passwords/accounts, sessions, private inquiries or drafts are included.
-- MySQL DDL auto-commits. The CLI migration runner is preferred for tracked repeatable installs.
SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS ibaa_staging_migrations (filename VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);

-- 0000_bored_logan.sql
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);


INSERT INTO ibaa_staging_migrations (filename) VALUES ('0000_bored_logan.sql');

-- 0001_vengeful_red_shift.sql
CREATE TABLE `content_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	CONSTRAINT `content_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_categories_slug_unique` UNIQUE(`slug`)
);


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


CREATE TABLE `content_entry_categories` (
	`entryId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `content_entry_categories_entryId_categoryId_pk` PRIMARY KEY(`entryId`,`categoryId`)
);


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
	CONSTRAINT `legacy_routes_legacyPath_unique` UNIQUE(`legacyPath`(768))
);


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


ALTER TABLE `content_entries` ADD CONSTRAINT `content_entries_featuredMediaId_media_assets_id_fk` FOREIGN KEY (`featuredMediaId`) REFERENCES `media_assets`(`id`) ON DELETE no action ON UPDATE no action;

ALTER TABLE `content_entries` ADD CONSTRAINT `content_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

ALTER TABLE `content_entry_categories` ADD CONSTRAINT `content_entry_categories_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `content_entry_categories` ADD CONSTRAINT `content_entry_categories_categoryId_content_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `content_categories`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `legacy_routes` ADD CONSTRAINT `legacy_routes_contentEntryId_content_entries_id_fk` FOREIGN KEY (`contentEntryId`) REFERENCES `content_entries`(`id`) ON DELETE set null ON UPDATE no action;

ALTER TABLE `media_assets` ADD CONSTRAINT `media_assets_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0001_vengeful_red_shift.sql');

-- 0002_chunky_vargas.sql
CREATE TABLE `content_entry_media` (
	`entryId` int NOT NULL,
	`mediaId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `content_entry_media_entryId_mediaId_pk` PRIMARY KEY(`entryId`,`mediaId`)
);


ALTER TABLE `content_entry_media` ADD CONSTRAINT `content_entry_media_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `content_entry_media` ADD CONSTRAINT `content_entry_media_mediaId_media_assets_id_fk` FOREIGN KEY (`mediaId`) REFERENCES `media_assets`(`id`) ON DELETE cascade ON UPDATE no action;

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0002_chunky_vargas.sql');

-- 0003_busy_firedrake.sql
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


ALTER TABLE `temple_directory_entries` ADD CONSTRAINT `temple_directory_entries_verifiedBy_users_id_fk` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;

ALTER TABLE `temple_directory_entries` ADD CONSTRAINT `temple_directory_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0003_busy_firedrake.sql');

-- 0004_powerful_joseph.sql
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


CREATE TABLE `meeting_minutes_traditions` (
	`meetingMinutesId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `meeting_minutes_traditions_meetingMinutesId_tradition_pk` PRIMARY KEY(`meetingMinutesId`,`tradition`)
);


ALTER TABLE `meeting_minutes` ADD CONSTRAINT `meeting_minutes_photoMediaId_media_assets_id_fk` FOREIGN KEY (`photoMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;

ALTER TABLE `meeting_minutes` ADD CONSTRAINT `meeting_minutes_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

ALTER TABLE `meeting_minutes_traditions` ADD CONSTRAINT `meeting_minutes_traditions_minutes_fk` FOREIGN KEY (`meetingMinutesId`) REFERENCES `meeting_minutes`(`id`) ON DELETE cascade ON UPDATE no action;


INSERT INTO ibaa_staging_migrations (filename) VALUES ('0004_powerful_joseph.sql');

-- 0005_marvelous_thunderbolts.sql
CREATE TABLE `contact_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`organization` varchar(255),
	`topic` enum('general','programs','community','archive','partnership') NOT NULL DEFAULT 'general',
	`message` text NOT NULL,
	`status` enum('new','read','archived') NOT NULL DEFAULT 'new',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_inquiries_id` PRIMARY KEY(`id`)
);


INSERT INTO ibaa_staging_migrations (filename) VALUES ('0005_marvelous_thunderbolts.sql');

-- 0006_thick_pet_avengers.sql
CREATE TABLE `content_entry_traditions` (
	`entryId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `content_entry_traditions_entryId_tradition_pk` PRIMARY KEY(`entryId`,`tradition`)
);


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


CREATE TABLE `event_entry_traditions` (
	`eventId` int NOT NULL,
	`tradition` enum('Theravada','Mahayana','Vajrayana') NOT NULL,
	CONSTRAINT `event_entry_traditions_eventId_tradition_pk` PRIMARY KEY(`eventId`,`tradition`)
);


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


ALTER TABLE `content_entry_traditions` ADD CONSTRAINT `content_entry_traditions_entryId_content_entries_id_fk` FOREIGN KEY (`entryId`) REFERENCES `content_entries`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `event_entries` ADD CONSTRAINT `event_entries_imageMediaId_media_assets_id_fk` FOREIGN KEY (`imageMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;

ALTER TABLE `event_entries` ADD CONSTRAINT `event_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

ALTER TABLE `event_entry_traditions` ADD CONSTRAINT `event_entry_traditions_eventId_event_entries_id_fk` FOREIGN KEY (`eventId`) REFERENCES `event_entries`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `staff_admin_accounts` ADD CONSTRAINT `staff_admin_accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;

ALTER TABLE `staff_admin_sessions` ADD CONSTRAINT `staff_admin_sessions_accountId_staff_admin_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `staff_admin_accounts`(`id`) ON DELETE cascade ON UPDATE no action;

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0006_thick_pet_avengers.sql');

-- 0007_slim_deathbird.sql
ALTER TABLE `event_entries` MODIFY COLUMN `startTime` varchar(16);

ALTER TABLE `event_entries` MODIFY COLUMN `endTime` varchar(16);

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0007_slim_deathbird.sql');

-- 0008_overrated_robin_chapel.sql
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


ALTER TABLE `study_circle_entries` ADD CONSTRAINT `study_circle_entries_imageMediaId_media_assets_id_fk` FOREIGN KEY (`imageMediaId`) REFERENCES `media_assets`(`id`) ON DELETE set null ON UPDATE no action;

ALTER TABLE `study_circle_entries` ADD CONSTRAINT `study_circle_entries_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;

INSERT INTO ibaa_staging_migrations (filename) VALUES ('0008_overrated_robin_chapel.sql');

-- Published approved public content seed
-- IBAA fresh-staging seed: published public records only; exported November 2026.
-- Excludes existing user/staff accounts, passwords, sessions, inquiries, drafts and private data.
-- Intended for a fresh database. Reapplying after staff edit content may overwrite those edits.
SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO users (openId,name,email,loginMethod,role,createdAt,updatedAt,lastSignedIn) VALUES ('staging:public-content-seed','IBAA Public Content',NULL,'system','user',NOW(),NOW(),NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);
SET @seed_user_id=(SELECT id FROM users WHERE openId='staging:public-content-seed' LIMIT 1);
INSERT INTO `media_assets` (`id`, `storageKey`, `url`, `originalName`, `mimeType`, `sizeBytes`, `mediaKind`, `altText`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (30001, 'ibaa-dharma-meeting-2026-08-22_cec00393.jpg', '/manus-storage/ibaa-dharma-meeting-2026-08-22_cec00393.jpg', 'IBAA Monthly Dharma Meeting — August 22, 2026.jpg', 'image/jpeg', 456671, 'image', 'IBAA Monthly Dharma Meeting flyer for the August 22, 2026 Interdenominational Study Circle at Dhammakaya Meditation Center California, representing Theravada, Mahayana, and Vajrayana.', 'IBAA Monthly Dharma Meeting / Interdenominational Study Circle flyer for August 22, 2026 at Dhammakaya Meditation Center California.', @seed_user_id, '2026-08-31 20:45:57', '2026-08-31 20:45:57') ON DUPLICATE KEY UPDATE `storageKey` = VALUES(`storageKey`), `url` = VALUES(`url`), `originalName` = VALUES(`originalName`), `mimeType` = VALUES(`mimeType`), `sizeBytes` = VALUES(`sizeBytes`), `mediaKind` = VALUES(`mediaKind`), `altText` = VALUES(`altText`), `caption` = VALUES(`caption`), `uploadedBy` = VALUES(`uploadedBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `media_assets` (`id`, `storageKey`, `url`, `originalName`, `mimeType`, `sizeBytes`, `mediaKind`, `altText`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (30002, 'ibaa-study-circle-hsi-lai-2026-09-26_31b00174.png', '/manus-storage/ibaa-study-circle-hsi-lai-2026-09-26_31b00174.png', 'IBAA Dharma Study Circle — September 26, 2026.png', 'image/png', 3229917, 'image', 'IBAA Dharma Study Circle flyer for September 26, 2026 at Fo Guang Shan Hsi Lai Temple, showing Ven. Ngim Saosamkhan, Ven. Hui Ze, and Ven. Geshe Tenzin Sherap.', 'IBAA Dharma Study Circle flyer for September 26, 2026 at Fo Guang Shan Hsi Lai Temple Conference Room.', @seed_user_id, '2026-08-31 20:45:57', '2026-08-31 20:45:57') ON DUPLICATE KEY UPDATE `storageKey` = VALUES(`storageKey`), `url` = VALUES(`url`), `originalName` = VALUES(`originalName`), `mimeType` = VALUES(`mimeType`), `sizeBytes` = VALUES(`sizeBytes`), `mediaKind` = VALUES(`mediaKind`), `altText` = VALUES(`altText`), `caption` = VALUES(`caption`), `uploadedBy` = VALUES(`uploadedBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `media_assets` (`id`, `storageKey`, `url`, `originalName`, `mimeType`, `sizeBytes`, `mediaKind`, `altText`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (30003, 'ibaa-wat-lao-buddhavong-2026-09-12-optimized_e17dd1a7.webp', '/manus-storage/ibaa-wat-lao-buddhavong-2026-09-12-optimized_e17dd1a7.webp', 'IBAA Dharma Meeting — Wat Lao Buddhavong — September 12, 2026.webp', 'image/webp', 171054, 'image', 'IBAA Dharma Meeting, Wat Lao Buddhavong, Catlett VA — Sep 12, 2026', 'IBAA Dharma Meeting, Wat Lao Buddhavong, Catlett VA — Sep 12, 2026', @seed_user_id, '2026-09-21 19:31:04', '2026-10-01 17:07:09') ON DUPLICATE KEY UPDATE `storageKey` = VALUES(`storageKey`), `url` = VALUES(`url`), `originalName` = VALUES(`originalName`), `mimeType` = VALUES(`mimeType`), `sizeBytes` = VALUES(`sizeBytes`), `mediaKind` = VALUES(`mediaKind`), `altText` = VALUES(`altText`), `caption` = VALUES(`caption`), `uploadedBy` = VALUES(`uploadedBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30001, 'katog-choling', 'Katog Choling', 'published', 'verified', '', NULL, '', '45 NC 8641', NULL, 'Parthenon', 'AR', '72666', 'United States', 'https://katog.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30002, 'jodo-shinshu-international-office', 'Jodo Shinshu International Office', 'published', 'verified', '', NULL, '', '2140 Durant Ave', NULL, 'Berkeley', 'CA', '94704', 'United States', 'https://www.bcahq.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30003, 'jungto-society', 'Jungto Society', 'published', 'verified', '', NULL, '', '4361 Aitcheson Rd', NULL, 'Beltsville', 'MD', '20705', 'United States', 'https://www.jungto.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30004, 'wat-khmer', 'Wat Khmer', 'published', 'verified', '', NULL, '', '24304 S 189th Ave', NULL, 'Buckeye', 'AZ', '85326', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30005, 'honpa-hongwanji', 'Honpa Hongwanji', 'published', 'verified', '', NULL, '', '1727 Pali Highway', NULL, 'Honolulu', 'HI', '96813', 'United States', 'https://honpahi.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30006, 'wat-khmer-kampuchea-krom', 'Wat Khmer Kampuchea Krom', 'published', 'verified', '', NULL, '', '66 Sunset Court', NULL, 'San Jose', 'CA', '95116', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30007, 'mettananda-vihara-myanmar-american-buddhist-association', 'Mettananda Vihara (Myanmar American Buddhist Association)', 'published', 'verified', '', NULL, '', '2707 Seminary Ave', NULL, 'Oakland', 'CA', '94605', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30008, 'thuong-hanh-buddhist-monastery', 'Thuong Hanh Buddhist Monastery', 'published', 'verified', '', NULL, '', '2301 Woodlawn Rd', NULL, 'McKinney', 'TX', '75071', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30009, 'huong-sen-buddhist-temple', 'Huong Sen Buddhist Temple', 'published', 'verified', '', NULL, '', '19865 Seaton Ave', NULL, 'Perris', 'CA', '92570', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30010, 'bulkwang-meditation-center', 'Bulkwang Meditation Center', 'published', 'verified', '', NULL, '', '104 Route 303', NULL, 'Tappan', 'NY', '10963', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30011, 'bub-hwa-sa', 'Bub Hwa Sa', 'published', 'verified', '', NULL, '', '7202 Poplar St #B202', NULL, 'Annandale', 'VA', '22003', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30012, 'maryland-buddhist-vihara', 'Maryland Buddhist Vihara', 'published', 'verified', '', NULL, '', '2600 Elmont St', NULL, 'Silver Spring', 'MD', '20902', 'United States', 'https://www.marylandbuddhistvihara.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30013, 'dharma-college', 'Dharma College', 'published', 'verified', '', NULL, '', '2222 Harold Way', NULL, 'Berkeley', 'CA', '94704', 'United States', 'https://www.dharma-college.com', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30014, 'taego-order-of-korean-buddhism-america-europe-parish', 'Taego Order of Korean Buddhism (America-Europe Parish)', 'published', 'verified', '', NULL, '', '1768 N. Glenview Ave', NULL, 'Anaheim Hills', 'CA', '92807', 'United States', 'https://taegoaeparish.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30015, 'international-buddhist-committee-of-washington-dc', 'International Buddhist Committee of Washington DC', 'published', 'verified', '', NULL, '', '3116 Memory Ln', NULL, 'Silver Spring', 'MD', '20904', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30016, 'seattle-choeizan-enkyoji-nichiren-buddhist-temple', 'Seattle Choeizan Enkyoji Nichiren Buddhist Temple', 'published', 'verified', '', NULL, '', '501 S Jackson St #202', NULL, 'Seattle', 'WA', '98104', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30017, 'ambedkar-association-of-north-america-aana', 'Ambedkar Association of North America (AANA)', 'published', 'verified', '', NULL, '', '7080 Forridge Dr', NULL, 'Canton', 'MI', '48187', 'United States', 'https://aanausa.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30018, 'seattle-betsuin-buddhist-temple', 'Seattle Betsuin Buddhist Temple', 'published', 'verified', '', NULL, '', '1427 S Main St', NULL, 'Seattle', 'WA', '98144', 'United States', 'https://seattlebetsuin.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30019, 'borisa-zen-center', 'Borisa Zen Center', 'published', 'verified', '', NULL, '', '4662 W Warm Springs Rd', NULL, 'Las Vegas', 'NV', '89118', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30020, 'arrana-buddhist-monastery-muryangsa', 'Arrana Buddhist Monastery (Muryangsa)', 'published', 'verified', '', NULL, '', '19730 Mouth of Monocacy Rd', NULL, 'Dickerson', 'MD', '20842', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30021, 'tzu-chi-usa', 'Tzu Chi USA', 'published', 'verified', '', NULL, '', NULL, NULL, 'Arcadia', 'CA', NULL, 'United States', 'https://www.tzuchi.us', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30022, 'gowoo-sunim-bokyung-jeon-temple', 'Gowoo Sunim (Bokyung Jeon) Temple', 'published', 'verified', '', NULL, '', NULL, NULL, 'New York', '', NULL, 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30023, 'american-sri-lanka-buddhist-association', 'American Sri Lanka Buddhist Association', 'published', 'verified', '', NULL, '', '115 John St', NULL, 'Staten Island', 'NY', '10302', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30024, 'cambodian-buddhist-meditation-center-watt-munisotaram', 'Cambodian Buddhist Meditation Center (Watt Munisotaram)', 'published', 'verified', '', NULL, '', '2925 220th St E', NULL, 'Empire', 'MN', '55024', 'United States', 'https://www.wattmunisotaram.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30025, 'wat-khmer-hawaii', 'Wat Khmer Hawaii', 'published', 'verified', '', NULL, '', '15-1435 20th Ave', NULL, 'Kea''au', 'HI', '96749', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30026, 'wat-buddhasasanarangsey', 'Wat Buddhasasanarangsey', 'published', 'verified', '', NULL, '', '2533 N Valentine Ave', NULL, 'Fresno', 'CA', '93722', 'United States', 'https://www.fresnocambodiantemple.org', NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `temple_directory_entries` (`id`, `slug`, `name`, `status`, `verificationStatus`, `tradition`, `lineage`, `description`, `addressLine1`, `addressLine2`, `city`, `stateRegion`, `postalCode`, `country`, `websiteUrl`, `publicEmail`, `legacyUrl`, `verifiedAt`, `verifiedBy`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30027, 'wat-ahram-meanchey', 'Wat Ahram Meanchey', 'published', 'verified', '', NULL, '', '255 Grassland Ct', NULL, 'Bowling Green', 'KY', '42101', 'United States', NULL, NULL, NULL, 1793044812314, @seed_user_id, 1793044812314, @seed_user_id, '2026-10-26 20:00:12', '2026-10-26 20:00:12') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `name` = VALUES(`name`), `status` = VALUES(`status`), `verificationStatus` = VALUES(`verificationStatus`), `tradition` = VALUES(`tradition`), `lineage` = VALUES(`lineage`), `description` = VALUES(`description`), `addressLine1` = VALUES(`addressLine1`), `addressLine2` = VALUES(`addressLine2`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `postalCode` = VALUES(`postalCode`), `country` = VALUES(`country`), `websiteUrl` = VALUES(`websiteUrl`), `publicEmail` = VALUES(`publicEmail`), `legacyUrl` = VALUES(`legacyUrl`), `verifiedAt` = VALUES(`verifiedAt`), `verifiedBy` = VALUES(`verifiedBy`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `meeting_minutes` (`id`, `slug`, `title`, `meetingDate`, `hostTemple`, `locationLabel`, `city`, `stateRegion`, `summary`, `minutesBody`, `status`, `youtubeUrl`, `youtubeTitle`, `photoMediaId`, `legacyUrl`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30001, 'ibaa-interdenominational-study-circle-dhammakaya-meditation-center-california', 'IBAA Interdenominational Study Circle — Dhammakaya Meditation Center California', 1787436000000, 'Dhammakaya Meditation Center California', 'Main Chapel · Greater Los Angeles · 3:00–5:00 pm PST', NULL, 'Greater Los Angeles', 'IBAA held its Los Angeles-area interdenominational Dharma Meeting at Dhammakaya Meditation Center California on August 22, 2026, from 3:00 to 5:00 pm PST.', 'IBAA held its Los Angeles-area interdenominational Dharma Meeting at Dhammakaya Meditation Center California on August 22, 2026, from 3:00 to 5:00 pm PST. The program followed the IBAA format of opening chanting from the three traditions, Triple Refuge and Five Precepts, Dharma talks from Theravada, Mahayana, and Vajrayana venerables, meditation, and closing chanting. The host temple recorded the meeting. The recording is embedded below.', 'published', 'https://www.youtube.com/watch?v=EYgu9HKe2ac', 'IBAA Interdenominational Study Circle at Dhammakaya Meditation Center California — August 22, 2026 recording', 30001, NULL, 1788209157771, @seed_user_id, '2026-08-31 20:45:57', '2026-08-31 20:45:57') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `meetingDate` = VALUES(`meetingDate`), `hostTemple` = VALUES(`hostTemple`), `locationLabel` = VALUES(`locationLabel`), `city` = VALUES(`city`), `stateRegion` = VALUES(`stateRegion`), `summary` = VALUES(`summary`), `minutesBody` = VALUES(`minutesBody`), `status` = VALUES(`status`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `photoMediaId` = VALUES(`photoMediaId`), `legacyUrl` = VALUES(`legacyUrl`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT IGNORE INTO `meeting_minutes_traditions` (`meetingMinutesId`, `tradition`) VALUES (30001, 'Theravada');
INSERT IGNORE INTO `meeting_minutes_traditions` (`meetingMinutesId`, `tradition`) VALUES (30001, 'Mahayana');
INSERT IGNORE INTO `meeting_minutes_traditions` (`meetingMinutesId`, `tradition`) VALUES (30001, 'Vajrayana');
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (1, 'ibaa-dharma-study-circle-hsi-lai-temple-2026-09-26', 'IBAA Dharma Study Circle', 1790424000000, '15:00', '17:00', 'America/Los_Angeles', 'Los Angeles', NULL, 'Fo Guang Shan Hsi Lai Temple', 'Conference Room', 'Speakers on the flyer: Ven. Ngim Saosamkhan — Theravada, Khemara Buddhikarama Temple; Ven. Hui Ze — Mahayana, Hsi Lai Temple; Ven. Geshe Tenzin Sherap — Vajrayana, Land of Enlightened Wisdom. Websites: www.ibaa.org and www.hsilai.us.', 'published', NULL, NULL, NULL, 30002, 1788284123000, @seed_user_id, '2026-09-01 17:35:23', '2026-09-01 17:42:32') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (2, 'dharma-college-study-circle-2026-10-03', 'Dharma Study Circle', 1791028800000, NULL, NULL, 'America/Los_Angeles', 'San Francisco Bay Area', NULL, 'Dharma College', NULL, 'Saturday, October 3, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1788284123000, @seed_user_id, '2026-09-01 17:35:23', '2026-09-01 17:42:32') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (3, 'dhammavicaya-vihara-study-circle-2026-10-10', 'IBAA Dharma Study Circle', 1791633600000, '15:00', '17:00', 'America/Los_Angeles', 'Los Angeles', 'Los Angeles', 'Dhammavicaya Vihara', NULL, 'Saturday, October 10, 2026, 3:00–5:00 pm PT. Dhammavicaya Vihara is a Sri Lankan Buddhist Temple in Los Angeles.', 'published', NULL, NULL, NULL, NULL, 1788284123000, @seed_user_id, '2026-09-01 17:35:23', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30001, 'ibaa-dharma-meeting-wat-lao-buddhavong-2026-09-12', 'IBAA Dharma Meeting', 1789214400000, NULL, NULL, 'America/New_York', 'Washington DC', 'Catlett, VA', 'Wat Lao Buddhavong', NULL, 'Laotian Buddhist Temple in Catlett, VA. Past IBAA Dharma Meeting held Saturday, September 12, 2026.', 'published', NULL, NULL, NULL, 30003, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30002, 'ibaa-dharma-study-circle-george-washington-university-2026-10-17', 'IBAA Dharma Study Circle', 1792238400000, NULL, NULL, 'America/New_York', 'Washington DC', 'Washington, DC', 'George Washington University', NULL, 'IBAA Dharma Study Circle at George Washington University on Saturday, October 17, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30003, 'ibaa-dharma-study-circle-wat-thai-glenmont-2026-11-21', 'IBAA Dharma Study Circle', 1795262400000, NULL, NULL, 'America/New_York', 'Washington DC', 'Glenmont, MD', 'Wat Thai', NULL, 'IBAA Dharma Study Circle at Wat Thai, a Thai Buddhist Temple in Glenmont, MD, on Saturday, November 21, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30004, 'ibaa-dharma-study-circle-wat-khemara-buddhikarama-2026-11-28', 'IBAA Dharma Study Circle', 1795867200000, NULL, NULL, 'America/Los_Angeles', 'Los Angeles', 'Long Beach', 'Wat Khemara Buddhikarama', NULL, 'IBAA Dharma Study Circle at Wat Khemara Buddhikarama, a Cambodian Buddhist Temple in Long Beach, on Saturday, November 28, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30005, 'ibaa-dharma-study-circle-drikung-dharma-surya-temple-2026-12-12', 'IBAA Dharma Study Circle', 1797076800000, NULL, NULL, 'America/New_York', 'Washington DC', 'Fairfax, VA', 'Drikung Dharma Surya Temple', NULL, 'IBAA Dharma Study Circle at Drikung Dharma Surya Temple, a Tibetan Buddhist Temple in Fairfax, VA, on Saturday, December 12, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT INTO `event_entries` (`id`, `slug`, `title`, `eventDate`, `startTime`, `endTime`, `timeZone`, `region`, `city`, `venueName`, `address`, `description`, `status`, `zoomUrl`, `youtubeUrl`, `youtubeTitle`, `imageMediaId`, `publishedAt`, `createdBy`, `createdAt`, `updatedAt`) VALUES (30006, 'ibaa-dharma-study-circle-rosemead-monastery-2026-12-19', 'IBAA Dharma Study Circle', 1797681600000, NULL, NULL, 'America/Los_Angeles', 'Los Angeles', 'Los Angeles', 'Rosemead Monastery', NULL, 'IBAA Dharma Study Circle at Rosemead Monastery, a Chinese Buddhist Temple in Los Angeles, on Saturday, December 19, 2026. Time to be determined.', 'published', NULL, NULL, NULL, NULL, 1790019064591, @seed_user_id, '2026-09-21 19:31:04', '2026-09-21 19:31:04') ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `title` = VALUES(`title`), `eventDate` = VALUES(`eventDate`), `startTime` = VALUES(`startTime`), `endTime` = VALUES(`endTime`), `timeZone` = VALUES(`timeZone`), `region` = VALUES(`region`), `city` = VALUES(`city`), `venueName` = VALUES(`venueName`), `address` = VALUES(`address`), `description` = VALUES(`description`), `status` = VALUES(`status`), `zoomUrl` = VALUES(`zoomUrl`), `youtubeUrl` = VALUES(`youtubeUrl`), `youtubeTitle` = VALUES(`youtubeTitle`), `imageMediaId` = VALUES(`imageMediaId`), `publishedAt` = VALUES(`publishedAt`), `createdBy` = VALUES(`createdBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);
INSERT IGNORE INTO `event_entry_traditions` (`eventId`, `tradition`) VALUES (1, 'Theravada');
INSERT IGNORE INTO `event_entry_traditions` (`eventId`, `tradition`) VALUES (1, 'Mahayana');
INSERT IGNORE INTO `event_entry_traditions` (`eventId`, `tradition`) VALUES (1, 'Vajrayana');
INSERT IGNORE INTO `event_entry_traditions` (`eventId`, `tradition`) VALUES (3, 'Theravada');
INSERT IGNORE INTO `event_entry_traditions` (`eventId`, `tradition`) VALUES (30001, 'Theravada');
COMMIT;

