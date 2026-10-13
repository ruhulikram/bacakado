"use client";

import { useEffect, useRef, useState } from "react";
import { Gift, Card } from "@/lib/types";
import { getTheme } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { recordView } from "@/app/actions/tracking";
import { unlockGift } from "@/app/actions/gift";
import { FloatingAmbience } from "@/components/gift/FloatingAmbience";
import { VinylMusicPlayer } from "@/components/gift/VinylMusicPlayer";
import { Envelope3D } from "@/components/gift/Envelope3D";
import { PolaroidCardDeck } from "@/components/gift/PolaroidCardDeck";
import { ClosingExperience } from "@/components/gift/ClosingExperience";
import { Lock } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

type Stage = "envelope" | "cards" | "closing";

export function GiftExperience({ gift }: { gift: Gift }) {
  // Langsung tampilkan amplop surat nyata di view utama sesuai konsep unboxing fisik
  const [stage, setStage] = useState<Stage>("envelope");
  const [musicTrigger, setMusicTrigger] = useState(false);

  // PIN Passcode Protection states
  const hasPasscode = Boolean(gift.has_passcode);
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(!hasPasscode);
  const [cards, setCards] = useState<Card[]>(gift.cards);
  const [pinChecking, setPinChecking] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);

  const viewRecorded = useRef(false);
  const theme = getTheme(gift.theme);
  const isDarkTheme = gift.theme === "valentine";

  useEffect(() => {
    if (!viewRecorded.current && gift.id !== "preview") {
      viewRecorded.current = true;
      recordView(gift.id);
    }
  }, [gift.id]);

  async function verifyPin() {
    if (pinChecking || !inputPin.trim()) return;
    setPinChecking(true);
    triggerHaptic("selection");
    const res = await unlockGift(gift.slug, inputPin);
    setPinChecking(false);
    if (res.cards) {
      triggerHaptic("success");
      setCards(res.cards);
      setPinError("");
      setPasscodeUnlocked(true);
      setShowPinModal(false);
    } else {
      triggerHaptic("error");
      setPinError(res.error || "PIN belum tepat. Coba masukkan tanggal spesial.");
    }
  }

  function handleReset() {
    triggerHaptic("selection");
    setStage("envelope");
    setMusicTrigger(false);
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-700`}
    >
      {/* ── Dynamic Floating Background Atmosphere ───────────── */}
      <FloatingAmbience
        type={theme.ambientParticle}
        glowColor={theme.glowColor}
        isDark={isDarkTheme}
      />

      {/* ── Aesthetic Vinyl / Spotify Music Player ────────────── */}
      <VinylMusicPlayer
        musicUrl={gift.music_url}
        autoPlayTrigger={musicTrigger}
        recipientName={gift.recipient_name}
        isDark={isDarkTheme}
      />

      {/* ── STAGE 1: 3D ENVELOPE SURAT NYATA ──────────────────── */}
      {stage === "envelope" && (
        <div className="z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full">
          {/* Header Ucapan Minimalis & Elegan */}
          <div className="text-center mb-1 sm:mb-2 animate-in fade-in duration-500 px-4">
            <p
              className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold mb-1 ${
                isDarkTheme ? "text-rose-300" : "text-rose-600"
              }`}
            >
              Sebuah Kado Digital Terindah
            </p>
            <h1
              className={`font-serif italic text-3xl sm:text-4xl font-normal tracking-tight ${
                isDarkTheme ? "text-white" : "text-neutral-950"
              }`}
            >
              Untuk {gift.recipient_name}
            </h1>
          </div>

          {/* Amplop 3D Layered SVG dengan Segel Proporsional Sesuai Picture 2 */}
          <Envelope3D
            recipientName={gift.recipient_name}
            openingText={gift.opening_text}
            onOpen={() => setStage(cards.length > 0 ? "cards" : "closing")}
            onOpeningStateChange={(isOpen) => {
              if (isOpen) setMusicTrigger(true);
            }}
            isDark={isDarkTheme}
            waxColor={theme.waxColor}
            sealSvg={theme.sealSvg}
            themeEmoji={theme.emoji}
            hasCards={cards.length > 0}
            cardsCount={cards.length}
            hasPasscode={hasPasscode}
            passcodeUnlocked={passcodeUnlocked}
            onRequestUnlock={() => setShowPinModal(true)}
          />
        </div>
      )}

      {/* ── PIN LOCK MODAL ────────────────────────────────────── */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 max-w-xs w-full text-center shadow-2xl relative border border-neutral-200/80 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 text-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-2xs">
              <Lock size={22} />
            </div>
            <h3 className="font-serif italic text-xl font-medium text-neutral-900 mb-1">
              Surat Ini Dirahasiakan
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Hanya orang spesial yang tahu kode atau tanggal rahasia untuk membuka kado ini.
            </p>

            <Input
              type="text"
              autoFocus
              placeholder="Masukkan PIN rahasia"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPin()}
              className="text-center font-medium text-base tracking-widest h-11 rounded-xl mb-2 border-neutral-200 focus-visible:ring-neutral-900"
            />

            {pinError && (
              <p className="text-rose-500 text-xs mb-3 animate-in fade-in duration-200 font-medium">
                {pinError}
              </p>
            )}

            <button
              onClick={verifyPin}
              disabled={pinChecking}
              className="w-full bg-neutral-900 hover:bg-black text-white font-semibold py-3 rounded-full text-xs transition-all active:scale-95 btn-apple-spring mb-2 shadow-xs"
            >
              {pinChecking ? "Membuka Kunci..." : "Buka Surat Sekarang"}
            </button>

            <button
              onClick={() => {
                triggerHaptic("selection");
                setShowPinModal(false);
              }}
              className="text-xs text-neutral-400 hover:text-neutral-700 block mx-auto mt-2 transition-colors btn-apple-spring"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 2: POLAROID CARDS DECK ──────────────────────── */}
      {stage === "cards" && cards.length > 0 && (
        <PolaroidCardDeck
          cards={cards}
          recipientName={gift.recipient_name}
          onFinish={() => setStage("closing")}
          isDark={isDarkTheme}
          tapeStyle={theme.tapeStyle}
        />
      )}

      {/* ── STAGE 3: CLOSING & CELEBRATION ────────────────────── */}
      {stage === "closing" && (
        <ClosingExperience
          giftId={gift.id}
          recipientName={gift.recipient_name}
          closingText={gift.closing_text}
          onReset={handleReset}
          isDark={isDarkTheme}
        />
      )}
    </div>
  );
}
