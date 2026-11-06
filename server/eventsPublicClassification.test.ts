import { describe, expect, it } from "vitest";
import { archivedEvents, studyCircleRegions } from "../client/src/data/siteContent";
import { isMonthlyDharmaMeeting } from "../client/src/components/site/ManagedEvents";

describe("one public home for monthly Dharma Meetings", () => {
  it("hides managed monthly meetings without deleting source records or concealing other events", () => {
    for (const title of ["Dharma Study Circle", "IBAA Dharma Study Circle", "IBAA Dharma Meeting", "IBAA Interdenominational Study Circle"]) {
      expect(isMonthlyDharmaMeeting({ title })).toBe(true);
    }
    for (const title of ["White House Vesak observance", "Annual interfaith festival", "Buddhist youth retreat"]) {
      expect(isMonthlyDharmaMeeting({ title })).toBe(false);
    }
  });

  it("retains the monthly host records in Study Circles while separating the generic Events archive", () => {
    expect(studyCircleRegions.find(region => region.id === "los-angeles")?.records.some(record => record.date === "2026-10-10" && record.temple === "Dhamma Vijaya Buddhist Temple")).toBe(true);
    expect(archivedEvents.filter(event => event.type !== "Study Circle").map(event => event.title)).toEqual(["White House Faith Office meeting", "Fourth White House Vesak observance"]);
    expect(archivedEvents.filter(event => event.type === "Study Circle")).toHaveLength(2);
  });
});
