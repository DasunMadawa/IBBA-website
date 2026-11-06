import { and, desc, eq } from "drizzle-orm";
import { templeDirectoryEntries, type InsertTempleDirectoryEntry } from "../drizzle/schema";
import { getDb } from "./db";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function listPublishedTemples() {
  const db = await requireDb();
  return db.select().from(templeDirectoryEntries)
    .where(and(eq(templeDirectoryEntries.status, "published"), eq(templeDirectoryEntries.verificationStatus, "verified")))
    .orderBy(templeDirectoryEntries.name);
}

export async function listAdminTemples() {
  const db = await requireDb();
  return db.select().from(templeDirectoryEntries).orderBy(desc(templeDirectoryEntries.updatedAt));
}

export async function getAdminTemple(id: number) {
  const db = await requireDb();
  const rows = await db.select().from(templeDirectoryEntries).where(eq(templeDirectoryEntries.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function saveTempleDirectoryEntry(id: number | undefined, values: InsertTempleDirectoryEntry) {
  const db = await requireDb();
  if (id) {
    const { createdBy: _createdBy, ...updates } = values;
    await db.update(templeDirectoryEntries).set(updates).where(eq(templeDirectoryEntries.id, id));
    return id;
  }
  const inserted = await db.insert(templeDirectoryEntries).values(values).returning({ id: templeDirectoryEntries.id });
  const entryId = inserted[0]?.id;
  if (!entryId) throw new Error("Temple record could not be saved");
  return entryId;
}

export async function setTempleDirectoryStatus(id: number, status: "draft" | "published") {
  const db = await requireDb();
  await db.update(templeDirectoryEntries).set({ status, publishedAt: status === "published" ? Date.now() : null }).where(eq(templeDirectoryEntries.id, id));
}

export async function deleteTempleDirectoryEntry(id: number) {
  const db = await requireDb();
  await db.delete(templeDirectoryEntries).where(eq(templeDirectoryEntries.id, id));
}
