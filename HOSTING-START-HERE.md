# Start here — IBAA Hosting.com handoff, November 3, 2026

This download contains the **current approved IBAA website**, built with React and Express on **Node.js 22 with MySQL**. It is **not a WordPress theme/export** and is not an FTP-only static website. WordPress conversion was discussed but has not been commissioned or implemented.

Read `HOSTING-COM-STAGING-GUIDE.md` for the complete beginner walkthrough. Read `deployment/DATABASE-SETUP.md` for database creation, connection variables, migrations, seed loading and safe backups. `database/IBAA-database-fresh-install.sql` is the combined alternative for phpMyAdmin on a **new empty database only**; the preferred installation is the included tracked CLI migration runner plus public seed.

The ZIP contains all application source, admin CMS, package/lock files, migrations 0000–0008, the current approved public database seed, 21 current managed images/documents and 338 successfully retrieved original archival upload files. The archived originals total hundreds of megabytes, which explains the large download. Original WordPress resized copies are not duplicated: package-only media references use the matching original photograph. The staged source is not changed by this conversion of media paths. External article citations, app-store links, YouTube embeds and third-party reference files still require the internet.

The current public seed contains 27 organization members, three media metadata rows, nine preserved Event database rows and one published written meeting record with tradition relations. The static regional Study Circle archives, two individual members, historical posts/pages and five news clippings are preserved in the source. Nine Event rows does not mean nine upcoming public events: monthly Dharma Meetings are intentionally displayed on Study Circles instead of duplicated on Events.

For privacy and security, the package is not a full private production-database dump. Existing staff accounts, passwords, sessions, drafts and contact inquiries are intentionally excluded. Create new administrator accounts after installing the schema. Do not reuse temporary passwords previously shared in chat. Keep all secrets in Hosting.com's environment controls or a private owner-readable file outside the document root; never upload them to `public_html`.

Run Node from a private application directory, not the domain's document root. cPanel/Passenger can use `startup.cjs` to load the compiled ESM server; standard Node deployment starts `dist/index.js`. Build first and configure private S3-compatible storage for future staff uploads. The bundled existing assets work locally without Manus storage credentials.

All current content refinements are included: Temple Outreach, About Governance/Directors locations and redirects, the current expanded navigation, regional upcoming/past grouping, September and October group photographs, the complete supplied member roster, larger Mission text, and check-only Donate with **IBAA, P.O. Box 2143, Clinton, MD 20735**. Current membership and donation forms use that address. There is no online-payment placeholder on public pages.

Before deploying, confirm Hosting.com supports your selected Node.js version, MySQL, SSH/SFTP and SSL. Keep the installation on a separate staging hostname until IBAA gives final approval. Preparing this download does not change the current staging site, Hosting.com account, DNS or custom domains.

After extracting, run `sha256sum -c PACKAGE-CHECKSUMS.sha256` to check files. See `PACKAGE-MANIFEST.md`, `deployment/PUBLIC-SEED-COUNTS.json` and `deployment/PORTABLE-MEDIA-REPORT.json` for measured package content and any residual media dependencies.
