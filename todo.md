# Project TODO

- [x] Inventory every public legacy page, post, category archive, PDF, image, downloadable file, and discoverable WordPress URL from ibaa.org.
- [x] Produce a migration inventory with legacy URL, title, content type, publication date, categories, featured media, downloadable documents, and proposed destination URL.
- [x] Preserve legacy WordPress paths through route aliases or permanent redirects without losing contextual information.
- [x] Define a maintainable content model for posts, pages, events, programs, leadership, temples, media, documents, and Buddhist-tradition tags.
- [x] Establish an elegant visual system using white, soft gold, deep maroon, forest green, and light gray with readable serif headings and sans-serif body typography.
- [x] Build a responsive, keyboard-accessible global header, grouped desktop navigation, mobile menu, skip link, and footer.
- [x] Build the public homepage around “Uniting America’s Buddhist Traditions,” national leadership, White House Vesak, programs, study circles, news, temples, membership, and donations.
- [x] Build public information routes for About IBAA, History, Leadership, Annual Delegates, Programs, Study Circles, Events, Member Temples, News & Media, Resources, Join IBAA, Donate, and Contact.
- [x] Build reusable article, media, document, category, tradition-tag, and legacy-context components.
- [x] Preserve migrated post dates, categories, featured imagery, downloadable document links, captions, alt text, and original-source context.
- [x] Build a searchable and filterable member-temple directory with Buddhist-tradition filtering and accessible empty states.
- [x] Build an accessible events listing and calendar-style experience.
- [x] Build a secure responsive YouTube embed component that accepts watch, youtu.be, shorts, and embed URLs, validates the host and video ID, uses privacy-enhanced embeds, and requires an accessible title.
- [x] Add automated tests for valid and invalid YouTube URL normalization and accessible embed output.
- [x] Build authenticated administrator access using the provided authentication and role model.
- [x] Build an administrator dashboard for creating, editing, previewing, publishing, unpublishing, and deleting news or media entries.
- [x] Include optional YouTube URL and required accessible video-title fields in the administrative publishing workflow.
- [x] Enable authorized administrators to upload and reuse photographs and downloadable documents through secure cloud file storage.
- [x] Store uploaded-file metadata and cloud references in the database without bundling media in the deployed application.
- [x] Provide accessible form validation, loading, success, error, confirmation, and empty states throughout the administrative workflow.
- [x] Add database tables, migrations, query helpers, typed procedures, and authorization checks for content and media management.
- [x] Migrate verified legacy text, real photography, and downloadable files selected from the current site inventory.
- [x] Add semantic metadata, descriptive page titles, canonical URL support, sitemap/robots foundations, and structured SEO-ready content.
- [x] Validate color contrast, heading hierarchy, landmarks, labels, alt text, focus visibility, keyboard operation, reduced motion, and responsive behavior.
- [x] Validate desktop and mobile layouts visually, run TypeScript checks, run Vitest tests, and resolve runtime console and network errors.
- [x] Prepare a comprehensive final migration inventory and handoff notes for future non-technical publishing.
- [x] Keep the application portable for Hosting.com by avoiding Manus-only runtime assumptions in public routes, content rendering, database contracts, and administrative workflows wherever practical.
- [x] Document the required Hosting.com runtime, build command, start command, environment variables, database requirements, persistent file-storage requirements, SSL, DNS, and legacy redirect configuration.
- [x] Prepare a production handoff package suitable for Hosting.com deployment while retaining the Manus project as the primary managed development workspace.
- [x] Document compatibility differences between Manus built-in hosting and Hosting.com, especially authentication, database, object storage, analytics, and environment-secret handling.
- [x] Research and document an inclusive Buddhist traditions framework covering Theravada, major Mahayana families, Vajrayana and Himalayan traditions, South and Southeast Asian communities, East Asian traditions, diasporas, and modern transnational communities without implying that a short taxonomy is exhaustive.
- [x] Build a public “Buddhist Traditions” educational experience that explains shared foundations and meaningful diversity without ranking traditions or collapsing distinct cultures and lineages.
- [x] Use geographically and culturally balanced real photography with verified captions, rights or source context, and respectful alternative text across the traditions experience.
- [x] Add editorial guardrails that distinguish IBAA’s practical three-tradition umbrella from the greater worldwide diversity that exists within and across those categories.
- [x] Create a terminology and representation review checklist for IBAA monastic and lay advisors before launch.
- [x] Verify factual claims about Buddhist traditions against multiple credible academic, institutional, or tradition-authored sources and retain citations in the editorial research record.
- [x] Conduct a dedicated final review for sectarian bias, cultural stereotyping, geographic imbalance, unsupported universals, and outdated leadership or organizational claims.
- [x] Add a component-render test for `SecureYouTubeEmbed` covering privacy-enhanced iframe output, accessible title behavior, and invalid-input fallback UI.
- [x] Let administrators select uploaded PDFs/documents as reusable entry attachments and render those attachments on published entries.
- [x] Add explicit accessible inline validation and query-error states to the content editor and media library.
- [x] Hydrate migrated post records with verified original media captions from the media inventory and render them without synthetic replacement text.
- [x] Migrate a documented set of high-value legacy PDFs and images to durable managed storage, then replace archive references with their managed URLs.
- [x] Produce an asset disposition report distinguishing files fully migrated to managed storage from files preserved by reference to the legacy host.
- [x] Build reusable `CategoryTag`, `TraditionTag`, `MediaFigure`, and `DocumentCard` components and replace inline presentation patterns.
- [x] Keep the current Study Circle host directory explicitly provisional until IBAA supplies or verifies a formal member-temple roster, then migrate the confirmed records into the managed directory.
- [x] Add an accessible agenda/calendar hybrid with month grouping, semantic dates, and empty states driven by the event dataset.
- [x] Verify Organization and WebSite JSON-LD are present in the built HTML and pass the production build.
- [x] Perform and document keyboard-navigation QA for the skip link, desktop/mobile navigation, public links, admin forms, and delete confirmation dialog.
- [x] Audit `prefers-reduced-motion` coverage and remove or gate any remaining non-essential motion that ignores the user preference.
- [x] Execute an automated keyboard interaction test for the collapsed mobile menu covering Tab focus, Enter/Space activation, `aria-expanded`, link activation, and menu-close behavior.
- [x] Execute a safe mocked-admin keyboard interaction test covering field traversal, validation messages, attachment controls, delete-dialog focus trapping, Escape cancellation, and focus return.
- [x] Execute and document desktop primary-navigation Tab order, visible focus, Enter activation, and route change.
- [x] Add a dedicated database table for formal temple/community records with verification, publication, tradition, location, website, and legacy-context fields.
- [x] Add public and administrator temple query procedures with administrator-only create, edit, verify, publish, unpublish, and delete authorization.
- [x] Build an authenticated temple-directory administrator page for maintaining future verified roster records without editing code.
- [x] Make the public community directory use published managed records when available and retain the explicit provisional Study Circle host fallback until then.
- [x] Add authorization, validation, empty-state, and fallback tests for the managed member-temple workflow.
- [x] Document the migration process from provisional Study Circle host records to the verified managed temple directory.
- [x] Add `/communities` as a working public alias for the managed Member Temples directory and verify desktop/mobile navigation never reaches a 404.
- [x] Add state and optional city filters to the searchable community directory while retaining tradition filtering and accessible empty states.
- [x] Add a clear public note that the formal community roster is managed and updateable by authorized administrators.
- [x] Replace the placeholder Leadership page with the exact 15-person Board of Directors list supplied by IBAA, preserving titles, countries, roles, and spelling without inventing additions.
- [x] Add a leadership verification note stating that IBAA maintains the roster and should confirm it before final launch.
- [x] Add a dedicated Meeting Minutes database model for meeting date, host temple, location, written summary, detailed minutes, traditions, optional YouTube URL/title, optional group photo, publication status, and legacy context.
- [x] Add administrator-only Meeting Minutes procedures for creating, editing, previewing, publishing, unpublishing, and deleting entries.
- [x] Build a simple non-technical Meeting Minutes editor with automatic secure YouTube embedding, reusable photo selection, tradition tags, and location fields.
- [x] Build a dedicated public `/meeting-minutes` archive in reverse chronological order with written minutes as the primary record and optional video/photo supplements.
- [x] Add Meeting Minutes to the main navigation or a clearly discoverable Study Circles/Resources location on desktop and mobile.
- [x] Surface recent published Meeting Minutes on the Study Circles page and homepage without fabricating meeting summaries or recordings.
- [x] Add automated tests for Meeting Minutes authorization, validation, ordering, optional media/video fields, and public rendering states.
- [x] Add a safe general contact inquiry form or clearly documented contact path without inventing a private email address or telephone number.
- [x] Add a privacy-conscious contact-inquiry table and public submission procedure with strict validation, honeypot protection, bounded rate limiting, and no stored IP address.
- [x] Add an administrator inquiry queue for reviewing, marking, and archiving general contact submissions.
- [x] Add automated tests for contact-form validation, honeypot rejection, administrator authorization, and public confirmation behavior.
- [x] Update the non-technical publishing guide with exact login, news, media, Meeting Minutes, and member-temple administration steps.
- [x] Audit every main navigation destination for HTTP success and correct public rendering, including mobile navigation.
- [x] Re-run responsive visual review, TypeScript, Vitest, production build, accessibility checks, and runtime console/network-log checks after the urgent fixes.
- [x] Deliver confirmation that Communities works, Leadership is updated, administrator publishing is functional, and provide the updated staging link.
- [x] Execute and document desktop and mobile Communities navigation checks for both `/communities` and `/member-temples`.
- [x] Add an automated route/navigation regression test that verifies the Communities alias and header destination.
- [x] Audit the existing June 11, 2026 White House Vesak page, its public URL, approved real 2026 photography, and the separate April 16, 2026 Faith Office post before editing.
- [x] Update only the June 11, 2026 Vesak page with the verified event name, date, EEOB location, organizers, approximate delegate count, three traditions, communities, and program highlights in no more than 220 words.
- [x] Ensure the June 11 Vesak copy does not mention the Dalai Lama and does not merge or overwrite the separate April 16 Faith Office meeting post.
- [x] Add a Participating Organizations directory using only organization names supplied by IBAA, with no invented biographies and “Profile forthcoming” where descriptive text is unavailable.
- [x] Use only real 2026 photographs already in the site inventory or clearly credited to Patrick B. Ruddy or a participating organization; do not add AI imagery.
- [x] Preserve monthly Dharma Meeting Minutes as the destination for monthly talks with optional YouTube embeds and make no unrelated layout changes.
- [x] Add focused tests for the Vesak facts, word limit, prohibited-name exclusion, approved organization names, photo provenance, and April 16 post separation.
- [x] Validate the Vesak page visually on desktop/mobile, run TypeScript, Vitest, and production build checks, then publish and report only the Vesak URL.
- [x] Audit the live `/meeting-minutes`, `/events`, and `/news-media` pages before editing and record whether the August 22 Dhammakaya post, YouTube embed, and upcoming LA/SF meetings already exist.
- [x] Report the pre-update status to the user before publishing any missing content.
- [x] If missing, upload and reuse the supplied August 22 Dhammakaya flyer and September 26 Hsi Lai flyer without altering them.
- [x] If missing, publish the August 22, 2026 Dhammakaya Meeting Minutes post with the supplied title, date, time, place, region, three traditions, exact written minutes, and YouTube URL.
- [x] Keep the written minutes as the primary record, embed YouTube only, and do not invent speaker quotes or re-upload the video file.
- [x] If missing, add the four supplied LA/SF upcoming meetings to both Meeting Minutes and Events in chronological order.
- [x] Use the September 26 Hsi Lai flyer for that listing and preserve the exact supplied speaker, temple, link, time, TBD, and name-to-be-confirmed wording.
- [x] Add focused tests for pre-update absence, August 22 newest-first ordering, exact content, three traditions, YouTube embed, flyer assignment, upcoming order, and non-invention constraints.
- [x] Verify the post and upcoming sections visually on desktop/mobile, run TypeScript, Vitest, production build, and runtime error checks.
- [x] Publish the validated August Meeting Minutes and upcoming-meetings update.
- [x] Return only the pre-update status, August 22 post URL, YouTube playback confirmation, and upcoming-meetings URL/section.
- [x] Render the October 10 venue exactly as “Sri Lankan Buddhist Temple, Los Angeles area (name to be confirmed)”.
- [x] Add deterministic regression coverage proving the August 22 Meeting Minutes entry sorts first in the published archive.
- [x] Preserve the observed pre-update absence of the August post, video, and upcoming meetings in a source-controlled status record with regression coverage.
- [x] Add a database-backed archive-order integration check that queries the actual published Meeting Minutes and confirms the August 22 record is first.
- [x] Save and publish a new checkpoint, then verify the live Meeting Minutes post and both upcoming-meetings sections.
- [x] Audit the current global CSS tokens and hard-coded green, burgundy, and maroon accents across public and administrator pages before editing.
- [x] Replace existing green and dark red-brown accent usage with Old Glory Blue `#002868` for top bars, heading accents, links, primary buttons, underlines, and small labels.
- [x] Replace strong burgundy/maroon accent usage with Old Glory Red `#BF0A30` for Donate, badges, and strong calls to action.
- [x] Keep all white, cream, and off-white backgrounds and all dark charcoal/black body text unchanged.
- [x] Preserve all photos, written content, page structure, layout, navigation, and route behavior with no unrelated source changes.
- [x] Verify the updated colors across the header, footer, buttons, links, tags, Meeting Minutes, Events, News, Communities, About, and the Vesak page on desktop and mobile.
- [x] Run color-contrast checks, TypeScript, Vitest, production build, and a deterministic content/structure integrity comparison.
- [x] Publish the color-only update and send a short screenshot note confirming that no content changed.
- [x] Compare post-change checksums for every non-stylesheet application file against the pre-change baseline and confirm only the stylesheet, palette test, and checklist changed.
- [x] Verify key public routes and navigation after the palette update and document that photos, content, layout, and page structure remain unchanged.
- [x] Audit the existing `/admin` routes, authentication primitives, content schemas, media uploads, and automatic public publication flows before editing.
- [x] Add secure email-and-password login at `/admin` for exactly two initial administrator accounts, with changeable credentials and a clear Logout action.
- [x] Store only password hashes, use secure HttpOnly same-site session cookies, apply bounded login throttling, and prevent public access to administrator procedures.
- [x] Keep the public footer and navigation unchanged; do not add a prominent public administrator button.
- [x] Use one shared, prebuilt administrator form layout for Events, Meeting Minutes, and News that is understandable to non-technical staff within two minutes.
- [x] Support Event fields for title, date, start/end time, Pacific-default time zone, city/region, venue, address, tradition checkboxes, short description, computer image upload, optional Zoom/YouTube links, and Draft/Published status.
- [x] Support Meeting Minutes fields for title, meeting date, host temple, region, tradition checkboxes, written minutes as the primary field, optional YouTube auto-embed, optional computer photo/flyer upload, and Draft/Published status.
- [x] Support News fields for title, date, category, short body, computer photo upload, optional tradition tags, and Draft/Published status.
- [x] Add obvious preview-before-publish, save-draft, edit, and delete workflows for all three content types using the same form pattern.
- [x] Publish Events automatically to `/events` in upcoming/newest order, Meeting Minutes to `/meeting-minutes` newest first, and News to `/news-media` newest first.
- [x] Keep all new forms empty except existing site content; do not invent event details, written records, images, or metadata.
- [x] Preserve the current public colors (`#002868`, `#BF0A30`), photos, Vesak page, published content, layouts, routes, and page structure.
- [x] Add security, authorization, draft/publication, upload, ordering, edit/delete, preview, and rendering tests for all three administrator content types.
- [x] Verify the administrator workflow on desktop and mobile, run TypeScript, Vitest, production build, accessibility checks, and public-site integrity comparisons.
- [x] Publish the administrator backend and provide only the requested admin URL, login instructions, publication-flow confirmation, and public-site preservation confirmation.
- [x] Verify the current official Hosting.com Node.js, domain, SSL, SSH/SFTP, MySQL, environment-variable, and application-restart instructions for staging deployment.
- [x] Create a secure downloadable site ZIP containing the current source code, lockfile, all database migrations, documentation, and required managed static assets.
- [x] Exclude `.git`, dependency folders, build caches, runtime logs, local environment files, private temporary credentials, and unrelated research artifacts from the download package.
- [x] Add a safe environment-variable template (rather than a prohibited dotenv file) and clearly label which Hosting.com staging values the user must create instead of copying production secrets.
- [x] Add a repeatable database migration command or script that applies all eight SQL migrations in order to a fresh Hosting.com MySQL database.
- [x] Add a portable staff-account bootstrap script or documented SQL process that creates two new staging admin accounts without embedding plaintext passwords in the downloadable ZIP.
- [x] Include the exact `/manus-storage` starter assets and checksums required by the current public website.
- [x] Document the S3-compatible object-storage requirement for future admin uploads and provide a safe staging alternative if Hosting.com does not supply compatible object storage.
- [x] Write a beginner-friendly Hosting.com staging walkthrough covering account preparation, subdomain, SSL, MySQL, SFTP/SSH, Node.js app creation, environment variables, upload, install, build, migrations, assets, start/restart, admin creation, login, public testing, and rollback.
- [x] Add a staging acceptance checklist for `/`, `/events`, `/meeting-minutes`, `/news-media`, `/admin`, uploads, draft/publish flows, legacy redirects, HTTPS, and backups.
- [x] Validate the ZIP file list, secret exclusion, checksums, clean installation, production build, migration sequence, and beginner guide before delivery.
- [x] Deliver the downloadable ZIP and detailed Hosting.com staging guide as attachments.
- [x] Audit the current Study Circles/Dharma Meetings and News & Media implementations, data sources, routes, and existing records before making content-only changes.
- [x] Preserve the current colors, Vesak page, Communities page, public photos, navigation, overall layout, and all unrelated published content.
- [x] Research the public IBAA Study Circle archive, including the April 13, 2026 archive page and other discoverable IBAA Study Circle pages, and save source-backed findings.
- [x] Create three clearly separated Study Circle groups: Washington DC Metro Area, Greater Los Angeles Metro Area, and San Francisco Bay Area.
- [x] Use the uniform record title format “Month Year — Temple Name (Nationality, Yana)” and include month, year, temple, nationality, and Yana on every confirmed item.
- [x] Sort every regional group newest first and keep unconfirmed details explicit rather than inferred.
- [x] Verify June 2026 is present in the preserved DC archive as Chua Giac Son on June 13, so no missing-record placeholder is needed.
- [x] Add the verified August 22, September 26, and October 10, 2026 Los Angeles records, including the existing August YouTube link and exact October temple-name caveat.
- [x] Add the verified October 3 and November 7, 2026 San Francisco Bay Area records, with no October 3 video and an explicit temple/time confirmation note where required.
- [x] Keep optional exact dates, times, addresses, flyers, and YouTube media attached only when verified.
- [x] Research all five approved public IBAA/news sources and record publication dates, source names, canonical links, and safe 2–4 sentence summaries.
- [x] Add concise News & Media clippings without copying full articles, inventing stories, or introducing AI-generated imagery.
- [x] Keep the April 16, 2026 White House Faith Office meeting separate from the June 11, 2026 Vesak observance and omit Dalai Lama references from the 2026 Vesak clipping.
- [x] Add source-fidelity, required-field, regional-grouping, newest-first ordering, missing-month, clipping-count, April/June separation, and prohibited-reference regression tests.
- [x] Verify Study Circles and News & Media on desktop and mobile, run TypeScript, all 94 tests, production build, runtime log review, Lighthouse accessibility/SEO, and protected-page integrity checks.
- [x] Publish the update and report only the Study Circles URL, confirmation of the three groups, remaining DC missing months, and number of clippings added.
- [x] Preserve all existing DC, Los Angeles, and San Francisco Study Circle records, the Oct 3 SF in-person/no-video constraint, the current #002868/#BF0A30 palette, Vesak content, and unrelated public pages.
- [x] Audit the current staff login, shared publishing form components, media upload contract, regional Study Circle datasets, and `/study-circles` route before schema or UI changes.
- [x] Add a managed Study Circle database model with region, month, year, exact date, start/end times, Pacific-default time zone, temple, nationality, yana, venue note, description, optional media, optional YouTube, draft/published status, author, and timestamps.
- [x] Add an administrator-only `/admin/study-circles` workflow titled “Add Study Circle / Dharma Meeting” using the existing shared form pattern.
- [x] Include all requested region, date/time, temple, nationality, yana, venue, description, upload, YouTube, and status fields with clear non-technical labels.
- [x] Support preview, save draft, publish, edit, delete, inline image/flyer upload, optional YouTube auto-embed, and explicit Logout without requiring code.
- [x] Make published managed Study Circles appear automatically in the correct regional block on `/study-circles`, sorted newest first with existing verified records retained and no duplicates.
- [x] Add a Washington DC Capitol/monument icon, a Greater Los Angeles sun/city-mark icon, and a San Francisco lotus-by-the-bay icon using clean accessible vector icons rather than generated people photography.
- [x] Show each regional card’s name, icon, next upcoming meeting, and the existing uniform “Month Year — Temple Name (Nationality, Yana)” archive list.
- [x] Add authorization, validation, CRUD, draft/public visibility, upload, secure YouTube, regional placement, newest-first ordering, icon, existing-record preservation, and Oct 3 no-video regression tests.
- [x] Verify staff can complete a future Study Circle preview in 46 seconds, confirm desktop/mobile usability, and pass TypeScript, all 100 tests, production build, runtime logs, 100 accessibility/SEO on Study Circles, 100 accessibility on admin login, and protected-page integrity checks.
- [x] Publish the update and return the admin URL with concise creation steps, Study Circles URL, and confirmation that all three regional icons are live.

## October 12, 2026 — staging-only photo and archive completion

- [x] Reuse and verify the existing four-item navigation, About links, Temple Outreach, BuddhaMap button, redirects, and secondary footer destinations; do not rebuild unrelated pages.
- [x] Optimize and upload both newly attached original group photos without cropping, AI edits, or replacing the user originals; add full captions, alt text, and dimensions in the correct regional records.
- [x] Separate upcoming and past meetings inside each regional card, preserve newest-first lists and all existing records, and place October 10 Dhammavicaya in the past archive automatically.
- [x] Verify the requested upcoming LA/DC hosts, canceled November 7 absence, and October 3 no-video preservation; keep unknown times/yana explicit.
- [x] Run TypeScript, complete tests, production build, live-link/redirect checks, and desktop/mobile visual QA; verify protected pages/palette unchanged.
- [x] Save a final validated checkpoint, verify staging propagation, and report changes/menu/redirects without touching custom domains or Hosting.com.

## October 13, 2026 — About governance relocation (staging only)

- [x] Place Governance navigation under `/about/governance` and preserve the complete existing Board roster under `/about/directors`; link both from About without changing the four-item top menu.
- [x] Repoint footer, About, and archive destination links; add direct permanent redirects for former leadership/director/governance URLs; update sitemap/metadata with no content deletion.
- [x] Verify exact roster/content preservation, links, redirects, desktop/mobile behavior, complete tests, TypeScript and production build; leave all unrelated content/styles/data unchanged.
- [x] Save checkpoint, verify only the existing manus.space staging release, and report moved content and redirects.

## October 20, 2026 — two past-meeting group photos (staging only)

- [x] Optimize copies of the attached October 10 LA and October 17 GWU photos without cropping or altering originals; add them to the existing regional past-meeting records with captions, alt text and dimensions matching the September photos.
- [x] Verify October 17 GWU is past and November 21 is next in DC; preserve September photos, other meetings, four-item menu, About relocation, palette and unrelated content; run tests, TypeScript/build and desktop/mobile QA.
- [x] Save the validated checkpoint and verify the two photos and past-meeting placement live on the existing manus.space staging site only; no Hosting.com or custom-domain changes.

## October 22, 2026 — Wangmo pre-launch refinements (staging only)

- [x] Remove source/citation presentation only from Our Mission; enlarge Mission prose on the Mission page and Home without changing the Mission wording or unrelated content.
- [x] Add tidy responsive Sign up disclosure with Membership link, Donate and Buddha Map top navigation; keep existing four destinations and anchor Buddha Map to the existing app section.
- [x] Replace Donate content with check-by-mail instructions and truthful PayPal reserved space. User explicitly approved 2222 Harold Way, Berkeley, CA 94704 on October 22 after reviewing the conflicting older donation-form address; membership-form source is credited. No invented address or fake PayPal link.
- [x] Update only October 17 GWU heading metadata to University / Interdenominational and remove its unconfirmed time; count formal published Member Temples separately from provisional hosts and report their names.
- [x] Test keyboard/mobile menu, Mission typography, approved Donate address and source, Buddha Map hash scrolling, GWU and protected content; 127 tests, TypeScript/build and desktop/mobile QA passed.
- [x] Checkpoint and verify the exact pre-launch refinements on existing manus.space staging only. No Hosting.com or custom-domain changes.

## October 26, 2026 — supplied member roster and Treasurer donation address (staging only)

- [x] Replace the provisional membership directory with the full user-supplied organization roster, storing real organizations in the existing admin-managed member table; preserve exact names, supplied address completeness and supplied websites only. Keep the two individuals separate and do not merge Study Circle hosts into membership.
- [x] Reuse the roster on Temple Outreach and repoint About/current directory references; preserve historic Study Circle records and unrelated content/design/menu.
- [x] Replace Donate mailing instructions with IBAA, attention Venerable Thongvanh, Treasurer, P.O. Box 464, Lorton, VA 22199; remove Berkeley address/source from Donate only and keep the PayPal placeholder.
- [x] Validate exact roster counts/fields, missing website omission, individual separation, admin updates and full tests/TypeScript/build plus desktop/mobile QA; checkpoint and verify existing manus.space staging only.

- [x] Verify the exact membership/Donate release after propagation to the existing manus.space staging hostname; no Hosting.com or custom-domain publication.

## October 27, 2026 — current Clinton mailing address correction (staging only)

- [x] Change current Donate/check-mailing instructions to IBAA, P.O. Box 2143, Clinton, MD 20735, using the admin correction supplied by the user; retain PayPal placeholder.
- [x] Correct the downloadable membership registration form and any current donation form with the same address; preserve all other fields/content, original historical file backups, and existing download URLs via redirects/updated links.
- [x] Leave membership names/affiliations and Study Circle records unchanged pending IBAA confirmation; validate corrected PDF text/layout and download links plus regression/TypeScript/build and responsive QA.
- [x] Checkpoint and verify existing manus.space staging only; no custom-domain or Hosting.com publication; report corrected address and unresolved affiliations.

- [x] Verify corrected pages and both versioned/stable PDF download contents after propagation to existing manus.space staging; application redirects and platform stable-key updates verified; no Hosting.com/custom-domain changes.

## October 28, 2026 — check-only donations (staging only)
- [x] Remove the entire online-payment placeholder from Donate, preserving only check instructions and the current IBAA / P.O. Box 2143 / Clinton, MD 20735 address; remove remaining public-page mentions elsewhere.
- [x] Update regressions; scan public source and published managed content; validate tests, TypeScript/build and desktop/mobile Donate layout without changing other content, hosting or domains.
- [x] Checkpoint the update and verify the exact new bundle and check-only Donate page on the existing staging hostname. Live content retains IBAA, P.O. Box 2143, Clinton, MD 20735 with no payment-service placeholder; 140 tests and desktop/mobile QA passed; no hosting/domain changes.

## November 3, 2026 — current Hosting.com downloadable handoff (no deployment)
- [x] Refresh the source package, local media and corrected current forms, portable migrations and approved public seed; exclude secrets, staff accounts/sessions, drafts and private inquiries; preserve the prior downloadable ZIP.
- [x] Update beginner Hosting.com and database instructions for the current Node.js system, including all migrations, current routes, fresh staff accounts and private uploads; clarify this is not WordPress/static hosting.
- [x] Validate a clean extracted package with install, TypeScript, all tests, build, asset checksums, secret scan and database migration/public-seed/bootstrap checks where available.
- [x] Create downloadable whole-site ZIP, separate database bundle and setup guide with checksums; verify files exist and no hosting/domain changes were made.
