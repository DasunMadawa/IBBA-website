# October 27, 2026 — Clinton mailing address correction

The user supplied an administrator's correction identifying the prior Lorton PO box as obsolete. The current postal destination for IBAA checks and membership registration is:

**IBAA**  
**P.O. Box 2143**  
**Clinton, MD 20735**

This is a postal mailing destination, not a temple street address. No temple location has been inferred from it. This correction supersedes the user's earlier Berkeley and Lorton donation instructions.

## Implemented changes

Donate uses the Clinton postal address and retains the original payee/instructions and honest non-clickable PayPal placeholder. Membership displays the same address beside its application download. The active Membership and Resources document links point to address-corrected membership and donation PDFs. At the application layer, old managed PDF download URLs return direct 301 redirects to the corrected files, retaining query strings; GET and HEAD are covered. Staging’s platform storage gateway serves these routes before Express, so the two stable original storage keys were also updated with the corrected form bytes after preserving SHA-256-identical originals outside the project. This prevents previously shared links from serving the old address. Original historical archive text/inventory and original PDF backups are retained.

The membership PDF's return block now reads IBAA / P.O. Box 2143 / Clinton, MD 20735. The donation PDF contained the old Lorton PO box as well, so its current download was corrected to avoid contradictory mailed-check instructions. Both PDFs retain their original one-page Letter format, logos, membership fee, form fields, all other text, and layout. Underlying old address text was redacted and replaced rather than hidden by a white overlay. PDF font subsets required matching base-14 substitutes for previously unused letters in the new address. Text outside the mailing blocks is identical after whitespace normalization; 4× pixel comparisons show zero differing bytes outside those blocks. Original source copies are SHA-256-identical. Parent visual review of both final page renders passed.

Current corrected files are stored externally under `/home/ubuntu/webdev-static-assets/ibaa/oct27/` and uploaded through the existing managed storage. Starter copies were saved outside the project for future portable delivery; no Hosting.com deployment or custom-domain changes were made.

## Membership questions deferred

Venerable Jinwol's temple affiliation and the Rajinder Kumar and Gowoo Sunim entries remain unchanged pending IBAA clarification. The email expresses uncertainty, not a confirmed correction or deletion instruction. The member roster, individuals, Board, Study Circles, photographs and existing Cambodian temple names are unchanged. No membership database rows were modified.

## Validation

All 138 tests passed, including three new current-address/form-redirect regressions. TypeScript, production build and diff checks passed. Desktop and 390px mobile Donate, Membership and Resources layouts were reviewed. Both actual downloaded preview PDFs return valid PDF bytes with SHA-256 checksums matching the final local files. Original managed URLs redirect in one hop to the corrected copies. Exact source comparisons confirm all media, Study Circles, articles, clippings, Board and other public-page content remain unchanged apart from membership return instructions. CSS, menu, member roster, legacy generated data and public database seed are unchanged.

Live verification is complete. Donate and Membership show IBAA / P.O. Box 2143 / Clinton, MD 20735. Membership links to the revised application. The two new versioned PDFs and both stable previously shared managed URLs download valid corrected PDFs whose SHA-256 checksums match the final validated local files. A first terminal-client/CDN request returned 403 during initial release checking; normal browser downloads and subsequent browser-style HTTP requests succeeded, and all four file URLs were checked. No remaining issue or source workaround is present. PayPal and all member records remain unchanged. No Hosting.com or custom-domain publication was performed.
