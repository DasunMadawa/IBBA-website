import { access, cp, mkdir } from "node:fs/promises";
import path from "node:path";

const sources = [
  { from: path.resolve(process.env.IBAA_STARTER_ASSETS_DIR || "deployment-assets/manus-storage"), to: path.resolve("dist/public/manus-storage"), label: "Current images/documents" },
  { from: path.resolve("deployment-assets/legacy-uploads"), to: path.resolve("dist/public/wp-content/uploads"), label: "Preserved original legacy uploads" },
];
for (const source of sources) {
  try {
    await access(source.from);
  } catch {
    console.log(`${source.label}: no local bundle found; copy skipped.`);
    continue;
  }
  await mkdir(source.to, { recursive: true });
  await cp(source.from, source.to, { recursive: true, force: true });
  console.log(`${source.label} installed from ${source.from}`);
}
