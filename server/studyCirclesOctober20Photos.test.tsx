// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ManagedStudyCircles } from "../client/src/components/site/ManagedStudyCircles";
import { media } from "../client/src/data/siteContent";

vi.mock("../client/src/lib/trpc", () => ({ trpc: { studyCircles: { listPublished: { useQuery: () => ({ data: [], isError: false }) } } } }));
vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-20T21:00:00Z")); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("October 20 staging group photos", () => {
  it("shows the October 10 Dhamma Vijaya photo in LA past meetings with the supplied caption and preserved time", () => {
    render(<ManagedStudyCircles />);
    const la = screen.getByRole("region", { name: "Greater Los Angeles Metro Area" });
    const past = within(la).getByRole("region", { name: "Past meetings" });
    const image = within(past).getByRole("img", { name: /Dhamma Vijaya Buddhist Temple.*October 10, 2026/ });
    expect(image.getAttribute("src")).toBe(media.dhammaVijayaOctober2026);
    expect(image.getAttribute("width")).toBe("1600");
    expect(image.getAttribute("height")).toBe("1200");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("decoding")).toBe("async");
    expect(within(past).getByText("IBAA Dharma Meeting - Dhamma Vijaya Buddhist Temple (Sri Lankan, Theravada), Greater Los Angeles, Los Angeles, CA - October 10, 2026")).toBeTruthy();
    expect(past.textContent).toContain("3:00–5:00 pm PT");
  });

  it("shows the October 17 GWU photo in DC past meetings, never upcoming, with Wat Thai as next", () => {
    render(<ManagedStudyCircles />);
    const dc = screen.getByRole("region", { name: "Washington DC Metro Area" });
    const past = within(dc).getByRole("region", { name: "Past meetings" });
    const upcoming = within(dc).getByRole("region", { name: "Upcoming meetings" });
    const image = within(past).getByRole("img", { name: /George Washington University.*October 17, 2026/ });
    expect(image.getAttribute("src")).toBe(media.gwuOctober2026);
    expect(image.getAttribute("width")).toBe("1600");
    expect(image.getAttribute("height")).toBe("899");
    expect(upcoming.textContent).not.toContain("George Washington University");
    expect(dc.querySelector(".study-region-next")?.textContent).toContain("November 2026 — Wat Thai");
    expect(within(past).getByText("IBAA Dharma Meeting - George Washington University, Washington DC Metro Area, Washington, DC - October 17, 2026")).toBeTruthy();
  });

  it("retains both September photos and the existing shared figure treatment for all four photographs", () => {
    render(<ManagedStudyCircles />);
    const figures = Array.from(document.querySelectorAll("figure.study-circle-managed-image"));
    expect(figures).toHaveLength(4);
    const images = figures.map(figure => figure.querySelector("img")?.getAttribute("src"));
    for (const url of [media.watLaoSeptember2026, media.hsiLaiSeptember2026, media.dhammaVijayaOctober2026, media.gwuOctober2026]) expect(images).toContain(url);
    for (const figure of figures) expect(figure.querySelector("figcaption")?.textContent).toMatch(/IBAA Dharma Meeting/);
    const dcPast = within(screen.getByRole("region", { name: "Washington DC Metro Area" })).getByRole("region", { name: "Past meetings" });
    expect(dcPast.querySelector("article time")?.getAttribute("datetime")).toBe("2026-10-17");
  });
});
