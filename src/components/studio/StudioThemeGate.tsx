"use client";

import React, { useState } from "react";
import Link from "next/link";
import { THEME_OPTIONS } from "@/lib/mock-data";
import { Theme } from "@/lib/types";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface StudioThemeGateProps {
  initialTheme: Theme;
  initialRecipient: string;
  onSelectThemeAndContinue: (theme: Theme, recipient: string) => void;
}

export function StudioThemeGate({
  initialTheme,
  initialRecipient,
  onSelectThemeAndContinue,
}: StudioThemeGateProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(initialTheme);
  const [recipient, setRecipient] = useState(initialRecipient);

  function handlePick(themeId: Theme) {
    triggerHaptic("selection");
    setSelectedTheme(themeId);
  }

  function handleContinue() {
    triggerHaptic("medium");
    onSelectThemeAndContinue(selectedTheme, recipient.trim());
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D1D1F] flex flex-col justify-between selection:bg-rose-100">
      {/* ── Top Header ────────────────────────────────────────── */}
      <header className="w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-neutral-500">BacaKado Studio</span>
          </div>
        </div>
      </header>

      {/* ── Main Selection Stage ──────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-3">
            Pilih suasana kado digitalmu
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Setiap nuansa hadir dengan segel lilin fisik, palet warna, dan partikel animasi yang dirancang khusus untuk momen terbaik.
          </p>
        </div>

        {/* 4 Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {THEME_OPTIONS.map((t) => {
            const isSelected = selectedTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePick(t.id as Theme)}
                className={`relative text-left rounded-3xl p-6 transition-all duration-300 btn-apple-spring border flex flex-col justify-between min-h-[220px] ${
                  isSelected
                    ? "bg-white border-neutral-900 shadow-xl ring-2 ring-neutral-900 ring-offset-2 scale-[1.02]"
                    : "bg-white/70 hover:bg-white border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md"
                }`}
              >
                {/* Visual Gradient Background Hint */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${t.gradient} opacity-40 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    {/* Wax Seal & Emoji Icon */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-black/5 p-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.sealSvg}
                          alt={t.label}
                          className="w-full h-full object-contain drop-shadow-xs"
                        />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/80 shadow-2xs flex items-center justify-center">
                        <IosEmoji symbol={t.emoji} size={18} />
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={20} className="text-neutral-900 fill-neutral-900 text-white" />
                    )}
                  </div>

                  <h3 className={`font-semibold text-base ${t.textColor} mb-1 tracking-tight`}>
                    {t.label}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {t.subtitle}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-black/[0.05] flex items-center justify-between text-[11px] font-medium text-neutral-400">
                  <span>Segel: {t.waxColor}</span>
                  <span className={isSelected ? "text-neutral-900 font-semibold" : "text-neutral-400"}>
                    {isSelected ? "Terpilih ✓" : "Pilih →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recipient Name Input & Enter Studio Button */}
        <div className="max-w-md mx-auto w-full bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm animate-in fade-in duration-300">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Siapa nama orang spesial yang akan menerima kado ini?
            </label>
            <Input
              type="text"
              placeholder="Contoh: Rara, Dimas, Bunda, Sahabat Tercinta"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              className="h-11 rounded-xl text-xs border-neutral-200 focus-visible:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Bisa diubah kapan saja di dalam studio editor.
            </p>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-12 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-semibold transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 group"
          >
            <span>Masuk ke Custom Studio</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-6 text-center text-xs text-neutral-400 border-t border-black/[0.05]">
        BacaKado Studio — Rancang kado ucapan layaknya kanvas visual pribadi
      </footer>
    </div>
  );
}
