// @vitest-environment jsdom
import React from "react";
import { readFileSync } from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LegacyInfoPage } from "../client/src/pages/ManagedNewsPages";
import { DonatePage } from "../client/src/pages/DonatePage";
import { TempleOutreachPage } from "../client/src/pages/TempleOutreachPage";
import { ManagedStudyCircles } from "../client/src/components/site/ManagedStudyCircles";
import { legacyPages } from "../client/src/data/legacyArchive.generated";
import { donationMailingAddress } from "../client/src/data/donationContent";
import { studyCircleRegions } from "../client/src/data/siteContent";

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock("../client/src/lib/trpc", () => ({ trpc: { temples: { listPublished: { useQuery: () => ({ data: [], isError: false, isLoading: false }) } }, studyCircles: { listPublished: { useQuery: () => ({ data: [], isError: false }) } } } }));
afterEach(cleanup);

describe("Wangmo October 22 staging pre-launch refinements", () => {
  it("removes the Mission source panel without deleting any original Mission paragraph", () => {
    render(<LegacyInfoPage slug="mission" />);
    const original = legacyPages.find(page => page.slug === "mission")!;
    expect(screen.getByRole("heading", { name: "Our Mission" })).toBeTruthy();
    const paragraphs = document.querySelectorAll(".mission-prose > p");
    expect(paragraphs).toHaveLength(original.body.length);
    expect(Array.from(paragraphs).map(p => p.textContent)).toEqual(original.body);
    expect(document.querySelector(".legacy-context")).toBeNull();
    expect(document.body.textContent).not.toContain("WordPress path");
  });

  it("leaves the source context on other legacy information pages", () => {
    const other = legacyPages.find(page => page.slug !== "mission")!;
    render(<LegacyInfoPage slug={other.slug} />);
    expect(document.querySelector(".legacy-context")).not.toBeNull();
  });

  it("gives both Home Mission and About Mission a larger scoped font", () => {
    const css = readFileSync(`${process.cwd()}/client/src/index.css`, "utf8");
    expect(css).toMatch(/\.mission-grid > p \{[^}]*font-size: clamp\(1\.4rem, 2vw, 1\.65rem\)/);
    expect(css).toMatch(/\.mission-page \.mission-prose > p, \.mission-page \.page-intro \{[^}]*font-size: clamp\(1\.4rem, 2vw, 1\.65rem\)/);
  });

  it("explains mailed checks without an online-payment placeholder", () => {
    render(<DonatePage />);
    expect(screen.getByRole("heading", { name: "Donate by mailing a check" })).toBeTruthy();
    expect(document.body.textContent).toContain("International Buddhist Association of America (IBAA)");
    expect(document.body.textContent).not.toMatch(/paypal|coming.soon|future online giving|not available yet|reserved for/i);
    expect(document.querySelector("aside, .donation-placeholder")).toBeNull();
    expect(document.querySelector('a[href*="paypal"]')).toBeNull();
    expect(document.querySelector("button")).toBeNull();
    expect(donationMailingAddress).toMatchObject({ recipient: "IBAA", street: "P.O. Box 2143", locality: "Clinton, MD 20735" });
    expect(document.querySelector("address")?.textContent).toBe("Please mail checks to IBAA, P.O. Box 2143, Clinton, MD 20735.");
    expect(document.body.textContent).not.toContain("2222 Harold Way");
    expect(document.body.textContent).not.toContain("Lorton");
    expect(document.body.textContent).not.toContain("P.O. Box 464");
    expect(document.querySelector(".donation-source")).toBeNull();
  });

  it("labels only the GWU record University / Interdenominational and removes its unconfirmed time", () => {
    render(<ManagedStudyCircles />);
    const dc = screen.getByRole("region", { name: "Washington DC Metro Area" });
    const heading = within(dc).getByRole("heading", { name: "October 2026 — George Washington University (University, Interdenominational)" });
    const record = heading.closest("article")!;
    expect(record.textContent).not.toContain("Time to be determined");
    expect(record.querySelector("img")?.getAttribute("src")).toContain("ibaa-gwu-2026-10-17-group");
    const gwu = studyCircleRegions.find(region => region.id === "washington-dc")!.records.find(entry => entry.date === "2026-10-17")!;
    expect(gwu).toMatchObject({ nationality: "University", yana: "Interdenominational" });
    const sf = studyCircleRegions.find(region => region.id === "san-francisco")!.records[0];
    expect(sf.yana).toBe("Yana to be confirmed");
  });

  it("scrolls directly to the Buddha Map section after its page mounts with the menu hash", () => {
    const scroll = vi.fn();
    Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scroll });
    window.history.replaceState(null, "", "/temple-outreach#buddha-map");
    render(<TempleOutreachPage />);
    expect(scroll).toHaveBeenCalledWith({ block: "start" });
    expect(document.querySelector('#buddha-map a')?.getAttribute("href")).toBe("https://play.google.com/store/apps/details?id=com.hexagon.directory_app&hl=en_US");
    window.history.replaceState(null, "", "/");
  });
});
