import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { media, studyCircleRegions, upcomingMeetings } from "../client/src/data/siteContent";
import { MinutesCard } from "../client/src/pages/MeetingMinutesPublic";
import officialMeeting from "../research/official-content/2026-08-22-dhammakaya-meeting.json";
import preUpdateStatus from "../research/status-before-august-meeting-update.md?raw";
import { compareMeetingMinutesNewestFirst, listPublishedMeetingMinutes } from "./meetingMinutesDb";
import appSource from "../client/src/App.tsx?raw";
import sitemap from "../client/public/sitemap.xml?raw";

describe("official August 22, 2026 Meeting Minutes content", () => {
  it("preserves the exact supplied record, three traditions, flyer, and YouTube URL", () => {
    expect(officialMeeting.title).toBe("IBAA Interdenominational Study Circle — Dhammakaya Meditation Center California");
    expect(officialMeeting.dateLabel).toBe("Saturday, August 22, 2026");
    expect(officialMeeting.time).toBe("3:00–5:00 pm PST");
    expect(officialMeeting.hostTemple).toBe("Dhammakaya Meditation Center California");
    expect(officialMeeting.place).toBe("Main Chapel");
    expect(officialMeeting.region).toBe("Greater Los Angeles");
    expect(officialMeeting.traditions).toEqual(["Theravada", "Mahayana", "Vajrayana"]);
    expect(officialMeeting.youtubeUrl).toBe("https://www.youtube.com/watch?v=EYgu9HKe2ac");
    expect(officialMeeting.flyerUrl).toContain("ibaa-dharma-meeting-2026-08-22");
    expect(officialMeeting.minutes).toContain("The host temple recorded the meeting. The recording is embedded below.");
    expect(officialMeeting.minutes.toLowerCase()).not.toContain("quote");
  });

  it("renders written minutes before the privacy-enhanced YouTube supplement", () => {
    const entry = {
      id: 1,
      slug: officialMeeting.slug,
      meetingDate: officialMeeting.meetingDate,
      title: officialMeeting.title,
      hostTemple: officialMeeting.hostTemple,
      locationLabel: `${officialMeeting.place} · ${officialMeeting.region} · ${officialMeeting.time}`,
      summary: officialMeeting.minutes.split(". ")[0] + ".",
      minutesBody: officialMeeting.minutes,
      traditions: officialMeeting.traditions,
      photo: { url: officialMeeting.flyerUrl, altText: "August 22 IBAA Monthly Dharma Meeting flyer", caption: "" },
      youtubeUrl: officialMeeting.youtubeUrl,
      youtubeTitle: officialMeeting.youtubeTitle,
    };
    const html = renderToStaticMarkup(<MinutesCard entry={entry} />);
    expect(html.indexOf("Meeting Minutes")).toBeLessThan(html.indexOf("youtube-nocookie.com/embed/EYgu9HKe2ac"));
    expect(html).toContain("Theravada");
    expect(html).toContain("Mahayana");
    expect(html).toContain("Vajrayana");
  });

  it("lists only the remaining supplied upcoming meetings in chronological order", () => {
    expect(upcomingMeetings.map(meeting => meeting.date)).toEqual(["2026-09-26", "2026-10-03", "2026-10-10", "2026-10-17", "2026-11-21", "2026-11-28", "2026-12-12", "2026-12-19"]);
    expect(upcomingMeetings[0].image).toContain("ibaa-study-circle-hsi-lai-2026-09-26");
    expect(upcomingMeetings[0].speakers).toHaveLength(3);
    expect(upcomingMeetings[1].time).toBe("Time to be determined");
    expect(upcomingMeetings[2].venue).toBe("Dhamma Vijaya Buddhist Temple");
    expect(upcomingMeetings[2].locationDetail).toContain("Sri Lankan Buddhist Temple");
    expect(JSON.stringify(upcomingMeetings)).not.toContain("City of Ten Thousand Buddhas");
    const archive = JSON.stringify(studyCircleRegions);
    for (const temple of ["Fo Guang Shan Hsi Lai Temple", "George Washington University", "Wat Thai", "Drikung Dharma Surya Temple", "Wat Khemara Buddhikarama", "Rosemead Monastery"]) expect(archive).toContain(temple);
    expect(archive).not.toContain("City of Ten Thousand Buddhas");
  });

  it("shows the optimized Sep 12 Wat Lao group photo in the DC regional archive", () => {
    expect(media.watLaoSeptember2026).toContain("ibaa-wat-lao-2026-09-12-group");
    const dc = studyCircleRegions.find(region => region.id === "washington-dc")!;
    expect(dc.records.find(record => record.date === "2026-09-12")).toMatchObject({ temple: "Wat Lao Buddhavong", nationality: "Laotian", yana: "Theravada", image: { url: media.watLaoSeptember2026, altText: expect.stringContaining("September 12, 2026") } });
  });

  it("registers and publishes a stable post URL", () => {
    const path = `/study-circles/minutes/${officialMeeting.slug}`;
    expect(appSource).toContain('path="/study-circles/minutes/:slug"');
    expect(sitemap).toContain(`https://www.ibaa.org${path}`);
  });

  it("sorts the August 22 record first in the published newest-first archive", () => {
    const records = [
      { id: 1, meetingDate: Date.parse("2026-07-25T00:00:00Z"), slug: "older-record" },
      { id: 2, meetingDate: officialMeeting.meetingDate, slug: officialMeeting.slug },
    ].sort(compareMeetingMinutesNewestFirst);
    expect(records[0].slug).toBe(officialMeeting.slug);
  });

  it("returns the August 22 record first from the actual published archive query", async () => {
    const records = await listPublishedMeetingMinutes();
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].slug).toBe(officialMeeting.slug);
    expect(records[0].status).toBe("published");
  });

  it("preserves the audited pre-update absence as historical evidence", () => {
    expect(preUpdateStatus).toContain("No managed Meeting Minutes were published");
    expect(preUpdateStatus).toContain("no `EYgu9HKe2ac` embed");
    expect(preUpdateStatus).toContain("none of the four supplied LA/SF upcoming meetings");
  });
});
