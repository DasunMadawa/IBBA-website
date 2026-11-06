// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ data: [] as Array<Record<string, unknown>>, isError: false }));
vi.mock("@/lib/trpc", () => ({ trpc: { temples: { listPublished: { useQuery: () => ({ data: state.data, isError: state.isError, isLoading: false, refetch: vi.fn() }) } } } }));
afterEach(() => { cleanup(); state.data = []; state.isError = false; });

describe("public member directory states", () => {
  it("does not substitute provisional hosts when no managed members are published", async () => {
    const { TemplesPage } = await import("../client/src/pages/TemplesPages");
    render(<TemplesPage />);
    expect(screen.getByRole("heading", { name: "Member Temples and Organizations" })).toBeTruthy();
    expect(screen.getByText("0 member temples and organizations")).toBeTruthy();
    expect(screen.queryByText("Drikung Kagyu Temple")).toBeNull();
    expect(screen.getByRole("heading", { name: "Individual Members" })).toBeTruthy();
  });

  it("renders managed members with their full address and website, without appending provisional hosts", async () => {
    state.data = [{ id: 1, name: "Managed Buddhist Community", tradition: "Community-preferred tradition", city: "Baltimore", stateRegion: "MD", postalCode: "21201", addressLine1: "10 Supplied Street", description: "A verified managed directory record used for rendering validation.", lineage: "Verified lineage", websiteUrl: "https://example.org", publicEmail: null, verificationStatus: "verified" }];
    const { TemplesPage } = await import("../client/src/pages/TemplesPages");
    render(<TemplesPage />);
    expect(screen.getByText(/Authorized administrators can maintain the organization records/i)).toBeTruthy();
    expect(screen.getByText("Managed Buddhist Community")).toBeTruthy();
    expect(screen.getByText("10 Supplied Street, Baltimore, MD 21201")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Website for Managed Buddhist Community" }).getAttribute("href")).toBe("https://example.org");
    expect(screen.queryByText("Drikung Kagyu Temple")).toBeNull();
  });

  it("shows a retry error rather than an incorrect membership fallback", async () => {
    state.isError = true;
    const { TemplesPage } = await import("../client/src/pages/TemplesPages");
    render(<TemplesPage />);
    expect(screen.getByRole("alert").textContent).toContain("The member roster could not be loaded");
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.queryByText("Drikung Kagyu Temple")).toBeNull();
  });
});
