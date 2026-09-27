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
  { id: "ulang-tahun", label: "Perayaan", subtitle: "Warm Sand", emoji: "✨", gradient: "from-[#FBF9F5] via-[#F4EFE6] to-[#ECE3D4]", textColor: "text-neutral-900", cardBg: "bg-white", accent: "#1D1D1F" },
  { id: "anniversary", label: "Romantis", subtitle: "Muted Rose", emoji: "🤍", gradient: "from-[#FDF8F8] via-[#F9ECEE] to-[#F1DEE2]", textColor: "text-neutral-900", cardBg: "bg-white", accent: "#2D1B22" },
  { id: "wisuda", label: "Pencapaian", subtitle: "Clean Slate", emoji: "🎓", gradient: "from-[#F8FAFC] via-[#EDF2F7] to-[#E2E8F0]", textColor: "text-neutral-900", cardBg: "bg-white", accent: "#0F172A" },
  { id: "lebaran", label: "Kekeluargaan", subtitle: "Soft Sage", emoji: "🌿", gradient: "from-[#F6F8F6] via-[#ECF2ED] to-[#DFE9E1]", textColor: "text-neutral-900", cardBg: "bg-white", accent: "#1A2E22" },
  { id: "valentine", label: "Obsidian", subtitle: "Deep Midnight", emoji: "🌑", gradient: "from-[#0F0F11] via-[#16161A] to-[#08080A]", textColor: "text-white", cardBg: "bg-[#18181B]", accent: "#FFFFFF" },
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
  return THEME_OPTIONS.find((t) => t.id === id) ?? THEME_OPTIONS[0];
}
