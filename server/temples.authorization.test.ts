import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin" | null): TrpcContext {
  const user: AuthenticatedUser | null = role ? {
    id: 23,
    openId: `temple-${role}`,
    email: `${role}@example.com`,
    name: `Temple ${role}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const validTemple = {
  name: "Verified Community",
  slug: "verified-community",
  status: "draft" as const,
  verificationStatus: "pending" as const,
  tradition: "Community-preferred description",
  description: "A complete public description suitable for the managed directory.",
  city: "Washington",
  stateRegion: "District of Columbia",
  country: "United States",
};

describe("managed temple procedures", () => {
  it.each([null, "user"] as const)("blocks %s accounts from the formal roster", async role => {
    const caller = appRouter.createCaller(createContext(role));
    await expect(caller.temples.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects publication before verification without touching the database", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.temples.save({ ...validTemple, status: "published" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects insecure community website URLs before database work", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.temples.save({ ...validTemple, websiteUrl: "http://example.org" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
