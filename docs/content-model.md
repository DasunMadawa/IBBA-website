# IBAA Content Model

The content model separates editorial entries, uploaded assets, structured organizational records, and migration aliases. This keeps the public site easy to query while allowing non-technical administrators to publish news and media without editing code.

| Entity | Core fields | Notes |
| --- | --- | --- |
| `contentEntries` | `id`, `type`, `status`, `slug`, `title`, `excerpt`, `bodyHtml`, `publishedAt`, `createdAt`, `updatedAt`, `authorUserId`, `featuredAssetId`, `tradition`, `legacyUrl`, `canonicalPath`, `youtubeUrl`, `youtubeVideoId`, `youtubeTitle` | Supports pages, news, media, meeting minutes, program updates, and event recaps. YouTube fields are optional as a group; a video title is required when a URL is supplied. |
| `categories` | `id`, `name`, `slug`, `description`, `legacyUrl` | Includes legacy categories and future editorial categories. |
| `contentCategories` | `contentId`, `categoryId` | Many-to-many join for archive filtering. |
| `mediaAssets` | `id`, `kind`, `storageKey`, `url`, `fileName`, `mimeType`, `sizeBytes`, `width`, `height`, `altText`, `caption`, `credit`, `legacyUrl`, `createdBy`, `createdAt` | Stores metadata and cloud references only; file bytes remain in object storage. |
| `contentAssets` | `contentId`, `assetId`, `role`, `sortOrder` | Supports galleries, downloads, inline media, and reusable assets. |
| `events` | `id`, `title`, `slug`, `description`, `startsAt`, `endsAt`, `timezone`, `venue`, `address`, `registrationUrl`, `tradition`, `status`, `featuredAssetId`, `legacyUrl` | UTC persistence with local-time display. |
| `temples` | `id`, `name`, `slug`, `tradition`, `description`, `address`, `city`, `state`, `postalCode`, `latitude`, `longitude`, `website`, `email`, `phone`, `featuredAssetId`, `status` | Searchable directory records. Tradition may be `theravada`, `mahayana`, `vajrayana`, or `intertradition`. |
| `leaders` | `id`, `name`, `role`, `group`, `bio`, `assetId`, `sortOrder`, `active`, `legacyUrl` | Supports officers, directors, advisory council, and delegates without hard-coded page layouts. |
| `externalPress` | `id`, `headline`, `publisher`, `publishedAt`, `url`, `languageNote`, `accessNote`, `legacyUrl`, `sortOrder` | Preserves the existing external-press archive without copying third-party article bodies. |
| `legacyRoutes` | `id`, `legacyPath`, `destinationPath`, `routeType`, `httpStatus`, `sourceRecordId`, `verifiedAt` | Exact aliases or permanent redirects for pages, posts, taxonomies, authors, attachment pages, and retired paths. |

## Editorial Status and Authorization

| Status | Public behavior | Administrative behavior |
| --- | --- | --- |
| `draft` | Never returned by public queries. | Editable and previewable by administrators. |
| `published` | Returned after its publication date. | May be edited, unpublished, or archived. |
| `archived` | Hidden from ordinary lists but available through a preserved legacy route when migration policy requires it. | Retained for history; not deleted by default. |

Only authenticated users with the `admin` role may create, upload, edit, publish, unpublish, archive, or delete content metadata. Public procedures return published records only. Uploaded images require alternative text before publication; downloadable documents require a human-readable title; and a YouTube URL requires an accessible video title.

## YouTube Contract

The system accepts only `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`, and `youtube.com/embed/…` URLs over HTTPS. The parser extracts an eleven-character video identifier, rejects non-YouTube hosts and malformed identifiers, and renders `https://www.youtube-nocookie.com/embed/{id}` inside a responsive aspect-ratio container. The iframe receives a required `title`, lazy loading, a strict referrer policy, and a limited `allow` list; arbitrary embed HTML is never stored or rendered.
