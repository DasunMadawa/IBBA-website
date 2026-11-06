# Legacy Asset Disposition

The rebuild uses a selective, documented migration strategy. The complete legacy file inventory remains available for audit, while high-value public documents and presentation-critical photography are copied to durable project storage so core pages do not depend on the former WordPress host.

## Fully Migrated Legacy Documents

| Asset | Original source | Managed destination | Rationale |
| --- | --- | --- | --- |
| Brief History of IBAA | `wp-content/uploads/2017/10/Brief-History-of-IBAA.pdf` | `/manus-storage/brief-history-of-ibaa_bcf3e29f.pdf` | Foundational organizational history |
| IBAA Donation Form | `wp-content/uploads/2017/10/IBAA-Donation-Form.pdf` | `/manus-storage/ibaa-donation-form_c3028c7b.pdf` | Historical governance and participation record |
| IBAA Membership Application | `wp-content/uploads/2023/08/IBAA-Application.pdf` | `/manus-storage/ibaa-application-form_0bbb5887.pdf` | Most recent public legacy application found in the inventory |
| White House Vesak 2023 Press Release | `wp-content/uploads/2023/05/Press-release-letterhead-2023-Final.pdf` | `/manus-storage/white-house-vesak-2023-press-release_d25fbea8.pdf` | National public-record document tied to a migrated article |

The archive generator replaces exact references to these four source URLs with the managed destinations. The original source URL remains stored in the corresponding media record for provenance.

## Fully Migrated Presentation Assets

| Asset | Managed destination | Use |
| --- | --- | --- |
| IBAA wordmark | `/manus-storage/ibaa-wordmark_3b38a5b1.webp` | Header identity and generated attachment remapping |
| White House Faith Office 2026 | `/manus-storage/white-house-faith-office-2026-optimized_233c8ff0.webp` | 172 KB optimized homepage/news rendition and generated archive remapping |
| White House Vesak 2024 | `/manus-storage/white-house-vesak-2024_273bb982.webp` | Homepage, news feature, and generated archive remapping |
| Study Circle August 2026 | `/manus-storage/study-circle-aug-2026-fixed_8f9f529d.webp` | Homepage, programs, featured article, and generated archive remapping |
| Theravada practice, Thailand | `/manus-storage/theravada-wat-khung-taphao-2009_f4447fee.webp` | Worldwide Buddhist traditions page |
| Chion-in ceremony, Japan | `/manus-storage/mahayana-chion-in-new-year-2019_c0f0f072.jpg` | Worldwide Buddhist traditions page |

These four legacy images are also recorded in `research/assets/managed-legacy-assets.json`; the deterministic generator remaps matching archive URLs to managed storage. Image provenance, creator, location, and licensing notes are retained in `research/assets/provenance.md`.

## Preserved by Reference

The source inventory contains **338 publicly retrievable media records** and **7,044 unique linked or uploaded file URLs**. Four media records now resolve to managed document copies. The remaining 334 media records and non-selected file URLs remain discoverable through the rebuilt attachment archive but resolve to their original IBAA source URL. This is intentional for the current migration scope: copying every derivative WordPress rendition would introduce thousands of redundant files and would not remedy the source library’s 321 missing image-alt records.

Before DNS cutover, IBAA should retain a read-only export of the entire `wp-content/uploads` tree on Hosting.com or object storage. The public route and file inventories provide the reconciliation list. A later batch can promote additional high-value assets to managed storage by adding records to `research/assets/managed-legacy-assets.json` and rerunning `scripts/generate-public-archive.mjs`.

## Caption and Alternative-Text Handling

Migrated post records are hydrated from `media-inventory.json` using their featured-media IDs. Original media captions and descriptions are rendered when present. When the legacy library contains no verified caption or description, the figure has no synthetic caption; a separate metadata notice states that no caption was invented. Newly uploaded images require meaningful alternative text in the administrator workflow.
