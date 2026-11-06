import { desc, eq, inArray } from "drizzle-orm";
import { mediaAssets, meetingMinutes, meetingMinutesTraditions, type InsertMeetingMinutes } from "../drizzle/schema";
import { getDb } from "./db";

type Tradition = "Theravada" | "Mahayana" | "Vajrayana";

export function compareMeetingMinutesNewestFirst(a: { meetingDate: number; id: number }, b: { meetingDate: number; id: number }) {
  return b.meetingDate - a.meetingDate || b.id - a.id;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

async function hydrateMinutes(rows: Array<{ minutes: typeof meetingMinutes.$inferSelect; photo: typeof mediaAssets.$inferSelect | null }>) {
  const db = await requireDb();
  const ids = rows.map(row => row.minutes.id);
  const traditionRows = ids.length
    ? await db.select().from(meetingMinutesTraditions).where(inArray(meetingMinutesTraditions.meetingMinutesId, ids))
    : [];
  return rows.map(row => ({
    ...row.minutes,
    photo: row.photo,
    traditions: traditionRows.filter(item => item.meetingMinutesId === row.minutes.id).map(item => item.tradition),
  }));
}

export async function listPublishedMeetingMinutes(limit?: number) {
  const db = await requireDb();
  const base = db.select({ minutes: meetingMinutes, photo: mediaAssets })
    .from(meetingMinutes)
    .leftJoin(mediaAssets, eq(meetingMinutes.photoMediaId, mediaAssets.id))
    .where(eq(meetingMinutes.status, "published"))
    .orderBy(desc(meetingMinutes.meetingDate), desc(meetingMinutes.createdAt));
  const rows = limit ? await base.limit(limit) : await base;
  return (await hydrateMinutes(rows)).sort(compareMeetingMinutesNewestFirst);
}

export async function listAdminMeetingMinutes() {
  const db = await requireDb();
  const rows = await db.select({ minutes: meetingMinutes, photo: mediaAssets })
    .from(meetingMinutes)
    .leftJoin(mediaAssets, eq(meetingMinutes.photoMediaId, mediaAssets.id))
    .orderBy(desc(meetingMinutes.meetingDate), desc(meetingMinutes.updatedAt));
  return (await hydrateMinutes(rows)).sort(compareMeetingMinutesNewestFirst);
}

export async function saveMeetingMinutes(id: number | undefined, values: InsertMeetingMinutes, traditions: Tradition[]) {
  const db = await requireDb();
  return db.transaction(async tx => {
    let minutesId = id;
    if (minutesId) {
      const { createdBy: _createdBy, ...updates } = values;
      await tx.update(meetingMinutes).set(updates).where(eq(meetingMinutes.id, minutesId));
    } else {
      const inserted = await tx.insert(meetingMinutes).values(values).returning({ id: meetingMinutes.id });
      minutesId = inserted[0]?.id;
    }
    if (!minutesId) throw new Error("Meeting Minutes entry could not be saved");
    await tx.delete(meetingMinutesTraditions).where(eq(meetingMinutesTraditions.meetingMinutesId, minutesId));
    const uniqueTraditions = Array.from(new Set(traditions));
    if (uniqueTraditions.length) {
      await tx.insert(meetingMinutesTraditions).values(uniqueTraditions.map(tradition => ({ meetingMinutesId: minutesId, tradition })));
    }
    return minutesId;
  });
}

export async function setMeetingMinutesStatus(id: number, status: "draft" | "published") {
  const db = await requireDb();
  await db.update(meetingMinutes).set({ status, publishedAt: status === "published" ? Date.now() : null }).where(eq(meetingMinutes.id, id));
}

export async function deleteMeetingMinutes(id: number) {
  const db = await requireDb();
  await db.delete(meetingMinutes).where(eq(meetingMinutes.id, id));
}
