import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SecureYouTubeEmbed } from "../client/src/components/site/SecureYouTubeEmbed";

describe("SecureYouTubeEmbed", () => {
  it("renders a privacy-enhanced iframe with an accessible title", () => {
    const html = renderToStaticMarkup(<SecureYouTubeEmbed url="https://youtu.be/dQw4w9WgXcQ" title="IBAA Vesak address" />);
    expect(html).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(html).toContain('title="IBAA Vesak address"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain("allowFullScreen");
  });

  it.each([
    ["https://example.com/not-youtube", "A title"],
    ["https://youtube.com/watch?v=dQw4w9WgXcQ", "   "],
  ])("renders an accessible fallback for invalid input", (url, title) => {
    const html = renderToStaticMarkup(<SecureYouTubeEmbed url={url} title={title} />);
    expect(html).toContain('role="status"');
    expect(html).toContain("Video unavailable");
    expect(html).not.toContain("<iframe");
  });
});
