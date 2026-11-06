# Managed Study Circles QA

The dedicated **Add Study Circle / Dharma Meeting** editor was validated with the existing authorized staff login. A review-only future meeting with region, month, year, exact date, times, temple, nationality, yana, venue note, description, and YouTube URL produced a complete public preview in **46 seconds**. The record was not saved, and the managed Study Circle table remains empty for IBAA staff’s first real entry.

| Validation | Result |
| --- | --- |
| Staff route | `/admin/study-circles` |
| Public route | `/study-circles` |
| Create, draft, publish, edit, delete | Administrator-only procedures covered by automated tests |
| Uploads | Existing secure inline image/flyer component reused |
| YouTube | Existing validated privacy-enhanced embed reused |
| Regional placement | Washington DC, Greater Los Angeles, and San Francisco enums enforced |
| Ordering | Published managed records sorted newest first and merged with preserved records |
| Existing archive | Retained; no static record was removed or edited |
| October 3 SF | Retains in-person-only and no-video context |
| Icons | Washington monument, Los Angeles sun, San Francisco lotus-by-the-bay |
| Desktop review | Passed at 1280 × 900 |
| Mobile review | Passed at 390 × 844 |
| Automated tests | 100 passed across 27 files |
| Production build | Passed |
| Study Circles Lighthouse | Accessibility 100; SEO 100 |
| Admin login Lighthouse | Accessibility 100 |
| Runtime logs | No current browser errors or failed application requests |

The final source-integrity review found no changes to the Vesak source data, homepage, News & Media implementation, public header/footer, existing photographs, or Old Glory palette tokens.
