import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  create: vi.fn(async () => 84),
  list: vi.fn(async () => []),
  status: vi.fn(async () => undefined),
}));

vi.mock("./contactDb", () => ({
  createContactInquiry: dbMocks.create,
  listContactInquiries: dbMocks.list,
  setContactInquiryStatus: dbMocks.status,
}));

import { resetContactRateLimitForTests } from "./contactRateLimit";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin" | null, ip = "203.0.113.10"): TrpcContext {
  const user: AuthenticatedUser | null = role ? {
    id: 44,
    openId: `contact-${role}`,
    email: `${role}@example.com`,
    name: `Contact ${role}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;
  return { user, req: { protocol: "https", ip, headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const inquiry = {
  name: "Community Visitor",
  email: "Visitor@Example.com",
  organization: "Example Community",
  topic: "general" as const,
  message: "I would like to learn more about IBAA community participation.",
  website: "",
};

beforeEach(() => {
  resetContactRateLimitForTests();
  dbMocks.create.mockClear();
  dbMocks.list.mockClear();
  dbMocks.status.mockClear();
});

describe("contact inquiry procedures", () => {
  it.each([null, "user"] as const)("blocks %s accounts from the private inquiry queue", async role => {
    await expect(appRouter.createCaller(createContext(role)).contact.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects honeypot content and malformed public submissions before persistence", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.contact.submit({ ...inquiry, website: "spam.example" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.contact.submit({ ...inquiry, email: "invalid", message: "short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.create).not.toHaveBeenCalled();
  });

  it("stores a validated inquiry without IP data and returns a public reference", async () => {
    const result = await appRouter.createCaller(createContext(null)).contact.submit(inquiry);
    expect(result).toEqual({ success: true, reference: "IBAA-84" });
    expect(dbMocks.create).toHaveBeenCalledWith({
      name: "Community Visitor",
      email: "visitor@example.com",
      organization: "Example Community",
      topic: "general",
      message: inquiry.message,
      status: "new",
    });
  });

  it("bounds repeated submissions without persisting the address", async () => {
    const caller = appRouter.createCaller(createContext(null, "198.51.100.22"));
    await caller.contact.submit(inquiry);
    await caller.contact.submit(inquiry);
    await caller.contact.submit(inquiry);
    await expect(caller.contact.submit(inquiry)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    expect(dbMocks.create).toHaveBeenCalledTimes(3);
  });

  it("allows administrators to triage inquiry status", async () => {
    const result = await appRouter.createCaller(createContext("admin")).contact.setStatus({ id: 84, status: "archived" });
    expect(result).toEqual({ success: true });
    expect(dbMocks.status).toHaveBeenCalledWith(84, "archived");
  });
});
