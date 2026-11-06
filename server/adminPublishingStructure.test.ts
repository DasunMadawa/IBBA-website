import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sortPublishedEvents } from "./eventsDb";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminPublishingPages.tsx"), "utf8");
const routes = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const publicEvents = readFileSync(resolve(process.cwd(), "client/src/components/site/ManagedEvents.tsx"), "utf8");
const contentRepository = readFileSync(resolve(process.cwd(), "server/contentDb.ts"), "utf8");

describe("non-technical publishing workspace", () => {
  it("uses one shared editor for Events, Study Circles, Meeting Minutes, and News", () => {
    expect(source.match(/<PublishingEditor/g)).toHaveLength(4);
    expect(source).toContain("AdminEventsPage");
    expect(source).toContain("AdminStudyCirclesPage");
    expect(source).toContain("AdminMeetingMinutesPage");
    expect(source).toContain("AdminNewsPage");
  });

  it("registers the simple admin and Events routes without a public navigation change", () => {
    expect(routes).toContain('<Route path="/admin/events" component={AdminEventsPage} />');
    expect(routes).toContain('<Route path="/admin" component={AdminNewsPage} />');
  });

  it("renders published managed Events on the public page", () => {
    expect(publicEvents).toContain("trpc.events.listPublished.useQuery()");
    expect(publicEvents).toContain("Upcoming and recent gatherings");
  });

  it("keeps the editor-selected News date when status changes", () => {
    const start = contentRepository.indexOf("export async function setContentEntryStatus");
    const end = contentRepository.indexOf("export async function deleteContentEntry");
    const statusFunction = contentRepository.slice(start, end);
    expect(statusFunction).toContain("set({ status })");
    expect(statusFunction).not.toContain("Date.now()");
  });

  it("orders upcoming Events first and past Events newest first", () => {
    const now = Date.UTC(2027, 0, 15, 12);
    const sorted = sortPublishedEvents([{ id: 1, eventDate: Date.UTC(2026, 11, 1) }, { id: 2, eventDate: Date.UTC(2027, 1, 1) }, { id: 3, eventDate: Date.UTC(2027, 0, 20) }, { id: 4, eventDate: Date.UTC(2026, 11, 20) }], now);
    expect(sorted.map(item => item.id)).toEqual([3, 2, 4, 1]);
  });
});
