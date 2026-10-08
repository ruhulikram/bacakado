"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";
import { Card } from "@/lib/types";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";

interface PolaroidCardDeckProps {
  cards: Card[];
  recipientName: string;
  onFinish: () => void;
  isDark?: boolean;
  tapeStyle?: "washi-tape" | "washi-tape-gold";
}

export function PolaroidCardDeck({
  cards,
  recipientName,
  onFinish,
  isDark = false,
  tapeStyle = "washi-tape",
}: PolaroidCardDeckProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const sortedCards = [...cards].sort((a, b) => a.order_index - b.order_index);
  const total = sortedCards.length;
  const current = sortedCards[index];

  function handleNext() {
    if (index < total - 1) {
      setDirection("next");
      setIndex((i) => i + 1);
    } else {
      onFinish();
    }
  }

  function handlePrev() {
    if (index > 0) {
      setDirection("prev");
      setIndex((i) => i - 1);
    }
  }

  // Pre-calculated organic tilts for the deck cards
  const tilts = ["-1.5deg", "1.8deg", "-0.9deg", "1.4deg", "-1.8deg"];
  const currentTilt = tilts[index % tilts.length];

  return (
    <div className="z-10 w-full max-w-sm sm:max-w-md mx-auto select-none px-2 animate-in fade-in duration-500">
      {/* Deck Indicator & Progress */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
            Kenangan
          </span>
          <span className="text-xs font-bold text-rose-500">
            {index + 1} / {total}
          </span>
        </div>

        {/* Progress Heart Bar */}
        <div className="flex items-center gap-1.5">
          {sortedCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-rose-500 shadow-xs"
                  : i < index
                  ? "w-2 bg-rose-300/80"
                  : "w-2 bg-neutral-200"
              }`}
              title={`Buka kartu ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card Deck Layering (Stacked Photo Effect) */}
      <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
        {/* Peeking Background Card 2 (Bottom layer) */}
        {index + 2 < total && (
          <div
            className="absolute inset-x-4 top-4 h-[430px] rounded-3xl bg-white/70 border border-black/5 shadow-md pointer-events-none transform scale-[0.92] -rotate-2 opacity-50"
            style={{ zIndex: 1 }}
          />
        )}

        {/* Peeking Background Card 1 (Middle layer) */}
        {index + 1 < total && (
          <div
            className="absolute inset-x-2 top-2 h-[440px] rounded-3xl bg-white/85 border border-black/5 shadow-lg pointer-events-none transform scale-[0.96] rotate-1 opacity-70"
            style={{ zIndex: 2 }}
          />
        )}

        {/* Active Polaroid Card Surface */}
        <div
          key={current?.id || index}
          className={`w-full polaroid-frame rounded-3xl p-4 sm:p-5 transition-all duration-300 animate-in ${
            direction === "next"
              ? "slide-in-from-right-6 fade-in"
              : "slide-in-from-left-6 fade-in"
          }`}
          style={{
            zIndex: 10,
            transform: `rotate(${currentTilt})`,
          }}
        >
          {/* Decorative Washi Tape on Top Center */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded-xs flex items-center justify-center pointer-events-none z-20">
            <div className={`w-full h-full ${tapeStyle} opacity-90`} />
          </div>

          {/* Photo Frame or Love Letter Note */}
          {current?.image_url ? (
            <div className="w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-inner mb-4 relative aspect-[4/3] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image_url}
                alt="Kenangan bersama"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs">
                <IosEmoji symbol="📷" size={12} />
                <span>Foto #{index + 1}</span>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-amber-50/50 border border-amber-100/80 p-5 mb-4 text-center relative overflow-hidden">
              <IosEmoji symbol="📜" size={32} className="mb-1" />
              <p className="text-[11px] font-semibold tracking-widest text-amber-800/80 uppercase">
                Catatan Kasih
              </p>
              <div className="w-8 h-0.5 bg-amber-300 mx-auto mt-1 mb-2 rounded-full" />
            </div>
          )}

          {/* Card Message Text */}
          <div className="px-2 pt-1 pb-3 text-center sm:text-left">
            <p className="font-serif italic text-lg sm:text-xl text-neutral-900 leading-relaxed whitespace-pre-wrap">
              &ldquo;<EmojiText text={current?.text_content} size={20} />&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-400 font-medium border-t border-neutral-100 pt-3">
              <span className="flex items-center gap-1 text-rose-500">
                <Heart size={12} className="fill-rose-500" />
                <span>Untuk {recipientName}</span>
              </span>
              <span>Halaman {index + 1} dari {total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
            index === 0
              ? "opacity-30 cursor-not-allowed border-neutral-200 text-neutral-400"
              : "border-neutral-200 bg-white/90 hover:bg-white text-neutral-800 shadow-xs active:scale-95 hover:border-neutral-300"
          }`}
        >
          <ChevronLeft size={14} />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-md active:scale-95 transition-all group"
        >
          {index < total - 1 ? (
            <>
              <span>Lanjut Baca</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          ) : (
            <>
              <span>Buka Pesan Penutup</span>
              <Sparkles size={14} className="text-amber-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
