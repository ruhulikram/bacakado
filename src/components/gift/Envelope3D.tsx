"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { IosEmoji } from "@/components/ui/IosEmoji";

interface Envelope3DProps {
  recipientName: string;
  onOpen: () => void;
  isDark?: boolean;
  waxColor?: "ruby" | "gold" | "emerald";
  envelopeBg?: string;
  envelopeFlap?: string;
}

export function Envelope3D({
  recipientName,
  onOpen,
  isDark = false,
  waxColor = "ruby",
  envelopeBg,
  envelopeFlap,
}: Envelope3DProps) {
  const [opening, setOpening] = useState(false);

  function handleEnvelopeClick() {
    if (opening) return;
    setOpening(true);

    // Micro sparkle burst at wax seal position
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.55 },
      ticks: 120,
      colors:
        waxColor === "gold"
          ? ["#FDE047", "#F59E0B", "#D97706", "#FFFBEB"]
          : ["#FB7185", "#F43F5E", "#BE123C", "#FFF1F2"],
    });

    // Allow flap & rising letter animation to complete before switching view
    setTimeout(() => {
      onOpen();
    }, 950);
  }

  const initial = recipientName.trim().slice(0, 1).toUpperCase() || "💌";

  const defaultBg = isDark ? "#1C1B2E" : envelopeBg || "#FFF8F2";
  const defaultFlap = isDark ? "#282640" : envelopeFlap || "#FCE7DB";

  return (
    <div className="z-10 flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-500">
      {/* 3D Envelope Container */}
      <div
        onClick={handleEnvelopeClick}
        className={`cursor-pointer group relative w-[310px] sm:w-[350px] h-[215px] sm:h-[235px] transition-all duration-700 ${
          opening ? "scale-105" : "hover:scale-[1.02] active:scale-[0.99] animate-envelope-bob"
        }`}
        style={{ perspective: "1200px" }}
      >
        {/* Back Plate / Interior Liner */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-black/10"
          style={{
            background: isDark
              ? "linear-gradient(145deg, #161528, #0E0D1B)"
              : "linear-gradient(145deg, #FFF1E6, #FDE2D0)",
          }}
        >
          {/* Subtle interior pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>

        {/* Letter Card Sliding Out */}
        <div
          className={`absolute left-4 right-4 h-40 sm:h-44 rounded-xl bg-white shadow-md p-4 transition-all duration-700 ease-out border border-neutral-100 flex flex-col justify-center items-center text-center ${
            opening ? "-translate-y-20 sm:-translate-y-24 opacity-100" : "-translate-y-2 opacity-90"
          }`}
          style={{ zIndex: 1 }}
        >
          <IosEmoji symbol="💌" size={32} className="mb-1" />
          <p className="font-serif italic text-sm text-neutral-800">
            Sebuah surat terindah
          </p>
          <p className="text-[11px] font-medium text-rose-500 mt-1">
            Khusus untuk {recipientName}
          </p>
        </div>

        {/* Front Envelope Pocket (Triangular Left & Right folds) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{ zIndex: 2 }}
        >
          {/* Bottom Fold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0 border-l-[155px] sm:border-l-[175px] border-r-[155px] sm:border-r-[175px] border-b-[110px] sm:border-b-[120px] border-l-transparent border-r-transparent shadow-sm"
            style={{
              borderBottomColor: defaultBg,
              filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.04))",
            }}
          />

          {/* Left Fold */}
          <div
            className="absolute top-0 bottom-0 left-0 w-0 border-t-[107px] sm:border-t-[117px] border-b-[107px] sm:border-b-[117px] border-l-[155px] sm:border-l-[175px] border-t-transparent border-b-transparent"
            style={{
              borderLeftColor: defaultBg,
              opacity: 0.96,
            }}
          />

          {/* Right Fold */}
          <div
            className="absolute top-0 bottom-0 right-0 w-0 border-t-[107px] sm:border-t-[117px] border-b-[107px] sm:border-b-[117px] border-r-[155px] sm:border-r-[175px] border-t-transparent border-b-transparent"
            style={{
              borderRightColor: defaultBg,
              opacity: 0.96,
            }}
          />
        </div>

        {/* Top Flap (Swings open 180 degrees in 3D) */}
        <div
          className="absolute top-0 left-0 right-0 h-0 border-l-[155px] sm:border-l-[175px] border-r-[155px] sm:border-r-[175px] border-t-[110px] sm:border-t-[120px] border-l-transparent border-r-transparent transition-transform duration-700 ease-in-out origin-top"
          style={{
            zIndex: opening ? 0 : 3,
            borderTopColor: defaultFlap,
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.06))",
          }}
        />

        {/* Realistic Wax Seal in the Center */}
        <div
          className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            opening ? "scale-125 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          }`}
          style={{ zIndex: 4 }}
        >
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-serif text-white font-bold text-base sm:text-lg cursor-pointer ${
              waxColor === "gold" ? "wax-seal-gold" : "wax-seal"
            } animate-wax-glow`}
          >
            {/* Wax rim relief */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center shadow-inner">
              <span className="drop-shadow-sm select-none tracking-tighter">
                {initial}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle recipient label on the front of the envelope */}
        <div
          className={`absolute bottom-3 left-0 right-0 text-center transition-opacity duration-300 pointer-events-none ${
            opening ? "opacity-0" : "opacity-90"
          }`}
          style={{ zIndex: 5 }}
        >
          <span
            className={`text-[11px] sm:text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-xs ${
              isDark ? "text-neutral-400 bg-white/5" : "text-neutral-600 bg-black/5"
            }`}
          >
            Untuk {recipientName}
          </span>
        </div>
      </div>

      {/* Heartfelt Call to Action Prompt */}
      {!opening && (
        <div className="mt-8 flex flex-col items-center gap-1.5 animate-bounce duration-1000">
          <p
            className={`text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 ${
              isDark ? "text-rose-300" : "text-rose-600"
            }`}
          >
            <IosEmoji symbol="✨" size={16} />
            <span>Sentuh segel lilin untuk membuka amplop</span>
            <IosEmoji symbol="💌" size={16} />
          </p>
          <p className="text-[11px] text-neutral-400 font-normal">
            Ada kejutan dan kenangan manis di dalamnya
          </p>
        </div>
      )}
    </div>
  );
}
