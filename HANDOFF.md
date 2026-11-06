# IBAA Website Rebuild Handoff

The repository contains the rebuilt public IBAA website, verified legacy archive, permanent redirect map, secure staff email/password publishing, secure YouTube support, cloud media metadata, managed Events, managed regional Study Circles, a managed member-temple workflow, a written-first Dharma Meeting Minutes archive/editor, and a privacy-conscious contact inquiry queue. News, Events, Study Circles, and Meeting Minutes use the same non-technical form pattern with drafts, previews, computer image uploads, editing, unpublishing, and confirmed deletion. Published managed Study Circles appear automatically in the correct Washington DC, Greater Los Angeles, or San Francisco regional card while the verified archive remains intact. The supplied 15-person Board of Directors roster is presented with an explicit IBAA verification note, and both `/communities` and `/member-temples` resolve to the managed directory.

| Start here | Purpose |
| --- | --- |
| `docs/hosting-com-deployment.md` | External Hosting.com deployment, compatibility, database, media, staff authentication, DNS, and acceptance checklist |
| `docs/quality-assurance.md` | Automated, Lighthouse, keyboard, responsive, runtime, and security validation |
| `docs/migration-implementation.md` | Content and route migration totals and behavior |
| `docs/asset-disposition.md` | Managed versus reference-only media and file decisions |
| `docs/buddhist-representation-review.md` | Independent representation, terminology, bias, factual, and launch-readiness review |
| `docs/temple-directory-workflow.md` | Formal roster governance and provisional-to-managed migration |
| `docs/nontechnical-publishing-guide.md` | Email/password login, Events, Study Circles, News, Meeting Minutes, uploads, contact inquiry, and member-temple administration |
| `docs/urgent-fixes-qa.md` | Communities, leadership, Meeting Minutes, contact, route, responsive, and Lighthouse validation |
| `research/inventory/README.md` | Complete legacy content, media, file, taxonomy, and route inventory |
| `todo.md` | Implementation history and remaining IBAA-controlled launch decisions |

The final verified commands are `pnpm check`, `pnpm test`, and `pnpm build`. The application starts with `pnpm start` and listens on the environment-provided `PORT`.

Manus remains the primary managed development workspace. Manus built-in hosting supports custom domains and managed storage. If IBAA proceeds with Hosting.com, follow the full cutover guide; staff authentication is portable through MySQL, but administrator uploads must not be enabled until IBAA-controlled S3-compatible storage is verified.
