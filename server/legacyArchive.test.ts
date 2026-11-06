import { describe, expect, it } from "vitest";
import { legacyMedia, legacyPages, legacyPosts } from "../client/src/data/legacyArchive.generated";
import { legacyRedirects } from "./legacyRedirects.generated";

describe("legacy migration integrity", () => {
  it("contains every publicly inventoried content and media record", () => {
    expect(legacyPosts).toHaveLength(29);
    expect(legacyPages).toHaveLength(17);
    expect(legacyMedia).toHaveLength(338);
    expect(legacyRedirects.size).toBe(393);
  });

  it("preserves unique legacy slugs and paths", () => {
    expect(new Set(legacyPosts.map(post => post.slug)).size).toBe(legacyPosts.length);
    expect(new Set(legacyPages.map(page => page.slug)).size).toBe(legacyPages.length);
    expect(new Set(legacyMedia.map(asset => asset.id)).size).toBe(legacyMedia.length);
  });

  it("maps representative page, post, taxonomy, and attachment paths", () => {
    expect(legacyRedirects.get("/index.php/mission/")?.destination).toBe("/about/mission");
    expect(legacyRedirects.get("/index.php/2021/05/14/vesak-2021-media-kit/")?.destination).toBe("/news/vesak-2021-media-kit");
    expect(legacyRedirects.get("/index.php/category/study/")?.destination).toBe("/news-media?category=study");
    expect(legacyRedirects.get("/ibaa-donation-form/")?.destination).toBe("/media/411-ibaa-donation-form");
  });

  it("uses managed storage for the documented selected legacy documents and images", () => {
    const managedMedia = legacyMedia.filter(asset => asset.sourceUrl.startsWith("/manus-storage/"));
    expect(managedMedia.map(asset => asset.sourceUrl)).toEqual(expect.arrayContaining([
      "/manus-storage/brief-history-of-ibaa_bcf3e29f.pdf",
      "/manus-storage/ibaa-donation-form_c3028c7b.pdf",
      "/manus-storage/ibaa-application-form_0bbb5887.pdf",
      "/manus-storage/white-house-vesak-2023-press-release_d25fbea8.pdf",
      "/manus-storage/ibaa-wordmark_3b38a5b1.webp",
      "/manus-storage/white-house-faith-office-2026-optimized_233c8ff0.webp",
      "/manus-storage/white-house-vesak-2024_273bb982.webp",
      "/manus-storage/study-circle-aug-2026-fixed_8f9f529d.webp",
    ]));
  });
});
