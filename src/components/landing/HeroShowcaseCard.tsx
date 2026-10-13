"use client";

import { useState } from "react";
import Link from "next/link";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { ExternalLink } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export function HeroShowcaseCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        triggerHaptic("selection");
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[460px] mx-auto select-none"
    >
      {/* ── Main Showcase Container Card ─────────────────────── */}
      <div className="relative rounded-[32px] bg-white border border-neutral-200/90 p-5 sm:p-7 shadow-md hover:shadow-lg transition-shadow duration-300 group">
        
        {/* Top Header Strip: Recipient & Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center">
              <IosEmoji symbol="💌" size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-rose-600">
                Kado Personal
              </p>
              <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                Untuk Rara Azzahra
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100/80 border border-neutral-200/60 text-[11px] font-medium text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Aktif Selamanya</span>
          </div>
        </div>

        {/* ── Simulated Physical Envelope & Polaroid Deck ──────── */}
        <div className="relative h-[250px] sm:h-[270px] rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F3EDE2] border border-amber-900/10 overflow-hidden p-4 flex flex-col justify-between shadow-inner">
          
          {/* Peeking Polaroid Photo Card */}
          <div
            className={`absolute top-3 left-1/2 -translate-x-1/2 w-[86%] sm:w-[88%] bg-white rounded-2xl p-3 shadow-lg border border-black/5 transition-all duration-500 z-10 ${
              isHovered ? "-translate-y-2 rotate-1" : "-translate-y-0.5 -rotate-1"
            }`}
          >
            {/* Washi Tape on Top Center */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape-gold rounded-xs opacity-90 pointer-events-none" />

            {/* Photo Preview */}
            <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-neutral-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=400&fit=crop"
                alt="Kenangan Bersama"
                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Sticker Badge on Polaroid */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/95 shadow-md border border-black/5 flex items-center justify-center">
                <IosEmoji symbol="🌸" size={18} />
              </div>

              <div className="absolute bottom-2 left-2 text-[10px] text-white font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                Slide 1 dari 4 cerita
              </div>
            </div>

            <p className="mt-2 text-xs text-neutral-700 italic font-medium truncate">
              &ldquo;Terima kasih sudah selalu jadi rumah ternyaman...&rdquo;
            </p>
          </div>

          {/* Lower Envelope Flap & Wax Seal Stamp */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#EDE4D5] to-[#F5ECE0]/90 border-t border-amber-900/10 z-20 flex items-center justify-between px-5">
            {/* Left Note */}
            <div>
              <p className="text-[11px] font-semibold text-amber-900/80">
                Segel Lilin Fisik
              </p>
              <p className="text-xs font-semibold text-neutral-800">
                Inisial Embossed &ldquo;R&rdquo;
              </p>
            </div>

            {/* Wax Seal 3D Stamp */}
            <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gift/seal-love.svg"
                alt="Segel Lilin"
                className="w-full h-full object-contain drop-shadow-md"
              />
              <span className="absolute inset-0 flex items-center justify-center font-serif text-white font-bold text-sm drop-shadow-xs">
                R
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Mini Bar: Vinyl Player & Action Button ────── */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
          {/* Vinyl Disc Simulation */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-xs shrink-0 animate-[spin_8s_linear_infinite]">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate">
                Piano Lembut & Romantis
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Musik Otomatis Saat Amplop Dibuka</span>
              </div>
            </div>
          </div>

          {/* Demo Link Button */}
          <Link
            href="/untuk-rara"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white transition-colors btn-apple-spring shadow-2xs"
            title="Buka demo kado Rara"
          >
            <span>Uji Buka</span>
            <ExternalLink size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}
