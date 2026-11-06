# Non-Technical Publishing Guide

The administrator area is designed for authorized IBAA editors. Open `/admin`, enter an approved administrator email and password, and select **Sign in**. After authentication, use the left navigation for **News**, **Events**, **Study Circles**, **Media library**, **Meeting Minutes**, **Contact inquiries**, **Member temples**, and **Account**. A non-admin account cannot open these procedures even if it knows the URL. Select the always-visible **Log out** button when finished, especially on a shared computer.

Open **Account** to change the current administrator’s display name, email, or password. Confirm the existing password before saving. A successful change signs the administrator out so the new credentials can be tested immediately. New passwords must contain at least 14 characters.

## Publish News

Open **News**. Enter the title, publication date, category, short body, optional tradition tags, and optional photo. The URL is generated automatically and does not require editing.

Drafts are private. Use the preview beside the editor before publishing. A published record appears automatically on `/news-media`. Existing managed posts can be edited, published, unpublished, or deleted; deletion always requires confirmation.

## Publish an Event

Open **Events** for activities other than monthly Dharma Meetings; enter the title, date, start and end times, city or region, venue, address, represented traditions, and short description. For a monthly Dharma Meeting, use **Study Circles** instead so it appears in the regional meeting archive. Pacific time is selected by default. Leave both time fields blank only when an existing schedule is genuinely to be determined. Add an optional Zoom link, YouTube link, or image.

Use the public preview before choosing **Published**. A published non-meeting Event appears automatically on `/events`, with upcoming dates first and past managed Events newest first. Older monthly meeting Event records remain editable in the admin list but are not duplicated on the public Events page; verified meeting listings remain on `/study-circles`.

## Add a Study Circle / Dharma Meeting

Open **Study Circles**. In the single form, choose Washington DC, Greater Los Angeles, or San Francisco Bay Area. Choose the exact date; the month and year update automatically. Enter the times when confirmed, leave Pacific selected unless another zone applies, and add the temple, nationality, yana, venue note, and short description.

An optional flyer or photo can be uploaded directly from the computer. An optional YouTube link embeds automatically; do not upload a video file. Use the preview beside the form, keep the status as **Draft** during review, and change it to **Published** when ready. The record then appears automatically in the correct regional card on `/study-circles`, sorted newest first. Existing managed records can be edited, unpublished, or deleted from the list below the form.

## Add a YouTube Video

Paste a standard YouTube watch URL, `youtu.be` short URL, Shorts URL, or embed URL into the optional video field. Add a clear accessible title that tells users what the video contains. The editor rejects other hosts, malformed video IDs, insecure URLs, or a YouTube URL without a title. Published videos use YouTube’s privacy-enhanced domain and responsive framing.

## Upload an Image or PDF

Each of the News, Events, Study Circles, and Meeting Minutes forms includes an **Upload from this computer** control. Images may be JPEG, PNG, or WebP. Provide a meaningful image description for screen-reader users; the server checks the file type, file signature, size, and administrator role before storing it. The separate **Media library** remains available for reusable images and PDF documents.

Uploaded images can be reused as featured images. Uploaded PDFs can be selected as downloadable attachments on multiple entries. Do not upload private, copyrighted, or personally sensitive documents without authorization.

## Publish Dharma Meeting Minutes

Open **Meeting Minutes**. Enter the title, meeting date, host temple, region, and every represented tradition: Theravada, Mahayana, or Vajrayana. The public URL is generated automatically.

Enter the complete written Meeting Minutes in the main field. The written record is required and remains the primary public content. A YouTube recording is optional; paste a supported YouTube link and it embeds automatically without uploading the video. A group photo or flyer is also optional and can be uploaded directly from the same form.

Keep the entry as **Draft** while checking names, decisions, host details, and representation labels. The public preview beside the editor shows the written summary, selected traditions, optional photo, and optional recording. Change the status to **Published** only after review. Published written records appear newest first in the **Dharma Meeting Minutes** section on `/study-circles`; each has a detail URL under `/study-circles/minutes/`. The former `/meeting-minutes` overview redirects to `/temple-outreach`, while old detail URLs redirect to their preserved written records. The staff editor remains **Meeting Minutes** because its form maintains written meeting records, not Temple Outreach's organization-wide content.

## Review Contact Inquiries

Open **Contact inquiries** to view messages submitted through the public Contact form. Email addresses are visible only in this protected queue. Use **Reply by email** to respond through the administrator’s email application; the website does not invent or publish a general private IBAA address.

Mark a message **Read** after review and **Archive** it when no further action is expected. The public form rejects malformed submissions, uses a hidden honeypot, and applies a bounded per-request-source submission limit without storing the source IP address. Do not copy sensitive message content into public posts or Meeting Minutes.

## Maintain the Formal Member-Temple Roster

Open **Member temples**. New community records begin as **Draft** and **Pending review**. Enter the community’s confirmed public name, preferred tradition or umbrella label, lineage context, description, location, website, public email, and legacy source when available.

Confirm the record with the community or an authorized IBAA roster before changing verification to **Verified**. The system blocks publication while a record remains pending. Once published, the verified record appears publicly; an unmatched Study Circle host remains visibly provisional until its own managed record is published.

## Editorial Checklist Before Publishing

| Check | Question |
| --- | --- |
| Accuracy | Are every name, date, title, and organizational claim confirmed? |
| Representation | Does the copy avoid ranking traditions or treating an umbrella category as exhaustive? |
| Community language | Does the community recognize the name, diacritics, and tradition label used? |
| Accessibility | Does every image have useful alt text and every video have an accessible title? |
| Source context | Is legacy material clearly distinguished from new editorial interpretation? |
| Privacy and rights | Is IBAA authorized to publish the text, image, file, email, and address? |
| Links | Do all public, document, legacy, and external links open correctly? |

## Corrections and Removal

For a small correction, edit and save the existing entry. For content that should temporarily disappear, choose **Unpublish** instead of deleting it. Delete only when the record itself should be permanently removed. Uploaded media remains in the reusable library when an article is deleted.

## Monthly Stewardship

Review drafts, outdated dates, broken external links, leadership and contact information, event listings, unverified temple records, and media alternatives. Export database and object-storage backups before major migrations. Keep the representation review and legacy inventory with the project so future editors can see why content and routes were structured this way.
