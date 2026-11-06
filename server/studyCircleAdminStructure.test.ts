import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sortStudyCirclesNewestFirst } from "./studyCirclesDb";

describe("Study Circle administrator and public structure", () => {
  it("sorts published Study Circles newest first", () => {
    const rows = [{ meetingDate: 10, id: 1 }, { meetingDate: 30, id: 3 }, { meetingDate: 20, id: 2 }];
    expect(sortStudyCirclesNewestFirst(rows).map(row => row.id)).toEqual([3, 2, 1]);
  });

  it("uses one staff-friendly form with every requested field and CRUD action", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminPublishingPages.tsx"), "utf8");
    const routes = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const dashboard = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");
    for (const field of ["study-circle-region", "study-circle-meetingMonth", "study-circle-meetingYear", "study-circle-meetingDate", "study-circle-startTime", "study-circle-endTime", "study-circle-timeZone", "study-circle-templeName", "study-circle-nationality", "study-circle-yana", "study-circle-venueNote", "study-circle-description", "study-circle-youtubeUrl"]) expect(source).toContain(field);
    expect(source).toContain('title="Add Study Circle / Dharma Meeting"');
    expect(source).toContain('label="Flyer or photo"');
    expect(source).toContain('status={form.status}');
    expect(source).toContain('onEdit={edit}');
    expect(source).toContain('onDelete={id => remove.mutate({ id })}');
    expect(routes).toContain('<Route path="/admin/study-circles" component={AdminStudyCirclesPage} />');
    expect(dashboard).toContain('{ icon: BookOpenText, label: "Study Circles", path: "/admin/study-circles" }');
  });

  it("renders three accessible regional icons and merges managed records into the preserved archive", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/site/ManagedStudyCircles.tsx"), "utf8");
    expect(source).toContain("Landmark");
    expect(source).toContain("Sun");
    expect(source).toContain("Waves");
    expect(source).toContain("studyCircleRegions.map");
    expect(source).toContain("trpc.studyCircles.listPublished.useQuery");
    expect(source).toContain('aria-labelledby={`${region.id}-title`}');
    expect(source).toContain("Next meeting");
  });
});
