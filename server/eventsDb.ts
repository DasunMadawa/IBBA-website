import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { eventEntries, eventEntryTraditions, mediaAssets, type InsertEventEntry } from "../drizzle/schema";
import { getDb } from "./db";

export type EventTradition = "Theravada" | "Mahayana" | "Vajrayana";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

async function hydrateEvents(rows: Array<{ event: typeof eventEntries.$inferSelect; image: typeof mediaAssets.$inferSelect | null }>) {
  const db = await requireDb();
  const ids = rows.map(row => row.event.id);
  const tags = ids.length ? await db.select().from(eventEntryTraditions).where(inArray(eventEntryTraditions.eventId, ids)) : [];
  return rows.map(row => ({ ...row.event, image: row.image, traditions: tags.filter(tag => tag.eventId === row.event.id).map(tag => tag.tradition) }));
}

export function sortPublishedEvents<T extends { eventDate: number }>(items: T[], now = Date.now()) {
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  return [...items].sort((a, b) => {
    const aUpcoming = a.eventDate >= startToday.getTime();
    const bUpcoming = b.eventDate >= startToday.getTime();
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
    return aUpcoming ? a.eventDate - b.eventDate : b.eventDate - a.eventDate;
  });
}

export async function listPublishedEvents() {
  const db = await requireDb();
  const rows = await db.select({ event: eventEntries, image: mediaAssets }).from(eventEntries).leftJoin(mediaAssets, eq(eventEntries.imageMediaId, mediaAssets.id)).where(eq(eventEntries.status, "published")).orderBy(asc(eventEntries.eventDate));
  return sortPublishedEvents(await hydrateEvents(rows));
}

export async function getPublishedEventBySlug(slug: string) {
  const db = await requireDb();
  const rows = await db.select({ event: eventEntries, image: mediaAssets }).from(eventEntries).leftJoin(mediaAssets, eq(eventEntries.imageMediaId, mediaAssets.id)).where(and(eq(eventEntries.slug, slug), eq(eventEntries.status, "published"))).limit(1);
  return (await hydrateEvents(rows))[0] ?? null;
}

export async function listAdminEvents() {
  const db = await requireDb();
  const rows = await db.select({ event: eventEntries, image: mediaAssets }).from(eventEntries).leftJoin(mediaAssets, eq(eventEntries.imageMediaId, mediaAssets.id)).orderBy(desc(eventEntries.updatedAt));
  return hydrateEvents(rows);
}

export async function saveEvent(input: { id?: number; values: InsertEventEntry; traditions: EventTradition[] }) {
  const db = await requireDb();
  return db.transaction(async tx => {
    let eventId = input.id;
    if (eventId) await tx.update(eventEntries).set(input.values).where(eq(eventEntries.id, eventId));
    else eventId = (await tx.insert(eventEntries).values(input.values).returning({ id: eventEntries.id }))[0]?.id;
    if (!eventId) throw new Error("Event could not be saved");
    await tx.delete(eventEntryTraditions).where(eq(eventEntryTraditions.eventId, eventId));
    const unique = Array.from(new Set(input.traditions));
    if (unique.length) await tx.insert(eventEntryTraditions).values(unique.map(tradition => ({ eventId, tradition })));
    return eventId;
  });
}

export async function setEventStatus(id: number, status: "draft" | "published") {
  const db = await requireDb();
  await db.update(eventEntries).set({ status, publishedAt: status === "published" ? Date.now() : null }).where(eq(eventEntries.id, id));
}

export async function deleteEvent(id: number) {
  const db = await requireDb();
  await db.delete(eventEntries).where(eq(eventEntries.id, id));
}
