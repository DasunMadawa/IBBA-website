# Hosting.com deployment — technical reference

**Prepared: November 3, 2026. Download handoff only; these instructions have not been executed against Hosting.com.**

For the beginner walkthrough, use [HOSTING-COM-STAGING-GUIDE.md](../HOSTING-COM-STAGING-GUIDE.md). For the standalone MySQL walkthrough, use [deployment/DATABASE-SETUP.md](../deployment/DATABASE-SETUP.md).

## Application and package boundaries

The current site is **React + Express/tRPC + MySQL**, not WordPress. It requires Node.js 22, at least 22.12, a managed application process, SSH/build access, and HTTPS. Do not place the application source, database files, backups, or secrets in `public_html` or another domain document root. Do not import into an old WordPress database. Downloading the package does not authorize hosting setup, DNS changes, live deployment, account creation, or editorial changes.

The source contains the public historical archive, static regional meeting archives, five clippings, and two individual member records. The public database exporter covers all currently published managed content and associated categories/tags/attachments/media, Events, minutes, managed Study Circles, and verified member organizations when present. It intentionally excludes existing users/staff credentials, sessions, inquiries, and drafts; a non-login bootstrap attribution identity preserves foreign keys.

The November 3 snapshot in `deployment/PUBLIC-SEED-COUNTS.json` contains **27 member organizations, 3 managed media rows, 1 written minutes record, and 9 Event rows**. Managed News/media entries, categories, managed Study Circles, and database legacy-route rows are currently zero. This does not remove the source-based archive: it includes 29 historical posts and 17 pages. The nine Event rows include Dharma meetings surfaced through Study Circles; the general Events view filters them out, so nine database rows do not mean nine upcoming event cards.

**Schema + public seed is a portable public bootstrap, not a full private production backup.** Database rows containing file URLs are not the binary files themselves. Use the final package/asset manifests and asset audit for actual bundled counts; older fourteen-file counts are obsolete.

## Provider configuration

| Concern | Setting |
| --- | --- |
| cPanel runtime | Node.js Selector; production mode; private application root; approved staging URL; startup file **`startup.cjs`** |
| Enhance runtime | Website's Deploy Node.js controls; private application directory; supported start command **`node dist/index.js`** or `pnpm start` |
| Build output | ESM server `dist/index.js`; React/static assets `dist/public/` |
| Runtime environment | `NODE_ENV=production`, new `DATABASE_URL`, new random `JWT_SECRET`; provider-managed port |
| Database | New dedicated MySQL database, utf8mb4, dedicated user with ALL privileges scoped to that database only |
| Existing bundled files | Build copies `deployment-assets/manus-storage/` to `dist/public/manus-storage/` |
| New staff uploads | Separately configured private S3-compatible bucket and complete `S3_...` variables |

Hosting.com's cPanel guide documents an application root outside the domain document root, a startup-file field, and the shell activation command.[1] Its Enhance guide documents website Files, SSH under Advanced → Developer Tools, and Node.js deployment; exact available controls/runtime versions vary by plan.[2] Confirm ESM/Passenger and process/port behavior on the actual account rather than assuming every plan is identical. `startup.cjs` dynamically imports the ESM bundle; do not convert the entire package to CommonJS.

Do not hard-code a public port, leave a second SSH process running, or add a static rewrite that bypasses Express. Express serves the API, media routes, legacy redirects, and SPA fallback. Direct client-route refresh must reach Node.

## Exact build and bootstrap sequence

From the extracted application root, verify `PACKAGE-CHECKSUMS.sha256` before modifying anything. On cPanel run the **exact** activation command shown by the selector, then check `node --version`.

```bash
sha256sum -c PACKAGE-CHECKSUMS.sha256
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile --prod=false
pnpm check
pnpm test
pnpm build
```

If Corepack is unavailable, use `npx --yes pnpm@10.4.1` in place of each pnpm invocation. Do not replace the pinned pnpm lockfile workflow with a generic npm-install example. Build tools require development dependencies even though the running application is in production mode.

Panel environment variables are **not automatically inherited by SSH**. In Bash, enter the new MySQL URL privately:

```bash
read -rsp 'DATABASE_URL: ' DATABASE_URL; export DATABASE_URL; echo
node scripts/apply-migrations.mjs --dry-run
node scripts/apply-migrations.mjs
node scripts/apply-public-seed.mjs
node scripts/apply-public-seed.mjs
```

The dry run must list nine migration files (`0000`–`0008`); it checks files, not connectivity. The second seed call is an initial idempotency check on the fresh, unchanged database. **Never rerun the public seed after staff editorial changes: its upserts can overwrite them.**

The runner records successful filenames in `ibaa_staging_migrations` and uses `scripts/mysql-migration-sql.mjs` to normalize generated statement markers and the long legacy-path index for standard MySQL/utf8mb4. It retains the full URL column while using a compatible unique prefix index. Do not manually import the raw `drizzle/*.sql` files or bypass this helper. DDL failures can leave partial schema; stop and recreate only a confirmed disposable fresh/test database before a clean retry. Never disable foreign keys or manually mark failed files complete.

**Alternative:** import `database/IBAA-database-fresh-install.sql` once into a completely empty database through phpMyAdmin. The combined SQL includes the normalized schema, public seed, and nine migration-history filenames. Do not mix initialization methods or import that DDL file twice. Verify 18 base tables (17 application tables + migration history), nine recorded filenames, utf8mb4 collations, and snapshot counts using the standalone database guide.

Create approved administrators separately:

```bash
node scripts/create-staff-admin.mjs 'Approved Staff Name' 'person@example.org'
unset DATABASE_URL
```

The generated password is displayed once; run privately, save securely, share through an approved private channel, and change it after login at `/admin/account`. Do not supply a password argument or reuse credentials exposed in chat. Runtime panel variables remain separately configured.

## Secrets and uploads

Use `deployment/ENVIRONMENT-VARIABLES.template` as a placeholder worksheet. Percent-encode punctuation in URL username/password components; never put a real URL in shell history. Use the provider's actual internal host/port and supported verified TLS configuration if required. Never place secrets in frontend `VITE_` values, SQL downloads, screenshots, or repositories. Optional legacy Manus OAuth settings are not needed for staff email/password login; Manus-only built-in keys must not be copied.

For future uploads, configure all six variables with a private bucket/provider: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`. Scope credentials to that bucket. The local bundled-file fallback is not a future upload backend. Restart/redeploy after runtime changes; rebuild after public frontend settings change.

## Current-site acceptance and preservation

Verify the seven navigation entries: **Home, About IBAA, Study Circles, Temple Outreach, Sign up → Membership, Donate, Buddha Map**. Check `/about/governance`, `/about/directors`, `/study-circles`, and `/study-circles/minutes/{slug}`. Monthly meetings/written records belong to Study Circles; `/meeting-minutes` redirects to `/temple-outreach`. Member pages retain 27 organizations plus two separate individuals. Donate is check-by-mail only to **IBAA, P.O. Box 2143, Clinton, MD 20735**, with the current form.

Also verify public archives, News/media, Events, resources/forms, administrator access gates, direct-route refresh, mobile/keyboard operation, bundled media checksums, representative legacy redirects, and valid HTTPS. Publishing and upload tests require separate authorization and designated disposable staging records.

The final audit reports **21 current managed files + 338 verified archived WordPress originals = 359 media files**, about 449.35 MiB (471,179,167 bytes). The packaged source remaps **7,042 matched historical upload URLs** to the 338 local originals, serving equivalent originals instead of duplicating every resized variant. Use the final manifests/checksums for download verification. This does not export the entire WordPress filesystem or every derivative. Four outside-scope references remain: a Wikimedia file-description page, GitHub demo image, `sisu.ut.ee` Vajrayana PDF, and WPForms spinner SVG. Audit representative pages and any other external links before retiring hosting; retain old originals/variants and screenshots where separately needed. Never equate thousands of URL mappings with thousands of included binary files.

## Backups and later updates

A future approved private backup command is:

```bash
umask 077
mkdir -p "$HOME/private-backups"
mysqldump --single-transaction --no-tablespaces -h DB_HOST -u FULL_USER -p FULL_DATABASE_NAME > "$HOME/private-backups/ibaa-$(date +%F-%H%M%S).sql"
```

`-p` prompts; never append a password. Keep backups outside all public roots, check success, store an independent encrypted copy, and test restoration separately. Back up source/build releases, secret settings, and object storage as well. Later migrations require backup and review; **do not reseed editorial databases**. Reverting source does not revert schema. No live DNS/canonical-host decision or remote cutover is performed by this download handoff.

## Official references

[1]: https://kb.hosting.com/docs/create-application-with-nodejs-selector "Hosting.com — Node.js Selector"
[2]: https://kb.hosting.com/docs/how-to-deploy-a-nodejs-application-on-enhance "Hosting.com — Node.js on Enhance"
[3]: https://kb.hosting.com/docs/managing-mysql-databases "Hosting.com — MySQL databases and users"
