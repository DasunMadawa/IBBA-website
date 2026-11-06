import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Communities public route regression", () => {
  const appSource = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
  const footerSource = readFileSync(new URL("../client/src/components/site/SiteFooter.tsx", import.meta.url), "utf8");

  it("registers the canonical and legacy-compatible community directory routes", () => {
    expect(appSource).toContain('<Route path="/communities" component={TemplesPage} />');
    expect(appSource).toContain('<Route path="/member-temples" component={TemplesPage} />');
  });

  it("keeps Communities accessible in the footer while the main menu has four items", () => {
    expect(footerSource).toContain('<Link href="/communities">Communities</Link>');
  });
});
