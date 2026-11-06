import "dotenv/config";
import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const scrypt = promisify(scryptCallback);
const [displayName, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();
if (!process.env.DATABASE_URL || !displayName?.trim() || !email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error('Usage: pnpm staff:create -- "Display Name" "person@example.org"');
  console.error("DATABASE_URL must be configured before running this command.");
  process.exit(1);
}

const password = `${randomBytes(18).toString("base64url")}!Aa9`;
const salt = randomBytes(16).toString("hex");
const derived = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt}$${derived.toString("hex")}`;
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const existing = await client.query('SELECT id FROM staff_admin_accounts WHERE email = $1 LIMIT 1', [email]);
  if (existing.rows.length) throw new Error(`A staff account already exists for ${email}`);
  await client.query("BEGIN");
  const userResult = await client.query(
    `INSERT INTO users ("openId", name, email, "loginMethod", role, "createdAt", "updatedAt", "lastSignedIn") VALUES ($1, $2, $3, 'staff', 'admin', NOW(), NOW(), NOW()) RETURNING id`,
    [`staff:${randomUUID()}`, displayName.trim(), email],
  );
  await client.query(
    `INSERT INTO staff_admin_accounts ("userId", email, "displayName", "passwordHash", status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())`,
    [userResult.rows[0].id, email, displayName.trim(), passwordHash],
  );
  await client.query("COMMIT");
  console.log("Staff account created. Save this temporary password securely; it will not be shown again.");
  console.log(`Email: ${email}`);
  console.log(`Temporary password: ${password}`);
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end();
}
