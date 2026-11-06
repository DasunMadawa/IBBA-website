# October 22, 2026 pre-launch staging refinements

The requested changes apply only to the existing `ibaanatnl-8cbczwdp.manus.space` staging site. No Hosting.com or custom-domain deployment is authorized.

## Donation address evidence

The existing Membership registration form, available at `/manus-storage/ibaa-application-form_0bbb5887.pdf`, ends with “Please mail this registration form to: International Buddhist Association of America / 2222 Harold Way / Berkeley CA 94704.” The preserved archive identifies its original publication as `https://www.ibaa.org/wp-content/uploads/2023/08/IBAA-Application.pdf`. The preserved Contact page also gives 2222 Harold Way, Berkeley CA 94704. This is a sourced street address; the document itself instructs membership-form returns, not donation-check mailing.

The older donation form, `/manus-storage/ibaa-donation-form_c3028c7b.pdf`, says “For future donation, if you prefer to mail a check, please address it to: IBAA / P.O. Box 464 / Lorton, VA 22199.” Its original publication is `https://www.ibaa.org/wp-content/uploads/2017/10/IBAA-Donation-Form.pdf`.

Because these payment/membership destinations differ, a deferred confirmation question was sent to the user before choosing a check-mailing destination. The user explicitly answered “Use 2222 Harold Way, Berkeley, CA 94704” on October 22, 2026. The new Donate page therefore instructs mailed checks to International Buddhist Association of America at that approved address and credits the 2023 membership registration form. No address is invented and no temple association is inferred. The reserved PayPal space is informative text, not a clickable or fake donation button.

## Member Temple directory

A read-only query on the current staging database found **zero** formally published, verified Member Temple records. The actual public Member Temples page shows **six communities**, explicitly marked as provisional Study Circle hosts:

1. Drikung Kagyu Temple — Fairfax, Virginia.
2. Ekoji Buddhist Temple — Fairfax Station, Virginia.
3. International Buddhist Center — Silver Spring, Maryland.
4. Wat Yarnna Rangsee — Sterling, Virginia.
5. Won Buddhist Temple — Alexandria, Virginia.
6. Chua Dieu Phap — Los Angeles, California.

These hosts must not be described as a confirmed formal member roster. No new membership records were inserted and no host was promoted to membership.

## Implemented changes and local validation

The original Home, About IBAA, Study Circles and Temple Outreach destinations remain. Sign up is a keyboard-operable disclosure with Membership pointing to the existing `/join` page and its preserved application form; Donate points to `/donate`; Buddha Map uses `/temple-outreach#buddha-map` and retains the exact requested Google Play destination within that section. The earlier four-item limit is explicitly superseded.

Our Mission no longer renders its source/WordPress context panel, but every original Mission paragraph remains unchanged in both source data and displayed body. Mission prose on Home and the About Mission page is enlarged to a responsive 1.4–1.65rem. Other legacy pages retain their source context.

Only the October 17 George Washington University heading classifications change to University / Interdenominational, and its unconfirmed-time text is removed. Its photo, date, region, caption and past placement are retained. Other photos and meeting metadata are unchanged.

All 127 regression tests, TypeScript and production build checks passed after the local refinements. Desktop and 390px mobile views of Mission and Donate were visually reviewed. The donation-address dependency is resolved by explicit user confirmation. Final validation and staging-only checkpoint/live verification follow.

The expanded menu was additionally exercised in the real app inside a 390px same-origin preview frame. Menu and Sign up both expanded; Membership remained visible and linked to `/join`; the menu used one column, fitted within the viewport and had no horizontal overflow. The transient QA frame was removed.

Final address approval was visually checked on desktop and 390px mobile. The new Buddha Map nav hash scrolls to its panel after lazy page mounting; the dedicated regression and preview navigation both passed. Final full suite: 127 tests passed, TypeScript and production build passed. The original Mission archive data, Board/other About content, meeting/photos except the requested GWU labels/time, and palette tokens remain preserved.

## Live staging verification

The exact built bundle propagated to the existing manus.space hostname. Live Donate shows the approved full Berkeley address, Membership dropdown links to `/join`, the credited application PDF responds HTTP 200 with application/pdf, and no fake PayPal link exists. Live Mission has eight retained body paragraphs, no legacy source panel, and actual computed Mission/intro font of 25.6px in the desktop viewport. Live Study Circles shows October 2026 — George Washington University (University, Interdenominational), Washington DC / October 17 date, retained photo and no unconfirmed-time text. Live Buddha Map hash navigation scrolls to the correct app section. All checklist items are complete; no Hosting.com or custom domain was modified.
