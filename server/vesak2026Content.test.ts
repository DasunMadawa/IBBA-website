import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { articles, media } from "../client/src/data/siteContent";

const vesak = articles.find(article => article.slug === "white-house-vesak-2026");
const aprilFaithOffice = articles.find(article => article.slug === "ibaa-white-house-faith-office");

const approvedOrganizations = [
  "IBAA / Dharma College / LBDFI",
  "Odiyana Institute",
  "Tzu Chi Foundation",
  "TDSA / Sitagu, Austin, TX",
  "Buddhist Churches of America",
  "Jodo Shinshu International Office",
  "Honpa Hongwanji Mission of Hawaii",
  "Chùa Điều Ngự (Dieu Ngu Temple)",
  "Ambedkar Association of North America",
  "United Vietnamese Buddhist Congregation of the U.S.",
  "Watt Munisotaram",
  "Sakya",
  "Staten Island Buddhist Vihara",
  "CTU",
  "Sakya Phuntsok Ling",
  "Ragya",
];

describe("June 11, 2026 White House Vesak record", () => {
  it("uses the supplied facts in a concise current record", () => {
    expect(vesak).toBeDefined();
    expect(vesak?.title).toBe("Fifth Annual White House Vesak Lamp Lighting Ceremony");
    expect(vesak?.date).toBe("2026-06-11");
    const copy = [vesak?.excerpt, ...(vesak?.body ?? [])].join(" ");
    expect(copy.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(220);
    expect(copy).toContain("Eisenhower Executive Office Building");
    expect(copy).toContain("IBAA President Wangmo Dixey");
    expect(copy).toContain("White House Faith Office");
    expect(copy).toContain("About 26 Buddhist delegates");
    expect(copy).toContain("Theravada, Mahayana, and Vajrayana");
    expect(copy).not.toMatch(/Dalai Lama/i);
    const sitemap = readFileSync(resolve(process.cwd(), "client/public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://www.ibaa.org/news/white-house-vesak-2026");
  });

  it("uses only the supplied organization names and forthcoming profiles", () => {
    expect(vesak?.participatingOrganizations).toEqual(approvedOrganizations);
    expect(vesak?.participatingOrganizations?.every(name => approvedOrganizations.includes(name))).toBe(true);
  });

  it("uses the approved real 2026 participating-organization photograph", () => {
    expect(vesak?.image).toBe(media.whiteHouseVesak2026);
    expect(vesak?.credit).toContain("Honpa Hongwanji Mission of Hawaii");
    const provenance = readFileSync(resolve(process.cwd(), "research/assets/provenance.md"), "utf8");
    expect(provenance).toContain("white-house-vesak-june-11-2026_ed4417f7.webp");
    expect(provenance).toContain("No AI generation or alteration");
  });

  it("keeps the April 16 Faith Office meeting separate", () => {
    expect(aprilFaithOffice).toBeDefined();
    expect(aprilFaithOffice?.slug).toBe("ibaa-white-house-faith-office");
    expect(aprilFaithOffice?.date).toBe("2026-04-27");
    expect(aprilFaithOffice?.body.join(" ")).toContain("April 16, 2026");
    expect(aprilFaithOffice?.image).not.toBe(vesak?.image);
    expect(articles.filter(article => article.slug === "ibaa-white-house-faith-office")).toHaveLength(1);
    expect(articles.filter(article => article.slug === "white-house-vesak-2026")).toHaveLength(1);
  });
});
