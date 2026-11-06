# IBAA Hosting.com Staging Package Manifest

| Item | Value |
| --- | ---: |
| Package files | 647 |
| Uncompressed bytes | 475,028,924 |
| Database migrations | 9 |
| Starter images/documents | 21 |
| Preserved original legacy uploads | 338 |

This source package intentionally excludes Git history, installed dependencies, build output, runtime logs, Manus project metadata, research captures, dotenv files, private keys, and credential files. It includes placeholders only in `deployment/ENVIRONMENT-VARIABLES.template`.

This is the approved current React/Express Node.js website, not a WordPress conversion. All source, current public database seed, migrations, corrected forms and available original media are included. Historical resized-image copies are not duplicated; package-only media URLs use the matching bundled originals. See `deployment/PORTABLE-MEDIA-REPORT.json` for any remaining old-site media dependencies and `deployment-assets/ASSET-INVENTORY.json` for measured coverage. Third-party article/app/video links remain external. No hosting or domain changes were performed.

Verify every packaged file after extraction with:

```bash
sha256sum -c PACKAGE-CHECKSUMS.sha256
```

The definitive beginner instructions are in `HOSTING-COM-STAGING-GUIDE.md`; database instructions are in `deployment/DATABASE-SETUP.md`. The single phpMyAdmin fresh-install SQL is `database/IBAA-database-fresh-install.sql`.
