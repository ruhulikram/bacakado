"use client";

import React, { useEffect } from "react";
import { Gift } from "@/lib/types";
import { GiftExperience } from "@/components/gift/GiftExperience";
import { X, Sparkles, Smartphone } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";

import { IPhone } from "@/components/ui/iphone";

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
      <IPhone
        className="w-full max-w-[340px] sm:max-w-[370px] h-[calc(100vh-160px)] max-h-[720px] shadow-2xl"
        screenClassName="bg-white"
      >
        <GiftExperience gift={gift} />
      </IPhone>

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
