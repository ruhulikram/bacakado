"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Gift, Theme } from "@/lib/types";
import { THEME_OPTIONS, getTheme } from "@/lib/mock-data";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { Search, Heart, Eye, ArrowUpRight, Flame, Clock } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface GaleriClientProps {
  initialGifts: Gift[];
}

export function GaleriClient({ initialGifts }: GaleriClientProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");

  const filteredGifts = useMemo(() => {
    return initialGifts
      .filter((gift) => {
        // Theme filter
        if (selectedTheme !== "all") {
          const normTheme =
            gift.theme === "anniversary" || gift.theme === "valentine"
              ? "pacar"
              : gift.theme === "wisuda" || gift.theme === "lebaran"
              ? "temen"
              : gift.theme;
          if (normTheme !== selectedTheme) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRecipient = gift.recipient_name?.toLowerCase().includes(q);
          const matchOpening = gift.opening_text?.toLowerCase().includes(q);
          const matchClosing = gift.closing_text?.toLowerCase().includes(q);
          const matchCard = gift.cards?.some((c) => c.text_content.toLowerCase().includes(q));
          if (!matchRecipient && !matchOpening && !matchClosing && !matchCard) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          const scoreA = (a.view_count || 0) + (a.like_count || 0) * 3;
          const scoreB = (b.view_count || 0) + (b.like_count || 0) * 3;
          return scoreB - scoreA;
        } else {
          const dateA = new Date(a.published_at || a.created_at || 0).getTime();
          const dateB = new Date(b.published_at || b.created_at || 0).getTime();
          return dateB - dateA;
        }
      });
  }, [initialGifts, selectedTheme, searchQuery, sortBy]);

  return (
    <div>
      {/* ── Filters & Search Bar ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => {
              triggerHaptic("selection");
              setSelectedTheme("all");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTheme === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
            }`}
          >
            Semua Nuansa
          </button>

          {THEME_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                triggerHaptic("selection");
                setSelectedTheme(t.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTheme === t.id
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
              }`}
            >
              <IosEmoji symbol={t.emoji} size={14} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari penerima atau ucapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200/90 rounded-full pl-8 pr-4 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Sort Pill */}
          <div className="flex items-center bg-neutral-100/90 p-1 rounded-full border border-neutral-200/60 shrink-0">
            <button
              onClick={() => {
                triggerHaptic("selection");
                setSortBy("popular");
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                sortBy === "popular"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              title="Urutkan terpopuler"
            >
              <Flame size={12} className={sortBy === "popular" ? "text-amber-500" : ""} />
              <span className="hidden sm:inline">Populer</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic("selection");
                setSortBy("latest");
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                sortBy === "latest"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              title="Urutkan terbaru"
            >
              <Clock size={12} />
              <span className="hidden sm:inline">Terbaru</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid Gallery Cards ────────────────────────────────── */}
      {filteredGifts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/70 max-w-md mx-auto my-12">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-100 shadow-2xs">
            <IosEmoji symbol="🔍" size={26} />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            Tidak Ada Kado yang Cocok
          </h3>
          <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
            Tidak ditemukan inspirasi untuk pencarian ini. Kamu bisa mencoba kata kunci lain atau langsung merancang kado personalmu di Studio!
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTheme("all");
            }}
            className="text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:opacity-80"
          >
            Reset filter pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => {
            const theme = getTheme(gift.theme);
            const firstCard = gift.cards?.[0];
            const cardsCount = gift.cards?.length || 0;

            return (
              <div
                key={gift.id}
                className="group bg-white rounded-3xl p-4 border border-neutral-200/70 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo or Aesthetic Gradient Card Header */}
                  <Link href={`/${gift.slug}`} className="block">
                    <div
                      className={`h-44 rounded-2xl overflow-hidden relative mb-3.5 bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-3.5 border border-black/5 shadow-2xs`}
                    >
                      {firstCard?.image_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={firstCard.image_url}
                            alt={gift.recipient_name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                        </>
                      ) : null}

                      <div className="relative z-10 flex justify-between items-start">
                        <span className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-2xs">
                          <IosEmoji symbol={theme.emoji} size={16} />
                        </span>
                        <span className="text-[11px] font-medium bg-white/95 text-neutral-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                          {theme.label}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <p className="text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1.5">
                          <span>Untuk {gift.recipient_name}</span>
                          <span className="text-[10px] text-white/80 font-normal">
                            ({cardsCount} kartu)
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Text Content */}
                  <div className="px-1 mb-4">
                    <p className="font-serif italic text-sm text-neutral-800 line-clamp-2 mb-1.5 leading-snug">
                      &ldquo;{gift.opening_text}&rdquo;
                    </p>
                    {gift.closing_text && (
                      <p className="text-[11px] text-neutral-400 line-clamp-1 leading-relaxed">
                        {gift.closing_text}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions & Stats */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{gift.view_count.toLocaleString("id-ID")}</span>
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <Heart size={12} className="fill-rose-500" />
                      <span>{gift.like_count}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/${gift.slug}`}
                      onClick={() => triggerHaptic("selection")}
                      className="px-2.5 py-1.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Lihat</span>
                      <ArrowUpRight size={12} />
                    </Link>

                    <Link
                      href={`/buat?theme=${theme.id}&template=${gift.slug}`}
                      onClick={() => triggerHaptic("medium")}
                      className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                      title="Gunakan gaya dan kata-kata kado ini di Studio"
                    >
                      <span>Pakai Template</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
