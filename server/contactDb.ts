import { desc, eq } from "drizzle-orm";
import { contactInquiries, type InsertContactInquiry } from "../drizzle/schema";
import { getDb } from "./db";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function createContactInquiry(values: InsertContactInquiry) {
  const db = await requireDb();
  const inserted = await db.insert(contactInquiries).values(values).returning({ id: contactInquiries.id });
  return inserted[0]?.id;
}

export async function listContactInquiries() {
  const db = await requireDb();
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.submittedAt), desc(contactInquiries.id));
}

export async function setContactInquiryStatus(id: number, status: "new" | "read" | "archived") {
  const db = await requireDb();
  await db.update(contactInquiries).set({ status }).where(eq(contactInquiries.id, id));
}
