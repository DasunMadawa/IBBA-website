import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("whole-site Old Glory color system", () => {
  it("defines the exact requested blue and red tokens", () => {
    expect(stylesheet).toContain("--old-glory-blue: #002868;");
    expect(stylesheet).toContain("--old-glory-red: #bf0a30;");
    expect(stylesheet).toContain("--primary: #002868;");
    expect(stylesheet).toContain("--secondary: #bf0a30;");
  });

  it("applies blue to the top bar, global primary accents, and footer", () => {
    expect(stylesheet).toContain("--maroon: var(--old-glory-blue);");
    expect(stylesheet).toContain("--forest: var(--old-glory-blue);");
    expect(stylesheet).toContain(".utility-bar { background: var(--old-glory-blue);");
    expect(stylesheet).toContain(".site-footer { padding-top: 5rem; background: var(--old-glory-blue);");
  });

  it("applies red to Donate and strong call-to-action surfaces", () => {
    expect(stylesheet).toContain(".utility-donate { background: var(--old-glory-red);");
    expect(stylesheet).toContain(".participate-band { padding-block: 5.5rem; background: var(--old-glory-red);");
    expect(stylesheet).toContain(".traditions-review { padding-block: 6rem; background: var(--old-glory-red);");
  });

  it("removes the previous green and burgundy color values", () => {
    for (const legacyColor of [
      "#6b1f2a",
      "#4d1520",
      "#214c3a",
      "#17382b",
      "#1b241e",
      "#26352c",
      "#17221c",
      "#7d1f2e",
      "#721728",
      "#24472f",
    ]) {
      expect(stylesheet.toLowerCase()).not.toContain(legacyColor);
    }
  });
});
