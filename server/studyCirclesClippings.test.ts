import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { newsClippings, studyCircleRegions } from "../client/src/data/siteContent";

const approvedSources = [
  "https://www.ibaa.org/",
  "https://www.ibaa.org/index.php/2026/04/27/ibaa-white-house-faith-office/",
  "https://hongwanjihawaii.com/blog/2026/06/25/hhmh-at-white-house-vesak/",
  "https://www.buddhistdoor.net/news/white-house-hosts-buddhist-representatives-for-fifth-official-vesak-observance/",
  "https://www.dailymirror.lk/breaking-news/Vesak-festival-held-at-White-House-in-conjunction-with-international-Vesak-2026/108-342820",
] as const;

function sentenceCount(value: string) {
  return value.split(/[.!?](?:\s|$)/).filter(part => part.trim().length > 0).length;
}

describe("Study Circle regional archive", () => {
  it("keeps DC, Los Angeles, and San Francisco in three separate groups", () => {
    expect(studyCircleRegions.map(region => region.name)).toEqual([
      "Washington DC Metro Area",
      "Greater Los Angeles Metro Area",
      "San Francisco Bay Area",
    ]);
  });

  it("uses all required listing fields and newest-first order in every region", () => {
    for (const region of studyCircleRegions) {
      for (const record of region.records) {
        expect(record.monthYear).toMatch(/^[A-Z][a-z]+ 2026$/);
        expect(record.temple.trim()).not.toBe("");
        expect(record.nationality.trim()).not.toBe("");
        expect(record.yana.trim()).not.toBe("");
      }
      const dates = region.records.map(record => record.date);
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });

  it("retains every DC month from January through December, including the verified June and September records", () => {
    const dc = studyCircleRegions.find(region => region.id === "washington-dc");
    expect(dc).toBeDefined();
    const months = new Set(dc!.records.map(record => record.monthYear));
    expect([...months]).toEqual(expect.arrayContaining([
      "January 2026", "February 2026", "March 2026", "April 2026",
      "May 2026", "June 2026", "July 2026", "August 2026",
      "September 2026", "October 2026", "November 2026", "December 2026",
    ]));
    expect(dc!.records.find(record => record.date === "2026-06-13")?.temple).toBe("Chua Giac Son");
    expect(dc!.records.find(record => record.date === "2026-09-12")).toMatchObject({ temple: "Wat Lao Buddhavong", nationality: "Laotian", yana: "Theravada", image: { altText: expect.stringContaining("Laotian Theravada temple in Catlett, Virginia") } });
  });

  it("publishes confirmed LA and DC records while preserving the Oct 3 SF no-video constraint", () => {
    const la = studyCircleRegions.find(region => region.id === "los-angeles")!;
    const sf = studyCircleRegions.find(region => region.id === "san-francisco")!;
    expect(la.records.find(record => record.date === "2026-08-22")).toMatchObject({
      temple: "Dhammakaya Meditation Center California",
      nationality: "Thai",
      yana: "Theravada",
      youtubeUrl: "https://www.youtube.com/watch?v=EYgu9HKe2ac",
    });
    expect(la.records.find(record => record.date === "2026-10-10")?.temple).toBe("Dhamma Vijaya Buddhist Temple");
    expect(la.records.find(record => record.date === "2026-11-28")?.temple).toBe("Wat Khemara Buddhikarama");
    expect(la.records.find(record => record.date === "2026-12-19")?.temple).toBe("Rosemead Monastery");
    const octoberSf = sf.records.find(record => record.date === "2026-10-03")!;
    expect(octoberSf.temple).toBe("Dharma College");
    expect(octoberSf.detail).toContain("In-person only");
    expect(octoberSf.detail).toContain("Time to be determined");
    expect("youtubeUrl" in octoberSf).toBe(false);
    expect(JSON.stringify(sf.records)).not.toMatch(/Ten Thousand|2026-11-07/);
  });

  it("renders the regional data on the existing Study Circles route", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/PublicPages.tsx"), "utf8");
    expect(source).toContain("<ManagedStudyCircles />");
    expect(source).toContain("/study-circles");
  });
});

describe("approved News & Media clippings", () => {
  it("contains exactly one concise clipping for each approved source", () => {
    expect(newsClippings).toHaveLength(5);
    expect(newsClippings.map(item => item.url).sort()).toEqual([...approvedSources].sort());
    for (const clipping of newsClippings) {
      expect(sentenceCount(clipping.summary)).toBeGreaterThanOrEqual(2);
      expect(sentenceCount(clipping.summary)).toBeLessThanOrEqual(4);
    }
  });

  it("keeps the April Faith Office meeting separate from June Vesak and excludes the prohibited reference", () => {
    const april = newsClippings.find(item => item.date === "2026-04-27")!;
    const june = newsClippings.filter(item => item.date.startsWith("2026-06"));
    expect(april.summary).toContain("separate April 16 meeting");
    expect(june).toHaveLength(3);
    expect(JSON.stringify(newsClippings)).not.toMatch(/Dalai Lama/i);
  });

  it("renders the clipping section on the actual managed News & Media route", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/ManagedNewsPages.tsx"), "utf8");
    expect(source).toContain("newsClippings.map");
    expect(source).toContain("IBAA in public coverage");
  });
});
