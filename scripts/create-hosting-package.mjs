import { createHash } from "node:crypto";
import { access, cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { preparePortableMedia } from "./prepare-portable-media.mjs";

const sourceRoot = process.cwd();
const deliveryRoot = path.resolve("/home/ubuntu/ibaa-delivery");
const packageName = process.env.IBAA_PACKAGE_NAME || "IBAA-Website-Hosting.com-2026-11-03";
const destination = path.join(deliveryRoot, packageName);
const externalAssets = path.resolve(process.env.IBAA_PACKAGE_ASSETS_DIR || "/home/ubuntu/ibaa-deployment-assets");
const excludedSegments = new Set([".git", ".manus-logs", "node_modules", "dist", "research"]);
const excludedFiles = new Set([".project-config.json", "vite.config.ts.bak"]);
const allowedResearchFixtures = new Set([
  "research/official-content/2026-08-22-dhammakaya-meeting.json",
  "research/assets/provenance.md",
  "research/status-before-august-meeting-update.md",
]);

function includePath(sourcePath) {
  const relative = path.relative(sourceRoot, sourcePath);
  if (!relative) return true;
  const normalized = relative.replaceAll(path.sep, "/");
  if (normalized === "research" || normalized === "research/official-content" || normalized === "research/assets") return true;
  if (allowedResearchFixtures.has(normalized)) return true;
  const segments = relative.split(path.sep);
  if (segments.some(segment => excludedSegments.has(segment))) return false;
  if (excludedFiles.has(relative)) return false;
  const name = path.basename(relative).toLowerCase();
  if (name === ".env" || name.startsWith(".env.")) return false;
  if (name.includes("credential") || name.endsWith(".pem") || name.endsWith(".key")) return false;
  return true;
}

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else if (entry.isFile()) output.push(absolute);
  }
  return output;
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(sourceRoot, destination, { recursive: true, force: true, filter: includePath });
try {
  await access(path.join(externalAssets, "manus-storage"));
} catch {
  throw new Error(`Hosting package assets are missing from ${externalAssets}`);
}
await cp(externalAssets, path.join(destination, "deployment-assets"), { recursive: true, force: true });
await preparePortableMedia(destination);

const checksumPath = path.join(destination, "PACKAGE-CHECKSUMS.sha256");
const manifestPath = path.join(destination, "PACKAGE-MANIFEST.md");
const files = (await walk(destination)).filter(file => file !== checksumPath && file !== manifestPath).sort();
let totalBytes = 0;
const checksums = [];
for (const file of files) {
  const data = await readFile(file);
  totalBytes += data.length;
  const digest = createHash("sha256").update(data).digest("hex");
  checksums.push(`${digest}  ${path.relative(destination, file).replaceAll(path.sep, "/")}`);
}
await writeFile(checksumPath, checksums.join("\n") + "\n", "utf8");

const assetFiles = await walk(path.join(destination, "deployment-assets", "manus-storage"));
const legacyAssetFiles = await walk(path.join(destination, "deployment-assets", "legacy-uploads"));
const migrationFiles = (await readdir(path.join(destination, "drizzle"))).filter(name => /^\d{4}_.+\.sql$/.test(name)).sort();
const manifest = `# IBAA Hosting.com Staging Package Manifest

| Item | Value |
| --- | ---: |
| Package files | ${files.length + 2} |
| Uncompressed bytes | ${totalBytes.toLocaleString("en-US")} |
| Database migrations | ${migrationFiles.length} |
| Starter images/documents | ${assetFiles.length} |
| Preserved original legacy uploads | ${legacyAssetFiles.length} |

This source package intentionally excludes Git history, installed dependencies, build output, runtime logs, Manus project metadata, research captures, dotenv files, private keys, and credential files. It includes placeholders only in \`deployment/ENVIRONMENT-VARIABLES.template\`.

This is the approved current React/Express Node.js website, not a WordPress conversion. All source, current public database seed, migrations, corrected forms and available original media are included. Historical resized-image copies are not duplicated; package-only media URLs use the matching bundled originals. See \`deployment/PORTABLE-MEDIA-REPORT.json\` for any remaining old-site media dependencies and \`deployment-assets/ASSET-INVENTORY.json\` for measured coverage. Third-party article/app/video links remain external. No hosting or domain changes were performed.

Verify every packaged file after extraction with:

\`\`\`bash
sha256sum -c PACKAGE-CHECKSUMS.sha256
\`\`\`

The definitive beginner instructions are in \`HOSTING-COM-STAGING-GUIDE.md\`; database instructions are in \`deployment/DATABASE-SETUP.md\`. The single phpMyAdmin fresh-install SQL is \`database/IBAA-database-fresh-install.sql\`.
`;
await writeFile(manifestPath, manifest, "utf8");
console.log(`Created ${destination}`);
console.log(`Files: ${files.length + 2}; migrations: ${migrationFiles.length}; starter assets: ${assetFiles.length}`);
