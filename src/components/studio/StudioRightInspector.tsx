"use client";

import React, { useState } from "react";
import { Theme } from "@/lib/types";
import { THEME_OPTIONS } from "@/lib/mock-data";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { Lock, Music } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export type RightTab = "design" | "settings";

interface StudioRightInspectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  hasPasscode: boolean;
  onTogglePasscode: (has: boolean) => void;
  passcode: string;
  onPasscodeChange: (code: string) => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  musicTitle?: string;
  onResetDraft: () => void;
}

export function StudioRightInspector({
  theme,
  onThemeChange,
  hasPasscode,
  onTogglePasscode,
  passcode,
  onPasscodeChange,
  recipientName,
  onRecipientNameChange,
  musicTitle,
  onResetDraft,
}: StudioRightInspectorProps) {
  const [activeTab, setActiveTab] = useState<RightTab>("design");

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <aside className="w-72 sm:w-80 h-[calc(100vh-64px)] border-l border-black/[0.08] bg-white flex flex-col select-none overflow-y-auto shrink-0 z-30">
      {/* ── Segmented Tab Header (Design vs Settings) ─────────── */}
      <div className="p-4 border-b border-black/[0.06] bg-[#FAF8F5]">
        <div className="grid grid-cols-2 p-1 bg-neutral-200/60 rounded-2xl">
          <button
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("design");
            }}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "design"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Nuansa
          </button>
          <button
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("settings");
            }}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Pengaturan
          </button>
        </div>
      </div>

      {/* ── Tab 1: Desain Visual ──────────────────────────────── */}
      {activeTab === "design" && (
        <div className="p-4 space-y-6">
          {/* Section: Nuansa Kado */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800">
                Nuansa
              </span>
              <span className="text-[11px] font-medium text-rose-500">
                {currentTheme.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      triggerHaptic("selection");
                      onThemeChange(t.id as Theme);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all btn-apple-spring relative overflow-hidden ${
                      isSelected
                        ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-1 bg-white shadow-sm"
                        : "border-neutral-200/80 hover:border-neutral-300 bg-neutral-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center p-0.5 border border-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.sealSvg} alt="" className="w-full h-full object-contain" />
                      </div>
                      <IosEmoji symbol={t.emoji} size={15} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-900 truncate">{t.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── Tab 2: Pengaturan Kado ────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="p-4 space-y-6">
          {/* Section: Penerima Kado */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-800 block">
              Nama penerima
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Contoh: Rara"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-400">
              Muncul di amplop dan di akhir kado.
            </p>
          </div>

          {/* Section: Gembok Rahasia (PIN Protection) */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                  <Lock size={14} />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">
                    Kunci dengan PIN
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Amplop baru terbuka setelah PIN benar
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("selection");
                  onTogglePasscode(!hasPasscode);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  hasPasscode ? "bg-amber-500" : "bg-neutral-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    hasPasscode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {hasPasscode && (
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 space-y-2 animate-in fade-in duration-200">
                <label className="text-[11px] font-semibold text-neutral-800 block">
                  PIN, 4 sampai 6 angka
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="1402"
                  value={passcode}
                  onChange={(e) => onPasscodeChange(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-neutral-300 text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Tanggal jadian atau ulang tahun gampang diingat berdua. Kasih tahu PIN-nya terpisah dari link.
                </p>
              </div>
            )}
          </div>

          {/* Section: Info Musik Terpasang */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-800 block">
              Musik
            </span>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5 text-xs text-neutral-700">
              <Music size={15} className="text-rose-500 shrink-0" />
              <span className="truncate font-medium">{musicTitle || "Tanpa musik"}</span>
            </div>
          </div>

          {/* Section: Status Kado */}
          <div className="pt-4 border-t border-neutral-100">
            <div className="p-3 rounded-2xl bg-neutral-900 text-white space-y-1">
              <p className="text-xs font-semibold">Belum terbit</p>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Bayar Rp 5.000 sekali lewat QRIS saat menerbitkan, lalu link-nya aktif selamanya.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetDraft}
              className="mt-3 w-full text-xs font-medium text-neutral-500 hover:text-rose-600 py-2 rounded-xl hover:bg-rose-50 transition-colors"
            >
              Mulai kado baru dari awal
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
