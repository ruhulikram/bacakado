"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface IPhoneProps {
  children?: React.ReactNode;
  className?: string;
  screenClassName?: string;
}

export const Component = ({
  children,
  className,
  screenClassName,
}: IPhoneProps) => {
  return (
    <div
      className={cn(
        "relative flex justify-center w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] border-[8px] sm:border-[10px] border-neutral-900 rounded-[48px] bg-neutral-900 select-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/10 shrink-0",
        className
      )}
    >
      {/* ── Left Side Buttons: Mute/Action, Vol Up, Vol Down ─── */}
      <span
        aria-hidden="true"
        className="absolute -left-[12px] top-20 w-[4px] h-6 rounded-l-md bg-neutral-700 border-l border-y border-neutral-800"
      />
      <span
        aria-hidden="true"
        className="absolute -left-[12px] top-32 w-[4px] h-11 rounded-l-md bg-neutral-700 border-l border-y border-neutral-800"
      />
      <span
        aria-hidden="true"
        className="absolute -left-[12px] top-47 w-[4px] h-11 rounded-l-md bg-neutral-700 border-l border-y border-neutral-800"
      />

      {/* ── Right Side Button: Power / Lock ──────────────────── */}
      <span
        aria-hidden="true"
        className="absolute -right-[12px] top-28 w-[4px] h-14 rounded-r-md bg-neutral-700 border-r border-y border-neutral-800"
      />

      {/* ── Top Apple Dynamic Island Notch ──────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 pointer-events-none flex items-center justify-between px-2.5 shadow-xs"
      >
        {/* Camera Sensor Reflection */}
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800/80 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-950" />
        </div>
        {/* Speaker Indicator */}
        <div className="w-2.5 h-1 rounded-full bg-neutral-800" />
      </div>

      {/* ── Bottom Home Indicator Bar ───────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/30 rounded-full z-30 pointer-events-none"
      />

      {/* ── Inner Screen Viewport ────────────────────────────── */}
      <div
        className={cn(
          "w-full h-full rounded-[38px] overflow-hidden relative flex flex-col",
          !children && "bg-gradient-to-b from-[#E7DFD5] via-[#DACFC4] to-[#C8BEB1]",
          screenClassName
        )}
      >
        {children ? (
          children
        ) : (
          /* Default High-Fidelity BacaKado Studio Polaroid Screen (matches reference) */
          <div className="w-full h-full flex flex-col justify-between pt-10 pb-4 px-3.5">
            {/* Top Space for Notch */}
            <div className="h-2" />

            {/* Polaroid Card */}
            <div className="bg-white p-3 pb-3.5 rounded-2xl shadow-xl w-full max-w-[230px] mx-auto border border-white/70 relative transition-transform hover:scale-[1.02] duration-300">
              {/* Pink Washi Tape Sticker */}
              <div
                aria-hidden="true"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-rose-200/90 border border-rose-300/80 -rotate-1 rounded-2xs shadow-2xs z-20"
              />

              {/* Card Photo Frame */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-inner relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=375&fit=crop"
                  alt="Kenangan Indah"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message Typography */}
              <p className="mt-2.5 text-[11px] font-normal italic text-neutral-600 leading-relaxed px-0.5">
                Ketik kata-kata manis atau kenangan indahmu di sini...
              </p>

              {/* Card Footer Info */}
              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400 font-medium">
                <div className="flex items-center gap-1 text-rose-500 font-semibold">
                  <span>❤️</span>
                  <span>Untuk Kamu</span>
                </div>
                <span>Kartu 1 dari 1</span>
              </div>
            </div>

            {/* Bottom Screen Navigation Controls */}
            <div className="w-full flex items-center justify-between pt-3 px-1">
              <button
                type="button"
                className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-0.5"
              >
                <ChevronLeft size={13} />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-neutral-950 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              >
                <span>Lihat Penutup</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const IPhone = Component;
export default Component;
