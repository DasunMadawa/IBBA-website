import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { saveTempleDirectoryEntry } from "./templeDb";

vi.mock("./templeDb", () => ({ saveTempleDirectoryEntry: vi.fn().mockResolvedValue(1), listPublishedTemples: vi.fn(), listAdminTemples: vi.fn(), getAdminTemple: vi.fn(), setTempleDirectoryStatus: vi.fn(), deleteTempleDirectoryEntry: vi.fn() }));
const context = { user: { id: 1, openId: "roster-admin", role: "admin", name: "Admin", email: null, loginMethod: "staff", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} }, res: {} } as TrpcContext;
const member = { slug: "gowoo-sunim-bokyung-jeon-temple", name: "Gowoo Sunim (Bokyung Jeon) Temple", status: "published" as const, verificationStatus: "verified" as const, tradition: "", description: "", city: "New York", stateRegion: "", country: "United States", websiteUrl: "", addressLine1: "", postalCode: "" };

describe("supplied partial member records remain administratively editable", () => {
  it("accepts the exact supplied New York location without invented state, street, website or biography", async () => {
    await expect(appRouter.createCaller(context).temples.save(member)).resolves.toEqual({ id: 1 });
    expect(saveTempleDirectoryEntry).toHaveBeenCalledWith(undefined, expect.objectContaining({ city: "New York", stateRegion: "", tradition: "", description: "", addressLine1: null, websiteUrl: null, postalCode: null, status: "published", verificationStatus: "verified" }));
  });
  it("still blocks unpublished verification and entirely missing location", async () => {
    await expect(appRouter.createCaller(context).temples.save({ ...member, verificationStatus: "pending" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(appRouter.createCaller(context).temples.save({ ...member, city: "", stateRegion: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
