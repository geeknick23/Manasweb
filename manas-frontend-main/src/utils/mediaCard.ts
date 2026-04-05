import type { MediaCardType } from '@/types/cards';

/** Raw API shape may use `articleUrl` (backend) instead of `externalUrl` (frontend). */
export type RawMediaCard = MediaCardType & { articleUrl?: string };

const VIDEO_IN_URL =
  /youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com|dailymotion\.com|facebook\.com\/watch|fb\.watch|instagram\.com\/(reel|tv|p\/)/i;

const VIDEO_EXT = /\.(mp4|webm|ogg|m3u8)(\?|$)/i;

const YT_THUMB = /ytimg\.com|i\.ytimg\.com|img\.youtube\.com/i;

const EMBED_IN_HTML = /youtube\.com\/embed|youtu\.be\/|youtube-nocookie\.com\/embed/i;

function collectUrlStrings(card: RawMediaCard): string {
  const parts = [
    card.externalUrl,
    card.articleUrl,
    card.imageUrl,
    card.detailedDescription,
    card.description,
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Detect video from links, filenames, YouTube thumbnails, or embeds in HTML description.
 */
export function resolveMediaType(card: RawMediaCard): 'press' | 'video' | 'photo' {
  const blob = collectUrlStrings(card);

  if (VIDEO_IN_URL.test(blob) || VIDEO_EXT.test(blob) || YT_THUMB.test(blob) || EMBED_IN_HTML.test(blob)) {
    return 'video';
  }

  if (card.type === 'video' || card.type === 'photo' || card.type === 'press') {
    return card.type;
  }

  return 'press';
}

/**
 * Single card used everywhere: consistent `externalUrl` + resolved `type` for badges and filters.
 */
export function normalizeMediaCard(raw: RawMediaCard): MediaCardType {
  const externalUrl = raw.externalUrl?.trim() || raw.articleUrl?.trim() || undefined;
  const withLink: RawMediaCard = { ...raw, externalUrl: externalUrl || raw.externalUrl };

  return {
    ...raw,
    externalUrl,
    type: resolveMediaType(withLink),
  };
}
