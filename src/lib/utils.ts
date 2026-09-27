export { cn } from "cn"

export const PREMIUM_PRICE = 5000;
export const PREMIUM_PRICE_LABEL = `Rp ${PREMIUM_PRICE.toLocaleString("id-ID")}`;

// ID video dari link YouTube (watch, youtu.be, shorts, embed, music). null bila bukan link YouTube.
export function youtubeId(url?: string | null): string | null {
  const m = url
    ?.trim()
    .match(
      /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/
    );
  return m ? m[1] : null;
}
