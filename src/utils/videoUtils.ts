/**
 * Utility functions for handling and normalizing video URLs
 * (YouTube standard links, short links, shorts, embeds, and direct MP4s)
 */

export interface FormattedVideoInfo {
  embedUrl: string;
  originalUrl: string;
  type: 'youtube' | 'mp4' | 'empty';
  videoId?: string;
}

export function parseAndFormatVideoUrl(url: string | undefined | null): FormattedVideoInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      embedUrl: '',
      originalUrl: '',
      type: 'empty'
    };
  }

  const trimmed = url.trim();

  // Check for YouTube URLs (watch, youtu.be, embed, shorts)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      originalUrl: trimmed,
      type: 'youtube',
      videoId
    };
  }

  // Already a youtube embed URL?
  if (trimmed.includes('youtube.com/embed/')) {
    return {
      embedUrl: trimmed,
      originalUrl: trimmed,
      type: 'youtube'
    };
  }

  // Fallback to direct video file (MP4, WebM, etc.)
  return {
    embedUrl: trimmed,
    originalUrl: trimmed,
    type: 'mp4'
  };
}
