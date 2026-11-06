import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required, e.g. postgres://user:password@127.0.0.1:5432/ibaa");
  process.exit(1);
}

const seedPath = path.resolve("deployment/seed-current-public-content.pg.sql");
const sql = await readFile(seedPath, "utf8");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query(sql);
  console.log("Current published public content seed applied (members, media, news, meetings, events and related records).");
} finally {
  await client.end();
}
