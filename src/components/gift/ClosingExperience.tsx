"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, Send, RotateCcw, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitReply } from "@/app/actions/tracking";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";

interface ClosingExperienceProps {
  giftId: string;
  recipientName: string;
  closingText: string;
  onReset: () => void;
  isDark?: boolean;
}

export function ClosingExperience({
  giftId,
  recipientName,
  closingText,
  onReset,
  isDark = false,
}: ClosingExperienceProps) {
  const [loveCount, setLoveCount] = useState(0);
  const [replyName, setReplyName] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Grand celebration confetti burst on mount
  useEffect(() => {
    // Initial burst
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F43F5E", "#FB7185", "#FDE047", "#F59E0B", "#FFFFFF"],
    });

    // Secondary delayed burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#BE123C", "#E11D48", "#FEF08A", "#D97706"],
      });
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  function handleSendLove() {
    triggerHaptic("burst");
    setLoveCount((c) => c + 1);
    confetti({
      particleCount: 18,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#F43F5E", "#E11D48", "#FDA4AF"],
    });
  }

  async function handleSendReply() {
    if (!replyName.trim() || !replyMsg.trim() || submitting) return;
    setSubmitting(true);
    setReplyError("");
    const res = await submitReply(giftId, replyName, replyMsg);
    setSubmitting(false);
    if (res.error) {
      triggerHaptic("error");
      setReplyError(res.error);
    } else {
      triggerHaptic("success");
      setReplySent(true);
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#34D399", "#FDE047"],
      });
    }
  }

  return (
    <div className="z-10 w-full max-w-sm sm:max-w-md mx-auto select-none px-2 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Badge */}
      <div className="text-center mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs">
          <Sparkles size={12} />
          <span>Momen Penutup</span>
        </span>
      </div>

      {/* Heartfelt Closing Letter Card */}
      <div className="polaroid-frame rounded-3xl p-6 sm:p-7 text-center mb-6 relative overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl mx-auto mb-3 shadow-2xs">
          <IosEmoji symbol="💌" size={26} />
        </div>

        <h2 className="font-serif italic text-2xl sm:text-3xl text-neutral-900 mb-3">
          Untuk {recipientName} Tercinta
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-neutral-800 leading-relaxed whitespace-pre-wrap px-2 mb-6">
          &ldquo;<EmojiText text={closingText} size={18} />&rdquo;
        </p>

        {/* Interactive "Kirim Peluk / Cinta" Reaction Button */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col items-center">
          <p className="text-[11px] text-neutral-400 mb-2 font-medium">
            Kirim pelukan & tanda cinta untuk pengirim
          </p>
          <button
            onClick={handleSendLove}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-all active:scale-95 btn-apple-spring shadow-2xs"
          >
            <Heart size={15} className={`fill-rose-500 transition-transform ${loveCount > 0 ? "scale-110" : ""}`} />
            <span>Kirim Peluk & Cinta</span>
            {loveCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                +{loveCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Postcard Reply Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-neutral-200/80 shadow-md mb-6">
        {replySent ? (
          <div className="text-center py-4 animate-in fade-in">
            <IosEmoji symbol="🎉" size={36} className="block mx-auto mb-2" />
            <h4 className="font-semibold text-sm text-neutral-900 mb-1">
              Surat Balasanmu Terkirim!
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-[260px] mx-auto">
              Pengirim kado ini akan sangat bahagia membaca pesan manis darimu di dasbor mereka.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <IosEmoji symbol="✍️" size={15} />
                <h4 className="font-semibold text-xs tracking-tight text-neutral-900">
                  Tulis Balasan untuk Pengirim
                </h4>
              </div>
              <span className="text-[10px] text-neutral-400 font-medium">Kartu Pos</span>
            </div>

            <Input
              placeholder="Nama kamu (misal: Rara)"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              className="text-xs h-10 rounded-xl mb-2.5 border-neutral-200 focus-visible:ring-rose-500"
            />

            <Textarea
              placeholder="Tuliskan isi balasan ucapan atau perasaanmu..."
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              rows={3}
              className="text-xs rounded-xl mb-3 resize-none border-neutral-200 focus-visible:ring-rose-500"
            />

            {replyError && (
              <p className="text-xs text-rose-500 mb-2 font-medium">{replyError}</p>
            )}

            <button
              onClick={handleSendReply}
              disabled={submitting || !replyName.trim() || !replyMsg.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-all active:scale-95 btn-apple-spring disabled:opacity-40 shadow-xs"
            >
              <Send size={12} />
              <span>{submitting ? "Mengirim Surat..." : "Kirim Surat Balasan"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Links */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => {
            triggerHaptic("selection");
            onReset();
          }}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-medium transition-colors btn-apple-spring"
        >
          <RotateCcw size={12} />
          <span>Buka & Putar Ulang Kado dari Awal</span>
        </button>

        {/* Viral Loop CTA */}
        <a
          href="/buat"
          onClick={() => triggerHaptic("light")}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 shadow-md transition-all active:scale-98 btn-apple-spring group"
        >
          <Sparkles size={14} className="text-amber-200 animate-spin-slow" />
          <span>Bikin Kado Personal Punyamu Sendiri</span>
          <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
        </a>
      </div>
    </div>
  );
}
