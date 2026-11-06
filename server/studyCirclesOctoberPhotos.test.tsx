import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { studyCircleRegions, media } from "../client/src/data/siteContent";
import { ManagedStudyCircles, partitionMeetingRecords } from "../client/src/components/site/ManagedStudyCircles";

vi.mock("../client/src/lib/trpc", () => ({ trpc: { studyCircles: { listPublished: { useQuery: () => ({ data: [], isError: false }) } } } }));
vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));

const asOf = "2026-10-12";
describe("October 12 staging photo and meeting completion", () => {
  it("puts October 10 in LA past meetings and selects November 28 as next", () => {
    const la = studyCircleRegions.find(region => region.id === "los-angeles")!;
    const { upcoming, past, next } = partitionMeetingRecords(la.records, asOf);
    expect(next?.temple).toBe("Wat Khemara Buddhikarama");
    expect(upcoming.map(record => record.date)).toEqual(["2026-12-19", "2026-11-28"]);
    expect(past.map(record => record.date)).toEqual(["2026-10-10", "2026-09-26", "2026-08-22"]);
    expect(past[0]).toMatchObject({ temple: "Dhamma Vijaya Buddhist Temple", nationality: "Sri Lankan", yana: "Theravada" });
    expect(past[0].detail).toContain("3:00–5:00 pm PT");
  });

  it("keeps all three upcoming DC meetings and selects October 17 as next", () => {
    const dc = studyCircleRegions.find(region => region.id === "washington-dc")!;
    const { upcoming, past, next } = partitionMeetingRecords(dc.records, asOf);
    expect(next?.temple).toBe("George Washington University");
    expect(upcoming.map(record => record.date)).toEqual(["2026-12-12", "2026-11-21", "2026-10-17"]);
    expect(past.some(record => record.date === "2026-09-12")).toBe(true);
    expect(upcoming.length + past.length).toBe(dc.records.length);
  });

  it("retains the October 3 in-person, no-video record as past and excludes canceled November 7", () => {
    const sf = studyCircleRegions.find(region => region.id === "san-francisco")!;
    const { upcoming, past, next } = partitionMeetingRecords(sf.records, asOf);
    expect(upcoming).toHaveLength(0);
    expect(next).toBeNull();
    expect(past[0].detail).toContain("No video");
    expect(past[0].youtubeUrl).toBeUndefined();
    expect(JSON.stringify(studyCircleRegions)).not.toContain("2026-11-07");
  });

  it("classifies the meeting day itself as upcoming and the next day as past", () => {
    const la = studyCircleRegions.find(region => region.id === "los-angeles")!;
    expect(partitionMeetingRecords(la.records, "2026-10-10").upcoming.some(record => record.date === "2026-10-10")).toBe(true);
    expect(partitionMeetingRecords(la.records, "2026-10-11").past.some(record => record.date === "2026-10-10")).toBe(true);
  });

  it("renders both supplied photos with exact captions, alt text, lazy loading and intrinsic dimensions", () => {
    const html = renderToStaticMarkup(<ManagedStudyCircles />);
    expect(html).toContain(media.hsiLaiSeptember2026);
    expect(html).toContain(media.watLaoSeptember2026);
    expect(html).toContain("IBAA Dharma Meeting - Hsi Lai Buddhist Temple (Taiwanese, Mahayana), Hacienda Heights, CA - September 26, 2026");
    expect(html).toContain("IBAA Dharma Meeting - Wat Lao Buddhavong (Laotian, Theravada), Catlett, VA - September 12, 2026");
    expect(html).toContain('width="1600" height="1066" loading="lazy" decoding="async"');
    expect(html).toContain('width="1600" height="899" loading="lazy" decoding="async"');
    expect(html).toContain("Monastic and lay participants gathered");
    expect(html.match(/>Upcoming meetings<\/h3>/g)).toHaveLength(3);
    expect(html.match(/>Past meetings<\/h3>/g)).toHaveLength(3);
  });
});
