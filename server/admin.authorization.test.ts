import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin" | null): TrpcContext {
  const user: AuthenticatedUser | null = role ? {
    id: 17,
    openId: `sample-${role}`,
    email: `${role}@example.com`,
    name: `Sample ${role}`,
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

describe("administrator procedures", () => {
  it.each([null, "user"] as const)("blocks %s accounts from the publishing list", async role => {
    const caller = appRouter.createCaller(createContext(role));
    await expect(caller.content.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects an invalid YouTube URL before database work", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.content.save({
      title: "A valid test title",
      slug: "valid-test-title",
      excerpt: "A sufficiently descriptive test excerpt.",
      body: "A sufficiently long article body used only to validate the input contract.",
      contentType: "news",
      status: "draft",
      authorName: "IBAA Editorial Team",
      youtubeUrl: "https://example.com/not-youtube",
      youtubeTitle: "A title",
      categoryNames: ["News"],
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
