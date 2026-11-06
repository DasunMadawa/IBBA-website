import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function preparePortableMedia(packageRoot) {
  const mapFile = path.join(packageRoot, "deployment-assets/portable-media-url-map.json");
  const mapping = JSON.parse(await readFile(mapFile, "utf8"));
  const files = [];
  async function walk(root) {
    for (const entry of await readdir(root, { withFileTypes: true })) {
      const file = path.join(root, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.(tsx?|json|html)$/.test(entry.name)) files.push(file);
    }
  }
  await walk(path.join(packageRoot, "client"));
  await walk(path.join(packageRoot, "shared"));
  const changed = [];
  const unresolved = new Set();
  const oldMedia = /https?:\/\/(?:www\.)?ibaa\.org\/wp-content\/uploads\/[^\s"'<>\\)\]“”‘’]+/g;
  for (const file of files) {
    const original = await readFile(file, "utf8");
    let replacements = 0;
    const revised = original.replace(oldMedia, url => {
      const key = url.replace(/^http:/, "https:").replace(/^https:\/\/ibaa\.org\//, "https://www.ibaa.org/");
      const local = mapping[url] || mapping[key];
      if (!local) { unresolved.add(url); return url; }
      replacements++;
      return local;
    });
    if (revised !== original) {
      await writeFile(file, revised);
      changed.push({ file: path.relative(packageRoot, file), replacements });
    }
  }
  const report = { changed, unresolvedOldMediaUrls: [...unresolved].sort(), note: "Only package media URL substrings changed. Text, dates, names, public sources and original staged source remain unchanged. Known resized images reference the identical bundled original photograph; third-party links remain external." };
  await writeFile(path.join(packageRoot, "deployment/PORTABLE-MEDIA-REPORT.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(`Package portable media: ${changed.length} files updated; ${unresolved.size} original-site media URLs remain external.`);
}
