"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Maximize2,
  Undo2,
  Redo2,
  Eye,
  Sparkles,
  ArrowLeft,
  Check,
  Edit2,
  Palette,
  RotateCcw,
} from "lucide-react";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";

export type StudioStage = "envelope" | "card" | "closing";
export type ViewportMode = "mobile" | "canvas";

interface StudioHeaderProps {
  recipientName: string;
  onUpdateRecipientName: (name: string) => void;
  activeStage: StudioStage;
  onStageChange: (stage: StudioStage) => void;
  cardsCount: number;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  zoomScale: number;
  onZoomChange: (scale: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenSimulation: () => void;
  onOpenPublish: () => void;
  onOpenThemeGate: () => void;
  onResetDraft: () => void;
  isEditing?: boolean;
  isSavingUpdate?: boolean;
  onSaveUpdate?: () => void;
}

export function StudioHeader({
  recipientName,
  onUpdateRecipientName,
  activeStage,
  onStageChange,
  cardsCount,
  viewportMode,
  onViewportChange,
  zoomScale,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenSimulation,
  onOpenPublish,
  onOpenThemeGate,
  onResetDraft,
  isEditing = false,
  isSavingUpdate = false,
  onSaveUpdate,
}: StudioHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempName, setTempName] = useState(recipientName);

  function handleSaveTitle() {
    onUpdateRecipientName(tempName.trim());
    setIsEditingTitle(false);
    triggerHaptic("selection");
  }

  return (
    <header className="h-16 border-b border-black/[0.08] bg-white/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* ── Left: Project & Navigation ────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={isEditing ? "/dashboard" : "/"}
          className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors btn-apple-spring shrink-0"
          title={isEditing ? "Kembali ke Dasbor Kado Saya" : "Kembali ke Beranda"}
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="h-5 w-[1px] bg-neutral-200 hidden sm:block shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center shrink-0">
            <IosEmoji symbol="💌" size={16} />
          </div>

          <div className="min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                  placeholder="Nama Penerima"
                  className="text-xs font-semibold px-2 py-0.5 rounded-md border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 w-36"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                >
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setTempName(recipientName);
                  setIsEditingTitle(true);
                }}
                className="group flex items-center gap-1.5 cursor-pointer"
                title="Klik untuk ubah nama penerima"
              >
                <h1 className="text-xs font-bold text-neutral-900 truncate max-w-[120px] sm:max-w-[180px]">
                  Kado untuk {recipientName || "Seseorang"}
                </h1>
                <Edit2
                  size={11}
                  className="text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0"
                />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px]">
              {isEditing ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-600 font-semibold">Mode Edit Kado Terbit</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-neutral-400">Draf tersimpan otomatis</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Center: Viewport & Stage Switcher ─────────────────── */}
      <div className="hidden md:flex items-center gap-2">
        {/* Stage Pills */}
        <div className="flex items-center bg-neutral-100/90 p-1 rounded-2xl border border-neutral-200/60 shadow-2xs">
          <button
            onClick={() => {
              triggerHaptic("selection");
              onStageChange("envelope");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeStage === "envelope"
                ? "bg-white text-neutral-900 shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <IosEmoji symbol="✉️" size={13} />
            <span>Sampul Amplop</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic("selection");
              onStageChange("card");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeStage === "card"
                ? "bg-white text-neutral-900 shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <IosEmoji symbol="📷" size={13} />
            <span>Kartu ({cardsCount})</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic("selection");
              onStageChange("closing");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeStage === "closing"
                ? "bg-white text-neutral-900 shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <IosEmoji symbol="✨" size={13} />
            <span>Penutup</span>
          </button>
        </div>

        {/* Viewport switch: Mobile frame vs Free canvas */}
        <div className="flex items-center bg-neutral-100/90 p-1 rounded-2xl border border-neutral-200/60 shadow-2xs ml-2">
          <button
            onClick={() => {
              triggerHaptic("selection");
              onViewportChange("mobile");
            }}
            className={`p-1.5 rounded-xl transition-all ${
              viewportMode === "mobile"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
            title="Tampilan Bingkai Ponsel (9:16)"
          >
            <Smartphone size={14} />
          </button>
          <button
            onClick={() => {
              triggerHaptic("selection");
              onViewportChange("canvas");
            }}
            className={`p-1.5 rounded-xl transition-all ${
              viewportMode === "canvas"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
            title="Tampilan Kanvas Luas"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Canvas Zoom Pill */}
        <div className="hidden lg:flex items-center bg-neutral-100/90 px-1 py-1 rounded-2xl border border-neutral-200/60 shadow-2xs ml-1 text-[11px] font-semibold text-neutral-600">
          {[0.85, 1, 1.15].map((z) => (
            <button
              key={z}
              onClick={() => {
                triggerHaptic("selection");
                onZoomChange(z);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                zoomScale === z
                  ? "bg-white text-neutral-900 shadow-2xs font-bold"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-xl transition-colors ${
              canUndo ? "text-neutral-600 hover:bg-neutral-100 active:scale-95" : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Urungkan (Undo)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-xl transition-colors ${
              canRedo ? "text-neutral-600 hover:bg-neutral-100 active:scale-95" : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Ulangi (Redo)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Right: Simulation & Publish ───────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Reset Draft Button */}
        <button
          onClick={() => {
            triggerHaptic("selection");
            onResetDraft();
          }}
          className="hidden md:flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
          title="Mulai draf baru atau reset kanvas"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>

        {/* Change Theme Button */}
        <button
          onClick={onOpenThemeGate}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors"
          title="Ubah nuansa kado"
        >
          <Palette size={13} />
          <span>Nuansa</span>
        </button>

        {/* Live Simulation Button */}
        <button
          onClick={() => {
            triggerHaptic("medium");
            onOpenSimulation();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all btn-apple-spring shadow-2xs"
          title="Buka amplop persis seperti penerima kado"
        >
          <Eye size={13} className="text-neutral-600" />
          <span>Uji Kado</span>
        </button>

        {/* Publish or Save Update Action Button */}
        {isEditing ? (
          <Button
            onClick={() => {
              triggerHaptic("medium");
              onSaveUpdate?.();
            }}
            disabled={isSavingUpdate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-9 rounded-xl text-xs font-semibold shadow-sm transition-all btn-apple-spring flex items-center gap-1.5"
          >
            <span>{isSavingUpdate ? "Menyimpan..." : "Simpan Perubahan"}</span>
            <Check size={13} className="text-white" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              triggerHaptic("medium");
              onOpenPublish();
            }}
            className="bg-neutral-900 hover:bg-black text-white px-4 h-9 rounded-xl text-xs font-semibold shadow-sm transition-all btn-apple-spring flex items-center gap-1.5"
          >
            <span>Terbitkan</span>
            <span className="text-[10px] text-amber-200 font-medium">({PREMIUM_PRICE_LABEL})</span>
            <Sparkles size={12} className="text-amber-300" />
          </Button>
        )}
      </div>
    </header>
  );
}
