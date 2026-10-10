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
import { Lock, Sparkles, Heart } from "lucide-react";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";

type Stage = "cover" | "envelope" | "cards" | "closing";

export function GiftExperience({ gift }: { gift: Gift }) {
  const [stage, setStage] = useState<Stage>("cover");
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

  function handleStartOpen() {
    triggerHaptic("light");
    if (hasPasscode && !passcodeUnlocked) {
      setShowPinModal(true);
      return;
    }
    setStage("envelope");
  }

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
      setStage("envelope");
    } else {
      triggerHaptic("error");
      setPinError(res.error || "PIN belum tepat. Coba masukkan tanggal spesial.");
    }
  }

  function handleEnvelopeOpen() {
    setMusicTrigger(true);
    setStage("cards");
  }

  function handleReset() {
    triggerHaptic("selection");
    setStage("cover");
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
      {stage !== "cover" && (
        <VinylMusicPlayer
          musicUrl={gift.music_url}
          autoPlayTrigger={musicTrigger}
          recipientName={gift.recipient_name}
          isDark={isDarkTheme}
        />
      )}

      {/* ── STAGE 1: COVER ────────────────────────────────────── */}
      {stage === "cover" && (
        <div className="z-10 text-center animate-in fade-in zoom-in-95 duration-500 max-w-sm sm:max-w-md px-4">
          {/* Animated Gift Envelope Icon */}
          <div className="relative inline-block mb-6">
            <div
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg border transition-all animate-float-gentle ${
                isDarkTheme
                  ? "bg-[#181824] border-white/10 text-white shadow-black/50"
                  : "bg-white border-neutral-200/80 text-neutral-900 shadow-rose-200/50"
              }`}
            >
              <IosEmoji symbol="💌" size={42} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md animate-bounce">
              <Sparkles size={12} />
            </div>
          </div>

          <p
            className={`text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold mb-3 ${
              isDarkTheme ? "text-rose-300" : "text-rose-600"
            }`}
          >
            Sebuah Kado Digital Terindah
          </p>

          <h1
            className={`font-serif italic text-4xl sm:text-5xl font-normal tracking-tight mb-4 ${
              isDarkTheme ? "text-white" : "text-neutral-950"
            }`}
          >
            Untuk {gift.recipient_name}
          </h1>

          <p
            className={`text-sm sm:text-base leading-relaxed mb-8 px-2 max-w-xs mx-auto ${
              isDarkTheme ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            <EmojiText text={gift.opening_text} size={18} />
          </p>

          <button
            onClick={handleStartOpen}
            className={`font-semibold px-8 py-3.5 rounded-full text-xs sm:text-sm transition-all active:scale-95 btn-apple-spring shadow-md flex items-center gap-2 mx-auto ${
              isDarkTheme
                ? "bg-white hover:bg-neutral-100 text-neutral-950 shadow-white/10"
                : "bg-neutral-900 hover:bg-black text-white shadow-neutral-400/30"
            }`}
          >
            {hasPasscode && !passcodeUnlocked ? (
              <>
                <Lock size={15} className="text-amber-400" />
                <span>Buka Surat Ber-PIN</span>
              </>
            ) : (
              <>
                <span>Buka Kado Spesial</span>
                <Heart size={15} className="fill-rose-500 text-rose-500" />
              </>
            )}
          </button>
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
              className="text-center font-mono text-base tracking-widest h-11 rounded-xl mb-2 border-neutral-200 focus-visible:ring-neutral-900"
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

      {/* ── STAGE 2: 3D ENVELOPE UNBOXING ─────────────────────── */}
      {stage === "envelope" && (
        <Envelope3D
          recipientName={gift.recipient_name}
          onOpen={handleEnvelopeOpen}
          isDark={isDarkTheme}
          waxColor={theme.waxColor}
          envelopeBg={theme.envelopeBg}
          envelopeFlap={theme.envelopeFlap}
        />
      )}

      {/* ── STAGE 3: POLAROID CARDS DECK ──────────────────────── */}
      {stage === "cards" && cards.length > 0 && (
        <PolaroidCardDeck
          cards={cards}
          recipientName={gift.recipient_name}
          onFinish={() => setStage("closing")}
          isDark={isDarkTheme}
          tapeStyle={theme.tapeStyle}
        />
      )}

      {/* ── STAGE 4: CLOSING & CELEBRATION ────────────────────── */}
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
