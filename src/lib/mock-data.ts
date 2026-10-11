import { Gift } from "./types";

// Instrumental bebas royalti (Pixabay Music). File mp3 disimpan di public/music/.
export const MUSIC_OPTIONS = [
  { id: "piano-lembut", label: "Piano Lembut — romantis & tenang", url: "/music/piano-lembut.mp3" },
  { id: "akustik-ceria", label: "Akustik Ceria — perayaan & ulang tahun", url: "/music/akustik-ceria.mp3" },
  { id: "sinematik-haru", label: "Sinematik Haru — wisuda & pencapaian", url: "/music/sinematik-haru.mp3" },
  { id: "hangat-keluarga", label: "Hangat Keluarga — lebaran & kebersamaan", url: "/music/hangat-keluarga.mp3" },
  { id: "lofi-santai", label: "Lo-fi Santai — ringan & kekinian", url: "/music/lofi-santai.mp3" },
];

export const THEME_OPTIONS = [
  {
    id: "ucapan",
    label: "Buat Ucapan",
    subtitle: "Kartu Kasih & Ungkapan Hangat",
    emoji: "💌",
    sealSvg: "/gift/seal-love.svg",
    gradient: "from-[#FFFDF7] via-[#FFF8F2] to-[#FFEFE6]",
    textColor: "text-neutral-900",
    cardBg: "bg-white",
    accent: "#EA580C",
    envelopeBg: "#FFF8F2",
    envelopeFlap: "#FED7AA",
    waxColor: "gold" as const,
    ambientParticle: "sparkles" as const,
    glowColor: "rgba(251, 146, 60, 0.15)",
    tapeStyle: "washi-tape-gold" as const,
  },
  {
    id: "ulang-tahun",
    label: "Buat Ulang Tahun",
    subtitle: "Pesta Ceria, Lilin & Confetti Emas",
    emoji: "🎂",
    sealSvg: "/gift/seal-star.svg",
    gradient: "from-[#FFFDF7] via-[#FEF3C7]/40 to-[#FED7AA]/40",
    textColor: "text-neutral-900",
    cardBg: "bg-white",
    accent: "#D97706",
    envelopeBg: "#FFF8ED",
    envelopeFlap: "#FDE68A",
    waxColor: "gold" as const,
    ambientParticle: "confetti-sparkles" as const,
    glowColor: "rgba(251, 191, 36, 0.15)",
    tapeStyle: "washi-tape-gold" as const,
  },
  {
    id: "pacar",
    label: "Buat Pacar",
    subtitle: "Romantis Penuh Cinta & Mawar",
    emoji: "🌹",
    sealSvg: "/gift/seal-rose.svg",
    gradient: "from-[#FFF5F7] via-[#FCE7F3]/60 to-[#FBCFE8]/40",
    textColor: "text-neutral-900",
    cardBg: "bg-white",
    accent: "#E11D48",
    envelopeBg: "#FFF0F5",
    envelopeFlap: "#FBCFE8",
    waxColor: "ruby" as const,
    ambientParticle: "petals-hearts" as const,
    glowColor: "rgba(244, 63, 94, 0.15)",
    tapeStyle: "washi-tape" as const,
  },
  {
    id: "temen",
    label: "Buat Temen",
    subtitle: "Hangat, Seru & Kebersamaan Sahabat",
    emoji: "✨",
    sealSvg: "/gift/seal-leaf.svg",
    gradient: "from-[#F0FDF4]/50 via-[#F7FEE7] to-[#D1FAE5]/40",
    textColor: "text-neutral-900",
    cardBg: "bg-white",
    accent: "#059669",
    envelopeBg: "#F0FDF4",
    envelopeFlap: "#D1FAE5",
    waxColor: "emerald" as const,
    ambientParticle: "sparkles" as const,
    glowColor: "rgba(16, 185, 129, 0.15)",
    tapeStyle: "washi-tape" as const,
  },
] as const;

export const GALLERY_MOCK: Gift[] = [
  {
    id: "1",
    slug: "untuk-rara",
    recipient_name: "Rara",
    opening_text: "Ada sesuatu buat kamu, Rara 💌",
    theme: "ulang-tahun",
    closing_text: "Semoga hari-harimu selalu indah seperti dirimu. Selamat ulang tahun! 🎉",
    music_url: "/music/akustik-ceria.mp3",
    cards: [
      { id: "c1", order_index: 0, text_content: "Selamat ulang tahun, Rara! 🎂 Semoga panjang umur dan selalu bahagia.", image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop" },
      { id: "c2", order_index: 1, text_content: "Terima kasih sudah jadi orang yang paling spesial dalam hidupku. ❤️" },
    ],
    status: "published",
    view_count: 247,
    like_count: 18,
    is_public: true,
    published_at: "2026-09-10T08:00:00Z",
    created_at: "2026-09-10T07:00:00Z",
  },
  {
    id: "2",
    slug: "untuk-dimas",
    recipient_name: "Dimas",
    opening_text: "Selamat ya, Dimas! Ada hadiah kecil buat kamu 🎓",
    theme: "wisuda",
    closing_text: "Perjalanan barumu dimulai hari ini. Bangga banget sama kamu!",
    cards: [
      { id: "c3", order_index: 0, text_content: "Selamat wisuda, Dimas! Perjuanganmu selama ini akhirnya terbayar. 🎓", image_url: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=400&h=300&fit=crop" },
      { id: "c4", order_index: 1, text_content: "Masa depanmu cerah. Terus semangat dan jangan lupa bahagia! ✨" },
    ],
    status: "published",
    view_count: 132,
    like_count: 9,
    is_public: true,
    published_at: "2026-09-12T10:00:00Z",
    created_at: "2026-09-12T09:00:00Z",
  },
  {
    id: "3",
    slug: "untuk-kamu",
    recipient_name: "Sayang",
    opening_text: "Buat kamu yang selalu ada untukku 💑",
    theme: "anniversary",
    closing_text: "1 tahun bersama, dan aku semakin yakin kamu adalah orangnya. Sayang kamu. ❤️",
    music_url: "/music/sinematik-haru.mp3",
    cards: [
      { id: "c5", order_index: 0, text_content: "Tepat setahun yang lalu kita mulai perjalanan ini bersama.", image_url: "https://images.unsplash.com/photo-1522168637698-f490d9f2c82f?w=400&h=300&fit=crop" },
      { id: "c6", order_index: 1, text_content: "Terima kasih sudah sabar dan selalu pengertian. 💕" },
      { id: "c7", order_index: 2, text_content: "Happy anniversary! Semoga kita terus tumbuh bersama. 🌹" },
    ],
    status: "published",
    view_count: 389,
    like_count: 34,
    is_public: true,
    published_at: "2026-09-01T00:00:00Z",
    created_at: "2026-08-31T22:00:00Z",
  },
];

export function getTheme(id: string) {
  const normalizedId =
    id === "anniversary" || id === "valentine"
      ? "pacar"
      : id === "wisuda" || id === "lebaran"
      ? "temen"
      : id;

  return THEME_OPTIONS.find((t) => t.id === normalizedId) ?? THEME_OPTIONS[0];
}
