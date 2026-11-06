// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { DonatePage } from "../client/src/pages/DonatePage";
import { JoinPage } from "../client/src/pages/PublicPages";
import { documents } from "../client/src/data/siteContent";
import { ibaaMailingAddress } from "../shared/ibaaMailingAddress";
import { registerLegacyRedirects } from "./legacyRedirects";

afterEach(cleanup);

describe("October 27 admin-supplied Clinton mailing destination", () => {
  it("uses only the latest exact mailing destination for check-only donations", () => {
    expect(ibaaMailingAddress).toEqual({ recipient: "IBAA", street: "P.O. Box 2143", locality: "Clinton, MD 20735" });
    render(<DonatePage />);
    expect(document.querySelector("address")?.textContent).toBe("Please mail checks to IBAA, P.O. Box 2143, Clinton, MD 20735.");
    for (const old of ["P.O. Box 464", "Lorton", "2222 Harold Way"]) expect(document.body.textContent).not.toContain(old);
    expect(document.body.textContent).not.toMatch(/paypal|coming.soon|future online giving|not available yet|reserved for/i);
    expect(document.querySelector("aside, .donation-placeholder")).toBeNull();
    expect(document.querySelector('a[href*="paypal"]')).toBeNull();
  });

  it("shows the same address beside the corrected membership application", () => {
    render(<JoinPage />);
    expect(document.querySelector("address")?.textContent).toBe("IBAAP.O. Box 2143Clinton, MD 20735");
    expect(screen.getByRole("link", { name: "Open application" }).getAttribute("href")).toBe(documents[1].url);
    expect(documents[1].url).not.toBe("/manus-storage/ibaa-application-form_0bbb5887.pdf");
    expect(documents[2].url).not.toBe("/manus-storage/ibaa-donation-form_c3028c7b.pdf");
    expect(document.body.textContent).not.toContain("2222 Harold Way");
  });

  it("preserves old form URLs by directly redirecting GET and HEAD to corrected forms without affecting other assets", () => {
    let middleware: any;
    registerLegacyRedirects({ use: (handler: any) => { middleware = handler; } } as any);
    for (const [old, destination] of [["/manus-storage/ibaa-application-form_0bbb5887.pdf", documents[1].url], ["/manus-storage/ibaa-donation-form_c3028c7b.pdf", documents[2].url]]) {
      for (const method of ["GET", "HEAD"]) {
        const redirect = { redirect: (status: number, location: string) => { expect(status).toBe(301); expect(location).toBe(`${destination}?download=1`); } };
        let continued = false;
        middleware({ path: old, originalUrl: `${old}?download=1`, method }, redirect, () => { continued = true; });
        expect(continued).toBe(false);
      }
    }
    let continued = false;
    middleware({ path: "/manus-storage/photo.webp", originalUrl: "/manus-storage/photo.webp", method: "GET" }, { redirect: () => { throw new Error("Unrelated media redirected"); } }, () => { continued = true; });
    expect(continued).toBe(true);
  });
});
