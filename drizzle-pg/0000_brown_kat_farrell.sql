CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contact_topic" AS ENUM('general', 'programs', 'community', 'archive', 'partnership');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('news', 'media');--> statement-breakpoint
CREATE TYPE "public"."legacy_route_type" AS ENUM('alias', 'redirect');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'document');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."staff_account_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."study_circle_region" AS ENUM('Washington DC Metro Area', 'Greater Los Angeles Metro Area', 'San Francisco Bay Area');--> statement-breakpoint
CREATE TYPE "public"."tradition" AS ENUM('Theravada', 'Mahayana', 'Vajrayana');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified');--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(320) NOT NULL,
	"organization" varchar(255),
	"topic" "contact_topic" DEFAULT 'general' NOT NULL,
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"submittedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"contentType" "content_type" DEFAULT 'news' NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"authorName" varchar(160) NOT NULL,
	"publishedAt" bigint,
	"youtubeUrl" varchar(512),
	"youtubeTitle" varchar(255),
	"featuredMediaId" integer,
	"legacyUrl" varchar(1024),
	"createdBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_entry_categories" (
	"entryId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "content_entry_categories_entryId_categoryId_pk" PRIMARY KEY("entryId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "content_entry_media" (
	"entryId" integer NOT NULL,
	"mediaId" integer NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "content_entry_media_entryId_mediaId_pk" PRIMARY KEY("entryId","mediaId")
);
--> statement-breakpoint
CREATE TABLE "content_entry_traditions" (
	"entryId" integer NOT NULL,
	"tradition" "tradition" NOT NULL,
	CONSTRAINT "content_entry_traditions_entryId_tradition_pk" PRIMARY KEY("entryId","tradition")
);
--> statement-breakpoint
CREATE TABLE "event_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(255) NOT NULL,
	"eventDate" bigint NOT NULL,
	"startTime" varchar(16),
	"endTime" varchar(16),
	"timeZone" varchar(100) DEFAULT 'America/Los_Angeles' NOT NULL,
	"region" varchar(160) NOT NULL,
	"city" varchar(160),
	"venueName" varchar(255) NOT NULL,
	"address" varchar(512),
	"description" text NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"zoomUrl" varchar(1024),
	"youtubeUrl" varchar(512),
	"youtubeTitle" varchar(255),
	"imageMediaId" integer,
	"publishedAt" bigint,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_entry_traditions" (
	"eventId" integer NOT NULL,
	"tradition" "tradition" NOT NULL,
	CONSTRAINT "event_entry_traditions_eventId_tradition_pk" PRIMARY KEY("eventId","tradition")
);
--> statement-breakpoint
CREATE TABLE "legacy_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"legacyPath" varchar(1024) NOT NULL,
	"destinationPath" varchar(512) NOT NULL,
	"contentEntryId" integer,
	"routeType" "legacy_route_type" DEFAULT 'redirect' NOT NULL,
	"httpStatus" integer DEFAULT 301 NOT NULL,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "legacy_routes_legacyPath_unique" UNIQUE("legacyPath")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"storageKey" varchar(512) NOT NULL,
	"url" varchar(1024) NOT NULL,
	"originalName" varchar(255) NOT NULL,
	"mimeType" varchar(127) NOT NULL,
	"sizeBytes" bigint NOT NULL,
	"mediaKind" "media_kind" NOT NULL,
	"altText" text,
	"caption" text,
	"uploadedBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_storageKey_unique" UNIQUE("storageKey")
);
--> statement-breakpoint
CREATE TABLE "meeting_minutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(255) NOT NULL,
	"meetingDate" bigint NOT NULL,
	"hostTemple" varchar(255) NOT NULL,
	"locationLabel" varchar(255) NOT NULL,
	"city" varchar(160),
	"stateRegion" varchar(160),
	"summary" text NOT NULL,
	"minutesBody" text NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"youtubeUrl" varchar(512),
	"youtubeTitle" varchar(255),
	"photoMediaId" integer,
	"legacyUrl" varchar(1024),
	"publishedAt" bigint,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meeting_minutes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "meeting_minutes_traditions" (
	"meetingMinutesId" integer NOT NULL,
	"tradition" "tradition" NOT NULL,
	CONSTRAINT "meeting_minutes_traditions_meetingMinutesId_tradition_pk" PRIMARY KEY("meetingMinutesId","tradition")
);
--> statement-breakpoint
CREATE TABLE "staff_admin_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"email" varchar(320) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"displayName" varchar(160) NOT NULL,
	"status" "staff_account_status" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_admin_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"accountId" integer NOT NULL,
	"tokenHash" varchar(64) NOT NULL,
	"expiresAt" bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastUsedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_circle_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"region" "study_circle_region" NOT NULL,
	"meetingMonth" integer NOT NULL,
	"meetingYear" integer NOT NULL,
	"meetingDate" bigint NOT NULL,
	"startTime" varchar(16),
	"endTime" varchar(16),
	"timeZone" varchar(100) DEFAULT 'America/Los_Angeles' NOT NULL,
	"templeName" varchar(255) NOT NULL,
	"nationality" varchar(160) NOT NULL,
	"yana" "tradition" NOT NULL,
	"venueNote" varchar(512),
	"description" text NOT NULL,
	"imageMediaId" integer,
	"youtubeUrl" varchar(512),
	"youtubeTitle" varchar(255),
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"publishedAt" bigint,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temple_directory_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"verificationStatus" "verification_status" DEFAULT 'pending' NOT NULL,
	"tradition" varchar(120) NOT NULL,
	"lineage" varchar(255),
	"description" text NOT NULL,
	"addressLine1" varchar(255),
	"addressLine2" varchar(255),
	"city" varchar(160) NOT NULL,
	"stateRegion" varchar(160) NOT NULL,
	"postalCode" varchar(32),
	"country" varchar(120) DEFAULT 'United States' NOT NULL,
	"websiteUrl" varchar(1024),
	"publicEmail" varchar(320),
	"legacyUrl" varchar(1024),
	"verifiedAt" bigint,
	"verifiedBy" integer,
	"publishedAt" bigint,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "temple_directory_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "content_entries" ADD CONSTRAINT "content_entries_featuredMediaId_media_assets_id_fk" FOREIGN KEY ("featuredMediaId") REFERENCES "public"."media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entries" ADD CONSTRAINT "content_entries_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry_categories" ADD CONSTRAINT "content_entry_categories_entryId_content_entries_id_fk" FOREIGN KEY ("entryId") REFERENCES "public"."content_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry_categories" ADD CONSTRAINT "content_entry_categories_categoryId_content_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."content_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry_media" ADD CONSTRAINT "content_entry_media_entryId_content_entries_id_fk" FOREIGN KEY ("entryId") REFERENCES "public"."content_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry_media" ADD CONSTRAINT "content_entry_media_mediaId_media_assets_id_fk" FOREIGN KEY ("mediaId") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry_traditions" ADD CONSTRAINT "content_entry_traditions_entryId_content_entries_id_fk" FOREIGN KEY ("entryId") REFERENCES "public"."content_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_entries" ADD CONSTRAINT "event_entries_imageMediaId_media_assets_id_fk" FOREIGN KEY ("imageMediaId") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_entries" ADD CONSTRAINT "event_entries_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_entry_traditions" ADD CONSTRAINT "event_entry_traditions_eventId_event_entries_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_routes" ADD CONSTRAINT "legacy_routes_contentEntryId_content_entries_id_fk" FOREIGN KEY ("contentEntryId") REFERENCES "public"."content_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedBy_users_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_minutes" ADD CONSTRAINT "meeting_minutes_photoMediaId_media_assets_id_fk" FOREIGN KEY ("photoMediaId") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_minutes" ADD CONSTRAINT "meeting_minutes_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_minutes_traditions" ADD CONSTRAINT "meeting_minutes_traditions_meetingMinutesId_meeting_minutes_id_fk" FOREIGN KEY ("meetingMinutesId") REFERENCES "public"."meeting_minutes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_admin_accounts" ADD CONSTRAINT "staff_admin_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_admin_sessions" ADD CONSTRAINT "staff_admin_sessions_accountId_staff_admin_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."staff_admin_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_circle_entries" ADD CONSTRAINT "study_circle_entries_imageMediaId_media_assets_id_fk" FOREIGN KEY ("imageMediaId") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_circle_entries" ADD CONSTRAINT "study_circle_entries_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_directory_entries" ADD CONSTRAINT "temple_directory_entries_verifiedBy_users_id_fk" FOREIGN KEY ("verifiedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_directory_entries" ADD CONSTRAINT "temple_directory_entries_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_categories_slug_unique" ON "content_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "event_entries_slug_unique" ON "event_entries" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_admin_accounts_email_unique" ON "staff_admin_accounts" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_admin_accounts_user_unique" ON "staff_admin_accounts" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_admin_sessions_token_unique" ON "staff_admin_sessions" USING btree ("tokenHash");--> statement-breakpoint
CREATE UNIQUE INDEX "study_circle_entries_slug_unique" ON "study_circle_entries" USING btree ("slug");