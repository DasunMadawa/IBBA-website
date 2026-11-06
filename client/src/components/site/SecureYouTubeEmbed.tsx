import React from "react";
import { normalizeYouTubeUrl } from "@shared/youtube";

type SecureYouTubeEmbedProps = {
  url: string;
  title: string;
  className?: string;
};

export function SecureYouTubeEmbed({ url, title, className = "" }: SecureYouTubeEmbedProps) {
  const video = normalizeYouTubeUrl(url);
  const accessibleTitle = title.trim();

  if (!video || !accessibleTitle) {
    return (
      <div className={`video-error ${className}`.trim()} role="status">
        <strong>Video unavailable</strong>
        <p>A valid YouTube URL and an accessible video title are required.</p>
      </div>
    );
  }

  return (
    <div className={`youtube-embed ${className}`.trim()}>
      <iframe
        src={video.embedUrl}
        title={accessibleTitle}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
