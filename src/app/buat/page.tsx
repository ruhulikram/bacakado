"use client";

import { useState, useEffect, useRef } from "react";
import { THEME_OPTIONS, MUSIC_OPTIONS } from "@/lib/mock-data";
import { Card, Theme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GiftExperience } from "@/components/gift/GiftExperience";
import { Gift } from "@/lib/types";
import { PublishModal, usePendingPublish } from "@/components/gift/PublishModal";
import { ShareSuccessModal } from "@/components/gift/ShareSuccessModal";
import { CardImageUpload } from "@/components/gift/CardImageUpload";
import { DraftGift } from "@/app/actions/gift";
import { checkPaymentStatus } from "@/app/actions/payment";
import { PREMIUM_PRICE_LABEL, youtubeId } from "@/lib/utils";
import { Play, Pause, Volume2, Sparkles, Heart, Smartphone } from "lucide-react";
import { IosEmoji, IosEmojiBar } from "@/components/ui/IosEmoji";

type Step = "theme" | "pembuka" | "kartu" | "musik" | "preview";

const STEPS: Step[] = ["theme", "pembuka", "kartu", "musik", "preview"];

const STEP_LABELS: Record<Step, string> = {
  theme: "Nuansa",
  pembuka: "Pesan Awal",
  kartu: "Kartu Cerita",
  musik: "Audio Latar",
  preview: "Pratinjau",
};

const PRESETS = [
  {
    icon: "💌",
    label: "Buat Ucapan",
    opening: (name: string) => `Ada sepucuk pesan manis yang ingin kusampaikan padamu, ${name || "kamu"} 💌✨`,
    closing: "Semoga hari-harimu selalu dipenuhi ketenangan dan senyuman. Terima kasih sudah hadir dalam hidupku. ✨",
  },
  {
    icon: "🎂",
    label: "Buat Ulang Tahun",
    opening: (name: string) => `Ada kejutan spesial buat kamu di hari bahagia ini, ${name || "kamu"} 🎂✨`,
    closing: "Selamat ulang tahun! Semoga segala harapan dan impianmu terwujud. Bangga banget sama kamu, teruslah bahagia! 🎉",
  },
  {
    icon: "🌹",
    label: "Buat Pacar",
    opening: (name: string) => `Sebuah surat kecil penuh cinta buat orang paling spesial dalam hidupku, ${name || "kamu"} ❤️`,
    closing: "Terima kasih sudah selalu ada dan melengkapi setiap hariku. Aku semakin bersyukur memilikimu. Sayang kamu selamanya. 🌹",
  },
  {
    icon: "✨",
    label: "Buat Temen",
    opening: (name: string) => `Buat temen terbaikku yang selalu ada di suka dan duka, ${name || "kamu"} 💌`,
    closing: "Terima kasih atas tawa, cerita konyol, dan kebersamaan yang gak pernah ada habisnya. Temenan selamanya ya! ✨",
  },
];

export default function BuatPage() {
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // Handle callback return setelah pembayaran Mayar berhasil
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment_success") === "1") {
      const giftId = params.get("gift_id");
      if (giftId) {
        checkPaymentStatus(giftId).then((res) => {
          if (res.isPaid && res.slug) {
            setPublishedSlug(res.slug);
            if (res.recipientName) setRecipientName(res.recipientName);
            window.history.replaceState({}, "", "/buat");
          }
        });
      }
    }
  }, []);

  // After Google OAuth redirect, continue the pending draft to payment
  usePendingPublish();

  const [step, setStep] = useState<Step>("theme");
  const [theme, setTheme] = useState<Theme>("ucapan");
  const [recipientName, setRecipientName] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [closingText, setClosingText] = useState("");
  const [musicId, setMusicId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const useYoutube = musicId === "youtube";
  const youtubeInvalid = useYoutube && Boolean(youtubeUrl.trim()) && !youtubeId(youtubeUrl);
  const [cards, setCards] = useState<Card[]>([
    { id: "1", order_index: 0, text_content: "" },
  ]);
  const [showPublish, setShowPublish] = useState(false);
  const [previewOpened, setPreviewOpened] = useState(false);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const stepIndex = STEPS.indexOf(step);

  // Audio preview handler in Step 4
  function toggleAudioPreview(id: string, url: string) {
    if (previewPlayingId === id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewPlayingId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.volume = 0.6;
      audio.play().then(() => {
        previewAudioRef.current = audio;
        setPreviewPlayingId(id);
        audio.onended = () => setPreviewPlayingId(null);
      }).catch(() => {});
    }
  }

  // Stop audio preview when changing steps
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, [step]);

  function applyPreset(preset: typeof PRESETS[0]) {
    setOpeningText(preset.opening(recipientName));
    setClosingText(preset.closing);
  }

  const draft: DraftGift = {
    recipientName,
    openingText,
    closingText,
    theme,
    musicId,
    youtubeUrl: useYoutube ? youtubeUrl : undefined,
    cards: cards.map((c) => ({ text_content: c.text_content, image_url: c.image_url })),
  };

  const previewGift: Gift = {
    id: "preview",
    slug: "preview",
    recipient_name: recipientName || "Kamu",
    opening_text: openingText || `Ada sesuatu buat ${recipientName || "kamu"}`,
    theme,
    closing_text: closingText || "Semoga hari-harimu selalu menyenangkan.",
    music_url: useYoutube ? youtubeUrl : MUSIC_OPTIONS.find((m) => m.id === musicId)?.url,
    cards: cards.filter((c) => c.text_content.trim()),
    status: "draft",
    is_premium: true,
    view_count: 0,
    like_count: 0,
    is_public: false,
    created_at: new Date().toISOString(),
  };

  function addCard() {
    setCards((prev) => [
      ...prev,
      { id: Date.now().toString(), order_index: prev.length, text_content: "" },
    ]);
  }

  function removeCard(id: string) {
    setCards((prev) =>
      prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, order_index: i }))
    );
  }

  function updateCard(id: string, field: "text_content" | "image_url", val: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1F]">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 apple-glass">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-xs font-bold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity flex items-center gap-1.5">
            <IosEmoji symbol="💌" size={18} />
            <span>BacaKado</span>
          </a>

          {/* Minimalist Progress Pill */}
          <div className="flex items-center gap-1.5 bg-neutral-100/90 px-3.5 py-1.5 rounded-full text-[11px] font-medium text-neutral-600 border border-neutral-200/60 shadow-2xs">
            <span>{stepIndex + 1} dari 5</span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-900 font-semibold">{STEP_LABELS[step]}</span>
          </div>

          <a href="/" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Keluar
          </a>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <main className="max-w-xl mx-auto px-6 py-10">

        {/* ── STEP 1: TEMA / NUANSA ────────────────────────────── */}
        {step === "theme" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
                <Sparkles size={12} />
                <span>Langkah 1 dari 5</span>
              </span>
              <h1 className="font-serif italic text-3xl font-medium tracking-tight text-neutral-900">
                Pilih Nuansa Kado
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Atur palet warna visual, partikel melayang, dan segel lilin amplop.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {THEME_OPTIONS.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`bg-gradient-to-b ${t.gradient} p-5 rounded-3xl text-left border transition-all relative btn-apple-spring ${
                      isSelected
                        ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 shadow-md scale-[1.01]"
                        : "border-neutral-200/80 hover:border-neutral-400 opacity-90 hover:opacity-100 shadow-2xs active:scale-[0.98]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-11 h-11 rounded-2xl bg-white/85 shadow-2xs flex items-center justify-center p-1 border border-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.sealSvg} alt={t.label} className="w-full h-full object-contain drop-shadow-xs" />
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-white/60 shadow-2xs flex items-center justify-center">
                          <IosEmoji symbol={t.emoji} size={16} />
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-neutral-900 bg-white/95 px-2.5 py-0.5 rounded-full shadow-2xs border border-black/5">
                          Dipilih ✓
                        </span>
                      )}
                    </div>
                    <p className={`font-semibold text-sm ${t.textColor}`}>{t.label}</p>
                    <p className="text-xs opacity-75 mt-0.5">{t.subtitle}</p>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep("pembuka")}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full h-12 text-xs font-semibold transition-all active:scale-[0.98] shadow-sm"
            >
              Lanjutkan ke Pesan Awal →
            </Button>
          </div>
        )}

        {/* ── STEP 2: PEMBUKA & PENUTUP ────────────────────────── */}
        {step === "pembuka" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
                <Sparkles size={12} />
                <span>Langkah 2 dari 5</span>
              </span>
              <h1 className="font-serif italic text-3xl font-medium tracking-tight text-neutral-900">
                Pesan Awal & Penutup
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Tulis nama penerima dan kalimat sebelum amplop dibuka.
              </p>
            </div>

            {/* Quick Presets Inspiration */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                💡 Ide Pesan Cepat (Klik untuk Pasang):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 hover:border-rose-300 hover:bg-rose-50/50 text-neutral-700 font-medium transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
                  >
                    <IosEmoji symbol={p.icon} size={14} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Envelope Mini-Preview */}
            <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-2xs">
              <div
                onClick={() => setPreviewOpened((prev) => !prev)}
                className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 cursor-pointer group"
                style={{ perspective: "1000px" }}
                title="Ketuk untuk melihat animasi buka/tutup amplop"
              >
                {/* Layer 1: Back Panel */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gift/back-panel.svg" alt="Back" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm" style={{ zIndex: 1 }} />

                {/* Layer 2: Letter Paper (Meluncur naik) */}
                <div
                  className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-out flex flex-col items-center justify-center ${
                    previewOpened ? "-translate-y-[44%] scale-[1.05] drop-shadow-lg" : "translate-y-0 scale-[0.98]"
                  }`}
                  style={{
                    zIndex: previewOpened ? 6 : 2,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gift/Paper.svg" alt="Paper" className="w-full h-full object-contain" />
                  <div className="absolute left-[8%] right-[8%] top-[22%] bottom-[44%] flex flex-col items-center justify-center text-center px-1">
                    <p className="font-serif italic text-[10px] sm:text-xs font-semibold text-neutral-900 truncate max-w-[90px]">
                      {recipientName ? `Untuk ${recipientName}` : "Untuk Kamu"}
                    </p>
                    <p className="text-[8px] text-neutral-600 line-clamp-1 italic mt-0.5">
                      {openingText || "Pesan ucapan..."}
                    </p>
                  </div>
                </div>

                {/* Layer 3: Front Panel Pocket */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gift/front-panel.svg" alt="Front" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ zIndex: 3 }} />

                {/* Layer 4: Top Flap Panel (Folds 180deg) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700"
                  style={{
                    zIndex: previewOpened ? 1 : 4,
                    transformOrigin: "50% 23.6%",
                    transformStyle: "preserve-3d",
                    transform: previewOpened ? "rotateX(180deg)" : "rotateX(0deg)",
                    transitionTimingFunction: "cubic-bezier(0.34, 1.25, 0.64, 1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gift/top-panel.svg" alt="Flap" className="w-full h-full object-contain" />
                </div>

                {/* Layer 5: Wax Seal (Proporsional ~18-20% Picture 2 + Tilt) */}
                <div
                  className={`absolute pointer-events-none transition-all duration-300 ${
                    previewOpened ? "opacity-0 scale-125" : "opacity-100 scale-100 group-hover:scale-110"
                  }`}
                  style={{
                    left: "50%",
                    top: "61%",
                    width: "34px",
                    height: "34px",
                    transform: "translate(-50%, -50%) rotate(-8deg)",
                    zIndex: 10,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentTheme.sealSvg} alt="Seal" className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100/80">
                    Pratinjau Amplop Nyata
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    (Ketuk amplop untuk {previewOpened ? "tutup" : "buka"})
                  </span>
                </div>
                <h4 className="font-serif italic text-lg font-medium text-neutral-900 mt-1 truncate">
                  Untuk {recipientName || "Nama Penerima"}
                </h4>
                <p className="text-xs text-neutral-600 italic line-clamp-2 mt-0.5 font-sans leading-relaxed">
                  &ldquo;{openingText || `Ada sesuatu buat ${recipientName || "kamu"} 💌`}&rdquo;
                </p>
                <p className="text-[10px] text-neutral-400 mt-1 font-normal">
                  Amplop kado ini akan tampil perdana di layar penerima dengan segel lilin {currentTheme.label}.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8 bg-white p-6 rounded-3xl border border-neutral-200/70 shadow-sm">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Nama Penerima
                </label>
                <Input
                  placeholder="Misal: Rara, Dimas, atau panggilan sayang"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="rounded-xl text-xs h-11 border-neutral-200 focus-visible:ring-neutral-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Kalimat Sampul Kado
                </label>
                <Input
                  placeholder={`Ada sesuatu buat ${recipientName || "kamu"} 💌`}
                  value={openingText}
                  onChange={(e) => setOpeningText(e.target.value)}
                  className="rounded-xl text-xs h-11 border-neutral-200 focus-visible:ring-neutral-900"
                />
                <IosEmojiBar
                  onSelect={(emoji) =>
                    setOpeningText((prev) => (prev ? `${prev} ${emoji}` : emoji))
                  }
                  className="mt-1.5"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Kalimat yang dilihat pertama kali sebelum amplop dibuka.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Pesan Penutup
                </label>
                <Textarea
                  placeholder="Pesan manis setelah semua kartu foto selesai dibuka..."
                  value={closingText}
                  onChange={(e) => setClosingText(e.target.value)}
                  className="rounded-xl text-xs resize-none border-neutral-200 focus-visible:ring-neutral-900"
                  rows={3}
                />
                <IosEmojiBar
                  onSelect={(emoji) =>
                    setClosingText((prev) => (prev ? `${prev} ${emoji}` : emoji))
                  }
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("theme")}
                className="rounded-full h-11 flex-1 text-xs font-semibold border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("kartu")}
                disabled={!recipientName.trim()}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                Lanjut ke Kartu Cerita →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SUSUN KARTU ──────────────────────────────── */}
        {step === "kartu" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
                <Sparkles size={12} />
                <span>Langkah 3 dari 5</span>
              </span>
              <h1 className="font-serif italic text-3xl font-medium tracking-tight text-neutral-900">
                Kartu Foto & Narasi
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Tiap kartu akan dibingkai seperti foto Polaroid fisik dengan washi tape.
              </p>
            </div>

            <div className="space-y-4 mb-4">
              {cards.map((card, i) => (
                <div key={card.id} className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 tracking-wide uppercase">
                      <IosEmoji symbol="📷" size={13} />
                      <span>Kartu Polaroid {i + 1}</span>
                    </span>
                    {cards.length > 1 && (
                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-neutral-400 text-xs hover:text-red-600 transition-colors font-medium"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <Textarea
                    placeholder="Tuliskan ucapan kenangan untuk foto ini..."
                    value={card.text_content}
                    onChange={(e) => updateCard(card.id, "text_content", e.target.value)}
                    className="resize-none rounded-xl text-xs mb-1.5 border-neutral-200 focus-visible:ring-neutral-900"
                    rows={3}
                  />

                  <IosEmojiBar
                    onSelect={(emoji) =>
                      updateCard(
                        card.id,
                        "text_content",
                        card.text_content ? `${card.text_content} ${emoji}` : emoji
                      )
                    }
                    className="mb-3"
                  />

                  <CardImageUpload
                    value={card.image_url}
                    onChange={(url) => updateCard(card.id, "image_url", url)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addCard}
              className="w-full border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50/50 rounded-3xl py-4 text-neutral-700 font-semibold text-xs transition-all mb-6 flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>+</span>
              <span>Tambah Kartu Kenangan Lainnya</span>
            </button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("pembuka")}
                className="rounded-full h-11 flex-1 text-xs font-semibold border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("musik")}
                disabled={cards.every((c) => !c.text_content.trim())}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                Lanjut ke Musik →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: PILIH MUSIK ──────────────────────────────── */}
        {step === "musik" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
                <Sparkles size={12} />
                <span>Langkah 4 dari 5</span>
              </span>
              <h1 className="font-serif italic text-3xl font-medium tracking-tight text-neutral-900">
                Pilih Audio Latar
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Musik akan diputar lewat piringan vinyl begitu amplop dibuka penerima.
              </p>
            </div>

            <div className="space-y-2 mb-8 bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-sm">
              <div
                onClick={() => setMusicId("")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                  musicId === ""
                    ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900"
                    : "border-transparent hover:bg-neutral-50 text-neutral-500"
                }`}
              >
                <span>Tanpa musik latar</span>
                {musicId === "" && <span>✓</span>}
              </div>

              {MUSIC_OPTIONS.map((m) => {
                const isSelected = musicId === m.id;
                const isPlaying = previewPlayingId === m.id;
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50/80 font-semibold text-neutral-900"
                        : "border-transparent hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div
                      onClick={() => setMusicId(m.id)}
                      className="flex-1 min-w-0 cursor-pointer flex items-center gap-2"
                    >
                      <span className="truncate">{m.label}</span>
                      {isSelected && <span className="text-rose-500 font-bold">✓</span>}
                    </div>

                    {/* Preview Listen Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudioPreview(m.id, m.url);
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                        isPlaying
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                      }`}
                      title={isPlaying ? "Jeda contoh lagu" : "Dengarkan contoh lagu"}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                      <span>{isPlaying ? "Jeda" : "Dengar"}</span>
                    </button>
                  </div>
                );
              })}

              <div
                onClick={() => setMusicId("youtube")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                  useYoutube
                    ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900"
                    : "border-transparent hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>Lagu pilihan sendiri dari YouTube</span>
                  <IosEmoji symbol="🎵" size={14} />
                </div>
                {useYoutube && <span>✓</span>}
              </div>

              {useYoutube && (
                <div className="px-2 pt-2 pb-1">
                  <Input
                    type="url"
                    placeholder="https://youtu.be/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="rounded-xl text-xs h-10 border-neutral-200"
                  />
                  <p className={`text-[11px] mt-1.5 ${youtubeInvalid ? "text-red-500" : "text-neutral-400"}`}>
                    {youtubeInvalid
                      ? "Link belum dikenali. Salin link dari tombol Bagikan di YouTube."
                      : "Akan diselaraskan dengan pemutar vinyl aesthetic di layar penerima."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("kartu")}
                className="rounded-full h-11 flex-1 text-xs font-semibold border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("preview")}
                disabled={useYoutube && !youtubeId(youtubeUrl)}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                Lihat Pratinjau Kado →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 5: PRATINJAU LANGSUNG ───────────────────────── */}
        {step === "preview" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
                <Sparkles size={12} />
                <span>Langkah 5 dari 5</span>
              </span>
              <h1 className="font-serif italic text-3xl font-medium tracking-tight text-neutral-900">
                Pratinjau Kado Interaktif
              </h1>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Coba ketuk segel lilin untuk membuka amplop persis seperti yang akan dialami {recipientName || "penerima"}.
              </p>
            </div>

            {/* Realistic Smartphone Mockup Bezel */}
            <div className="max-w-sm mx-auto mb-8 rounded-[44px] p-2.5 bg-neutral-900 shadow-2xl border-4 border-neutral-800 relative">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full z-50 pointer-events-none flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
              </div>

              {/* Smartphone Screen Viewport */}
              <div className="rounded-[36px] overflow-hidden bg-white h-[580px] relative border border-neutral-800">
                <GiftExperience gift={previewGift} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("musik")}
                className="rounded-full h-12 flex-1 text-xs font-semibold border-neutral-200 hover:bg-neutral-50"
              >
                ← Ubah Konten
              </Button>
              <Button
                onClick={() => setShowPublish(true)}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-12 flex-1 text-xs font-semibold transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              >
                <span>Terbitkan Kado ({PREMIUM_PRICE_LABEL})</span>
                <Sparkles size={14} className="text-amber-300" />
              </Button>
            </div>
          </div>
        )}

      </main>

      {/* Modal Publish / Checkout Sheet */}
      {showPublish && (
        <PublishModal
          draft={draft}
          onClose={() => setShowPublish(false)}
          onPublished={(slug) => {
            setShowPublish(false);
            setPublishedSlug(slug);
          }}
        />
      )}

      {/* Modal Sukses Berbagi */}
      {publishedSlug && (
        <ShareSuccessModal
          slug={publishedSlug}
          recipientName={recipientName || "dia"}
          onClose={() => setPublishedSlug(null)}
        />
      )}
    </div>
  );
}
