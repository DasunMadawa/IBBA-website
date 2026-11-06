import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { AboutGovernancePage } from "../client/src/pages/AboutGovernancePage";
import { aboutRelocations } from "../shared/aboutRoutes";
import { registerLegacyRedirects } from "./legacyRedirects";

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

function redirectResult(path: string, originalUrl = path, method = "GET") {
  let middleware: any;
  registerLegacyRedirects({ use: (handler: any) => { middleware = handler; } } as any);
  let result: { status: number; destination: string } | null = null;
  let continued = false;
  middleware({ path, originalUrl, method }, { redirect: (status: number, destination: string) => { result = { status, destination }; } }, () => { continued = true; });
  return { result, continued };
}

describe("About governance and directors relocation", () => {
  it("keeps the existing Board component under About and provides a separate governance hub", () => {
    const app = source("client/src/App.tsx");
    expect(app).toContain('<Route path="/about/directors" component={LeadershipPage} />');
    expect(app).toContain('<Route path="/about/governance" component={AboutGovernancePage} />');
    expect(app).not.toMatch(/<Route path="\/leadership/);
    const html = renderToStaticMarkup(<AboutGovernancePage />);
    for (const href of ["/about", "/about/directors", "/annual-delegates", "/privacy", "/terms-of-use"]) expect(html).toContain(`href="${href}"`);
    expect(html).toContain("Board of Directors");
    expect(html).toContain("Governance");
  });

  it("links to both locations from About and repoints footer leadership and governance without adding a top-menu item", () => {
    const about = source("client/src/pages/PublicPages.tsx");
    const footer = source("client/src/components/site/SiteFooter.tsx");
    for (const route of ["/about/governance", "/about/directors"]) {
      expect(about).toContain(`href="${route}"`);
      expect(footer).toContain(`href="${route}"`);
    }
    expect(`${about}\n${footer}`).not.toContain('href="/leadership"');
    const header = source("client/src/components/site/SiteHeader.tsx");
    expect(header).toContain('["About IBAA", "/about"]');
    expect(header).not.toMatch(/\["(?:Governance|Directors|Board of Directors)",/);
  });

  it("uses 301 redirects for every old destination including trailing slash and HEAD, preserving query parameters", () => {
    for (const [old, destination] of Object.entries(aboutRelocations)) {
      expect(redirectResult(old).result).toEqual({ status: 301, destination });
      expect(redirectResult(`${old}/`).result).toEqual({ status: 301, destination });
      expect(redirectResult(old, old, "HEAD").result).toEqual({ status: 301, destination });
      expect(redirectResult(old, `${old}?ref=footer`).result).toEqual({ status: 301, destination: `${destination}?ref=footer` });
    }
    expect(redirectResult("/about/directors").continued).toBe(true);
    expect(redirectResult("/admin").continued).toBe(true);
    expect(redirectResult("/leadership", "/leadership", "POST").continued).toBe(true);
  });

  it("keeps legacy WordPress governance redirects direct and updates only archive destination metadata", () => {
    for (const [old, destination] of [
      ["/index.php/board_of_directors/", "/about/directors"],
      ["/index.php/officers/", "/about/governance/officers"],
      ["/index.php/advisory_council/", "/about/governance/advisory-council"],
    ]) expect(redirectResult(old).result).toEqual({ status: 301, destination });
    const archive = source("client/src/data/legacyArchive.generated.ts");
    expect(archive).not.toMatch(/"destination": "\/leadership/);
    const sitemap = source("client/public/sitemap.xml");
    expect(sitemap).toContain("https://www.ibaa.org/about/directors");
    expect(sitemap).toContain("https://www.ibaa.org/about/governance");
    expect(sitemap).not.toContain("https://www.ibaa.org/leadership");
  });
});
