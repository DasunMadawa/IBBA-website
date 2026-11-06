import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function textSources(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? textSources(file) : /\.(?:tsx?|json|css|html|xml|txt|md)$/.test(entry.name) ? [file] : [];
  });
}

describe("October 28 check-only donation instructions", () => {
  it("contains no removed payment-service references in any frontend source or shared public dataset", () => {
    const root = process.cwd();
    const files = [path.join(root, "client/index.html"), ...textSources(path.join(root, "client/src")), ...textSources(path.join(root, "client/public")), ...textSources(path.join(root, "shared"))];
    const matches = files.filter(file => /paypal/i.test(readFileSync(file, "utf8"))).map(file => path.relative(root, file));
    expect(matches).toEqual([]);
  });

  it("retains the current check-mailing configuration without payment placeholders", () => {
    const page = readFileSync(path.join(process.cwd(), "client/src/pages/DonatePage.tsx"), "utf8");
    expect(page).toContain("donationMailingAddress.instructions");
    expect(page).toContain("Make your check payable to");
    expect(page).not.toMatch(/<aside|<button|donation-placeholder|future online giving|coming.soon|not available yet/i);
  });
});
