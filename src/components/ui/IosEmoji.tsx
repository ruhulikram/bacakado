"use client";

import React from "react";

// Mapping emoji symbol / alias name to local Apple emoji asset
export const IOS_EMOJI_MAP: Record<string, string> = {
  // Surat & Amplop
  "💌": "/emojis/ios/love-letter.png",
  "love-letter": "/emojis/ios/love-letter.png",
  "✉️": "/emojis/ios/envelope.png",
  "✉": "/emojis/ios/envelope.png",
  "envelope": "/emojis/ios/envelope.png",
  "📜": "/emojis/ios/scroll.png",
  "scroll": "/emojis/ios/scroll.png",

  // Cinta & Ekspresi Kasih Sayang
  "❤️": "/emojis/ios/red-heart.png",
  "❤": "/emojis/ios/red-heart.png",
  "heart": "/emojis/ios/red-heart.png",
  "💕": "/emojis/ios/two-hearts.png",
  "two-hearts": "/emojis/ios/two-hearts.png",
  "💖": "/emojis/ios/sparkling-heart.png",
  "sparkling-heart": "/emojis/ios/sparkling-heart.png",
  "🤍": "/emojis/ios/white-heart.png",
  "white-heart": "/emojis/ios/white-heart.png",
  "🥰": "/emojis/ios/smiling-face-with-hearts.png",
  "smiling-hearts": "/emojis/ios/smiling-face-with-hearts.png",
  "😍": "/emojis/ios/heart-eyes.png",
  "heart-eyes": "/emojis/ios/heart-eyes.png",
  "🥺": "/emojis/ios/pleading-face.png",
  "pleading": "/emojis/ios/pleading-face.png",
  "😊": "/emojis/ios/smiling-face.png",
  "smile": "/emojis/ios/smiling-face.png",
  "🤗": "/emojis/ios/hugging-face.png",
  "hug": "/emojis/ios/hugging-face.png",

  // Bunga, Boneka & Cincin
  "🌹": "/emojis/ios/rose.png",
  "rose": "/emojis/ios/rose.png",
  "🌸": "/emojis/ios/cherry-blossom.png",
  "cherry-blossom": "/emojis/ios/cherry-blossom.png",
  "💐": "/emojis/ios/bouquet.png",
  "bouquet": "/emojis/ios/bouquet.png",
  "🧸": "/emojis/ios/teddy-bear.png",
  "teddy": "/emojis/ios/teddy-bear.png",
  "💍": "/emojis/ios/ring.png",
  "ring": "/emojis/ios/ring.png",
  "🌿": "/emojis/ios/herb.png",
  "herb": "/emojis/ios/herb.png",

  // Perayaan & Pesta
  "🎂": "/emojis/ios/birthday-cake.png",
  "cake": "/emojis/ios/birthday-cake.png",
  "🎉": "/emojis/ios/party-popper.png",
  "party": "/emojis/ios/party-popper.png",
  "🎁": "/emojis/ios/wrapped-gift.png",
  "gift": "/emojis/ios/wrapped-gift.png",
  "✨": "/emojis/ios/sparkles.png",
  "sparkles": "/emojis/ios/sparkles.png",
  "🌟": "/emojis/ios/glowing-star.png",
  "glowing-star": "/emojis/ios/glowing-star.png",
  "⭐": "/emojis/ios/star.png",
  "star": "/emojis/ios/star.png",
  "🎓": "/emojis/ios/graduation-cap.png",
  "graduation": "/emojis/ios/graduation-cap.png",
  "🥂": "/emojis/ios/champagne.png",
  "champagne": "/emojis/ios/champagne.png",
  "🌙": "/emojis/ios/moon.png",
  "moon": "/emojis/ios/moon.png",

  // Kamera, Gembok & Tangan
  "📷": "/emojis/ios/camera.png",
  "camera": "/emojis/ios/camera.png",
  "🔒": "/emojis/ios/lock.png",
  "lock": "/emojis/ios/lock.png",
  "🔑": "/emojis/ios/key.png",
  "key": "/emojis/ios/key.png",
  "✍️": "/emojis/ios/writing-hand.png",
  "✍": "/emojis/ios/writing-hand.png",
  "write": "/emojis/ios/writing-hand.png",
  "🎵": "/emojis/ios/musical-note.png",
  "music": "/emojis/ios/musical-note.png",
};

export const POPULAR_IOS_EMOJIS = [
  "❤️", "💕", "🥰", "😍", "💌", "🌹", "🌸", "💐", "🎂", "🎉", "🎁", "✨", "🧸", "🥺"
];

// Regex matching any recognized emoji
const EMOJI_PARSE_REGEX = /(✍️|✉️|❤️|💌|✉|📜|❤|💕|💖|🤍|🥰|😍|🥺|😊|🤗|🌹|🌸|💐|🧸|💍|🌿|🎂|🎉|🎁|✨|🌟|⭐|🎓|🥂|🌙|📷|🔒|🔑|✍|🎵)/g;

interface IosEmojiProps {
  symbol?: string;
  name?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function IosEmoji({
  symbol,
  name,
  size = 20,
  className = "",
  alt,
}: IosEmojiProps) {
  const key = symbol || name || "";
  const src = IOS_EMOJI_MAP[key];

  if (!src) {
    // Fallback: render Unicode symbol with Apple-preferred font stack
    return (
      <span
        className={`inline-block select-none align-middle font-['Apple_Color_Emoji',sans-serif] ${className}`}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
      >
        {symbol || name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt || symbol || name || "emoji"}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`inline-block select-none align-middle object-contain ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "inline-block",
        verticalAlign: "-0.15em",
      }}
    />
  );
}

/**
 * Komponen yang otomatis menguraikan teks dan mengganti emoji teks biasa
 * menjadi aset Apple Retina iOS Emoji, sehingga tampilan 100% konsisten
 * di Android, Windows, Mac, dan iPhone.
 */
export function EmojiText({
  text,
  size = 18,
  className = "",
}: {
  text?: string;
  size?: number;
  className?: string;
}) {
  if (!text) return null;

  const parts = text.split(EMOJI_PARSE_REGEX);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (IOS_EMOJI_MAP[part]) {
          return (
            <React.Fragment key={i}>
              <IosEmoji symbol={part} size={size} />
            </React.Fragment>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/**
 * Toolbar cepat untuk menyisipkan emoji iOS ke dalam form input/textarea.
 */
export function IosEmojiBar({
  onSelect,
  className = "",
}: {
  onSelect: (emoji: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto py-1 px-1 scrollbar-none select-none ${className}`}
    >
      <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1 shrink-0">
        Emoji:
      </span>
      {POPULAR_IOS_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="p-1 rounded-lg hover:bg-neutral-100 transition-colors active:scale-90 shrink-0"
          title={`Sisipkan ${emoji}`}
        >
          <IosEmoji symbol={emoji} size={16} />
        </button>
      ))}
    </div>
  );
}

