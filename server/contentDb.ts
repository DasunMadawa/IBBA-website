import { and, desc, eq, inArray } from "drizzle-orm";
import { contentCategories, contentEntries, contentEntryCategories, contentEntryMedia, contentEntryTraditions, mediaAssets, type InsertContentEntry } from "../drizzle/schema";
import { getDb } from "./db";

type SaveContentInput = {
  id?: number;
  values: InsertContentEntry;
  categoryNames: string[];
  attachmentMediaIds: number[];
  traditions: Array<"Theravada" | "Mahayana" | "Vajrayana">;
};

function categorySlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

async function hydrateEntries(rows: Array<{ entry: typeof contentEntries.$inferSelect; featuredMedia: typeof mediaAssets.$inferSelect | null }>) {
  const db = await requireDb();
  const ids = rows.map(row => row.entry.id);
  const categoryRows = ids.length
    ? await db.select({ entryId: contentEntryCategories.entryId, name: contentCategories.name })
        .from(contentEntryCategories)
        .innerJoin(contentCategories, eq(contentEntryCategories.categoryId, contentCategories.id))
        .where(inArray(contentEntryCategories.entryId, ids))
    : [];
  const attachmentRows = ids.length
    ? await db.select({ entryId: contentEntryMedia.entryId, asset: mediaAssets })
        .from(contentEntryMedia)
        .innerJoin(mediaAssets, eq(contentEntryMedia.mediaId, mediaAssets.id))
        .where(inArray(contentEntryMedia.entryId, ids))
        .orderBy(contentEntryMedia.sortOrder)
    : [];
  const traditionRows = ids.length ? await db.select().from(contentEntryTraditions).where(inArray(contentEntryTraditions.entryId, ids)) : [];

  return rows.map(row => ({
    ...row.entry,
    featuredMedia: row.featuredMedia,
    categories: categoryRows.filter(category => category.entryId === row.entry.id).map(category => category.name),
    attachments: attachmentRows.filter(attachment => attachment.entryId === row.entry.id).map(attachment => attachment.asset),
    traditions: traditionRows.filter(tradition => tradition.entryId === row.entry.id).map(tradition => tradition.tradition),
  }));
}

export async function listPublishedEntries() {
  const db = await requireDb();
  const rows = await db.select({ entry: contentEntries, featuredMedia: mediaAssets })
    .from(contentEntries)
    .leftJoin(mediaAssets, eq(contentEntries.featuredMediaId, mediaAssets.id))
    .where(eq(contentEntries.status, "published"))
    .orderBy(desc(contentEntries.publishedAt), desc(contentEntries.createdAt));
  return hydrateEntries(rows);
}

export async function getPublishedEntryBySlug(slug: string) {
  const db = await requireDb();
  const rows = await db.select({ entry: contentEntries, featuredMedia: mediaAssets })
    .from(contentEntries)
    .leftJoin(mediaAssets, eq(contentEntries.featuredMediaId, mediaAssets.id))
    .where(and(eq(contentEntries.slug, slug), eq(contentEntries.status, "published")))
    .limit(1);
  const hydrated = await hydrateEntries(rows);
  return hydrated[0] ?? null;
}

export async function listAdminEntries() {
  const db = await requireDb();
  const rows = await db.select({ entry: contentEntries, featuredMedia: mediaAssets })
    .from(contentEntries)
    .leftJoin(mediaAssets, eq(contentEntries.featuredMediaId, mediaAssets.id))
    .orderBy(desc(contentEntries.updatedAt));
  return hydrateEntries(rows);
}

export async function saveContentEntry({ id, values, categoryNames, attachmentMediaIds, traditions }: SaveContentInput) {
  const db = await requireDb();
  return db.transaction(async tx => {
    let entryId = id;
    if (entryId) {
      await tx.update(contentEntries).set(values).where(eq(contentEntries.id, entryId));
    } else {
      const inserted = await tx.insert(contentEntries).values(values).returning({ id: contentEntries.id });
      entryId = inserted[0]?.id;
    }
    if (!entryId) throw new Error("Content entry could not be saved");

    await tx.delete(contentEntryCategories).where(eq(contentEntryCategories.entryId, entryId));
    const uniqueNames = Array.from(new Set(categoryNames.map(name => name.trim()).filter(Boolean)));
    for (const name of uniqueNames) {
      const slug = categorySlug(name);
      if (!slug) continue;
      await tx.insert(contentCategories).values({ name, slug }).onConflictDoUpdate({ target: contentCategories.slug, set: { name } });
      const category = await tx.select({ id: contentCategories.id }).from(contentCategories).where(eq(contentCategories.slug, slug)).limit(1);
      if (category[0]) await tx.insert(contentEntryCategories).values({ entryId, categoryId: category[0].id });
    }
    await tx.delete(contentEntryMedia).where(eq(contentEntryMedia.entryId, entryId));
    const uniqueAttachments = Array.from(new Set(attachmentMediaIds));
    if (uniqueAttachments.length) {
      await tx.insert(contentEntryMedia).values(uniqueAttachments.map((mediaId, sortOrder) => ({ entryId, mediaId, sortOrder })));
    }
    await tx.delete(contentEntryTraditions).where(eq(contentEntryTraditions.entryId, entryId));
    const uniqueTraditions = Array.from(new Set(traditions));
    if (uniqueTraditions.length) await tx.insert(contentEntryTraditions).values(uniqueTraditions.map(tradition => ({ entryId, tradition })));
    return entryId;
  });
}

export async function setContentEntryStatus(id: number, status: "draft" | "published") {
  const db = await requireDb();
  await db.update(contentEntries).set({ status }).where(eq(contentEntries.id, id));
}

export async function deleteContentEntry(id: number) {
  const db = await requireDb();
  await db.delete(contentEntries).where(eq(contentEntries.id, id));
}
