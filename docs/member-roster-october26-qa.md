# October 26, 2026 — supplied membership roster and Treasurer address

This update is confined to the existing IBAA manus.space staging project. No Hosting.com or custom domain is changed.

## Membership

The user's supplied roster contains 27 temples/organizations, 12 supplied website URLs, and 15 organizations without supplied websites. It also contains two individual members: Rajinder Kumar (Clovis, CA) and Young Ho Jin Wol Lee (Livermore, CA). The blank numbered record and any “not found” values are not represented. No tradition, biography, email, missing street address or extra website is inferred.

The 27 real organizations are published in the existing admin-managed `temple_directory_entries` table, confirmed against the IBAA-supplied membership list rather than independent validation of organizations' addresses. The table was empty before the import. No Study Circle archive row was changed or deleted. The previous provisional-host membership fallback/merge is removed, so additional meeting hosts are not falsely included as members. Individuals appear under a separate small Individual Members heading and are not stored as temples.

A shared MemberRoster renders the same current records on Member Temples, its Communities alias and Temple Outreach. About includes a discoverable member-directory link. The unused former public-directory export points to the same managed page. Admin forms/procedures permit genuinely missing tradition/biography/state fields, retain verification and admin-only gates, and do not force invented information when editing a supplied partial address. Search includes full address and preserves the existing state/city filters. Organizations are alphabetized by the existing database query.

The public API was checked row by row against `shared/ibaaMembers.json`: all 27 names and displayed addresses, all 12 supplied URLs, all 15 missing websites and blank unprovided tradition/biography fields match exactly. Tzu Chi remains “Arcadia, CA”; Gowoo Sunim remains “New York.” The existing safe public seed now includes the 27 members with portable bootstrap ownership; all existing Event/Meeting Minutes/media seed lines are unchanged.

## Donate

The current Donate text is exactly: “Please mail checks to IBAA, attention Venerable Thongvanh, Treasurer, P.O. Box 464, Lorton, VA 22199.” The previous Berkeley address and membership-form source link are removed from this page. The PayPal placeholder is unchanged and contains no fake link/button. Dharma College's legitimate member address at 2222 Harold Way is retained; the user's removal instruction applies to Donate, not the member roster or preserved archive.

## QA

The first full suite passed 135 tests, TypeScript and production build. Desktop and 390px mobile captures cover Member Temples, Temple Outreach, About's member link and Donate. Actual 390px viewport checks found 27 organization cards, 12 links, a one-column grid, zero overflowing cards, and correct separate individual text.

The dev preview initially had a stale existing database connection: a fresh process returned the real 27 records while the older dev server did not. Only the development service was restarted; its health check and actual API then returned all 27 records, and populated desktop/mobile captures were rechecked. No workaround or fallback data hides query errors.

Source preservation checks show no changes to global CSS/palette, top navigation, Home/Mission, Study Circle content/photos/rendering, Vesak/legacy content or redirects. Final full regression/build and live staging propagation verification follow.

Final local validation: all 135 tests passed; TypeScript, production build and exact protected-source checks passed. All existing seed records remain unchanged. Only checkpoint propagation and live verification remain.

## Live staging completion

The exact bundle propagated to the existing manus.space staging hostname. Live Member Temples and Temple Outreach show 27 real member organization cards and 12 supplied website links, with both named individuals separately displayed. Tzu Chi USA shows Arcadia, CA only; Gowoo Sunim shows New York only. No provisional host records are appended. Live Donate shows the exact Treasurer/Lorton sentence, no Berkeley address/source link, and the unchanged non-clickable PayPal placeholder. All checklist items are complete. No Hosting.com or custom-domain publication was performed.
