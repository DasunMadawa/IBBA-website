import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, Response } from "express";
import { parse } from "cookie";
import { and, eq, gt, lt } from "drizzle-orm";
import { staffAdminAccounts, staffAdminSessions, users, type User } from "../drizzle/schema";
import { getDb } from "./db";

const scrypt = promisify(scryptCallback);
export const STAFF_SESSION_COOKIE = "ibaa_staff_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function requireDbValue<T>(value: T | null): T {
  if (!value) throw new Error("Database is unavailable");
  return value;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;
  const forwarded = req.headers["x-forwarded-proto"];
  const values = Array.isArray(forwarded) ? forwarded : forwarded?.split(",") ?? [];
  return values.some(value => value.trim().toLowerCase() === "https");
}

export function staffCookieOptions(req: Request) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "strict" as const,
    secure: isSecureRequest(req),
  };
}

export async function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPasswordHash(password: string, encoded: string) {
  const [algorithm, salt, storedHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !storedHex) return false;
  const stored = Buffer.from(storedHex, "hex");
  const derived = (await scrypt(password, salt, stored.length)) as Buffer;
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

export async function authenticateStaff(email: string, password: string) {
  const db = requireDbValue(await getDb());
  const rows = await db.select({ account: staffAdminAccounts, user: users })
    .from(staffAdminAccounts)
    .innerJoin(users, eq(staffAdminAccounts.userId, users.id))
    .where(and(eq(staffAdminAccounts.email, normalizeEmail(email)), eq(staffAdminAccounts.status, "active")))
    .limit(1);
  const record = rows[0];
  if (!record || !(await verifyPasswordHash(password, record.account.passwordHash))) return null;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await db.delete(staffAdminSessions).where(lt(staffAdminSessions.expiresAt, Date.now()));
  await db.insert(staffAdminSessions).values({ accountId: record.account.id, tokenHash: hashSessionToken(token), expiresAt });
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, record.user.id));
  return { token, user: record.user };
}

export function readStaffToken(req: Request) {
  return parse(req.headers.cookie ?? "")[STAFF_SESSION_COOKIE] ?? null;
}

export async function getStaffUserFromRequest(req: Request): Promise<User | null> {
  const token = readStaffToken(req);
  if (!token) return null;
  const db = requireDbValue(await getDb());
  const rows = await db.select({ session: staffAdminSessions, account: staffAdminAccounts, user: users })
    .from(staffAdminSessions)
    .innerJoin(staffAdminAccounts, eq(staffAdminSessions.accountId, staffAdminAccounts.id))
    .innerJoin(users, eq(staffAdminAccounts.userId, users.id))
    .where(and(
      eq(staffAdminSessions.tokenHash, hashSessionToken(token)),
      gt(staffAdminSessions.expiresAt, Date.now()),
      eq(staffAdminAccounts.status, "active"),
      eq(users.role, "admin"),
    ))
    .limit(1);
  const record = rows[0];
  if (!record) return null;
  return record.user;
}

export async function revokeStaffSession(req: Request) {
  const token = readStaffToken(req);
  if (!token) return;
  const db = requireDbValue(await getDb());
  await db.delete(staffAdminSessions).where(eq(staffAdminSessions.tokenHash, hashSessionToken(token)));
}

export function setStaffSessionCookie(res: Response, req: Request, token: string) {
  res.cookie(STAFF_SESSION_COOKIE, token, { ...staffCookieOptions(req), maxAge: SESSION_TTL_MS });
}

export function clearStaffSessionCookie(res: Response, req: Request) {
  res.clearCookie(STAFF_SESSION_COOKIE, staffCookieOptions(req));
}

export async function updateStaffAccount(userId: number, input: { currentPassword: string; email: string; displayName: string; newPassword?: string }) {
  const db = requireDbValue(await getDb());
  const rows = await db.select().from(staffAdminAccounts).where(eq(staffAdminAccounts.userId, userId)).limit(1);
  const account = rows[0];
  if (!account || !(await verifyPasswordHash(input.currentPassword, account.passwordHash))) return false;
  const passwordHash = input.newPassword ? await createPasswordHash(input.newPassword) : account.passwordHash;
  await db.transaction(async tx => {
    await tx.update(staffAdminAccounts).set({ email: normalizeEmail(input.email), displayName: input.displayName.trim(), passwordHash }).where(eq(staffAdminAccounts.id, account.id));
    await tx.update(users).set({ email: normalizeEmail(input.email), name: input.displayName.trim() }).where(eq(users.id, userId));
    await tx.delete(staffAdminSessions).where(eq(staffAdminSessions.accountId, account.id));
  });
  return true;
}
