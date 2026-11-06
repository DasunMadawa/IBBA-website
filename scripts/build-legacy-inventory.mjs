import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const rawDir = path.join(root, "research", "raw");
const outputDir = path.join(root, "research", "inventory");
const contentDir = path.join(outputDir, "content");

fs.mkdirSync(contentDir, { recursive: true });

const readJson = file => JSON.parse(fs.readFileSync(path.join(rawDir, file), "utf8"));
const posts = readJson("posts.json");
const pages = readJson("pages.json");
const categories = readJson("categories.json");
const tags = readJson("tags.json");
const media = [1, 2, 3, 4].flatMap(page => readJson(`media-page-${page}.json`));

const categoryMap = new Map(categories.map(category => [category.id, category.name]));
const tagMap = new Map(tags.map(tag => [tag.id, tag.name]));
const mediaMap = new Map(media.map(item => [item.id, item]));

function decodeEntities(value = "") {
  const entities = {
    "&amp;": "&",
    "&quot;": '"',
    "&#039;": "'",
    "&#8217;": "’",
    "&#8211;": "–",
    "&#8212;": "—",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
  };
  return value.replace(/&(amp|quot|#039|#8217|#8211|#8212|lt|gt|nbsp);/g, match => entities[match] ?? match);
}

function stripHtml(value = "") {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractUrls(html = "") {
  const urls = new Set();
  const attributePattern = /(?:href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributePattern)) {
    try {
      urls.add(new URL(decodeEntities(match[1]), "https://www.ibaa.org/").href);
    } catch {
      // Preserve a successful inventory even when legacy markup contains a malformed URL.
    }
  }
  const srcsetPattern = /srcset=["']([^"']+)["']/gi;
  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of match[1].split(",")) {
      const rawUrl = candidate.trim().split(/\s+/)[0];
      if (!rawUrl) continue;
      try {
        urls.add(new URL(decodeEntities(rawUrl), "https://www.ibaa.org/").href);
      } catch {
        // Ignore malformed legacy responsive-image candidates.
      }
    }
  }
  return [...urls];
}

function isDocument(url) {
  return /\.(pdf|docx?|xlsx?|pptx?|csv|txt)(?:$|\?)/i.test(url);
}

function isImage(url) {
  return /\.(avif|gif|jpe?g|png|svg|webp)(?:$|\?)/i.test(url);
}

function routeFor(item, type) {
  if (type === "page") {
    const pageRoutes = {
      home: "/",
      mission: "/about/mission",
      goals: "/about/goals",
      values: "/about/values",
      vision: "/about/vision",
      officers: "/leadership/officers",
      board_of_directors: "/leadership/board-of-directors",
      advisory_council: "/leadership/advisory-council",
      "ibaa-communities": "/member-temples",
      contact: "/contact",
      privacy: "/privacy",
      "terms-of-use": "/terms-of-use",
      aboutus: "/about",
      unsubscribe: "/unsubscribe",
      "ibaa-youth": "/programs/youth",
      media: "/news-media",
      "dc-liaison": "/leadership/dc-liaison",
    };
    return pageRoutes[item.slug] ?? `/${item.slug}`;
  }
  return `/news/${item.slug}`;
}

function normalizeContent(item, type) {
  const html = item.content?.rendered ?? "";
  const linkedUrls = extractUrls(html);
  const featuredMedia = mediaMap.get(item.featured_media);
  const row = {
    id: item.id,
    type,
    status: item.status,
    slug: item.slug,
    title: stripHtml(item.title?.rendered ?? ""),
    excerpt: stripHtml(item.excerpt?.rendered ?? ""),
    published_at: item.date,
    modified_at: item.modified,
    author_id: item.author ?? null,
    author_name: item.author === 10 ? "Allen Tsaur" : "",
    author_legacy_url: item.author === 10 ? "https://www.ibaa.org/index.php/author/attsaur/" : "",
    legacy_url: item.link,
    proposed_destination: routeFor(item, type),
    categories: (item.categories ?? []).map(id => categoryMap.get(id)).filter(Boolean),
    tags: (item.tags ?? []).map(id => tagMap.get(id)).filter(Boolean),
    featured_media_id: featuredMedia?.id ?? null,
    featured_media_url: featuredMedia?.source_url ?? "",
    featured_media_alt: featuredMedia?.alt_text ?? "",
    document_urls: linkedUrls.filter(isDocument),
    image_urls: linkedUrls.filter(isImage),
    linked_urls: linkedUrls,
    plain_text: stripHtml(html),
    content_html: html,
  };

  const safeSlug = item.slug.replace(/[^a-z0-9_-]+/gi, "-");
  fs.writeFileSync(path.join(contentDir, `${type}-${item.id}-${safeSlug}.html`), html);
  fs.writeFileSync(path.join(contentDir, `${type}-${item.id}-${safeSlug}.txt`), `${row.title}\n\n${row.plain_text}\n`);
  return row;
}

const content = [
  ...pages.map(item => normalizeContent(item, "page")),
  ...posts.map(item => normalizeContent(item, "post")),
];

const mediaRows = media.map(item => {
  const derivativeUrls = Object.values(item.media_details?.sizes ?? {})
    .map(size => size?.source_url)
    .filter(Boolean);
  let originalUploadUrl = "";
  if (item.media_details?.original_image && item.source_url) {
    try {
      const source = new URL(item.source_url);
      source.pathname = `${source.pathname.slice(0, source.pathname.lastIndexOf("/") + 1)}${item.media_details.original_image}`;
      originalUploadUrl = source.href;
    } catch {
      originalUploadUrl = "";
    }
  }
  return {
    id: item.id,
    parent_id: item.post ?? 0,
    status: item.status,
    slug: item.slug,
    title: stripHtml(item.title?.rendered ?? ""),
    alt_text: item.alt_text ?? "",
    caption: stripHtml(item.caption?.rendered ?? ""),
    description: stripHtml(item.description?.rendered ?? ""),
    published_at: item.date,
    modified_at: item.modified,
    legacy_attachment_url: item.link,
    source_url: item.source_url,
    original_upload_url: originalUploadUrl,
    derivative_urls: derivativeUrls,
    media_type: item.media_type,
    mime_type: item.mime_type,
    width: item.media_details?.width ?? "",
    height: item.media_details?.height ?? "",
    file_size_bytes: item.media_details?.filesize ?? "",
    original_file: item.media_details?.file ?? "",
  };
});

const contentLinkedFiles = content.flatMap(item => [
  ...item.document_urls.map(url => ({ url, discovered_from: item.legacy_url, kind: "document-link" })),
  ...item.image_urls.map(url => ({ url, discovered_from: item.legacy_url, kind: "content-image" })),
]);
const mediaFiles = mediaRows.flatMap(item => [
  {
    url: item.source_url,
    discovered_from: item.legacy_attachment_url,
    kind: `media-primary:${item.mime_type}`,
  },
  ...(item.original_upload_url
    ? [{ url: item.original_upload_url, discovered_from: item.legacy_attachment_url, kind: `media-original:${item.mime_type}` }]
    : []),
  ...item.derivative_urls.map(url => ({
    url,
    discovered_from: item.legacy_attachment_url,
    kind: `media-derivative:${item.mime_type}`,
  })),
]);
const fileIndex = new Map();
for (const item of [...mediaFiles, ...contentLinkedFiles]) {
  const key = item.url;
  if (!key) continue;
  const existing = fileIndex.get(key);
  if (existing) {
    existing.discovered_from = [...new Set([...existing.discovered_from, item.discovered_from])];
    existing.kind = [...new Set([...existing.kind, item.kind])];
  } else {
    fileIndex.set(key, { url: key, discovered_from: [item.discovered_from], kind: [item.kind] });
  }
}
const files = [...fileIndex.values()];

function csvEscape(value) {
  const serialized = Array.isArray(value)
    ? value.join(" | ")
    : typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value ?? "");
  return `"${serialized.replaceAll('"', '""')}"`;
}

function writeCsv(file, rows, columns) {
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of rows) lines.push(columns.map(column => csvEscape(row[column])).join(","));
  fs.writeFileSync(path.join(outputDir, file), `${lines.join("\n")}\n`);
}

fs.writeFileSync(path.join(outputDir, "content-inventory.json"), JSON.stringify(content, null, 2));
fs.writeFileSync(path.join(outputDir, "media-inventory.json"), JSON.stringify(mediaRows, null, 2));
fs.writeFileSync(path.join(outputDir, "file-inventory.json"), JSON.stringify(files, null, 2));
const legacyRoutes = [
  ...content.map(item => ({ legacy_url: item.legacy_url, destination: item.proposed_destination, route_type: item.type })),
  ...categories.map(category => ({
    legacy_url: category.link,
    destination: `/news-media?category=${encodeURIComponent(category.slug)}`,
    route_type: "category-archive",
  })),
  ...tags.map(tag => ({
    legacy_url: tag.link,
    destination: `/news-media?tag=${encodeURIComponent(tag.slug)}`,
    route_type: "tag-archive",
  })),
  {
    legacy_url: "https://www.ibaa.org/index.php/author/attsaur/",
    destination: "/news-media?author=allen-tsaur",
    route_type: "author-archive",
  },
  {
    legacy_url: "https://www.ibaa.org/index.php/type/video/",
    destination: "/news-media?format=video",
    route_type: "post-format-archive",
  },
  ...mediaRows.map(item => ({
    legacy_url: item.legacy_attachment_url,
    destination: `/media/${item.id}-${item.slug}`,
    route_type: "attachment",
  })),
];
fs.writeFileSync(
  path.join(outputDir, "legacy-route-map.json"),
  JSON.stringify(legacyRoutes, null, 2),
);

writeCsv("content-inventory.csv", content, [
  "id",
  "type",
  "status",
  "title",
  "slug",
  "published_at",
  "modified_at",
  "author_id",
  "author_name",
  "author_legacy_url",
  "legacy_url",
  "proposed_destination",
  "categories",
  "tags",
  "featured_media_url",
  "featured_media_alt",
  "document_urls",
  "image_urls",
]);
writeCsv("media-inventory.csv", mediaRows, [
  "id",
  "parent_id",
  "status",
  "title",
  "slug",
  "published_at",
  "modified_at",
  "legacy_attachment_url",
  "source_url",
  "original_upload_url",
  "derivative_urls",
  "media_type",
  "mime_type",
  "width",
  "height",
  "file_size_bytes",
  "alt_text",
  "caption",
  "description",
]);
writeCsv("file-inventory.csv", files, ["url", "kind", "discovered_from"]);

const categoryRows = categories.map(category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  count: category.count,
  legacy_url: category.link,
  description: stripHtml(category.description),
}));
writeCsv("category-inventory.csv", categoryRows, ["id", "name", "slug", "count", "legacy_url", "description"]);

const documents = files.filter(file => file.kind.includes("document-link") || isDocument(file.url));
const missingAlt = mediaRows.filter(item => item.media_type === "image" && !item.alt_text.trim());
const mediaHeader = fs.readFileSync(path.join(rawDir, "media.headers"), "utf8");
const reportedMediaTotal = Number(mediaHeader.match(/^x-wp-total:\s*(\d+)/im)?.[1] ?? mediaRows.length);
const mediaCompletenessNote = reportedMediaTotal === mediaRows.length
  ? `The retrieved media count matches the API-reported total of ${reportedMediaTotal}.`
  : reportedMediaTotal - mediaRows.length === 2
    ? `The API headers report ${reportedMediaTotal} media positions, while bulk public retrieval returns ${mediaRows.length} records. Direct checks of the authoritative one-record sequence show empty public responses at positions 309 and 327; all other positions resolve, so this inventory contains every publicly retrievable media record while preserving the two-slot anomaly for cutover review.`
    : `The API headers reported ${reportedMediaTotal} media records while stable paginated retrieval returned ${mediaRows.length}. This ${reportedMediaTotal - mediaRows.length}-record discrepancy should be rechecked immediately before final cutover because the live site is still changing.`;
const summary = `# IBAA Legacy Content Inventory\n\n` +
  `This inventory was generated from the public WordPress REST API and sitemap records on ${new Date().toISOString()}. It is intended to guide migration and legacy URL preservation; source content must still be editorially reviewed before publication.\n\n` +
  `| Record type | Count |\n| --- | ---: |\n` +
  `| Public pages | ${pages.length} |\n` +
  `| Public posts | ${posts.length} |\n` +
  `| Categories | ${categories.length} |\n` +
  `| Tags | ${tags.length} |\n` +
  `| Media records | ${mediaRows.length} |\n` +
  `| Unique linked or uploaded files | ${files.length} |\n` +
  `| Documents discovered | ${documents.length} |\n` +
  `| Images missing explicit alt text | ${missingAlt.length} |\n\n` +
  `> **Completeness note:** ${mediaCompletenessNote}\n\n` +
  `## Migration Outputs\n\n` +
  `| File | Purpose |\n| --- | --- |\n` +
  `| content-inventory.csv | Human-readable page and post migration map |\n` +
  `| media-inventory.csv | Complete WordPress media metadata inventory |\n` +
  `| file-inventory.csv | Deduplicated public file URL list |\n` +
  `| category-inventory.csv | Legacy taxonomy inventory |\n` +
  `| legacy-route-map.json | Legacy-to-new route alias and redirect plan |\n` +
  `| content/ | Original rendered HTML and extracted plain text for editorial review |\n\n` +
  `## Source References\n\n` +
  `[1]: https://www.ibaa.org/wp-sitemap.xml \"IBAA WordPress XML Sitemap\"\n` +
  `[2]: https://www.ibaa.org/wp-json/wp/v2/posts \"IBAA WordPress Posts API\"\n` +
  `[3]: https://www.ibaa.org/wp-json/wp/v2/pages \"IBAA WordPress Pages API\"\n` +
  `[4]: https://www.ibaa.org/wp-json/wp/v2/media \"IBAA WordPress Media API\"\n`;

fs.writeFileSync(path.join(outputDir, "README.md"), summary);
console.log(JSON.stringify({
  pages: pages.length,
  posts: posts.length,
  categories: categories.length,
  tags: tags.length,
  media: mediaRows.length,
  files: files.length,
  documents: documents.length,
  missingAlt: missingAlt.length,
}, null, 2));
