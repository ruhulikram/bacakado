"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Gift } from "@/lib/types";
import { getTheme } from "@/lib/mock-data";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { recordView, submitReply } from "@/app/actions/tracking";

type Stage = "cover" | "envelope" | "cards" | "closing";

export function GiftExperience({ gift }: { gift: Gift }) {
  const [stage, setStage] = useState<Stage>("cover");
  const [cardIndex, setCardIndex] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [replyName, setReplyName] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState("");

  // PIN Passcode Protection states
  const hasPasscode = Boolean(gift.passcode && gift.passcode.trim().length > 0);
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(!hasPasscode);
  const [inputPin, setInputPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    if (hasPasscode && !passcodeUnlocked) {
      setShowPinModal(true);
      return;
    }
    setStage("envelope");
  }

  function verifyPin() {
    if (inputPin.trim().toLowerCase() === gift.passcode?.trim().toLowerCase()) {
      setPinError("");
      setPasscodeUnlocked(true);
      setShowPinModal(false);
      setStage("envelope");
    } else {
      setPinError("PIN belum tepat. Coba ingat tanggal atau momen spesial ya.");
    }
  }

  function openEnvelope() {
    setEnvelopeOpen(true);
    if (gift.music_url && audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => setStage("cards"), 700);
  }

  function nextCard() {
    if (cardIndex < gift.cards.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setStage("closing");
      setTimeout(() => {
        // Apple-style champagne & silver confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: isDarkTheme
            ? ["#FFFFFF", "#E2E8F0", "#94A3B8", "#D4AF37"]
            : ["#1D1D1F", "#86868B", "#D4AF37", "#F5F5F7"],
        });
      }, 200);
    }
  }

  function prevCard() {
    setCardIndex((i) => Math.max(0, i - 1));
  }

  async function handleReply() {
    setReplyError("");
    const result = await submitReply(gift.id, replyName, replyMsg);
    if (result.error) setReplyError(result.error);
    else setReplySent(true);
  }

  function reset() {
    setStage("cover");
    setCardIndex(0);
    setEnvelopeOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const sorted = [...gift.cards].sort((a, b) => a.order_index - b.order_index);
  const currentCard = sorted[cardIndex];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700`}
    >
      {gift.music_url && (
        <audio ref={audioRef} src={gift.music_url} loop preload="none" />
      )}

      {/* ── COVER ──────────────────────────────────────────── */}
      {stage === "cover" && (
        <div className="text-center z-10 animate-in fade-in duration-500 max-w-sm">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center border shadow-sm transition-all ${
              isDarkTheme
                ? "bg-neutral-900 border-neutral-800 text-white"
                : "bg-white border-neutral-200/80 text-neutral-900"
            }`}
          >
            <span className="text-xl">✉️</span>
          </div>

          <p
            className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${
              isDarkTheme ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            Sebuah Pesan Untuk
          </p>

          <h1
            className={`text-3xl sm:text-4xl font-semibold tracking-tight mb-4 ${
              isDarkTheme ? "text-white" : "text-neutral-950"
            }`}
          >
            {gift.recipient_name}
          </h1>

          <p
            className={`text-sm leading-relaxed mb-8 px-2 ${
              isDarkTheme ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {gift.opening_text}
          </p>

          <button
            onClick={handleStartOpen}
            className={`font-medium px-8 py-3 rounded-full text-sm transition-all active:scale-[0.98] shadow-sm ${
              isDarkTheme
                ? "bg-white hover:bg-neutral-100 text-neutral-950"
                : "bg-neutral-900 hover:bg-black text-white"
            }`}
          >
            {hasPasscode && !passcodeUnlocked ? "Buka dengan PIN" : "Buka Kado"}
          </button>
        </div>
      )}

      {/* ── PIN LOCK MODAL ───────────────────────────────────── */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 max-w-xs w-full text-center shadow-2xl relative border border-neutral-200/80">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 text-lg flex items-center justify-center mx-auto mb-3">
              🔒
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 mb-1">
              Surat Ini Terkunci
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Masukkan kode rahasia atau tanggal spesial untuk membuka kado ini.
            </p>

            <Input
              type="text"
              autoFocus
              placeholder="Masukkan PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPin()}
              className="text-center font-mono text-base tracking-widest h-11 rounded-xl mb-2 border-neutral-200 focus-visible:ring-neutral-900"
            />

            {pinError && (
              <p className="text-red-500 text-xs mb-3 animate-in fade-in duration-200">
                {pinError}
              </p>
            )}

            <button
              onClick={verifyPin}
              className="w-full bg-neutral-900 hover:bg-black text-white font-medium py-2.5 rounded-full text-sm transition-all active:scale-[0.98] mb-2"
            >
              Buka Surat
            </button>

            <button
              onClick={() => setShowPinModal(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700 block mx-auto mt-1 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── ENVELOPE ───────────────────────────────────────── */}
      {stage === "envelope" && (
        <div className="z-10 flex flex-col items-center gap-6">
          <div
            className={`cursor-pointer select-none transition-all duration-700 ${
              envelopeOpen ? "scale-105 opacity-0 pointer-events-none" : "scale-100 opacity-100"
            }`}
            onClick={openEnvelope}
          >
            <div
              className={`relative w-72 h-48 rounded-3xl shadow-xl border flex items-center justify-center transition-all ${
                isDarkTheme
                  ? "bg-[#18181B] border-neutral-800 text-white shadow-black/40"
                  : "bg-white border-neutral-200/80 text-neutral-900 shadow-neutral-200/50"
              }`}
            >
              {/* Envelope flap architectural line */}
              <div
                className={`absolute top-0 left-0 right-0 h-0 border-l-[144px] border-r-[144px] border-t-[72px] border-l-transparent border-r-transparent transition-all duration-500 origin-top ${
                  isDarkTheme ? "border-t-neutral-800/80" : "border-t-neutral-100"
                }`}
                style={{
                  transform: envelopeOpen ? "scaleY(-1)" : "scaleY(1)",
                }}
              />

              {/* Minimal Wax Monogram */}
              <div
                className={`w-11 h-11 rounded-full border flex items-center justify-center text-xs font-semibold tracking-wider z-10 shadow-sm ${
                  isDarkTheme
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700"
                }`}
              >
                {gift.recipient_name.slice(0, 1).toUpperCase()}
              </div>

              <p
                className={`absolute bottom-4 text-xs font-medium tracking-wide ${
                  isDarkTheme ? "text-neutral-500" : "text-neutral-400"
                }`}
              >
                Untuk {gift.recipient_name}
              </p>
            </div>
          </div>

          {!envelopeOpen && (
            <p
              className={`text-xs tracking-wide transition-opacity ${
                isDarkTheme ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              Sentuh amplop untuk membuka
            </p>
          )}
        </div>
      )}

      {/* ── CARDS ──────────────────────────────────────────── */}
      {stage === "cards" && currentCard && (
        <div className="z-10 w-full max-w-sm">
          {/* Minimal Progress Dots */}
          <div className="flex gap-1.5 justify-center mb-5">
            {sorted.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === cardIndex ? 24 : 6,
                  backgroundColor:
                    i <= cardIndex
                      ? isDarkTheme
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(29,29,31,0.9)"
                      : isDarkTheme
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.12)",
                }}
              />
            ))}
          </div>

          {/* Card Surface */}
          <div
            className={`rounded-3xl shadow-xl overflow-hidden border transition-all animate-in fade-in duration-300 ${
              isDarkTheme
                ? "bg-[#18181B] border-neutral-800 shadow-black/40 text-white"
                : "bg-white border-neutral-200/80 shadow-neutral-200/50 text-neutral-900"
            }`}
          >
            {currentCard.image_url && (
              <div className="w-full aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentCard.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-7">
              <p
                className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal"
                style={{
                  color: isDarkTheme ? "#E4E4E7" : "#1D1D1F",
                  lineHeight: 1.65,
                }}
              >
                {currentCard.text_content}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-3 mt-6 justify-center">
            {cardIndex > 0 && (
              <button
                onClick={prevCard}
                className={`px-6 py-2.5 rounded-full text-xs font-medium border transition-all ${
                  isDarkTheme
                    ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Kembali
              </button>
            )}
            <button
              onClick={nextCard}
              className={`px-8 py-2.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] shadow-sm ${
                isDarkTheme
                  ? "bg-white hover:bg-neutral-100 text-neutral-950"
                  : "bg-neutral-900 hover:bg-black text-white"
              }`}
            >
              {cardIndex < sorted.length - 1 ? "Lanjut" : "Selesai"}
            </button>
          </div>
        </div>
      )}

      {/* ── CLOSING ────────────────────────────────────────── */}
      {stage === "closing" && (
        <div className="z-10 w-full max-w-sm text-center animate-in fade-in duration-500">
          <p
            className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-2 ${
              isDarkTheme ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            Pesan Penutup
          </p>

          <h2
            className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-3 ${
              isDarkTheme ? "text-white" : "text-neutral-950"
            }`}
          >
            Selesai
          </h2>

          <p
            className={`text-sm leading-relaxed mb-7 max-w-[280px] mx-auto ${
              isDarkTheme ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {gift.closing_text}
          </p>

          {/* Reply Box */}
          <div
            className={`rounded-3xl p-6 mb-6 text-left border shadow-sm ${
              isDarkTheme
                ? "bg-[#18181B] border-neutral-800 text-white"
                : "bg-white border-neutral-200/80 text-neutral-900"
            }`}
          >
            {replySent ? (
              <p className="text-center text-xs font-medium py-3 text-emerald-600">
                Balasanmu telah tersampaikan dengan baik.
              </p>
            ) : (
              <>
                <p className="text-xs font-semibold mb-3 tracking-tight">Kirim Balasan Pesan</p>
                <Input
                  placeholder="Nama kamu"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className={`mb-2.5 text-xs h-10 rounded-xl ${
                    isDarkTheme
                      ? "bg-neutral-900 border-neutral-700 text-white"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                />
                <Textarea
                  placeholder="Tulis balasan ucapanmu di sini..."
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  className={`mb-3 text-xs rounded-xl resize-none ${
                    isDarkTheme
                      ? "bg-neutral-900 border-neutral-700 text-white"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                  rows={3}
                />
                {replyError && <p className="text-red-500 text-xs mb-2">{replyError}</p>}
                <button
                  onClick={handleReply}
                  disabled={!replyName.trim() || !replyMsg.trim()}
                  className={`w-full py-2.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] disabled:opacity-40 ${
                    isDarkTheme
                      ? "bg-white text-neutral-950 hover:bg-neutral-100"
                      : "bg-neutral-900 text-white hover:bg-black"
                  }`}
                >
                  Kirim Balasan
                </button>
              </>
            )}
          </div>

          <button
            onClick={reset}
            className={`text-xs mb-5 block mx-auto transition-colors ${
              isDarkTheme ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Putar ulang dari awal
          </button>

          {/* Viral CTA */}
          <a
            href="/buat"
            className={`block font-medium py-3 px-6 rounded-full text-xs transition-all active:scale-[0.98] shadow-sm border ${
              isDarkTheme
                ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800"
                : "bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Bikin Kado Personal Punyamu Sendiri ↗
          </a>
        </div>
      )}
    </div>
  );
}
