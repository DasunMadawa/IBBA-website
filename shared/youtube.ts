const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export type NormalizedYouTubeVideo = {
  videoId: string;
  embedUrl: string;
};

function validId(candidate: string | null | undefined) {
  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

export function normalizeYouTubeUrl(input: string): NormalizedYouTubeVideo | null {
  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") return null;

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const segments = parsed.pathname.split("/").filter(Boolean);
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = validId(segments[0]);
  } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
    if (parsed.pathname === "/watch") {
      videoId = validId(parsed.searchParams.get("v"));
    } else if (["shorts", "embed"].includes(segments[0] ?? "")) {
      videoId = validId(segments[1]);
    }
  }

  if (!videoId) return null;

  return {
    videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}
