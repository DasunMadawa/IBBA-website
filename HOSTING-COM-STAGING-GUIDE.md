# IBAA website — Hosting.com staging and download guide

**Prepared: November 3, 2026**
**Scope: instructions for a future, separately authorized installation.** Preparing or downloading this package does not configure Hosting.com, change DNS, publish a website, or change the current database.

## 1. What this download is

The current IBAA website is a **React frontend with an Express/Node.js backend and MySQL**. It is not WordPress, a WordPress theme, or an import for WordPress. A previous discussion of conversion costs does not change the application in this download. Do not use a WordPress installer or import its SQL into the old WordPress database.

The package preserves the current source, public archive data baked into source, administrator application, nine schema migrations (`0000`–`0008`), public database bootstrap, and the bundled images/documents identified in its manifests. Read `PACKAGE-MANIFEST.md` and `deployment-assets/CHECKSUMS.sha256` for the final file and asset counts; do not rely on older fourteen-file instructions.

The managed public-content seed covers published News/media entries, categories, tradition tags, attachments and their media metadata, Events, written meeting records, regional Study Circles, and the published member organizations. Staff accounts, sessions, contact inquiries, private drafts, and real credentials are intentionally excluded. Public attribution may use a non-login bootstrap identity so foreign keys remain valid. **The database download is schema plus approved public rows, not a private production backup.** The two individual members are preserved in the source roster rather than inserted as temple records.

The November 3 export has **27 member organizations, 3 managed media rows, 1 written minutes record, and 9 Event rows**, as recorded in `deployment/PUBLIC-SEED-COUNTS.json`. Managed News, categories, managed Study Circles, and database legacy routes are zero in this snapshot. The source still preserves **29 historical posts, 17 pages, regional meeting archives, and five clippings**. The Event rows include monthly Dharma meetings shown through Study Circles, not nine upcoming cards on the general Events page.

### Important archive-media limitation

The final asset audit reports **21 current managed files plus 338 verified archived WordPress originals: 359 media files in total**, about 449.35 MiB (471,179,167 bytes). Use the final manifests and checksums to verify the actual download. The packaged source remaps 7,042 matched historical upload URLs to the 338 local originals; resized variants resolve to an equivalent original rather than each variant being duplicated. This removes the old IBAA uploads dependency for matched references in the packaged source.

This is **not an export of the entire WordPress filesystem or every historical derivative**. Four outside-scope references remain: a Wikimedia file-description page, a GitHub demo image, a Vajrayana PDF on `sisu.ut.ee`, and a WPForms plugin spinner SVG. These are not guaranteed local originals. Before retiring old hosting or changing live DNS, check the final asset audit and representative archive pages, preserve any separately required originals/variants, and reconcile unexpected remaining external references. Do not delete the old archive, screenshots, or preservation evidence. A database attachment row or URL alone is never proof of a bundled binary.

## 2. Requirements and safe boundaries

Hosting must support a managed **Node.js 22 runtime, at least 22.12**, MySQL, SSH, and HTTPS. A static/FTP-only plan cannot run publishing, authentication, database queries, or uploads. Hosting.com's available runtime versions and screen labels vary by plan. Confirm the account supports this application before doing anything to the live site.[1][2]

Use a separately approved staging application/address. Keep its application root outside the domain's public document root, for example `/home/ACCOUNT/apps/ibaa-staging`. Do not upload source, SQL, secret files, or backups into `public_html`. Selecting a staging hostname and arranging its certificate are future operator actions; **do not change `ibaa.org`, `www.ibaa.org`, nameservers, or the old site's database as part of a download-only handoff**.

Keep these values in a private password manager: hosting/SSH access, the full database name, full database username, database password, `DATABASE_URL`, `JWT_SECRET`, and any upload-storage credentials. Never reuse a password exposed in chat, a previous shared document, or the old development environment.

## 3. Extract and check the package

Keep an untouched copy of the downloaded archive. Upload it through authenticated File Manager or SFTP to the account home/application area, not the public document root. Extract it so `package.json`, `pnpm-lock.yaml`, `client/`, `server/`, `shared/`, `drizzle/`, and `scripts/` are directly inside the application folder.

On **cPanel**, Hosting.com documents a Node.js Selector application root outside the domain document root.[1] On **Enhance**, its guide uses **Websites → the selected domain → Files**, an application directory beneath that website's home area, and SSH under **Advanced → Developer Tools**.[2] Confirm that the selected folder is private; names and exact controls can vary.

If the final package supplies `PACKAGE-CHECKSUMS.sha256`, verify it from the extracted root before editing files:

```bash
cd ~/apps/ibaa-staging
sha256sum -c PACKAGE-CHECKSUMS.sha256
```

Every checked file should report `OK`. A mismatch means stop and re-extract or obtain a clean download. Windows users can perform this verification in the hosting SSH shell.

## 4. Create a new, dedicated MySQL database

Follow **[deployment/DATABASE-SETUP.md](deployment/DATABASE-SETUP.md)** for the complete small-step instructions and SQL checks.

In cPanel, open **Manage My Databases**, or **MySQL Databases** on older versions.[3] Create a fresh database and a separate user. Record the **full prefixed names**, such as `account_ibaa_stage`, not just the short suffix. Add that user to that one database, select **ALL PRIVILEGES**, and save with **Make Changes**. Do not grant server-wide privileges or use the hosting account's root credentials.

On Enhance, use the database controls for the selected website to create a fresh MySQL database/user and associate them. Confirm the actual host, port, database name, username, and permissions shown by the account or Hosting.com support; do not assume cPanel's prefix rules or screen names apply.

Use **utf8mb4** for the new database and verify the resulting tables. Use the provider's internal database hostname; `127.0.0.1:3306` is only an example, not a promise for every plan. Do not expose MySQL publicly. If TLS is required, obtain the provider's supported connection settings and certificate requirements rather than disabling verification.

A connection string has this structure:

```text
mysql://FULL_USER:URL_ENCODED_PASSWORD@DB_HOST:3306/FULL_DATABASE_NAME
```

Percent-encode punctuation in username/password components; for example `@` becomes `%40` and `#` becomes `%23`. Do not encode the whole URL. A strong randomly generated hexadecimal database password avoids most URL-encoding mistakes. See the database guide for private encoding instructions.

## 5. Configure the hosting application environment

Use `deployment/ENVIRONMENT-VARIABLES.template` as a list of names, **not a completed file to publish**. Add at least:

| Variable | Setting |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | New database's private connection string |
| `JWT_SECRET` | New random secret of at least 32 bytes |
| `PORT` | Provider-managed value where applicable; do not guess or replace it |

Generate a fresh signing secret in a private terminal with `openssl rand -hex 32` and store it securely. Its output is secret; do not include it in screenshots or transcripts. Do not copy Manus-only `BUILT_IN_FORGE_API_KEY` or other built-in service credentials. Staff email/password authentication does not require the optional legacy Manus OAuth variables.

Frontend `VITE_` values, if used, are public build-time settings. **Never put passwords, database URLs, signing secrets, or storage keys in a `VITE_` variable.** Restart/redeploy after changing runtime variables; rebuild after changing frontend settings.

## 6. Open SSH and activate Node.js

Use the account's actual SSH host, username, and port:

```bash
ssh -p YOUR_SSH_PORT YOUR_ACCOUNT@YOUR_SSH_HOST
cd ~/apps/ibaa-staging
```

On cPanel, run the exact activation command displayed in the Node.js Selector, commonly beginning with `source /home/.../nodevenv/.../bin/activate`. On Enhance, follow the SSH/runtime guidance for the selected application.[1][2]

```bash
node --version
```

It must be a compatible Node.js 22 version (22.12 or newer in that line). If unavailable, stop and ask Hosting.com for a supported runtime.

**Important: environment variables saved in the hosting application's panel do not automatically become variables in your SSH terminal.** Before the database scripts, enter the URL privately in Bash:

```bash
read -rsp 'DATABASE_URL: ' DATABASE_URL; export DATABASE_URL; echo
```

Paste the URL at the hidden prompt, then press Enter. The command is safe to retain in shell history because it contains no actual credential. Do not run `export DATABASE_URL='your real secret'`, print the variable, or put the URL in a command-line argument. Repeat this private prompt in a new SSH session. The application still needs its own panel setting from section 5.

## 7. Install dependencies and build

From the application root, use the package's pinned pnpm version. Include development dependencies because Vite, TypeScript, and esbuild are build tools:

```bash
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile --prod=false
pnpm check
pnpm test
pnpm build
```

If Corepack is unavailable or cannot activate pnpm on the account, use the explicit version without changing the lockfile:

```bash
npx --yes pnpm@10.4.1 install --frozen-lockfile --prod=false
npx --yes pnpm@10.4.1 check
npx --yes pnpm@10.4.1 test
npx --yes pnpm@10.4.1 build
```

Do not substitute `npm install` for this project's pinned lockfile workflow just because a generic hosting example uses npm. If any command fails, resolve that failure before starting the application.

`pnpm build` produces `dist/index.js`, `dist/public/`, and automatically runs the starter asset installer. To repeat only the asset copy:

```bash
node scripts/install-starter-assets.mjs
find dist/public/manus-storage -type f | wc -l
(cd deployment-assets/manus-storage && sha256sum -c ../CHECKSUMS.sha256)
```

Compare the file count with the final asset manifest; all checksum lines must report `OK`. A message saying the asset copy was skipped is not successful preservation: check that `deployment-assets/manus-storage/` exists in the extracted package.

## 8. Bootstrap the database — choose one method

**Method A, recommended: run the packaged Node scripts against the fresh database.** After privately exporting `DATABASE_URL`, run:

```bash
node scripts/apply-migrations.mjs --dry-run
```

This lists all **nine** files, `0000` through `0008`, and ends with `Migration dry run passed: 9 ordered SQL files found.` It only checks the files; it does not test connectivity or SQL compatibility.

```bash
node scripts/apply-migrations.mjs
node scripts/apply-public-seed.mjs
node scripts/apply-public-seed.mjs
```

The migration runner records completed filenames in `ibaa_staging_migrations`. Its MySQL helper removes generated statement markers and makes the long legacy-path index compatible with utf8mb4 while retaining the full URL field. Do not manually import raw `drizzle/*.sql` files or bypass that helper. The second seed run is an initial idempotency check on a **fresh, unchanged deployment only**. The seed contains upserts: rerunning it after staff have edited content can overwrite their changes. Do not use it as a routine update, backup, or synchronization tool.

**Method B, alternative: import `database/IBAA-database-fresh-install.sql` using phpMyAdmin** into a completely empty database. The combined file creates the schema, records the nine migration filenames, and inserts approved public rows. Do not also run Method A to initialize the same database; do not import the combined file twice because it contains schema DDL. The database guide explains verification and failure handling. Neither method requires disabling foreign-key checks.

## 9. Create new staff administrator accounts

The download intentionally contains no working staff login credentials. After database bootstrap, use a real approved email address:

```bash
node scripts/create-staff-admin.mjs 'Approved Staff Name' 'person@example.org'
```

The script generates a random temporary password and prints it once. Run it in a private, non-recorded terminal; save the result in a password manager and share only through an approved private channel. Do not supply a password argument, put it into shell history, or reuse credentials exposed in chat. Each administrator needs an individual account. The script refuses an email that already exists; do not bypass that by creating unnecessary replacement accounts.

After first sign-in at `/admin`, open `/admin/account` and change the password. Database attribution identities are not staff login accounts.

## 10. Select the startup entry and restart

On **cPanel**, create/configure the Node.js application with production mode, the approved staging URL, and the private application root. Set **Application startup file** to **`startup.cjs`**.[1] This supplied root-level CommonJS-compatible wrapper dynamically imports the ESM server at `dist/index.js`; it does not replace the build. Do not change `package.json` to CommonJS or rename the compiled ESM bundle. Confirm Passenger/port compatibility with Hosting.com if startup still fails.

On **Enhance**, select the website's **Deploy Node.js** controls and use the account's supported start-command setting. `node dist/index.js` (or `pnpm start`) runs the built server with the panel's production environment. Exact deployment options vary.[2]

Use the panel's restart/redeploy action after building and setting variables. Do not leave a second SSH-launched copy running, use `nohup` as a deployment substitute, or hard-code a public port. Requests must reach Express, which serves both API and React routes and handles legacy redirects.

## 11. Future uploads and acceptance checks

Bundled current files work without a new storage account. **New administrator uploads require a configured S3-compatible provider and private bucket.** Set all six template variables (`S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`) using that provider's instructions. Restrict credentials to the intended bucket; do not expose keys to the browser or make the entire bucket public. Back up those objects separately from MySQL. Until configured, do not assume new uploads will work on Hosting.com.

After a separately authorized staging installation, verify:

| Area | Expected result |
| --- | --- |
| Navigation | Seven entries: Home, About IBAA, Study Circles, Temple Outreach, Sign up → Membership, Donate, Buddha Map |
| About | `/about/governance` and `/about/directors` load correctly |
| Monthly meetings | `/study-circles` contains monthly meetings and written records |
| Written record | `/study-circles/minutes/{slug}` opens a real published record; optional media supplement the writing |
| Old minutes address | `/meeting-minutes` redirects to `/temple-outreach`; it is not the monthly-meeting listing |
| Members | `/member-temples`, `/communities`, and Temple Outreach show 27 organizations and two separate individual members |
| Donate | Check-by-mail instructions only: IBAA, P.O. Box 2143, Clinton, MD 20735; current donation form opens |
| Other preserved content | Home, News/media archive, Events, Resources, membership form, and representative historical articles/documents load |
| Authentication | `/admin` requires login; newly created individual accounts can sign in, change passwords, and sign out |
| Media and routes | Bundled files match manifests; representative legacy URLs redirect; reference-only archive links are audited |
| Accessibility and HTTPS | Desktop/mobile menus, keyboard operation, forms, direct-route refresh, and valid HTTPS work |

Publishing/upload tests change staging data and require separate authorization. If approved, create only designated test drafts, exercise publishing and uploads, and remove the test material. Never test by editing preserved historical entries.

## 12. Backups, later updates, and troubleshooting

Keep private database backups **outside every public document root**. The following is a future operator command, not a backup executed by this handoff:

```bash
umask 077
mkdir -p "$HOME/private-backups"
mysqldump --single-transaction --no-tablespaces -h DB_HOST -u FULL_USER -p FULL_DATABASE_NAME > "$HOME/private-backups/ibaa-$(date +%F-%H%M%S).sql"
```

Replace non-secret placeholders with actual names. `-p` prompts privately; never append the password to it. Check exit status and backup size, store an independent encrypted copy, and test restoration into another private database. Keep source/build versions, runtime settings, and S3 objects as separate backups.

Before later migrations, take a backup and retain the previous application. Install/build the new source, run approved migrations, restart, and verify. **Do not rerun the public seed after editorial changes.** Rolling back source does not roll back schema; restore a database backup only through a planned, authorized procedure.

| Problem | Next check |
| --- | --- |
| `DATABASE_URL is required` in SSH | Repeat the hidden terminal prompt; panel variables are not inherited |
| Database access denied | Full prefixed names, encoded password, host, and user-to-database privileges |
| Table already exists on initial import | Stop; wrong/nonempty database or mixed bootstrap methods |
| Migration/FK/index error | Stop and inspect compatibility and logs; do not disable foreign keys or mark failed migrations complete |
| `503`, ESM startup error, or generic placeholder | Node runtime, application root, build, startup wrapper/native ESM support, panel variables, and provider logs |
| Current images missing | Extracted asset directory, build copy, and final checksums |
| Old archive binary unavailable | Preservation gap; obtain uploads export or reconcile its original URL |
| Direct public route returns host 404 | Ensure requests reach Node, not a static-only document root |

## Official Hosting.com references

These support the general panel workflows; actual account capabilities and labels must be confirmed before installation.

[1]: https://kb.hosting.com/docs/create-application-with-nodejs-selector "Hosting.com — Creating an application with Node.js Selector"
[2]: https://kb.hosting.com/docs/how-to-deploy-a-nodejs-application-on-enhance "Hosting.com — Deploying a Node.js application on Enhance"
[3]: https://kb.hosting.com/docs/managing-mysql-databases "Hosting.com — Managing MySQL databases"
