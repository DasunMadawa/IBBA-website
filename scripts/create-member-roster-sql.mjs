import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const source = JSON.parse(await readFile(new URL("../shared/ibaaMembers.json", import.meta.url), "utf8"));
const value = input => input === null || input === undefined ? "NULL" : `'${String(input).replaceAll("\\", "\\\\").replaceAll("'", "''")}'`;
const slug = name => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const columns = ["slug", "name", "status", "verificationStatus", "tradition", "description", "addressLine1", "city", "stateRegion", "postalCode", "websiteUrl"];
const rows = source.organizations.map(member => [slug(member.name), member.name, "published", "verified", "", "", member.street || null, member.city, member.state, member.postalCode || null, member.website || null]);
const sql = [
  "-- Real membership roster supplied by IBAA on October 26, 2026. Individual members are separately displayed, not stored as temples.",
  "START TRANSACTION;",
  "SET @roster_owner = (SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1);",
  `INSERT INTO temple_directory_entries (${columns.map(key => `\`${key}\``).join(", ")}, country, verifiedAt, verifiedBy, publishedAt, createdBy) VALUES`,
  rows.map(row => `(${row.map(value).join(", ")}, 'United States', UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3)) * 1000, @roster_owner, UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3)) * 1000, @roster_owner)`).join(",\n"),
  `ON DUPLICATE KEY UPDATE ${columns.filter(key => key !== "slug").map(key => `\`${key}\` = VALUES(\`${key}\`)`).join(", ")}, verifiedAt = VALUES(verifiedAt), verifiedBy = VALUES(verifiedBy), publishedAt = VALUES(publishedAt);`,
  "COMMIT;",
  "",
].join("\n");
const destination = path.resolve(process.argv[2] || "/home/ubuntu/ibaa-members-oct26.sql");
await writeFile(destination, sql);
console.log(`Generated ${source.organizations.length} organizations and ${source.individuals.length} separate individuals; ${source.organizations.filter(member => member.website).length} supplied website links.`);
console.log(destination);
