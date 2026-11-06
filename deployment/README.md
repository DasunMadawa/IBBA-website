# IBAA Hosting.com Staging Package

Start with `HOSTING-COM-STAGING-GUIDE.md` in the package root. Do not upload this application as a static site or place source files under `public_html`.

| Package item | Purpose |
| --- | --- |
| `client/`, `server/`, `shared/`, `drizzle/` | Current full-stack source and all eight database migrations |
| `scripts/apply-migrations.mjs` | Ordered, repeatable staging migration command |
| `scripts/apply-public-seed.mjs` | Loads only current public Events and Meeting Minutes |
| `scripts/create-staff-admin.mjs` | Creates new staging admins with random one-time passwords |
| `deployment-assets/manus-storage/` | Fourteen current images and PDFs copied automatically during build |
| `deployment-assets/CHECKSUMS.sha256` | SHA-256 verification for those fourteen files |
| `deployment/ENVIRONMENT-VARIABLES.template` | Secret-name worksheet with placeholders only |
| `deployment/seed-current-public-content.sql` | Public records only; no accounts, sessions, drafts, or inquiries |

The ZIP must never contain a completed `.env` file, live password, database backup, staff session, contact inquiry, or private API key.
