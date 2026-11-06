import { describe, expect, it } from "vitest";
import { normalizeYouTubeUrl } from "../shared/youtube";

describe("normalizeYouTubeUrl", () => {
  const expected = {
    videoId: "dQw4w9WgXcQ",
    embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  };

  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?t=10",
    "https://youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  ])("normalizes supported YouTube URL %s", url => {
    expect(normalizeYouTubeUrl(url)).toEqual(expected);
  });

  it.each([
    "http://youtube.com/watch?v=dQw4w9WgXcQ",
    "https://example.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/watch?v=too-short",
    "https://youtube.com/playlist?list=PL123",
    "not-a-url",
  ])("rejects unsafe or unsupported URL %s", url => {
    expect(normalizeYouTubeUrl(url)).toBeNull();
  });
});
