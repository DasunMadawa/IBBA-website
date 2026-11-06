import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { compareMeetingMinutesNewestFirst } from "./meetingMinutesDb";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin" | null): TrpcContext {
  const user: AuthenticatedUser | null = role ? {
    id: 31,
    openId: `minutes-${role}`,
    email: `${role}@example.com`,
    name: `Minutes ${role}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const validInput = {
  slug: "january-dharma-meeting-minutes",
  title: "January Dharma Meeting Minutes",
  meetingDate: Date.UTC(2026, 0, 10, 12),
  hostTemple: "Example Buddhist Temple",
  locationLabel: "Example Hall, Washington, DC",
  summary: "Participants shared teachings and agreed on the next rotating host.",
  minutesBody: "Opening reflection\nTradition reports\nDiscussion and decisions\nClosing dedication",
  status: "draft" as const,
  traditions: ["Theravada", "Mahayana"] as Array<"Theravada" | "Mahayana" | "Vajrayana">,
};

describe("Meeting Minutes procedures", () => {
  it.each([null, "user"] as const)("blocks %s accounts from the administrator archive", async role => {
    const caller = appRouter.createCaller(createContext(role));
    await expect(caller.meetingMinutes.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires at least one represented tradition before database work", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.meetingMinutes.save({ ...validInput, traditions: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an invalid optional video before database work", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.meetingMinutes.save({ ...validInput, youtubeUrl: "https://example.com/video", youtubeTitle: "Meeting recording" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires an accessible title when an optional recording is present", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.meetingMinutes.save({ ...validInput, youtubeUrl: "https://youtu.be/dQw4w9WgXcQ" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("orders Meeting Minutes newest first with a stable ID tie-breaker", () => {
    const rows = [{ id: 1, meetingDate: 100 }, { id: 3, meetingDate: 200 }, { id: 2, meetingDate: 200 }];
    expect(rows.sort(compareMeetingMinutesNewestFirst).map(row => row.id)).toEqual([3, 2, 1]);
  });
});
