import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  deleteStudyCircle: vi.fn(),
  listAdminStudyCircles: vi.fn(),
  listPublishedStudyCircles: vi.fn(),
  saveStudyCircle: vi.fn(),
  setStudyCircleStatus: vi.fn(),
}));

vi.mock("./studyCirclesDb", () => dbMocks);

import { appRouter } from "./routers";

function context(role: "admin" | "user" | null): TrpcContext {
  return {
    user: role ? { id: role === "admin" ? 1 : 2, openId: role, name: role, email: `${role}@example.org`, loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } : null,
    req: { ip: "127.0.0.1", protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const input = {
  slug: "2027-01-16-sample-temple",
  region: "Washington DC Metro Area" as const,
  meetingMonth: 1,
  meetingYear: 2027,
  meetingDate: Date.UTC(2027, 0, 16, 12),
  startTime: "15:00",
  endTime: "17:00",
  timeZone: "America/Los_Angeles",
  templeName: "Sample Temple",
  nationality: "Sample nationality",
  yana: "Mahayana" as const,
  venueNote: "Main hall",
  description: "A future Study Circle entered by an authorized administrator.",
  imageMediaId: null,
  youtubeUrl: null,
  youtubeTitle: null,
  status: "draft" as const,
};

describe("managed Study Circle procedures", () => {
  beforeEach(() => { vi.clearAllMocks(); dbMocks.saveStudyCircle.mockResolvedValue(27); dbMocks.listPublishedStudyCircles.mockResolvedValue([]); dbMocks.listAdminStudyCircles.mockResolvedValue([]); });

  it("keeps published regional records public while protecting the editor", async () => {
    await appRouter.createCaller(context(null)).studyCircles.listPublished();
    await expect(appRouter.createCaller(context("user")).studyCircles.save(input)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context(null)).studyCircles.remove({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.listPublishedStudyCircles).toHaveBeenCalledOnce();
    expect(dbMocks.saveStudyCircle).not.toHaveBeenCalled();
  });

  it("lets an administrator save a draft, publish it, and delete it", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.studyCircles.save(input)).resolves.toEqual({ id: 27 });
    await caller.studyCircles.setStatus({ id: 27, status: "published" });
    await caller.studyCircles.remove({ id: 27 });
    expect(dbMocks.saveStudyCircle).toHaveBeenCalledWith(expect.objectContaining({ values: expect.objectContaining({ status: "draft", createdBy: 1, region: "Washington DC Metro Area" }) }));
    expect(dbMocks.setStudyCircleStatus).toHaveBeenCalledWith(27, "published");
    expect(dbMocks.deleteStudyCircle).toHaveBeenCalledWith(27);
  });

  it("rejects mismatched month/year, invalid times, and invalid YouTube links", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.studyCircles.save({ ...input, meetingMonth: 2 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.studyCircles.save({ ...input, endTime: "14:00" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.studyCircles.save({ ...input, youtubeUrl: "https://example.org/video", youtubeTitle: "Example" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
