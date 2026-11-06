import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TempleOutreachPage } from "../client/src/pages/TempleOutreachPage";
import { registerLegacyRedirects } from "./legacyRedirects";

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock("../client/src/lib/trpc", () => ({ trpc: { temples: { listPublished: { useQuery: () => ({ data: [], isLoading: false, isError: false }) } } } }));

describe("Temple Outreach consolidation", () => {
  it("shows BuddhaMap near the top and no repeated monthly meeting list", () => {
    const html = renderToStaticMarkup(<TempleOutreachPage />);
    expect(html).toContain("Buddha Map – Find a Buddhist Temple Near You");
    expect(html).toContain("https://play.google.com/store/apps/details?id=com.hexagon.directory_app&amp;hl=en_US");
    expect(html).toContain("Get it on Google Play");
    expect(html).toContain("Theravada");
    expect(html).toContain("Mahayana");
    expect(html).toContain("Vajrayana");
    expect(html).toContain("/study-circles");
    expect(html).not.toContain("November 21, 2026");
  });

  it("keeps About links to mission, leadership, and news", () => {
    const about = readFileSync(resolve(process.cwd(), "client/src/pages/PublicPages.tsx"), "utf8");
    for (const route of ["/about/mission", "/about/directors", "/news-media", "/member-temples"]) expect(about).toContain(`href="${route}"`);
  });

  it("redirects former overview and detail paths permanently without touching other routes", () => {
    let middleware: any;
    registerLegacyRedirects({ use: (handler: any) => { middleware = handler; } } as any);
    const redirect = (path: string, method = "GET") => {
      let result: { status: number; destination: string } | null = null;
      let continued = false;
      middleware({ path, method, originalUrl: path }, { redirect: (status: number, destination: string) => { result = { status, destination }; } }, () => { continued = true; });
      return { result, continued };
    };
    expect(redirect("/meeting-minutes").result).toEqual({ status: 301, destination: "/temple-outreach" });
    expect(redirect("/meeting-minutes/").result).toEqual({ status: 301, destination: "/temple-outreach" });
    expect(redirect("/meeting-minutes/august-record").result).toEqual({ status: 301, destination: "/study-circles/minutes/august-record" });
    expect(redirect("/admin/meeting-minutes").continued).toBe(true);
    expect(redirect("/meeting-minutes", "POST").continued).toBe(true);
  });
});
