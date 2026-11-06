import "dotenv/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required to export the current public staging seed.");
  process.exit(1);
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  return `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "''")}'`;
}
function upsert(table, row, overrides = {}) {
  const normalized = { ...row, ...overrides };
  const columns = Object.keys(normalized);
  const updates = columns.filter(column => column !== "id").map(column => `\`${column}\` = VALUES(\`${column}\`)`);
  return `INSERT INTO \`${table}\` (${columns.map(column => `\`${column}\``).join(", ")}) VALUES (${columns.map(column => sqlValue(normalized[column])).join(", ")}) ON DUPLICATE KEY UPDATE ${updates.join(", ")};`;
}
function insertIgnore(table, row) {
  const columns = Object.keys(row);
  return `INSERT IGNORE INTO \`${table}\` (${columns.map(column => `\`${column}\``).join(", ")}) VALUES (${columns.map(column => sqlValue(row[column])).join(", ")});`;
}
const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
  await connection.query("START TRANSACTION WITH CONSISTENT SNAPSHOT");
  const select = async sql => (await connection.query(sql))[0];
  const members = await select("SELECT * FROM temple_directory_entries WHERE status='published' AND verificationStatus='verified' ORDER BY id");
  const news = await select("SELECT * FROM content_entries WHERE status='published' ORDER BY id");
  const categories = await select("SELECT * FROM content_categories ORDER BY id");
  const newsCategories = await select("SELECT x.* FROM content_entry_categories x JOIN content_entries n ON n.id=x.entryId WHERE n.status='published' ORDER BY x.entryId,x.categoryId");
  const newsTraditions = await select("SELECT x.* FROM content_entry_traditions x JOIN content_entries n ON n.id=x.entryId WHERE n.status='published' ORDER BY x.entryId,x.tradition");
  const newsMedia = await select("SELECT x.* FROM content_entry_media x JOIN content_entries n ON n.id=x.entryId WHERE n.status='published' ORDER BY x.entryId,x.sortOrder,x.mediaId");
  const minutes = await select("SELECT * FROM meeting_minutes WHERE status='published' ORDER BY id");
  const minuteTraditions = await select("SELECT x.* FROM meeting_minutes_traditions x JOIN meeting_minutes m ON m.id=x.meetingMinutesId WHERE m.status='published' ORDER BY x.meetingMinutesId,x.tradition");
  const events = await select("SELECT * FROM event_entries WHERE status='published' ORDER BY id");
  const eventTraditions = await select("SELECT x.* FROM event_entry_traditions x JOIN event_entries e ON e.id=x.eventId WHERE e.status='published' ORDER BY x.eventId,x.tradition");
  const circles = await select("SELECT * FROM study_circle_entries WHERE status='published' ORDER BY id");
  const routes = await select("SELECT r.* FROM legacy_routes r LEFT JOIN content_entries n ON n.id=r.contentEntryId WHERE r.contentEntryId IS NULL OR n.status='published' ORDER BY r.id");
  const mediaIds = [...new Set([...news.map(r => r.featuredMediaId), ...newsMedia.map(r => r.mediaId), ...minutes.map(r => r.photoMediaId), ...events.map(r => r.imageMediaId), ...circles.map(r => r.imageMediaId)].filter(Boolean))];
  const media = mediaIds.length ? (await connection.query(`SELECT * FROM media_assets WHERE id IN (${mediaIds.map(() => "?").join(",")}) ORDER BY id`, mediaIds))[0] : [];
  await connection.commit();
  const owned = (table, rows, field = "createdBy") => rows.map(row => upsert(table, row, { [field]: "__SEED_USER__" }).replaceAll("'__SEED_USER__'", "@seed_user_id"));
  const lines = [
    "-- IBAA fresh-staging seed: published public records only; exported November 2026.",
    "-- Excludes existing user/staff accounts, passwords, sessions, inquiries, drafts and private data.",
    "-- Intended for a fresh database. Reapplying after staff edit content may overwrite those edits.",
    "SET NAMES utf8mb4;",
    "START TRANSACTION;",
    "INSERT INTO users (openId,name,email,loginMethod,role,createdAt,updatedAt,lastSignedIn) VALUES ('staging:public-content-seed','IBAA Public Content',NULL,'system','user',NOW(),NOW(),NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);",
    "SET @seed_user_id=(SELECT id FROM users WHERE openId='staging:public-content-seed' LIMIT 1);",
    ...categories.map(row => upsert("content_categories", row)),
    ...owned("media_assets", media, "uploadedBy"),
    ...members.map(row => upsert("temple_directory_entries", row, { createdBy: "__SEED_USER__", verifiedBy: "__SEED_USER__" }).replaceAll("'__SEED_USER__'", "@seed_user_id")),
    ...owned("content_entries", news),
    ...newsCategories.map(row => insertIgnore("content_entry_categories", row)),
    ...newsTraditions.map(row => insertIgnore("content_entry_traditions", row)),
    ...newsMedia.map(row => insertIgnore("content_entry_media", row)),
    ...owned("meeting_minutes", minutes),
    ...minuteTraditions.map(row => insertIgnore("meeting_minutes_traditions", row)),
    ...owned("event_entries", events),
    ...eventTraditions.map(row => insertIgnore("event_entry_traditions", row)),
    ...owned("study_circle_entries", circles),
    ...routes.map(row => upsert("legacy_routes", row)),
    "COMMIT;", "",
  ];
  const destination = path.resolve("deployment/seed-current-public-content.sql");
  await writeFile(destination, lines.join("\n"), "utf8");
  const counts = { members: members.length, news: news.length, categories: categories.length, media: media.length, meeting_minutes: minutes.length, events: events.length, managed_study_circles: circles.length, database_legacy_routes: routes.length };
  await writeFile(path.resolve("deployment/PUBLIC-SEED-COUNTS.json"), JSON.stringify({ exportedAt: new Date().toISOString(), counts, excludes: ["existing users", "staff accounts", "passwords", "sessions", "private contact inquiries", "drafts"], note: "Static archives, regional meetings and individual members are included in source rather than these row counts." }, null, 2) + "\n");
  console.log(`Wrote ${destination}`);
  console.log("Published public rows:", JSON.stringify(counts));
} finally {
  connection.destroy();
}
