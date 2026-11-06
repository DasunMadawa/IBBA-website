# Legacy Migration Implementation

The rebuilt IBAA site now includes a **complete public archive layer** generated from the verified WordPress inventory captured on August 25, 2026. The generator at `scripts/generate-public-archive.mjs` creates typed frontend archive records and server-side redirect data from the source inventory, which keeps the migration repeatable rather than relying on manually copied fragments.

| Migrated record | Implemented count | Public behavior |
| --- | ---: | --- |
| WordPress posts | 29 | Indexed on `/news-media` and rendered at `/news/{slug}` with original date, author, taxonomy, body, media, document links, and source context |
| WordPress pages | 17 | Integrated into the new information architecture or preserved through dedicated legacy page presentations |
| Media records | 338 | Rendered through `/media/{id}-{slug}` attachment records with original metadata and source links |
| Legacy WordPress paths | 393 redirects plus unchanged homepage | Permanent HTTP 301 redirects to the mapped rebuilt destinations |
| Categories | 6 | Legacy category archives redirect to query-aware News & Media archive views |
| Tags | 2 | Legacy tag archives redirect to query-aware News & Media archive views |
| Author archives | 1 public author | Redirected to the filtered News & Media archive |

The source API reported 340 media positions while returning 338 publicly retrievable records. The two empty public positions are documented in `research/inventory/api-anomalies.md`; the rebuilt media-not-found state explicitly preserves that context rather than pretending those records were recoverable.

Legacy text is presented as a historical record and is not silently rewritten. New editorial framing appears separately through source-context panels. Images lacking usable alternative text in the old WordPress library remain decorative in archive presentations and receive an explicit caption explaining the source metadata gap. New editorial and uploaded media require meaningful alternative text.

The detailed managed-versus-reference asset disposition is recorded in `docs/asset-disposition.md`. Four high-value legacy PDFs and six presentation-critical identity or photographic assets are now stored in durable project storage. Original source URLs remain recorded for provenance.

Representative server checks confirmed permanent redirects for a page, a post, a taxonomy archive, and a document attachment. All generated destinations are also represented in the client route table.
