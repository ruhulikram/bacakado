"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";
import { Lock } from "lucide-react";

interface Envelope3DProps {
  recipientName: string;
  openingText?: string;
  onOpen: () => void;
  onOpeningStateChange?: (isOpen: boolean) => void;
  isDark?: boolean;
  waxColor?: "ruby" | "gold" | "emerald";
  sealSvg?: string;
  themeEmoji?: string;
  hasCards?: boolean;
  cardsCount?: number;
  hasPasscode?: boolean;
  passcodeUnlocked?: boolean;
  onRequestUnlock?: () => void;
  previewMode?: boolean;
}

export function Envelope3D({
  recipientName,
  openingText = "Ada sesuatu terindah buat kamu 💌",
  onOpen,
  onOpeningStateChange,
  isDark = false,
  waxColor = "ruby",
  sealSvg = "/gift/seal-love.svg",
  themeEmoji = "💌",
  hasCards = true,
  cardsCount = 0,
  hasPasscode = false,
  passcodeUnlocked = true,
  onRequestUnlock,
  previewMode = false,
}: Envelope3DProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Posisi kemiringan segel lilin random organik (-14° s/d +14°) layaknya cap stempel lilin artisanal asli
  const [sealTilt] = useState(() => {
    const angles = [-12, -9, -7, -4, 5, 8, 11, 13, -10, 7];
    return angles[Math.floor(Math.random() * angles.length)];
  });

  function handleSealClick(e: React.MouseEvent) {
    e.stopPropagation();

    // Jika terkunci PIN rahasia, munculkan modal PIN
    if (hasPasscode && !passcodeUnlocked) {
      triggerHaptic("selection");
      onRequestUnlock?.();
      return;
    }

    if (isOpen) {
      // Pada mode preview kreator, ketuk lagi untuk menutup/membuka kembali
      if (previewMode) {
        setIsOpen(false);
        onOpeningStateChange?.(false);
        triggerHaptic("selection");
      } else {
        // Jika kado penerima, ketuk untuk lanjut ke pengalaman berikutnya
        triggerHaptic("selection");
        onOpen();
      }
      return;
    }

    // Trigger buka amplop
    triggerOpen();
  }

  function triggerOpen() {
    setIsOpen(true);
    onOpeningStateChange?.(true);

    // Multimodal audio-tactile haptic burst pada perangkat Apple/Android
    triggerHaptic("burst");

    // Micro sparkle confetti pas pada posisi segel lilin (center X 50%, Y ~61%)
    confetti({
      particleCount: 38,
      spread: 68,
      origin: { x: 0.5, y: 0.61 },
      ticks: 120,
      gravity: 0.85,
      colors:
        waxColor === "gold"
          ? ["#FDE047", "#F59E0B", "#D97706", "#FFFBEB"]
          : ["#FB7185", "#F43F5E", "#BE123C", "#FFF1F2"],
    });
  }

  function handlePaperClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isOpen) {
      handleSealClick(e);
      return;
    }
    // Jika surat sudah terbuka dan ditekan, lanjutkan ke kartu kenangan
    if (!previewMode) {
      triggerHaptic("selection");
      onOpen();
    }
  }

  return (
    <div className="z-10 flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-500 touch-fluid">
      {/* ── Realistic Layered SVG Envelope Container ───────────────── */}
      <div
        className={`relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] transition-transform duration-700 ${
          isOpen ? "scale-[1.02]" : "animate-envelope-bob"
        }`}
        style={{ perspective: "1400px" }}
      >
        {/* Layer 1: Back Panel (Interior liner & envelope back) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gift/back-panel.svg"
          alt="Amplop Belakang"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xl"
          style={{ zIndex: 1 }}
        />

        {/* Layer 2: Letter Paper (Meluncur naik dari dalam saku amplop dan menampilkan pesan) */}
        <div
          onClick={handlePaperClick}
          className={`absolute inset-0 w-full h-full cursor-pointer transition-all duration-900 ease-out flex flex-col items-center justify-center ${
            isOpen
              ? "-translate-y-[46%] scale-[1.06] drop-shadow-2xl pointer-events-auto"
              : "translate-y-0 scale-[0.98] drop-shadow-sm pointer-events-none"
          }`}
          style={{
            zIndex: isOpen ? 6 : 2, // Ketika terbuka naik ke atas saku depan
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", // Fluid Apple spring glide
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gift/Paper.svg"
            alt="Kertas Surat"
            draggable={false}
            className="w-full h-full object-contain"
          />

          {/* Letter Message Overlay on Paper (Pesan Ucapan Nyata) */}
          <div
            className="absolute left-[7%] right-[7%] top-[21%] bottom-[44%] flex flex-col items-center justify-between text-center px-4 py-2 pointer-events-auto"
            style={{
              transition: "opacity 400ms ease, transform 500ms ease",
              opacity: isOpen ? 1 : 0.85,
            }}
          >
            {/* Header Surat */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="transform scale-90 sm:scale-100">
                <IosEmoji symbol={themeEmoji} size={20} />
              </span>
              <p className="font-serif italic text-sm sm:text-base font-semibold text-neutral-900 tracking-tight truncate max-w-[210px]">
                Untuk {recipientName}
              </p>
            </div>

            {/* Isi Pesan Ucapan */}
            <div className="my-auto px-1 max-w-[240px]">
              <p className="text-[11px] sm:text-xs text-neutral-700 font-sans italic line-clamp-3 leading-relaxed">
                &ldquo;<EmojiText text={openingText} size={13} />&rdquo;
              </p>
            </div>

            {/* Catatan Kaki Surat */}
            <div className="pt-0.5">
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-serif italic tracking-wide">
                — Dari lubuk hati terdalam ✨
              </span>
            </div>
          </div>
        </div>

        {/* Layer 3: Front Panel Pocket (Saku depan amplop) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gift/front-panel.svg"
          alt="Amplop Depan"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
          style={{ zIndex: 3 }}
        />

        {/* Layer 4: Top Flap Panel (Tutup atas berputar 180° dalam 3D fisik Apple) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-800 ${
            isOpen ? "opacity-95" : "opacity-100"
          }`}
          style={{
            zIndex: isOpen ? 1 : 4, // Saat terbuka berputar ke belakang saku
            transformOrigin: "50% 23.6%", // Garis engsel lipatan atas amplop (Y=191px pada 810 viewBox)
            transformStyle: "preserve-3d",
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transitionTimingFunction: "cubic-bezier(0.34, 1.25, 0.64, 1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gift/top-panel.svg"
            alt="Tutup Amplop Atas"
            draggable={false}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Layer 5: Wax Seal (Segel lilin proporsional sesuai Referensi Picture 2) */}
        {/* Koordinat Y 61% duduk tepat di ujung lancip flap atas, menutup saku */}
        {/* Tanpa efek cursor pointer, tanpa hover scale, murni seperti lilin asli */}
        <div
          onClick={handleSealClick}
          className={`absolute transition-all duration-300 ${
            isOpen
              ? "opacity-0 pointer-events-none scale-125"
              : "opacity-100 pointer-events-auto scale-100"
          }`}
          style={{
            left: "50%",
            top: "61%", // Pas di ujung segitiga flap atas penutup amplop
            width: "88px",
            height: "88px",
            transform: `translate(-50%, -50%) rotate(${sealTilt}deg)`,
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sealSvg}
            alt="Segel Lilin"
            draggable={false}
            className="w-full h-full object-contain filter drop-shadow-md select-none"
          />

          {/* Badge Kunci PIN Rahasia jika ada */}
          {hasPasscode && !passcodeUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-md animate-pulse">
                <Lock size={12} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
