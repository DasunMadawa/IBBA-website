# Legacy URL Preservation Strategy

The migration inventory currently maps 17 public pages, 29 public posts, 6 category archives, 2 tag archives, one known author archive, one video-format archive, and 338 publicly retrievable attachment pages. The generated `research/inventory/legacy-route-map.json` is the source of truth for application aliases and redirect rules.

| Legacy URL class | Preservation behavior |
| --- | --- |
| `/index.php/YYYY/MM/DD/post-slug/` | Permanent redirect to `/news/post-slug`, while the destination displays original date, author, categories, captions, and legacy context. |
| `/index.php/page-slug/` | Permanent redirect or exact route alias to the corresponding new section route. |
| `/index.php/category/:slug/` | Permanent redirect to `/news-media?category=:slug`. |
| `/index.php/tag/:slug/` | Permanent redirect to `/news-media?tag=:slug`. |
| `/index.php/author/attsaur/` | Permanent redirect to the filtered publication archive. |
| `/index.php/type/video/` | Permanent redirect to the media archive’s video filter. |
| Attachment pages | Permanent redirect to `/media/:id-:slug` so title, caption, credit, and related content remain available. |
| Direct `/wp-content/uploads/...` files | Retain the original relative key in object storage and resolve through an application or CDN compatibility route. Do not bundle files in the application repository. |
| Obsolete or malformed navigation targets | Redirect to the intended destination while retaining any valid direct legacy URL separately. |

Redirect matching will occur on normalized URL paths before public page rendering. Query strings that represent filters or legacy pagination will be translated into the new archive parameters. Redirect targets are internal allow-listed paths, preventing open redirects.

For Hosting.com, equivalent rules must also be documented for the active control panel or fronting web server. Application-level handling remains the portable source of truth; server-level rules are an optimization and a fail-safe during cutover.
