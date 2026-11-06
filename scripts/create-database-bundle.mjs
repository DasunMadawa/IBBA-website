import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prepareMysqlMigrationSql } from "./mysql-migration-sql.mjs";

const root = process.cwd();
const files = (await readdir(path.join(root, "drizzle"))).filter(name => /^\d{4}_.+\.sql$/.test(name)).sort();
const lines = [
  "-- IBAA database fresh installation: select a NEW EMPTY utf8mb4 MySQL database first.",
  "-- Do not import into WordPress or an existing live IBAA database. Do not import this schema twice.",
  "-- No staff passwords/accounts, sessions, private inquiries or drafts are included.",
  "-- MySQL DDL auto-commits. The CLI migration runner is preferred for tracked repeatable installs.",
  "SET NAMES utf8mb4;",
  "CREATE TABLE IF NOT EXISTS ibaa_staging_migrations (filename VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);",
];
for (const file of files) {
  lines.push(`\n-- ${file}`, prepareMysqlMigrationSql(await readFile(path.join(root, "drizzle", file), "utf8")), `\nINSERT INTO ibaa_staging_migrations (filename) VALUES ('${file}');`);
}
lines.push("\n-- Published approved public content seed", await readFile(path.join(root, "deployment/seed-current-public-content.sql"), "utf8"));
await mkdir(path.join(root, "database"), { recursive: true });
await writeFile(path.join(root, "database/IBAA-database-fresh-install.sql"), lines.join("\n") + "\n");
console.log(`Created database/IBAA-database-fresh-install.sql (${files.length} migrations plus public seed).`);
