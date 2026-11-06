// @vitest-environment jsdom
import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({
  Link: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(({ href, children, onClick, ...props }, ref) => <a ref={ref} href={href} onClick={event => { event.preventDefault(); onClick?.(event); }} {...props}>{children}</a>),
  useLocation: () => ["/", vi.fn()],
}));

const primaryRoutes = [
  ["Home", "/"],
  ["About IBAA", "/about"],
  ["Study Circles", "/study-circles"],
  ["Temple Outreach", "/temple-outreach"],
  ["Donate", "/donate"],
  ["Buddha Map", "/temple-outreach#buddha-map"],
] as const;

afterEach(cleanup);

describe("primary navigation route coverage", () => {
  it("registers every primary destination in the public router", () => {
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    for (const [, path] of primaryRoutes) {
      expect(appSource).toContain(`<Route path="${path.split("#")[0]}"`);
    }
  });

  it("opens the mobile menu and activates every primary navigation link", async () => {
    const { SiteHeader } = await import("../client/src/components/site/SiteHeader");
    const user = userEvent.setup();
    render(<SiteHeader />);
    expect(document.querySelectorAll("#primary-navigation > .nav-link, #primary-navigation > .nav-signup")).toHaveLength(7);
    expect(document.querySelectorAll(".utility-bar a")).toHaveLength(0);

    for (const [label, path] of primaryRoutes) {
      const menu = screen.getByRole("button", { name: "Menu" });
      await user.click(menu);
      expect(menu.getAttribute("aria-expanded")).toBe("true");
      const link = screen.getByRole("link", { name: label });
      expect(link.getAttribute("href")).toBe(path);
      await user.click(link);
      expect(menu.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("opens Sign up with keyboard, closes with Escape and follows the existing Membership page", async () => {
    const { SiteHeader } = await import("../client/src/components/site/SiteHeader");
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const signup = screen.getByRole("button", { name: "Sign up" });
    signup.focus();
    await user.keyboard("{Enter}");
    expect(signup.getAttribute("aria-expanded")).toBe("true");
    await user.tab();
    const membership = screen.getByRole("link", { name: "Membership" });
    expect(membership.getAttribute("href")).toBe("/join");
    expect(document.activeElement).toBe(membership);
    await user.keyboard("{Escape}");
    expect(signup.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(signup);
    await user.keyboard(" ");
    await user.click(screen.getByRole("link", { name: "Membership" }));
    expect(signup.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("does not expose the unresolved gallery or recent-meetings paths in public navigation", () => {
    const headerSource = readFileSync(resolve(process.cwd(), "client/src/components/site/SiteHeader.tsx"), "utf8");
    const footerSource = readFileSync(resolve(process.cwd(), "client/src/components/site/SiteFooter.tsx"), "utf8");
    expect(`${headerSource}\n${footerSource}`).not.toMatch(/href=["']\/(?:gallery|recent-meetings)["']/);
    for (const href of ["/buddhist-traditions", "/programs", "/events", "/news-media", "/resources", "/communities", "/contact", "/donate"]) {
      expect(footerSource).toContain(`href="${href}"`);
    }
  });

  it("registers every footer destination so secondary navigation cannot lead to a 404", () => {
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const footerSource = readFileSync(resolve(process.cwd(), "client/src/components/site/SiteFooter.tsx"), "utf8");
    const footerPaths = Array.from(footerSource.matchAll(/<Link href="(\/[^"]+)"/g)).map(match => match[1]);
    expect(footerPaths.length).toBeGreaterThan(12);
    for (const path of footerPaths) expect(appSource, `Missing public route: ${path}`).toContain(`<Route path="${path}"`);
  });
});
