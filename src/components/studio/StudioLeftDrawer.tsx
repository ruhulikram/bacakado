"use client";

import React, { useState, useRef } from "react";
import { Card, Theme } from "@/lib/types";
import { IosEmoji, POPULAR_IOS_EMOJIS, IOS_EMOJI_MAP } from "@/components/ui/IosEmoji";
import { MUSIC_OPTIONS } from "@/lib/mock-data";
import { uploadGiftImage } from "@/lib/supabase/storage";
import {
  Layers,
  Type,
  Image as ImageIcon,
  Smile,
  Music,
  Plus,
  Trash2,
  Copy,
  Upload,
  Play,
  Pause,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { playCardFlip, playStickerSnap } from "@/lib/sfx";
import { StudioStage } from "./StudioHeader";
import { triggerHaptic } from "@/lib/haptics";
import { youtubeId } from "@/lib/utils";

export type LeftTab = "layers" | "text" | "media" | "stickers" | "music";

interface StudioLeftDrawerProps {
  cards: Card[];
  activeCardIndex: number;
  activeCard?: Card;
  activeCardSticker?: string;
  onSelectCard: (index: number) => void;
  onAddCard: () => void;
  onDuplicateCard: (id: string) => void;
  onRemoveCard: (id: string) => void;
  onMoveCard: (fromIndex: number, toIndex: number) => void;
  activeStage: StudioStage;
  onStageChange: (stage: StudioStage) => void;
  recipientName: string;
  openingText: string;
  closingText: string;
  onApplyPresetText: (text: string, target: "opening" | "card" | "closing") => void;
  onSetCardSticker: (sticker: string, position?: { x: number; y: number; rotate?: number }) => void;
  onUpdateCardStickerPosition?: (x: number, y: number, rotate?: number) => void;
  onRemoveCardSticker?: () => void;
  onUpdateActiveCardImage: (url: string) => void;
  musicId: string;
  onSelectMusic: (id: string) => void;
  youtubeUrl: string;
  onChangeYoutubeUrl: (url: string) => void;
  theme: Theme;
}

const STICKER_CATEGORIES = [
  {
    name: "Romantis & Kasih Sayang 💖",
    stickers: ["💖", "🌹", "💌", "💐", "💝", "💍", "🥰", "💋"],
  },
  {
    name: "Ulang Tahun & Pesta 🎂",
    stickers: ["🎂", "🎁", "🎉", "🎈", "🍰", "🍾", "🥳", "🧁"],
  },
  {
    name: "Aesthetic & Lucu 🌸",
    stickers: ["✨", "🧸", "🎀", "🌸", "🦋", "☕", "🍓", "☁️"],
  },
  {
    name: "Dukungan & Perayaan 🌟",
    stickers: ["🎓", "🌟", "🥂", "🍀", "🌻", "👏", "🌈", "🕊️"],
  },
];

const PRESET_QUOTES = [
  {
    category: "Ulang Tahun 🎂",
    quotes: [
      "Selamat ulang tahun! Semoga segala mimpi indahmu mekar satu per satu.",
      "Ada lilin yang menyala dan doa terbaik yang kupanjatkan untukmu hari ini.",
      "Terima kasih sudah tumbuh jadi orang yang begitu mengagumkan. Bangga banget sama kamu!",
      "Semoga tahun baru usiamu dipenuhi tawa renyah, kesehatan, dan rezeki berlimpah.",
    ],
  },
  {
    category: "Romantis / Pacar 🌹",
    quotes: [
      "Setiap sudut hariku terasa lebih teduh dan hangat semenjak ada kamu.",
      "Terima kasih sudah memilih untuk terus berjalan bersamaku di setiap cuaca.",
      "Kamu adalah doa yang tak sengaja kutitipkan pada semesta, yang kini nyata di depan mata.",
      "Sayang kamu selamanya, hari ini, esok, dan di hari-hari setelahnya.",
    ],
  },
  {
    category: "Sahabat / Teman ✨",
    quotes: [
      "Buat temen terbaikku yang selalu ada di suka, duka, dan obrolan random tengah malam.",
      "Terima kasih atas segala kekonyolan dan tawa yang gak pernah ada habisnya.",
      "Dunia boleh berubah, tapi pertemanan kita tetap yang paling nyaman untuk pulang.",
    ],
  },
  {
    category: "Apresiasi & Terima Kasih 💌",
    quotes: [
      "Ada sepucuk rasa syukur yang ingin kusampaikan padamu atas semua kebaikanmu.",
      "Kehadiranmu membawa warna baru yang tak tergantikan dalam hidupku.",
      "Semoga semesta membalas ketulusan hatimu dengan ribuan kebahagiaan.",
    ],
  },
];

const CURATED_SAMPLE_PHOTOS = [
  { label: "Bunga Mawar", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=500&fit=crop" },
  { label: "Kue Ulang Tahun", url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=500&fit=crop" },
  { label: "Langit Senja", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop" },
  { label: "Kopi Bersama", url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&h=500&fit=crop" },
];

export function StudioLeftDrawer({
  cards,
  activeCardIndex,
  activeCard,
  activeCardSticker,
  onSelectCard,
  onAddCard,
  onDuplicateCard,
  onRemoveCard,
  onMoveCard,
  activeStage,
  onStageChange,
  recipientName,
  openingText,
  closingText,
  onApplyPresetText,
  onSetCardSticker,
  onUpdateCardStickerPosition,
  onRemoveCardSticker,
  onUpdateActiveCardImage,
  musicId,
  onSelectMusic,
  youtubeUrl,
  onChangeYoutubeUrl,
}: StudioLeftDrawerProps) {
  const [activeTab, setActiveTab] = useState<LeftTab>("layers");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function toggleAudioPreview(id: string, url: string) {
    if (previewPlayingId === id) {
      if (audioRef.current) audioRef.current.pause();
      setPreviewPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(url);
      a.volume = 0.5;
      a.play().then(() => {
        audioRef.current = a;
        setPreviewPlayingId(id);
        a.onended = () => setPreviewPlayingId(null);
      }).catch(() => {});
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    triggerHaptic("selection");

    const res = await uploadGiftImage(file);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";

    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      onUpdateActiveCardImage(res.url);
      triggerHaptic("success");
    }
  }

  return (
    <aside className="h-[calc(100vh-64px)] flex border-r border-black/[0.08] bg-white select-none shrink-0 z-30">
      {/* ── Leftmost Icon Rail ─────────────────────────────────── */}
      <div className="w-14 sm:w-16 border-r border-black/[0.06] bg-[#FAF8F5] flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("layers");
          }}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === "layers"
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:bg-neutral-200/70"
          }`}
          title="Adegan & Kartu"
        >
          <Layers size={17} />
          <span className="text-[9px] font-semibold mt-0.5">Kartu</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("text");
          }}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === "text"
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:bg-neutral-200/70"
          }`}
          title="Ide Teks & Presets"
        >
          <Type size={17} />
          <span className="text-[9px] font-semibold mt-0.5">Teks</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("media");
          }}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === "media"
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:bg-neutral-200/70"
          }`}
          title="Foto Kenangan"
        >
          <ImageIcon size={17} />
          <span className="text-[9px] font-semibold mt-0.5">Foto</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("stickers");
          }}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === "stickers"
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:bg-neutral-200/70"
          }`}
          title="Stiker & Apple Emojis"
        >
          <Smile size={17} />
          <span className="text-[9px] font-semibold mt-0.5">Stiker</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic("selection");
            setActiveTab("music");
          }}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === "music"
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:bg-neutral-200/70"
          }`}
          title="Musik Latar"
        >
          <Music size={17} />
          <span className="text-[9px] font-semibold mt-0.5">Audio</span>
        </button>
      </div>

      {/* ── Content Drawer ────────────────────────────────────── */}
      <div className="w-64 sm:w-72 overflow-y-auto p-4 flex flex-col">
        {/* TAB 1: ADEGAN / KARTU */}
        {activeTab === "layers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900">
                Alur kado digital
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                {cards.length + 2} Adegan
              </span>
            </div>

            {/* Stage 1: Amplop */}
            <div
              onClick={() => {
                triggerHaptic("selection");
                onStageChange("envelope");
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeStage === "envelope"
                  ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300 shadow-2xs"
                  : "bg-neutral-50/60 border-neutral-200/70 hover:bg-neutral-100/70"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-black/5 shadow-2xs shrink-0">
                  <IosEmoji symbol="💌" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">1. Sampul Amplop</p>
                  <p className="text-[10px] text-neutral-500 truncate italic">
                    {openingText || `Untuk ${recipientName || "kamu"}...`}
                  </p>
                </div>
              </div>
              <ChevronRight size={13} className="text-neutral-400 shrink-0" />
            </div>

            {/* Stage 2: Cards List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-medium text-neutral-500">
                  Kartu polaroid ({cards.length})
                </span>
                <button
                  onClick={() => {
                    triggerHaptic("medium");
                    onAddCard();
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus size={12} />
                  <span>Tambah</span>
                </button>
              </div>

              {cards.map((c, idx) => {
                const isActive = activeStage === "card" && activeCardIndex === idx;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      triggerHaptic("selection");
                      onStageChange("card");
                      onSelectCard(idx);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.01]"
                        : "bg-white border-neutral-200/80 hover:border-neutral-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {c.image_url ? (
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-black/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          <IosEmoji symbol="📜" size={14} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-neutral-900"}`}>
                          Polaroid #{idx + 1}
                        </p>
                        <p className={`text-[10px] truncate ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                          {c.text_content || "Ketuk untuk menulis ucapan..."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic("selection");
                            playCardFlip();
                            onMoveCard(idx, idx - 1);
                          }}
                          className={`p-1 rounded-lg ${isActive ? "hover:bg-neutral-800 text-neutral-300" : "hover:bg-neutral-100 text-neutral-500"}`}
                          title="Pindah ke atas"
                        >
                          <ArrowUp size={12} />
                        </button>
                      )}
                      {idx < cards.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic("selection");
                            playCardFlip();
                            onMoveCard(idx, idx + 1);
                          }}
                          className={`p-1 rounded-lg ${isActive ? "hover:bg-neutral-800 text-neutral-300" : "hover:bg-neutral-100 text-neutral-500"}`}
                          title="Pindah ke bawah"
                        >
                          <ArrowDown size={12} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic("selection");
                          onDuplicateCard(c.id);
                        }}
                        className={`p-1 rounded-lg ${isActive ? "hover:bg-neutral-800 text-neutral-300" : "hover:bg-neutral-100 text-neutral-400"}`}
                        title="Duplikat kartu"
                      >
                        <Copy size={12} />
                      </button>
                      {cards.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic("error");
                            onRemoveCard(c.id);
                          }}
                          className={`p-1 rounded-lg ${isActive ? "hover:bg-neutral-800 text-rose-300" : "hover:bg-rose-50 text-rose-500"}`}
                          title="Hapus kartu"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stage 3: Closing */}
            <div
              onClick={() => {
                triggerHaptic("selection");
                onStageChange("closing");
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeStage === "closing"
                  ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300 shadow-2xs"
                  : "bg-neutral-50/60 border-neutral-200/70 hover:bg-neutral-100/70"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-black/5 shadow-2xs shrink-0">
                  <IosEmoji symbol="✨" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">
                    {cards.length + 2}. Pesan Penutup
                  </p>
                  <p className="text-[10px] text-neutral-500 truncate italic">
                    {closingText || "Semoga bahagia selalu..."}
                  </p>
                </div>
              </div>
              <ChevronRight size={13} className="text-neutral-400 shrink-0" />
            </div>

            <button
              onClick={() => {
                triggerHaptic("medium");
                onAddCard();
              }}
              className="w-full py-2.5 border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-2xl text-xs font-semibold text-neutral-600 flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <Plus size={13} />
              <span>Tambah Kartu Polaroid</span>
            </button>
          </div>
        )}

        {/* TAB 2: TEKS & PRESETS */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900 block">
                Inspirasi kalimat
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Klik kalimat untuk langsung memasangnya di kartu yang aktif.
              </p>
            </div>

            {PRESET_QUOTES.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-600 block px-1">
                  {group.category}
                </span>
                <div className="space-y-1.5">
                  {group.quotes.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => {
                        triggerHaptic("selection");
                        onApplyPresetText(q, activeStage === "card" ? "card" : activeStage === "closing" ? "closing" : "opening");
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-neutral-50 hover:bg-rose-50/60 border border-neutral-200/60 hover:border-rose-200 text-xs text-neutral-700 transition-all active:scale-98 leading-relaxed shadow-2xs group"
                    >
                      <span className="line-clamp-2 italic">&ldquo;{q}&rdquo;</span>
                      <span className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Pasang di {activeStage === "card" ? `Polaroid #${activeCardIndex + 1}` : activeStage === "closing" ? "Penutup" : "Amplop"}</span>
                        <span>→</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MEDIA & FOTO */}
        {activeTab === "media" && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900 block">
                Foto kenangan
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Pasang foto untuk Polaroid #{activeCardIndex + 1}.
              </p>
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/50 hover:bg-neutral-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-neutral-200/80 flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform">
                <Upload size={18} />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-neutral-800 block">
                  {isUploading ? "Mengunggah foto..." : "Unggah Foto dari HP / Laptop"}
                </span>
                <span className="text-[10px] text-neutral-400">JPG, PNG, WebP (maks 5MB)</span>
              </div>
            </button>

            {uploadError && (
              <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded-xl border border-rose-200">
                {uploadError}
              </p>
            )}

            {/* Curated Aesthetic Starters */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-medium text-neutral-500 block">
                Atau pilih foto estetik cepat:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CURATED_SAMPLE_PHOTOS.map((pic, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerHaptic("selection");
                      onUpdateActiveCardImage(pic.url);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-black/10 group active:scale-95 transition-transform"
                    title={pic.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pic.url} alt={pic.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/70 to-transparent text-[9px] text-white font-medium truncate">
                      {pic.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STIKER & RETINA APPLE EMOJIS (CANVA STYLE) */}
        {activeTab === "stickers" && (() => {
          const currentCard = activeCard || cards[activeCardIndex];
          const currentSticker = activeCardSticker || currentCard?.sticker;
          const currentX = currentCard?.sticker_x ?? 86;
          const currentY = currentCard?.sticker_y ?? 14;
          const currentRotate = currentCard?.sticker_rotate ?? 12;

          return (
            <div className="space-y-4">
              <div className="pb-2 border-b border-neutral-100">
                <span className="text-xs font-semibold text-neutral-900 block">
                  Stiker & pin polaroid
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Tarik & tempel stiker langsung ke kartu ucapan, atau klik untuk memilih.
                </p>
              </div>

              {/* Drag & Stick Pro-Tip Banner */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs border border-neutral-200/80 flex items-center justify-center shrink-0 text-neutral-700">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900">Drag & stick interaktif</h4>
                    <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                      Tarik stiker di bawah langsung ke atas kartu di kanvas, atau klik untuk menempelkan. Kamu bebas menggeser posisinya ke mana saja.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pin Sticker Status on active Polaroid */}
              {currentSticker ? (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-center shadow-inner">
                        <IosEmoji symbol={currentSticker} size={22} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 block">
                          Stiker di Polaroid #{activeCardIndex + 1}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          X: {Math.round(currentX)}% • Y: {Math.round(currentY)}% • {currentRotate}°
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("medium");
                        if (onRemoveCardSticker) {
                          onRemoveCardSticker();
                        } else {
                          onSetCardSticker("");
                        }
                      }}
                      className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-semibold border border-rose-200 transition-colors flex items-center gap-1"
                      title="Lepas stiker dari kartu ini"
                    >
                      <Trash2 size={12} />
                      <span>Lepas</span>
                    </button>
                  </div>

                  {/* Quick Position Presets */}
                  <div className="space-y-1.5 pt-1 border-t border-neutral-100">
                    <span className="text-[11px] font-medium text-neutral-500 block">
                      Posisi cepat di kartu:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: "Kiri Atas", x: 14, y: 14, rot: -12 },
                        { label: "Tengah Foto", x: 50, y: 38, rot: 0 },
                        { label: "Kanan Atas", x: 86, y: 14, rot: 12 },
                        { label: "Kiri Bawah", x: 14, y: 86, rot: -8 },
                        { label: "Tengah Teks", x: 50, y: 76, rot: 0 },
                        { label: "Kanan Bawah", x: 86, y: 86, rot: 10 },
                      ].map((pos) => (
                        <button
                          key={pos.label}
                          type="button"
                          onClick={() => {
                            triggerHaptic("selection");
                            playStickerSnap();
                            if (onUpdateCardStickerPosition) {
                              onUpdateCardStickerPosition(pos.x, pos.y, pos.rot);
                            } else {
                              onSetCardSticker(currentSticker, { x: pos.x, y: pos.y, rotate: pos.rot });
                            }
                          }}
                          className="px-2 py-1.5 rounded-xl bg-neutral-50 hover:bg-rose-50 border border-neutral-200/80 hover:border-rose-300 text-[10px] font-medium text-neutral-700 hover:text-rose-900 transition-colors text-center"
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Rotation Buttons */}
                  <div className="space-y-1.5 pt-1 border-t border-neutral-100">
                    <span className="text-[11px] font-medium text-neutral-500 block">
                      Sudut kemiringan:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[-18, -8, 0, 12, 24].map((rot) => (
                        <button
                          key={rot}
                          type="button"
                          onClick={() => {
                            triggerHaptic("selection");
                            playStickerSnap();
                            if (onUpdateCardStickerPosition) {
                              onUpdateCardStickerPosition(currentX, currentY, rot);
                            } else {
                              onSetCardSticker(currentSticker, { x: currentX, y: currentY, rotate: rot });
                            }
                          }}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            currentRotate === rot
                              ? "bg-neutral-900 text-white font-semibold shadow-xs"
                              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                          }`}
                        >
                          {rot > 0 ? `+${rot}°` : `${rot}°`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-neutral-50/80 border border-dashed border-neutral-200 text-center">
                  <span className="text-[11px] text-neutral-500 block">
                    Polaroid #{activeCardIndex + 1} belum memiliki stiker.
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Tarik stiker di bawah ke atas kartu atau klik untuk pasang.
                  </span>
                </div>
              )}

              {/* Categorized Stickers (Draggable & Clickable) */}
              <div className="space-y-3 pt-1">
                {STICKER_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <span className="text-[11px] font-medium text-neutral-500 block">
                      {cat.name}
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {cat.stickers.map((stk) => {
                        const isSelected = currentSticker === stk;
                        return (
                          <div
                            key={stk}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData("application/bacakado-sticker", stk);
                              e.dataTransfer.setData("text/plain", stk);
                              e.dataTransfer.effectAllowed = "copy";
                              triggerHaptic("selection");
                            }}
                            onClick={() => {
                              triggerHaptic("selection");
                              playStickerSnap();
                              onSetCardSticker(stk, { x: 86, y: 14, rotate: 12 });
                            }}
                            className={`relative aspect-square rounded-2xl bg-white border cursor-grab active:cursor-grabbing hover:scale-108 active:scale-95 flex flex-col items-center justify-center p-1.5 transition-all shadow-2xs group ${
                              isSelected
                                ? "border-rose-400 ring-2 ring-rose-300 bg-rose-50/40"
                                : "border-neutral-200 hover:border-rose-300 hover:shadow-xs"
                            }`}
                            title={`Tarik ${stk} ke kartu ucapan atau klik untuk menempelkan`}
                          >
                            <IosEmoji symbol={stk} size={22} />
                            <span className="text-[8px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 pointer-events-none">
                              Tarik
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* TAB 5: MUSIK & AUDIO */}
        {activeTab === "music" && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900 block">
                Audio latar kado
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Berputar otomatis melalui piringan vinyl saat amplop dibuka.
              </p>
            </div>

            {/* Without music option */}
            <div
              onClick={() => {
                triggerHaptic("selection");
                onSelectMusic("");
              }}
              className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                musicId === ""
                  ? "bg-neutral-900 text-white border-neutral-900 font-semibold"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200"
              }`}
            >
              <span>Tanpa musik latar</span>
              {musicId === "" && <Check size={14} />}
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              {MUSIC_OPTIONS.map((m) => {
                const isSelected = musicId === m.id;
                const isPlaying = previewPlayingId === m.id;
                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-2xl border transition-all text-xs flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-rose-50/80 border-rose-300 ring-1 ring-rose-300 font-semibold text-neutral-900 shadow-2xs"
                        : "bg-white border-neutral-200/80 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div
                      onClick={() => {
                        triggerHaptic("selection");
                        onSelectMusic(m.id);
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <p className="truncate text-xs font-medium">{m.label.split("—")[0].trim()}</p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {m.label.split("—")[1]?.trim() || "Instrumental"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudioPreview(m.id, m.url);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        isPlaying
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                      }`}
                      title={isPlaying ? "Jeda lagu" : "Dengarkan contoh"}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* YouTube Custom URL */}
            <div className="pt-2 border-t border-neutral-100">
              <div
                onClick={() => {
                  triggerHaptic("selection");
                  onSelectMusic("youtube");
                }}
                className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-center justify-between mb-2 transition-all ${
                  musicId === "youtube"
                    ? "bg-rose-50 border-rose-300 ring-1 ring-rose-300 text-neutral-900 font-semibold"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <IosEmoji symbol="🎵" size={14} />
                  <span>Gunakan Lagu dari YouTube</span>
                </div>
                {musicId === "youtube" && <Check size={14} className="text-rose-600" />}
              </div>

              {musicId === "youtube" && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <input
                    type="url"
                    placeholder="https://youtu.be/..."
                    value={youtubeUrl}
                    onChange={(e) => onChangeYoutubeUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <p className="text-[10px] text-neutral-400">
                    {youtubeId(youtubeUrl) ? "✓ Link YouTube valid" : "Tempel link dari tombol bagikan YouTube"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
