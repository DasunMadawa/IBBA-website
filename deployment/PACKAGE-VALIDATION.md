# Hosting.com Staging Package Validation

**Validation date:** September 1, 2026

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Automated tests | 86 passed across 24 test files |
| Production build | Passed |
| Clean packaged-source install | Passed with the pinned lockfile |
| Ordered migration dry run | Eight files, `0000` through `0007` |
| Starter assets | Fourteen files; every SHA-256 checksum passed |
| Current public seed | Two media records, one Meeting Minutes record, four Events |
| Private-data exclusion | Staff accounts, sessions, inquiries, drafts, credentials, dotenv files, and private keys excluded |
| Package file checksums | Passed |
| ZIP archive integrity | Passed |

The staging seed intentionally contains public content only. New Hosting.com staff accounts must be created with `pnpm staff:create`, and future uploads require the documented private S3-compatible bucket.
