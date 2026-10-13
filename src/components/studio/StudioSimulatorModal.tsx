"use client";

import React, { useEffect } from "react";
import { Gift } from "@/lib/types";
import { GiftExperience } from "@/components/gift/GiftExperience";
import { X, Sparkles, Smartphone } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";

interface StudioSimulatorModalProps {
  gift: Gift;
  onClose: () => void;
  onPublish: () => void;
}

export function StudioSimulatorModal({
  gift,
  onClose,
  onPublish,
}: StudioSimulatorModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200">
      {/* ── Top Bar ───────────────────────────────────────────── */}
      <div className="w-full max-w-xl flex items-center justify-between text-white z-20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Smartphone size={16} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-bold block">Simulasi Pengalaman Penerima</span>
            <span className="text-[10px] text-white/60">Ketuk segel lilin untuk menguji unboxing</span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic("selection");
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          title="Tutup Simulasi (Esc)"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Phone Mockup Viewport Running GiftExperience ─────── */}
      <div className="w-full max-w-sm sm:max-w-md h-[calc(100vh-140px)] rounded-[44px] p-2 bg-neutral-900 border-4 border-neutral-700/80 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 pointer-events-none flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
        </div>

        {/* Screen */}
        <div className="w-full h-full rounded-[36px] overflow-hidden bg-white relative">
          <GiftExperience gift={gift} />
        </div>
      </div>

      {/* ── Bottom Controls ───────────────────────────────────── */}
      <div className="w-full max-w-md flex items-center justify-between gap-3 mt-3 z-20">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
        >
          ← Lanjut Mengedit di Studio
        </button>

        <button
          onClick={() => {
            onClose();
            onPublish();
          }}
          className="flex-1 py-3 rounded-2xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
        >
          <span>Terbitkan Kado</span>
          <span className="text-[10px] text-neutral-500 font-medium">({PREMIUM_PRICE_LABEL})</span>
          <Sparkles size={13} className="text-amber-500" />
        </button>
      </div>
    </div>
  );
}
