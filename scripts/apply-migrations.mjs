import { readdir } from "node:fs/promises";
import path from "node:path";

const migrationsFolder = path.resolve(process.cwd(), "drizzle-pg");
const files = (await readdir(migrationsFolder)).filter(file => /^\d{4}_.+\.sql$/.test(file)).sort();
if (!files.length) throw new Error("No migration SQL files were found in drizzle-pg/. Run `pnpm db:generate` first.");
if (process.argv.includes("--dry-run")) {
  console.log(files.join("\n"));
  console.log(`Migration dry run passed: ${files.length} ordered SQL files found.`);
  process.exit(0);
}
await import("dotenv/config");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required, e.g. postgres://user:password@127.0.0.1:5432/ibaa");
  process.exit(1);
}

const { default: pg } = await import("pg");
const { drizzle } = await import("drizzle-orm/node-postgres");
const { migrate } = await import("drizzle-orm/node-postgres/migrator");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await migrate(drizzle(pool), { migrationsFolder });
  console.log(`Database ready: ${files.length} migration files accounted for.`);
} finally {
  await pool.end();
}
