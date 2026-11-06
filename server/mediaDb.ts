import { desc, eq } from "drizzle-orm";
import { mediaAssets, type InsertMediaAsset } from "../drizzle/schema";
import { getDb } from "./db";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function listMediaAssets() {
  const db = await requireDb();
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function createMediaAsset(values: InsertMediaAsset) {
  const db = await requireDb();
  const inserted = await db.insert(mediaAssets).values(values).returning({ id: mediaAssets.id });
  return inserted[0]?.id;
}

export async function updateMediaAssetMetadata(id: number, values: { altText?: string | null; caption?: string | null }) {
  const db = await requireDb();
  await db.update(mediaAssets).set(values).where(eq(mediaAssets.id, id));
}
