import { describe, expect, it } from "vitest";
import { articles, documents, studyCircleHosts } from "./data/siteContent";

describe("public content foundations", () => {
  it("preserves a legacy URL and accessible image description for every migrated article", () => {
    expect(articles.length).toBeGreaterThan(0);
    for (const article of articles) {
      expect(article.legacyUrl).toMatch(/^https:\/\/www\.ibaa\.org\//);
      expect(article.imageAlt.trim().length).toBeGreaterThan(20);
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("labels every legacy document with a human-readable title and file type", () => {
    for (const document of documents) {
      expect(document.title.trim().length).toBeGreaterThan(5);
      expect(document.type).toBe("PDF");
      expect(document.url).toMatch(/\.pdf$/i);
    }
  });

  it("does not represent verified Study Circle hosts as confirmed member temples", () => {
    expect(studyCircleHosts.every(host => host.relationship === "Study Circle host")).toBe(true);
  });
});
