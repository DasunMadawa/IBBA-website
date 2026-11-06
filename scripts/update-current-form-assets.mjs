import "dotenv/config";
import { readFile } from "node:fs/promises";

if (!process.argv.includes("--apply")) {
  console.log("Address-only correction of two existing public form assets. Original PDFs are backed up outside the project. Run with --apply to publish the validated corrected bytes to their stable legacy keys.");
  process.exit(0);
}
const base = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, "");
const token = process.env.BUILT_IN_FORGE_API_KEY;
if (!base || !token) throw new Error("Managed storage credentials are required.");

const forms = [
  { key: "ibaa-application-form_0bbb5887.pdf", file: "/home/ubuntu/webdev-static-assets/ibaa/oct27/ibaa-membership-application-clinton-2026-10-27.pdf", backup: "/home/ubuntu/webdev-static-assets/ibaa/oct27/original-ibaa-application-form_0bbb5887.pdf" },
  { key: "ibaa-donation-form_c3028c7b.pdf", file: "/home/ubuntu/webdev-static-assets/ibaa/oct27/ibaa-donation-form-clinton-2026-10-27.pdf", backup: "/home/ubuntu/webdev-static-assets/ibaa/oct27/original-ibaa-donation-form_c3028c7b.pdf" },
];
for (const form of forms) {
  const backup = await readFile(form.backup);
  const bytes = await readFile(form.file);
  if (!backup.subarray(0, 4).equals(Buffer.from("%PDF")) || !bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) throw new Error(`Invalid PDF or missing original backup: ${form.key}`);
  const endpoint = new URL("v1/storage/presign/put", base + "/");
  endpoint.searchParams.set("path", form.key);
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Storage presign failed: ${response.status}`);
  const { url } = await response.json();
  if (!url) throw new Error("Storage presign returned no URL.");
  const uploaded = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/pdf" }, body: new Blob([bytes], { type: "application/pdf" }) });
  if (!uploaded.ok) throw new Error(`Storage update failed: ${uploaded.status}`);
  console.log(`Corrected stable public form key: ${form.key} (${bytes.length} bytes); original backup retained.`);
}
