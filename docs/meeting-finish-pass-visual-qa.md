# IBAA Meeting Finish-Pass Visual QA

Date: September 21, 2026

Desktop full-page captures at 1440×1000 and mobile full-page captures at 390×844 were reviewed for the affected public pages.

- `/study-circles`: The Washington DC, Greater Los Angeles, and San Francisco Bay Area cards remain visually distinct and responsive. The September 12 Wat Lao Buddhavong record and supplied group photo render in the DC archive. The next-meeting panel now shows George Washington University. Dhammavicaya Vihara, Wat Khemara Buddhikarama, and Rosemead Monastery appear in the LA archive. The canceled November 7 City of Ten Thousand Buddhas entry is absent. Dharma College remains labeled in-person only, with time to be determined and no video.
- `/events`: The managed event list shows the new DC and LA records, uses Eastern/Pacific labels, and includes the supplied September 12 photo. The canceled November 7 event is absent.
- `/meeting-minutes`: The existing August 22 written-first minutes and YouTube supplement remain intact. A Recent Regional Dharma Meetings section presents the September 12 Wat Lao record and supplied photo. Upcoming sections list Washington DC, Los Angeles, and San Francisco Bay Area meetings; the canceled November 7 entry is absent.
- Navigation: Desktop and mobile captures show no Gallery or Recent Meetings navigation links, so neither unresolved path is exposed from the main navigation.
- No layout, palette, Vesak content, Communities content, or public navigation structure was changed.

## Public staging verification

After checkpoint `34066109` propagated, the public `/study-circles` page was reloaded. It showed the September 12 Wat Lao Buddhavong record and supplied photo, George Washington University, Wat Thai, Drikung Dharma Surya Temple, Dhammavicaya Vihara, Wat Khemara Buddhikarama, Rosemead Monastery, and the preserved Dharma College in-person/time-TBD/no-video notice. The canceled November 7 City of Ten Thousand Buddhas record and the old October 10 venue placeholder were absent.

The propagated public `/events` page showed all eight remaining upcoming notices plus the September 12 Wat Lao past event and photo. Eastern/Pacific labels rendered correctly, and the canceled November 7 record was absent. The propagated public `/meeting-minutes` page preserved the August 22 written-first record and YouTube supplement, showed the September 12 Wat Lao recent-meeting photo, listed the requested Washington DC and Los Angeles notices, retained Dharma College as time to be determined, and omitted the canceled November 7 record.
