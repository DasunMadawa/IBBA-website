import { desc, eq } from "drizzle-orm";
import { mediaAssets, studyCircleEntries, type InsertStudyCircleEntry } from "../drizzle/schema";
import { getDb } from "./db";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export function sortStudyCirclesNewestFirst<T extends { meetingDate: number }>(items: T[]) {
  return [...items].sort((a, b) => b.meetingDate - a.meetingDate);
}

export async function listPublishedStudyCircles() {
  const db = await requireDb();
  const rows = await db.select({ entry: studyCircleEntries, image: mediaAssets })
    .from(studyCircleEntries)
    .leftJoin(mediaAssets, eq(studyCircleEntries.imageMediaId, mediaAssets.id))
    .where(eq(studyCircleEntries.status, "published"))
    .orderBy(desc(studyCircleEntries.meetingDate));
  return sortStudyCirclesNewestFirst(rows.map(row => ({ ...row.entry, image: row.image })));
}

export async function listAdminStudyCircles() {
  const db = await requireDb();
  const rows = await db.select({ entry: studyCircleEntries, image: mediaAssets })
    .from(studyCircleEntries)
    .leftJoin(mediaAssets, eq(studyCircleEntries.imageMediaId, mediaAssets.id))
    .orderBy(desc(studyCircleEntries.updatedAt));
  return rows.map(row => ({ ...row.entry, image: row.image }));
}

export async function saveStudyCircle(input: { id?: number; values: InsertStudyCircleEntry }) {
  const db = await requireDb();
  if (input.id) {
    await db.update(studyCircleEntries).set(input.values).where(eq(studyCircleEntries.id, input.id));
    return input.id;
  }
  const id = (await db.insert(studyCircleEntries).values(input.values).returning({ id: studyCircleEntries.id }))[0]?.id;
  if (!id) throw new Error("Study Circle could not be saved");
  return id;
}

export async function setStudyCircleStatus(id: number, status: "draft" | "published") {
  const db = await requireDb();
  await db.update(studyCircleEntries).set({ status, publishedAt: status === "published" ? Date.now() : null }).where(eq(studyCircleEntries.id, id));
}

export async function deleteStudyCircle(id: number) {
  const db = await requireDb();
  await db.delete(studyCircleEntries).where(eq(studyCircleEntries.id, id));
}
