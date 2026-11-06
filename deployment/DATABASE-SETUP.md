# IBAA database setup on Hosting.com

**Prepared: November 3, 2026. Instructions only — no remote database has been created or modified by this handoff.**

This database belongs to the current **React/Express, Node.js 22, MySQL application**, not WordPress. Use a **new, empty database**. Never import this bundle into the old WordPress database or a database already used by staff.

The download contains the application schema and approved public data, not a full private production backup. The public exporter covers all managed published content and its categories, tradition tags, attachments, media references, Events, minutes, Study Circles, and verified member organizations when present. It excludes existing user/staff credentials, sessions, contact inquiries, and drafts. A new non-login attribution row in `users` keeps foreign keys valid; it is not an administrator login.

Media rows are metadata, not binary backups. The site package separately preserves 21 current managed files and 338 verified archived WordPress originals, with matched historical URLs remapped to local originals. It does not contain every WordPress filesystem file or resized variant. Consult the package asset audit/manifests for binary coverage and remaining outside-scope external references.

## 1. Create a database and database user

### cPanel

1. Sign in to the correct Hosting.com hosting account and open cPanel.
2. Open **Manage My Databases**. Older versions call it **MySQL Databases**.[1]
3. Under **Create New Database**, choose a new suffix such as `ibaa_stage` and create it.
4. Record the **full database name** displayed afterward. It may be prefixed, such as `account_ibaa_stage`.
5. Under **Add New User**, create a separate user with a strong, newly generated password. A random 32-character hexadecimal password is convenient for connection URLs. Save it only in a password manager.
6. Record the **full username**, including any prefix. It is not necessarily the same as your SSH username.
7. Under **Add User to Database**, select the new user and only the new IBAA database, then select **Add**.
8. Choose **ALL PRIVILEGES** and save using **Make Changes**. These privileges must apply to this one database, not the whole MySQL server.

### Enhance

Open the selected website's database-management controls and create a fresh MySQL database plus dedicated user. Associate the user with that database with the permissions needed to create/alter tables and read/write rows. Record the actual host, port, full database name, and user. Enhance screens and account permissions vary; consult Hosting.com if the controls are unavailable. Do not infer cPanel prefixes or invent a server hostname.

Use Hosting.com's internal database host. `127.0.0.1:3306` is an example for a local database, not universal. Do not enable public MySQL access or use a server root account.

## 2. Select utf8mb4 and confirm emptiness

Open phpMyAdmin through the authenticated hosting panel and select the **new** database in the left sidebar. Verify its name before using **SQL**. Run the following after replacing the placeholder with the actual full database name:

```sql
ALTER DATABASE `FULL_DATABASE_NAME`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SELECT DATABASE() AS selected_database;
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = DATABASE();
SHOW TABLES;
```

The character set should be `utf8mb4`, and `SHOW TABLES` must show no tables before bootstrap. If the hosting account cannot alter the new database's charset, ask Hosting.com to set it before importing. Never apply this command to the old WordPress database.

**Compatibility checkpoint:** use the packaged installer or combined SQL, not manual imports of raw `drizzle/*.sql` files. `scripts/mysql-migration-sql.mjs` removes generated statement markers and normalizes the legacy-path unique index to a 768-character prefix for standard MySQL's utf8mb4 index-byte limit; the full 1,024-character URL field is retained. The combined SQL uses the same normalization. If the provider still reports an index-length, collation, or foreign-key error, stop and obtain a reviewed compatibility fix; do not switch to a lossy charset, shorten source URLs yourself, disable foreign-key checks, or mark a failed migration complete. A partially applied DDL import is not automatically rolled back.

## 3. Construct and store DATABASE_URL privately

The URL structure is:

```text
mysql://FULL_USERNAME:URL_ENCODED_PASSWORD@DB_HOST:3306/FULL_DATABASE_NAME
```

Use the complete names from the hosting panel. Percent-encode only components such as username/password, not the entire URL. Reserved punctuation changes URL parsing: `@` → `%40`, `:` → `%3A`, `/` → `%2F`, `#` → `%23`, `%` → `%25`, `?` → `%3F`. A plus sign must be `%2B`, not used as a substitute for a space. Do not double-encode.

Use a password manager's encoding utility or, if Python 3 is available in a **private, non-recorded** terminal:

```bash
python3 -c 'import getpass, urllib.parse; print(urllib.parse.quote(getpass.getpass("Database password: "), safe=""))'
```

The prompt is hidden and the password is not placed in shell history. The resulting encoded password is still a secret: encoding is not encryption. Save it privately and exclude the output from screenshots/transcripts. Never use a public online URL encoder for a real password.

Add `DATABASE_URL` to Hosting.com's Node.js application environment, along with `NODE_ENV=production` and a new random `JWT_SECRET`. Use `deployment/ENVIRONMENT-VARIABLES.template` for names only. Do not put a completed secret file, SQL backup, or credentials in a public directory, repository, download archive, or chat. No `VITE_` variable may contain secrets.

MySQL connections normally use utf8mb4 through the driver, and the public seed sets `SET NAMES utf8mb4`. Verify the database and table collations below. If the provider requires TLS, obtain its supported certificate/settings; the migration/seed runners recognize `ssl=true` or `ssl-mode=REQUIRED` with certificate verification. Confirm equivalent TLS configuration for the application and administrator bootstrap with the hosting provider; do not assume a query flag makes every driver path identical.

## 4. Prepare the SSH terminal

SSH into the authorized account, enter the extracted application root, and activate the Node environment using the exact command shown in cPanel's Node.js Selector. On Enhance, follow the account's SSH/runtime instructions.[2] [3] Confirm a compatible Node.js 22 runtime, at least 22.12, and install dependencies as described in the root hosting guide:

```bash
cd ~/apps/ibaa-staging
node --version
npx --yes pnpm@10.4.1 install --frozen-lockfile --prod=false
```

**Panel environment variables do not automatically transfer to SSH.** Privately set the terminal's variable in Bash:

```bash
read -rsp 'DATABASE_URL: ' DATABASE_URL; export DATABASE_URL; echo
```

Paste the connection URL at the hidden prompt and press Enter. Never put the real URL in an `export ...` command, command argument, or shell history. Repeat the prompt in each new terminal session. Do not print the variable to test it.

## 5. Choose exactly one fresh-install method

### Method A — Node migration and public-seed runners (recommended)

From the application root:

```bash
node scripts/apply-migrations.mjs --dry-run
```

Expected output lists these **nine** files:

```text
0000_bored_logan.sql
0001_vengeful_red_shift.sql
0002_chunky_vargas.sql
0003_busy_firedrake.sql
0004_powerful_joseph.sql
0005_marvelous_thunderbolts.sql
0006_thick_pet_avengers.sql
0007_slim_deathbird.sql
0008_overrated_robin_chapel.sql
Migration dry run passed: 9 ordered SQL files found.
```

This is a file/order check, not a database connection or SQL execution test. If it lists a different number, check the package before continuing.

```bash
node scripts/apply-migrations.mjs
node scripts/apply-public-seed.mjs
node scripts/apply-public-seed.mjs
```

The first command applies schema files in order and records successful filenames in `ibaa_staging_migrations`. The seed inserts approved public rows with valid ownership/reference ordering. Do not disable foreign keys.

The second seed execution is an initial repeatability check **only while the deployment is fresh and unchanged**. Its upserts can overwrite content that staff later edit. Do not rerun it as part of routine updates, or against an editorial/live database. The seed runner's console text may use its older “Events and Meeting Minutes” description; the SQL and `deployment/PUBLIC-SEED-COUNTS.json` describe the complete export.

### Method B — phpMyAdmin combined SQL import

Use this instead of Method A when a panel import is preferred; the Node application and later staff bootstrap still require Node.js hosting.

1. Select the fresh database in phpMyAdmin. Verify `SHOW TABLES` is empty and its charset is utf8mb4.
2. Open **Import**, choose the supplied **`database/IBAA-database-fresh-install.sql`**, and select SQL format/UTF-8 file encoding where offered.
3. Keep foreign-key checking enabled. Import once and wait for the success report.
4. Run the verification queries below.

The combined file contains schema DDL, approved public rows, and migration-history records for all nine filenames. **Do not import it twice, run it after Method A, or import the nine schema files again.** It does not include your private credentials. If the browser's upload/time limit is insufficient, use Method A rather than splitting the file arbitrarily.

After an error, stop: a partial DDL import may have created tables even if rows rolled back. Do not repeatedly click Import. Confirm you are working only on a disposable new database, then obtain guidance on recreating that fresh database and restarting one method cleanly. Never drop an existing editorial database as a troubleshooting shortcut.

## 6. Verify schema and current public rows

In phpMyAdmin's SQL tab, or in the MySQL client connected to the selected new database:

```sql
SELECT DATABASE() AS selected_database;
SELECT filename FROM ibaa_staging_migrations ORDER BY filename;
SELECT COUNT(*) AS completed_migrations FROM ibaa_staging_migrations;

SELECT COUNT(*) AS table_count
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE';

SELECT TABLE_NAME, TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

SELECT 'members' AS item, COUNT(*) AS rows_found
  FROM temple_directory_entries
  WHERE status = 'published' AND verificationStatus = 'verified'
UNION ALL SELECT 'media', COUNT(*) FROM media_assets
UNION ALL SELECT 'meeting_minutes', COUNT(*) FROM meeting_minutes WHERE status = 'published'
UNION ALL SELECT 'events', COUNT(*) FROM event_entries WHERE status = 'published'
UNION ALL SELECT 'managed_news', COUNT(*) FROM content_entries WHERE status = 'published'
UNION ALL SELECT 'categories', COUNT(*) FROM content_categories
UNION ALL SELECT 'managed_study_circles', COUNT(*) FROM study_circle_entries WHERE status = 'published'
UNION ALL SELECT 'database_legacy_routes', COUNT(*) FROM legacy_routes
UNION ALL SELECT 'minute_tradition_links', COUNT(*) FROM meeting_minutes_traditions
UNION ALL SELECT 'event_tradition_links', COUNT(*) FROM event_entry_traditions
UNION ALL SELECT 'news_tradition_links', COUNT(*) FROM content_entry_traditions
UNION ALL SELECT 'category_links', COUNT(*) FROM content_entry_categories
UNION ALL SELECT 'attachment_links', COUNT(*) FROM content_entry_media
UNION ALL SELECT 'attribution_users', COUNT(*) FROM users
UNION ALL SELECT 'staff_accounts', COUNT(*) FROM staff_admin_accounts
UNION ALL SELECT 'staff_sessions', COUNT(*) FROM staff_admin_sessions
UNION ALL SELECT 'private_inquiries', COUNT(*) FROM contact_inquiries;
```

Expect **9 migration records** and **18 base tables**: the 17 application tables plus `ibaa_staging_migrations`. Table collations should be utf8mb4-based. Before creating administrators, the November 3 public seed has:

| Item | Expected rows |
| --- | ---: |
| Published verified member organizations | 27 |
| Managed media metadata | 3 |
| Published written minutes | 1 |
| Published Event database rows | 9 |
| Managed News/media entries | 0 |
| Categories | 0 |
| Managed Study Circle entries | 0 |
| Database legacy-route rows | 0 |
| Minutes / Event tradition links | 3 / 5 |
| News tradition / category / attachment links | 0 / 0 / 0 |
| Non-login attribution user | 1 |
| Staff accounts / sessions / inquiries | 0 / 0 / 0 |

Use **`deployment/PUBLIC-SEED-COUNTS.json`** as the snapshot's authoritative count reference. The attachment/category/tradition relationship tables are also present; some are empty because no corresponding managed entries exist yet.

Zero managed News/Study Circle rows does **not** mean the public archive is missing: 29 historical posts, 17 pages, static regional meeting archives, and five clippings are preserved in source. Two individual members are also source data, not temple rows. The nine Event rows include monthly Dharma meetings shown through Study Circles; the general Events page filters those out, so do not expect nine upcoming public event cards. Legacy redirects also exist in application/source middleware rather than requiring populated `legacy_routes` rows.

## 7. Create a new staff administrator

With the privately exported terminal URL still set:

```bash
node scripts/create-staff-admin.mjs 'Approved Staff Name' 'person@example.org'
```

Replace the name/email with a real authorized administrator. The script generates and displays a temporary password once; capture it only in a password manager and share privately. Do not add a password argument, use exposed chat credentials, or create shared generic accounts. It refuses duplicate emails.

Once the built application is running over HTTPS, sign in at `/admin` and change the password at `/admin/account`. Repeat only for approved additional administrators. Your expected account/session counts change after this step and login; the public seed's zero counts describe the state **before** bootstrap.

Clear the terminal's credential variable when finished:

```bash
unset DATABASE_URL
```

The panel's runtime setting remains separate and must stay configured for the application.

## 8. Private backups and future changes

The supplied public seed is not a disaster-recovery backup. For future approved operations, create a full database backup before changes:

```bash
umask 077
mkdir -p "$HOME/private-backups"
mysqldump --single-transaction --no-tablespaces -h DB_HOST -u FULL_USERNAME -p FULL_DATABASE_NAME > "$HOME/private-backups/ibaa-$(date +%F-%H%M%S).sql"
```

Use actual non-secret host/user/database names. The standalone `-p` prompts privately; **never append the password or include it in the command**. Store the file outside all document roots, check success/size, keep an independent encrypted copy, and test restoration into a separate private database. Private backups contain staff/session/inquiry data and must not go into the downloadable public package. Back up S3 objects and application source separately.

Later updates may run approved new migrations after backup; do not rerun the public seed after editorial changes. Failed migrations can leave partial DDL despite missing history records. Stop on failure and resolve it with the maintainer/provider, rather than disabling constraints or inserting fake completion records.

## Official references

[1]: https://kb.hosting.com/docs/managing-mysql-databases "Hosting.com — Managing MySQL databases and users"
[2]: https://kb.hosting.com/docs/create-application-with-nodejs-selector "Hosting.com — Node.js Selector"
[3]: https://kb.hosting.com/docs/how-to-deploy-a-nodejs-application-on-enhance "Hosting.com — Node.js deployment on Enhance"
