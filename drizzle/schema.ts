import { bigint, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const mediaKind = pgEnum("media_kind", ["image", "document"]);
export const contentType = pgEnum("content_type", ["news", "media"]);
export const publishStatus = pgEnum("publish_status", ["draft", "published"]);
export const verificationStatus = pgEnum("verification_status", ["pending", "verified"]);
export const legacyRouteType = pgEnum("legacy_route_type", ["alias", "redirect"]);
export const tradition = pgEnum("tradition", ["Theravada", "Mahayana", "Vajrayana"]);
export const staffAccountStatus = pgEnum("staff_account_status", ["active", "disabled"]);
export const studyCircleRegion = pgEnum("study_circle_region", ["Washington DC Metro Area", "Greater Los Angeles Metro Area", "San Francisco Bay Area"]);
export const contactTopic = pgEnum("contact_topic", ["general", "programs", "community", "archive", "partnership"]);
export const contactStatus = pgEnum("contact_status", ["new", "read", "archived"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
  url: varchar("url", { length: 1024 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 127 }).notNull(),
  sizeBytes: bigint("sizeBytes", { mode: "number" }).notNull(),
  mediaKind: mediaKind("mediaKind").notNull(),
  altText: text("altText"),
  caption: text("caption"),
  uploadedBy: integer("uploadedBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const contentEntries = pgTable("content_entries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  contentType: contentType("contentType").default("news").notNull(),
  status: publishStatus("status").default("draft").notNull(),
  authorName: varchar("authorName", { length: 160 }).notNull(),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  youtubeUrl: varchar("youtubeUrl", { length: 512 }),
  youtubeTitle: varchar("youtubeTitle", { length: 255 }),
  featuredMediaId: integer("featuredMediaId").references(() => mediaAssets.id),
  legacyUrl: varchar("legacyUrl", { length: 1024 }),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const contentCategories = pgTable("content_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
}, table => ({
  slugUnique: uniqueIndex("content_categories_slug_unique").on(table.slug),
}));

export const contentEntryCategories = pgTable("content_entry_categories", {
  entryId: integer("entryId").notNull().references(() => contentEntries.id, { onDelete: "cascade" }),
  categoryId: integer("categoryId").notNull().references(() => contentCategories.id, { onDelete: "cascade" }),
}, table => ({
  pk: primaryKey({ columns: [table.entryId, table.categoryId] }),
}));

export const contentEntryMedia = pgTable("content_entry_media", {
  entryId: integer("entryId").notNull().references(() => contentEntries.id, { onDelete: "cascade" }),
  mediaId: integer("mediaId").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  sortOrder: integer("sortOrder").default(0).notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.entryId, table.mediaId] }),
}));

export const legacyRoutes = pgTable("legacy_routes", {
  id: serial("id").primaryKey(),
  legacyPath: varchar("legacyPath", { length: 1024 }).notNull().unique(),
  destinationPath: varchar("destinationPath", { length: 512 }).notNull(),
  contentEntryId: integer("contentEntryId").references(() => contentEntries.id, { onDelete: "set null" }),
  routeType: legacyRouteType("routeType").default("redirect").notNull(),
  httpStatus: integer("httpStatus").default(301).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const templeDirectoryEntries = pgTable("temple_directory_entries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: publishStatus("status").default("draft").notNull(),
  verificationStatus: verificationStatus("verificationStatus").default("pending").notNull(),
  tradition: varchar("tradition", { length: 120 }).notNull(),
  lineage: varchar("lineage", { length: 255 }),
  description: text("description").notNull(),
  addressLine1: varchar("addressLine1", { length: 255 }),
  addressLine2: varchar("addressLine2", { length: 255 }),
  city: varchar("city", { length: 160 }).notNull(),
  stateRegion: varchar("stateRegion", { length: 160 }).notNull(),
  postalCode: varchar("postalCode", { length: 32 }),
  country: varchar("country", { length: 120 }).default("United States").notNull(),
  websiteUrl: varchar("websiteUrl", { length: 1024 }),
  publicEmail: varchar("publicEmail", { length: 320 }),
  legacyUrl: varchar("legacyUrl", { length: 1024 }),
  verifiedAt: bigint("verifiedAt", { mode: "number" }),
  verifiedBy: integer("verifiedBy").references(() => users.id, { onDelete: "set null" }),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const meetingMinutes = pgTable("meeting_minutes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  meetingDate: bigint("meetingDate", { mode: "number" }).notNull(),
  hostTemple: varchar("hostTemple", { length: 255 }).notNull(),
  locationLabel: varchar("locationLabel", { length: 255 }).notNull(),
  city: varchar("city", { length: 160 }),
  stateRegion: varchar("stateRegion", { length: 160 }),
  summary: text("summary").notNull(),
  minutesBody: text("minutesBody").notNull(),
  status: publishStatus("status").default("draft").notNull(),
  youtubeUrl: varchar("youtubeUrl", { length: 512 }),
  youtubeTitle: varchar("youtubeTitle", { length: 255 }),
  photoMediaId: integer("photoMediaId").references(() => mediaAssets.id, { onDelete: "set null" }),
  legacyUrl: varchar("legacyUrl", { length: 1024 }),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const meetingMinutesTraditions = pgTable("meeting_minutes_traditions", {
  meetingMinutesId: integer("meetingMinutesId").notNull().references(() => meetingMinutes.id, { onDelete: "cascade" }),
  tradition: tradition("tradition").notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.meetingMinutesId, table.tradition] }),
}));

export const staffAdminAccounts = pgTable("staff_admin_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  status: staffAccountStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  emailUnique: uniqueIndex("staff_admin_accounts_email_unique").on(table.email),
  userUnique: uniqueIndex("staff_admin_accounts_user_unique").on(table.userId),
}));

export const staffAdminSessions = pgTable("staff_admin_sessions", {
  id: serial("id").primaryKey(),
  accountId: integer("accountId").notNull().references(() => staffAdminAccounts.id, { onDelete: "cascade" }),
  tokenHash: varchar("tokenHash", { length: 64 }).notNull(),
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp("lastUsedAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({
  tokenUnique: uniqueIndex("staff_admin_sessions_token_unique").on(table.tokenHash),
}));

export const eventEntries = pgTable("event_entries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  eventDate: bigint("eventDate", { mode: "number" }).notNull(),
  startTime: varchar("startTime", { length: 16 }),
  endTime: varchar("endTime", { length: 16 }),
  timeZone: varchar("timeZone", { length: 100 }).default("America/Los_Angeles").notNull(),
  region: varchar("region", { length: 160 }).notNull(),
  city: varchar("city", { length: 160 }),
  venueName: varchar("venueName", { length: 255 }).notNull(),
  address: varchar("address", { length: 512 }),
  description: text("description").notNull(),
  status: publishStatus("status").default("draft").notNull(),
  zoomUrl: varchar("zoomUrl", { length: 1024 }),
  youtubeUrl: varchar("youtubeUrl", { length: 512 }),
  youtubeTitle: varchar("youtubeTitle", { length: 255 }),
  imageMediaId: integer("imageMediaId").references(() => mediaAssets.id, { onDelete: "set null" }),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  slugUnique: uniqueIndex("event_entries_slug_unique").on(table.slug),
}));

export const eventEntryTraditions = pgTable("event_entry_traditions", {
  eventId: integer("eventId").notNull().references(() => eventEntries.id, { onDelete: "cascade" }),
  tradition: tradition("tradition").notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.eventId, table.tradition] }),
}));

export const studyCircleEntries = pgTable("study_circle_entries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull(),
  region: studyCircleRegion("region").notNull(),
  meetingMonth: integer("meetingMonth").notNull(),
  meetingYear: integer("meetingYear").notNull(),
  meetingDate: bigint("meetingDate", { mode: "number" }).notNull(),
  startTime: varchar("startTime", { length: 16 }),
  endTime: varchar("endTime", { length: 16 }),
  timeZone: varchar("timeZone", { length: 100 }).default("America/Los_Angeles").notNull(),
  templeName: varchar("templeName", { length: 255 }).notNull(),
  nationality: varchar("nationality", { length: 160 }).notNull(),
  yana: tradition("yana").notNull(),
  venueNote: varchar("venueNote", { length: 512 }),
  description: text("description").notNull(),
  imageMediaId: integer("imageMediaId").references(() => mediaAssets.id, { onDelete: "set null" }),
  youtubeUrl: varchar("youtubeUrl", { length: 512 }),
  youtubeTitle: varchar("youtubeTitle", { length: 255 }),
  status: publishStatus("status").default("draft").notNull(),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, table => ({
  slugUnique: uniqueIndex("study_circle_entries_slug_unique").on(table.slug),
}));

export const contentEntryTraditions = pgTable("content_entry_traditions", {
  entryId: integer("entryId").notNull().references(() => contentEntries.id, { onDelete: "cascade" }),
  tradition: tradition("tradition").notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.entryId, table.tradition] }),
}));

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  topic: contactTopic("topic").default("general").notNull(),
  message: text("message").notNull(),
  status: contactStatus("status").default("new").notNull(),
  submittedAt: timestamp("submittedAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
export type ContentEntry = typeof contentEntries.$inferSelect;
export type InsertContentEntry = typeof contentEntries.$inferInsert;
export type TempleDirectoryEntry = typeof templeDirectoryEntries.$inferSelect;
export type InsertTempleDirectoryEntry = typeof templeDirectoryEntries.$inferInsert;
export type MeetingMinutes = typeof meetingMinutes.$inferSelect;
export type InsertMeetingMinutes = typeof meetingMinutes.$inferInsert;
export type StaffAdminAccount = typeof staffAdminAccounts.$inferSelect;
export type EventEntry = typeof eventEntries.$inferSelect;
export type InsertEventEntry = typeof eventEntries.$inferInsert;
export type StudyCircleEntry = typeof studyCircleEntries.$inferSelect;
export type InsertStudyCircleEntry = typeof studyCircleEntries.$inferInsert;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = typeof contactInquiries.$inferInsert;
