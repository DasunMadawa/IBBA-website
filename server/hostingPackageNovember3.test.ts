import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
describe("November 3 current Hosting.com handoff", () => {
  it("normalizes generated SQL for MySQL while retaining full legacy URL storage", () => {
    const script = `import { prepareMysqlMigrationSql } from './scripts/mysql-migration-sql.mjs'; console.log(prepareMysqlMigrationSql('CREATE TABLE x (legacyPath varchar(1024), CONSTRAINT \u0060legacy_routes_legacyPath_unique\u0060 UNIQUE(\u0060legacyPath\u0060));--> statement-breakpoint'));`;
    const normalized = execFileSync(process.execPath, ["--input-type=module", "-e", script], { cwd: root, encoding: "utf8" });
    expect(normalized).not.toContain("--> statement-breakpoint");
    expect(normalized).toContain("varchar(1024)");
    expect(normalized).toContain("UNIQUE(`legacyPath`(768))");
  });
  it("contains all nine migration files and only approved public records in its seed", () => {
    expect(readdirSync(path.join(root, "drizzle")).filter(name => /^\d{4}_.+\.sql$/.test(name))).toHaveLength(9);
    const counts = JSON.parse(readFileSync(path.join(root, "deployment/PUBLIC-SEED-COUNTS.json"), "utf8"));
    expect(counts.counts.members).toBe(27);
    const sql = readFileSync(path.join(root, "deployment/seed-current-public-content.sql"), "utf8");
    expect(sql).toContain("`temple_directory_entries`");
    expect(sql).toContain("`meeting_minutes`");
    expect(sql).toContain("`event_entries`");
    expect(sql).not.toMatch(/INSERT\s+(?:IGNORE\s+)?INTO\s+`?(?:staff_admin_accounts|staff_admin_sessions|contact_inquiries)`?/i);
    expect(sql).not.toMatch(/'draft'/);
  });
  it("uses an ESM-compatible Passenger wrapper and supports local legacy upload assets", () => {
    expect(readFileSync(path.join(root, "startup.cjs"), "utf8")).toContain('import("./dist/index.js")');
    expect(readFileSync(path.join(root, "scripts/install-starter-assets.mjs"), "utf8")).toContain("dist/public/wp-content/uploads");
    expect(readFileSync(path.join(root, "scripts/create-hosting-package.mjs"), "utf8")).not.toContain("await rm(deliveryRoot");
  });
});
