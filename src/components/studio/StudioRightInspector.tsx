"use client";

import React, { useState } from "react";
import { Theme } from "@/lib/types";
import { THEME_OPTIONS } from "@/lib/mock-data";
import { IosEmoji } from "@/components/ui/IosEmoji";
import {
  Palette,
  Sliders,
  Lock,
  Music,
  Sparkles,
  Type,
  Maximize,
  RotateCw,
  Heart,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export type RightTab = "design" | "settings";

export type FontStyle = "serif" | "sans" | "mono";

interface StudioRightInspectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  fontStyle: FontStyle;
  onFontStyleChange: (font: FontStyle) => void;
  cardTilt: number;
  onCardTiltChange: (tilt: number) => void;
  hasPasscode: boolean;
  onTogglePasscode: (has: boolean) => void;
  passcode: string;
  onPasscodeChange: (code: string) => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  musicTitle?: string;
  tapeStyle: "washi-tape" | "washi-tape-gold";
  onTapeStyleChange: (style: "washi-tape" | "washi-tape-gold") => void;
}

export function StudioRightInspector({
  theme,
  onThemeChange,
  fontStyle,
  onFontStyleChange,
  cardTilt,
  onCardTiltChange,
  hasPasscode,
  onTogglePasscode,
  passcode,
  onPasscodeChange,
  recipientName,
  onRecipientNameChange,
  musicTitle,
  tapeStyle,
  onTapeStyleChange,
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
            Desain Visual
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
                Nuansa Kado
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
                    <p className="text-[10px] text-neutral-400 capitalize">{t.waxColor} seal</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Tipografi / Font */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-800 block">
              Gaya Tulisan
            </span>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  triggerHaptic("selection");
                  onFontStyleChange("serif");
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  fontStyle === "serif"
                    ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                    : "bg-neutral-50 border-neutral-200/80 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className="font-serif italic text-sm">Instrument Serif (Romantis)</span>
                {fontStyle === "serif" && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
              </button>

              <button
                onClick={() => {
                  triggerHaptic("selection");
                  onFontStyleChange("sans");
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  fontStyle === "sans"
                    ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                    : "bg-neutral-50 border-neutral-200/80 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className="font-sans font-medium">Arimo (Modern)</span>
                {fontStyle === "sans" && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
              </button>

              <button
                onClick={() => {
                  triggerHaptic("selection");
                  onFontStyleChange("mono");
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  fontStyle === "mono"
                    ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                    : "bg-neutral-50 border-neutral-200/80 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className="font-mono text-xs">Mesin Ketik (Nostalgia)</span>
                {fontStyle === "mono" && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
              </button>
            </div>
          </div>

          {/* Section: Rotasi & Kemiringan Polaroid */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">
                Kemiringan Polaroid
              </span>
              <span className="text-neutral-500 font-semibold text-xs">
                {cardTilt > 0 ? `+${cardTilt}` : cardTilt}°
              </span>
            </div>

            <input
              type="range"
              min={-6}
              max={6}
              step={0.5}
              value={cardTilt}
              onChange={(e) => onCardTiltChange(parseFloat(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Miring Kiri (-6°)</span>
              <span>Lurus (0°)</span>
              <span>Miring Kanan (+6°)</span>
            </div>
          </div>

          {/* Section: Gaya Washi Tape */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-800 block">
              Pelekat Washi Tape
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  triggerHaptic("selection");
                  onTapeStyleChange("washi-tape-gold");
                }}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  tapeStyle === "washi-tape-gold"
                    ? "border-neutral-900 bg-neutral-100/70 font-semibold text-neutral-900 ring-1 ring-neutral-900 shadow-2xs"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="w-12 h-3 mx-auto mb-1 rounded-xs washi-tape-gold" />
                <span>Emas Elegan</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic("selection");
                  onTapeStyleChange("washi-tape");
                }}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  tapeStyle === "washi-tape"
                    ? "border-neutral-900 bg-neutral-100/70 font-semibold text-neutral-900 ring-1 ring-neutral-900 shadow-2xs"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="w-12 h-3 mx-auto mb-1 rounded-xs washi-tape" />
                <span>Pastel Lembut</span>
              </button>
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
              Nama Penerima
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Contoh: Rara"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-400">
              Akan terpampang di amplop surat dan halaman akhir kado.
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
                    Gembok PIN Rahasia
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Kunci amplop dengan kode rahasia
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
                  Masukkan kode atau tanggal rahasia:
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Misal: 1402 atau 2026"
                  value={passcode}
                  onChange={(e) => onPasscodeChange(e.target.value)}
                  className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-neutral-300 text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Penerima harus memasukkan kode ini agar segel amplop terbuka. Cocok untuk tanggal jadian atau ulang tahun.
                </p>
              </div>
            )}
          </div>

          {/* Section: Info Musik Terpasang */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-800 block">
              Audio latar terpasang
            </span>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5 text-xs text-neutral-700">
              <Music size={15} className="text-rose-500 shrink-0" />
              <span className="truncate font-medium">{musicTitle || "Tanpa musik latar"}</span>
            </div>
          </div>

          {/* Section: Status Kado */}
          <div className="pt-4 border-t border-neutral-100">
            <div className="p-3 rounded-2xl bg-neutral-900 text-white space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Status Kado</span>
                <span className="text-emerald-400 font-medium">Draf siap</span>
              </div>
              <p className="text-[10px] text-neutral-300 leading-relaxed">
                Kado ini akan diterbitkan dengan tautan permanen & QRIS Mayar seharga Rp 5.000 sekali bayar.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
