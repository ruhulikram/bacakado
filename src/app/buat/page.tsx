"use client";

import { useState, useEffect } from "react";
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

type Step = "theme" | "pembuka" | "kartu" | "musik" | "preview";

const STEPS: Step[] = ["theme", "pembuka", "kartu", "musik", "preview"];

const STEP_LABELS: Record<Step, string> = {
  theme: "Nuansa",
  pembuka: "Pesan Awal",
  kartu: "Kartu Cerita",
  musik: "Audio Latar",
  preview: "Pratinjau",
};

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
            window.history.replaceState({}, "", "/buat");
          }
        });
      }
    }
  }, []);

  // After Google OAuth redirect, auto-publish the pending draft and show share modal
  usePendingPublish((slug, pendingDraft) => {
    setPublishedSlug(slug);
    if (pendingDraft?.recipientName) {
      setRecipientName(pendingDraft.recipientName);
    }
  });

  const [step, setStep] = useState<Step>("theme");
  const [theme, setTheme] = useState<Theme>("ulang-tahun");
  const [recipientName, setRecipientName] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [closingText, setClosingText] = useState("");
  const [musicId, setMusicId] = useState("");
  const [cards, setCards] = useState<Card[]>([
    { id: "1", order_index: 0, text_content: "" },
  ]);
  const [showPublish, setShowPublish] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const draft: DraftGift = {
    recipientName,
    openingText,
    closingText,
    theme,
    musicId,
    cards: cards.map((c) => ({ text_content: c.text_content, image_url: c.image_url })),
  };

  const previewGift: Gift = {
    id: "preview",
    slug: "preview",
    recipient_name: recipientName || "Kamu",
    opening_text: openingText || `Ada sesuatu buat ${recipientName || "kamu"}`,
    theme,
    closing_text: closingText || "Semoga hari-harimu selalu menyenangkan.",
    music_url: MUSIC_OPTIONS.find((m) => m.id === musicId)?.url,
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
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F]">
      {/* ── Apple-Grade Minimalist Navbar ─────────────────────── */}
      <header className="sticky top-0 z-30 apple-glass">
        <div className="max-w-3xl mx-auto px-6 h-13 flex items-center justify-between">
          <a href="/" className="text-xs font-semibold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity">
            BacaKado
          </a>

          {/* Minimalist Progress Pill */}
          <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1 rounded-full text-[11px] font-medium text-neutral-600">
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
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah 1
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Pilih Nuansa Kado
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Menentukan palet warna dan atmosfer visual halaman kado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {THEME_OPTIONS.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`bg-gradient-to-b ${t.gradient} p-5 rounded-2xl text-left border transition-all relative ${isSelected
                      ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 shadow-sm"
                      : "border-neutral-200/70 hover:border-neutral-400 opacity-90 hover:opacity-100"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xl">{t.emoji}</span>
                      {isSelected && (
                        <span className="text-xs font-semibold text-neutral-900 bg-white/80 px-2 py-0.5 rounded-full">
                          Dipilih
                        </span>
                      )}
                    </div>
                    <p className={`font-semibold text-sm ${t.textColor}`}>{t.label}</p>
                    <p className="text-xs text-neutral-500">{t.subtitle}</p>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep("pembuka")}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full h-11 text-xs font-medium transition-all active:scale-[0.98]"
            >
              Lanjutkan ke Pesan Awal →
            </Button>
          </div>
        )}

        {/* ── STEP 2: PEMBUKA & PENUTUP ────────────────────────── */}
        {step === "pembuka" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah 2
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Pesan Awal & Penutup
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Tulis nama penerima dan pengantar sebelum amplop dibuka.
              </p>
            </div>

            <div className="space-y-4 mb-8 bg-white p-6 rounded-2xl border border-neutral-200/70 shadow-sm">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Nama Penerima
                </label>
                <Input
                  placeholder="Misal: Rara, Dimas, atau panggilan sayang"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="rounded-xl text-xs h-10 border-neutral-200 focus-visible:ring-neutral-900"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Kalimat Sampul Kado
                </label>
                <Input
                  placeholder={`Ada sesuatu buat ${recipientName || "kamu"}`}
                  value={openingText}
                  onChange={(e) => setOpeningText(e.target.value)}
                  className="rounded-xl text-xs h-10 border-neutral-200 focus-visible:ring-neutral-900"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Kalimat yang dilihat pertama kali di layar pembuka.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Pesan Penutup
                </label>
                <Textarea
                  placeholder="Pesan manis setelah semua kartu selesai dibuka..."
                  value={closingText}
                  onChange={(e) => setClosingText(e.target.value)}
                  className="rounded-xl text-xs resize-none border-neutral-200 focus-visible:ring-neutral-900"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("theme")}
                className="rounded-full h-11 flex-1 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("kartu")}
                disabled={!recipientName.trim()}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-medium transition-all active:scale-[0.98]"
              >
                Lanjut ke Kartu Cerita →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SUSUN KARTU ──────────────────────────────── */}
        {step === "kartu" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah 3
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Kartu Foto & Pesan
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Tiap kartu akan digeser satu per satu layaknya membalik album kenangan.
              </p>
            </div>

            <div className="space-y-4 mb-4">
              {cards.map((card, i) => (
                <div key={card.id} className="bg-white rounded-2xl p-5 border border-neutral-200/70 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-neutral-500 tracking-wide uppercase">
                      Kartu {i + 1}
                    </span>
                    {cards.length > 1 && (
                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-neutral-400 text-xs hover:text-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <Textarea
                    placeholder="Tuliskan ucapan atau kenangan untuk kartu ini..."
                    value={card.text_content}
                    onChange={(e) => updateCard(card.id, "text_content", e.target.value)}
                    className="resize-none rounded-xl text-xs mb-3 border-neutral-200 focus-visible:ring-neutral-900"
                    rows={3}
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
              className="w-full border border-dashed border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-2xl py-3.5 text-neutral-700 font-medium text-xs transition-colors mb-6"
            >
              + Tambah Kartu Lainnya
            </button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("pembuka")}
                className="rounded-full h-11 flex-1 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("musik")}
                disabled={cards.every((c) => !c.text_content.trim())}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-medium transition-all active:scale-[0.98]"
              >
                Lanjut ke Musik →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: PILIH MUSIK ──────────────────────────────── */}
        {step === "musik" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah 4
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Pilih Audio Latar
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Musik akan mulai diputar secara lembut begitu amplop dibuka penerima.
              </p>
            </div>

            <div className="space-y-2 mb-8 bg-white p-4 rounded-2xl border border-neutral-200/70 shadow-sm">
              <button
                onClick={() => setMusicId("")}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex justify-between items-center ${musicId === ""
                  ? "border-neutral-900 bg-neutral-50 font-medium text-neutral-900"
                  : "border-transparent hover:bg-neutral-50 text-neutral-500"
                  }`}
              >
                <span>Tanpa musik latar</span>
                {musicId === "" && <span>✓</span>}
              </button>

              {MUSIC_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMusicId(m.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex justify-between items-center ${musicId === m.id
                    ? "border-neutral-900 bg-neutral-50 font-medium text-neutral-900"
                    : "border-transparent hover:bg-neutral-50 text-neutral-700"
                    }`}
                >
                  <span className="truncate pr-4">{m.label}</span>
                  {musicId === m.id && <span>✓</span>}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("kartu")}
                className="rounded-full h-11 flex-1 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
              >
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep("preview")}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-medium transition-all active:scale-[0.98]"
              >
                Lihat Pratinjau →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 5: PRATINJAU LANGSUNG ───────────────────────── */}
        {step === "preview" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah 5
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Pratinjau Kado
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Begini persis tampilan yang akan dinikmati oleh {recipientName || "penerima"}.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 mb-6 h-[520px] relative">
              <GiftExperience gift={previewGift} />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("musik")}
                className="rounded-full h-11 flex-1 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
              >
                ← Ubah Konten
              </Button>
              <Button
                onClick={() => setShowPublish(true)}
                className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 flex-1 text-xs font-medium transition-all active:scale-[0.98] shadow-sm"
              >
                Terbitkan Kado (Rp 4.000)
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
