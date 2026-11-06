# Final Migration Inventory and Handoff

**Prepared by:** Manus AI  
**Snapshot date:** August 25, 2026

The legacy IBAA website has been inventoried and represented in the rebuilt application through public routes, a verified archive layer, permanent redirects, and an asset disposition record. The source inventory is reproducible from the saved WordPress API records and generator scripts rather than a manually maintained spreadsheet alone.

## Migration Totals

| Legacy record class | Count | Rebuilt treatment |
| --- | ---: | --- |
| Public pages | 17 | Integrated into the new information architecture or preserved as legacy information pages |
| Public posts | 29 | Searchable News & Media archive with original date, author, categories, body, media, documents, and source context |
| Public media records | 338 | Attachment archive with original metadata and source destination |
| Categories | 6 | Query-aware News & Media archive destinations |
| Tags | 2 | Query-aware News & Media archive destinations |
| Public author archives | 1 | Filtered News & Media archive destination |
| Permanent legacy redirects | 393 | Server-side HTTP 301 mappings before the application fallback |
| Unique linked or uploaded file URLs | 7,044 | Complete audit list; selected high-value files migrated, remainder preserved by reference |

The source API reported 340 media positions but returned 338 public records. The two empty positions are documented in `research/inventory/api-anomalies.md`; no synthetic records were created.

## Inventory Files

| File | Purpose |
| --- | --- |
| `research/inventory/content-inventory.csv` | Page and post migration table with source and destination URLs |
| `research/inventory/media-inventory.csv` | Public media record inventory |
| `research/inventory/file-inventory.csv` | Unique file and derivative URL inventory |
| `research/inventory/legacy-route-map.json` | Machine-readable redirect and destination map |
| `research/inventory/category-inventory.csv` | Category taxonomy inventory |
| `research/inventory/tag-inventory.csv` | Tag taxonomy inventory |
| `research/inventory/author-inventory.csv` | Public author attribution and archive inventory |
| `research/inventory/api-anomalies.md` | Source API completeness exception record |

## Content Preservation Rules

Migrated records keep their original publication date, author attribution when exposed publicly, category and tag context, featured-media relationship, downloadable-document links, and legacy source URL. Original captions and descriptions are rendered when present. When the old library lacks verified caption or alternative text, the archive identifies the metadata gap rather than inventing a description.

Legacy prose remains a historical record and is not silently modernized. New explanatory copy appears separately through editorial and source-context panels. Organizational claims that require current IBAA authority—leadership, formal membership, contact details, community-preferred labels, and current program cadence—remain clearly marked for confirmation.

## Asset Disposition

Four high-value PDFs and six presentation-critical images are included in the checksummed Hosting.com asset bundle. Their exact managed paths match the application’s `/manus-storage/...` references. The complete old `wp-content/uploads` tree is still required before the legacy host is retired because 334 media records and thousands of derivative URLs remain reference-only.

| Asset state | Required action |
| --- | --- |
| Ten bundled managed assets | Copy to `dist/public/manus-storage` after a Hosting.com build |
| Reference-only WordPress media | Export and preserve at the original `/wp-content/uploads/...` paths or remap every inventory URL |
| Future administrator uploads | Store in IBAA-controlled S3-compatible storage; never use the application filesystem as the source of truth |

See `docs/asset-disposition.md` and the separate `IBAA-Hosting.com-Initial-Assets.zip` bundle for exact filenames and checksums.

## Public Destination Map

| Public area | Destination |
| --- | --- |
| Organization and history | `/about` and preserved legacy information routes |
| Buddhist traditions | `/buddhist-traditions` |
| Leadership and governance | `/leadership` with clearly labeled legacy roster context |
| Annual delegates | `/annual-delegates` |
| Programs and youth | `/programs`, `/programs/youth`, `/study-circles` |
| Events | `/events` |
| Communities and formal roster | `/member-temples` |
| News, posts, and taxonomies | `/news-media`, `/news/{slug}` |
| Media attachments | `/media/{id}-{slug}` |
| Forms and documents | `/resources`, `/join`, `/donate` |
| Contact | `/contact` |

## Cutover Conditions Controlled by IBAA

Before public DNS cutover, IBAA should approve the current leadership roster, formal member-temple roster, community-preferred tradition labels, general contact details, historical milestones, ongoing program cadence, privacy policy, and terms of use. The existing site deliberately withholds or labels these items rather than guessing.

The external Hosting.com runtime must also have working OAuth, MySQL, durable object storage for future uploads, the complete legacy file export, SSL, canonical-host redirects, secrets, backups, and rollback access. Full steps are in `docs/hosting-com-deployment.md`.
