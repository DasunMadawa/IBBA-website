import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  deleteEvent: vi.fn(),
  getPublishedEventBySlug: vi.fn(),
  listAdminEvents: vi.fn(),
  listPublishedEvents: vi.fn(),
  saveEvent: vi.fn(),
  setEventStatus: vi.fn(),
}));

vi.mock("./eventsDb", () => dbMocks);

import { appRouter } from "./routers";

function context(role: "admin" | "user" | null): TrpcContext {
  return {
    user: role ? { id: role === "admin" ? 1 : 2, openId: role, name: role, email: `${role}@example.org`, loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } : null,
    req: { ip: "127.0.0.1", protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const input = { slug: "sample-event", title: "Sample Event", eventDate: Date.UTC(2027, 0, 10, 12), startTime: "15:00", endTime: "17:00", timeZone: "America/Los_Angeles", region: "Los Angeles" as const, city: "Los Angeles", venueName: "Sample Venue", address: "123 Example", description: "A verified event description supplied by the administrator.", status: "draft" as const, traditions: ["Theravada" as const], zoomUrl: null, youtubeUrl: null, youtubeTitle: null, imageMediaId: null };

describe("managed Events procedures", () => {
  beforeEach(() => { vi.clearAllMocks(); dbMocks.saveEvent.mockResolvedValue(19); dbMocks.listPublishedEvents.mockResolvedValue([]); dbMocks.listAdminEvents.mockResolvedValue([]); });

  it("keeps public listing available without authentication", async () => {
    await appRouter.createCaller(context(null)).events.listPublished();
    expect(dbMocks.listPublishedEvents).toHaveBeenCalledOnce();
  });

  it("blocks non-admin users from saving or deleting Events", async () => {
    await expect(appRouter.createCaller(context("user")).events.save(input)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context(null)).events.remove({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.saveEvent).not.toHaveBeenCalled();
  });

  it("lets an administrator save a draft, publish it, and delete it", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.events.save(input)).resolves.toEqual({ id: 19 });
    await caller.events.setStatus({ id: 19, status: "published" });
    await caller.events.remove({ id: 19 });
    expect(dbMocks.saveEvent).toHaveBeenCalledWith(expect.objectContaining({ traditions: ["Theravada"], values: expect.objectContaining({ status: "draft", createdBy: 1 }) }));
    expect(dbMocks.setEventStatus).toHaveBeenCalledWith(19, "published");
    expect(dbMocks.deleteEvent).toHaveBeenCalledWith(19);
  });
});
