"use client";

import React, { useState } from "react";
import Link from "next/link";
import { THEME_OPTIONS } from "@/lib/mock-data";
import { Theme } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface StudioThemeGateProps {
  initialTheme: Theme | null;
  initialRecipient: string;
  resumeName: string | null;
  onResume: () => void;
  onSelectThemeAndContinue: (theme: Theme, recipient: string) => void;
}

export function StudioThemeGate({
  initialTheme,
  initialRecipient,
  resumeName,
  onResume,
  onSelectThemeAndContinue,
}: StudioThemeGateProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(initialTheme);
  const [recipient, setRecipient] = useState(initialRecipient);

  function handleContinue() {
    if (!selectedTheme) return;
    triggerHaptic("medium");
    onSelectThemeAndContinue(selectedTheme, recipient.trim());
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F5] text-neutral-900 flex flex-col">
      <header className="h-14 px-4 sm:px-6 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 h-10 px-2 -ml-2 rounded-xl text-sm text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04] transition-colors"
        >
          <ArrowLeft size={16} />
          Beranda
        </Link>
      </header>

      <main className="w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-10 flex-1 flex flex-col">
        {resumeName !== null && (
          <div className="mb-10 flex items-center justify-between gap-3 rounded-2xl bg-white border border-neutral-200 p-4">
            <p className="text-sm text-neutral-700">
              {resumeName ? (
                <>Kado untuk <span className="font-serif italic text-base text-neutral-900">{resumeName}</span> belum selesai.</>
              ) : (
                "Ada kado yang belum selesai."
              )}
            </p>
            <button
              type="button"
              onClick={onResume}
              className="shrink-0 h-10 px-4 rounded-full bg-neutral-900 text-white text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/25"
            >
              Lanjutkan
            </button>
          </div>
        )}

        <label htmlFor="recipient" className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-[-0.01em] mb-6 block">
          Kado ini untuk siapa?
        </label>
        <input
          id="recipient"
          type="text"
          autoFocus={resumeName === null}
          autoComplete="off"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder="Nama panggilannya"
          className="w-full font-serif italic text-2xl bg-transparent border-b border-neutral-300 focus:border-neutral-900 outline-none pb-2 placeholder:text-neutral-300 transition-colors"
        />
        <p className="text-sm text-neutral-500 mt-2">Muncul di amplop. Bisa diganti nanti.</p>

        <fieldset className="mt-10">
          <legend className="text-sm font-semibold mb-3">Nuansanya</legend>
          <div className="grid grid-cols-2 gap-3">
            {THEME_OPTIONS.map((t) => {
              const isSelected = selectedTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    triggerHaptic("selection");
                    setSelectedTheme(t.id as Theme);
                  }}
                  className={`flex flex-col items-start text-left rounded-2xl p-4 border bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                    isSelected ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.sealSvg} alt="" className="w-10 h-10 object-contain mb-3" />
                  <span className="block text-base font-semibold">{t.label}</span>
                  <span className="block text-sm text-neutral-500 leading-snug mt-0.5">{t.subtitle}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedTheme}
          className="mt-8 w-full h-12 rounded-full bg-neutral-900 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/25"
        >
          {selectedTheme ? "Mulai menulis" : "Pilih nuansanya dulu"}
        </button>
      </main>
    </div>
  );
}
