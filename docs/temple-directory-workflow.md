# Managed Member-Temple Directory Workflow

The public community page now separates the **formal managed roster** from the **provisional Study Circle host archive**. No provisional host is silently promoted to membership.

## Data Governance

| Record state | Public behavior |
| --- | --- |
| Draft + pending | Visible only to administrators |
| Draft + verified | Visible only to administrators and ready for publication review |
| Published + verified | Displayed publicly as a verified IBAA directory record |
| Published + pending | Rejected by both client and server validation |
| Provisional Study Circle host | Remains visibly labeled as provisional until a verified managed record with the same community name and city replaces it |

The `temple_directory_entries` table stores the verified public name, slug, publication status, verification status, community-preferred tradition label, lineage context, description, address fields, city, region, country, public website, public email, legacy source URL, verifying administrator, and timestamps. The formal roster is intentionally independent of the hard-coded historical Study Circle host list.

## Administrator Process

Authorized administrators use `/admin/temples` to create or edit a record. A record begins as **Pending review** and **Draft**. The editor validates names, slugs, descriptions, location, email, and HTTPS URLs. Administrators confirm the community-preferred tradition label rather than inferring it from the old archive.

After an authorized roster or community representative confirms the record, an administrator changes verification to **Verified**. Only then can the record be published. Unpublishing does not erase verification, and deletion requires an accessible confirmation dialog.

## Incremental Migration

The public `/member-temples` directory merges published verified records with unmatched provisional Study Circle hosts. Matching uses normalized community name and city. When a verified managed record is published for a provisional host, the managed record replaces that host card; other provisional cards remain visible and labeled. This allows IBAA to confirm the roster incrementally without losing historical context or creating a false implication that every Study Circle host is a current member.

The public query returns only records that are both `published` and `verified`. Administrator list, save, status, and delete procedures are role-gated. Automated tests cover anonymous and non-admin rejection, publication-before-verification rejection, insecure URL rejection, provisional fallback rendering, managed record rendering, and coexistence during incremental migration.
