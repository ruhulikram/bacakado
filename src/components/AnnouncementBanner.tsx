"use client";

import { useState } from "react";
import { triggerHaptic } from "@/lib/haptics";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { X, Send, Sparkles, CheckCircle2 } from "lucide-react";

export function AnnouncementBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenModal() {
    triggerHaptic("medium");
    setIsSubmitted(false);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    triggerHaptic("light");
    setIsModalOpen(false);
  }

  async function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;

    triggerHaptic("medium");
    setIsSubmitting(true);

    // Simulate sending feedback or logging
    try {
      // You can wire this to a Supabase table or webhook when ready
      console.log("[Feedback Submitted]:", {
        feedback: feedback.trim(),
        contact: contact.trim() || "Anonim",
        timestamp: new Date().toISOString(),
      });
      await new Promise((r) => setTimeout(r, 600));
      setIsSubmitted(true);
      triggerHaptic("success");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Top Announcement Banner Strip (Figma Exact 1440x70) ─── */}
      <aside
        aria-label="Pengumuman BacaKado"
        className="relative w-full h-auto min-h-[70px] sm:h-[70px] overflow-hidden select-none border-b border-black/[0.06]"
        style={{
          background:
            "linear-gradient(269.51deg, rgba(0, 0, 0, 0.6) 10.22%, rgba(102, 102, 102, 0.6) 28.74%, rgba(191, 180, 180, 0.6) 32.41%), linear-gradient(90.29deg, #B8A4A4 7.27%, #F1DEDE 56.54%, #F4F3F3 93.83%)",
        }}
      >
        {/* Frame 20 background texture with masked diagonal stripes */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Banner/Frame%2020.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Content Container: Matches Figma Grid (Left: 35px, Right: 1188px, Height: 70px) */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto min-h-[70px] sm:h-[70px] px-4 sm:pl-[30px] sm:pr-[85px] py-2.5 sm:py-0 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2.5 sm:gap-0">
          {/* Left Element: Button Tahap Pengembangan (359x38 pill at left: 35px, top: 16px) */}
          <div className="flex-shrink-0 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Banner/Button%20Tahap%20Pengembangan.svg"
              alt="BacaKado masih tahap pengembangan"
              className="w-[300px] xs:w-[335px] sm:w-[373px] h-auto object-contain pointer-events-none drop-shadow-sm"
            />
          </div>

          {/* Right Element: Button Beri Masukan (167x38 pill at left: 1188px, top: 16px) */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="group flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl transition-all duration-150 active:scale-95 hover:scale-[1.02]"
            aria-label="Beri Masukan untuk BacaKado"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Banner/Button%20Beri%20Masukan.svg"
              alt="Beri Masukan"
              className="w-[145px] sm:w-[167px] h-auto object-contain transition-all duration-150 group-hover:brightness-110 drop-shadow-sm"
            />
          </button>
        </div>
      </aside>

      {/* ── Apple-Grade Feedback Modal ──────────────────────────── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/[0.08] text-neutral-900 animate-slide-up"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
              aria-label="Tutup modal"
            >
              <X size={16} />
            </button>

            {!isSubmitted ? (
              <>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-2xl bg-neutral-100 flex items-center justify-center">
                    <IosEmoji symbol="💡" size={20} />
                  </div>
                  <div>
                    <h2
                      id="feedback-dialog-title"
                      className="text-lg font-semibold tracking-tight text-neutral-950"
                    >
                      Beri Masukan
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Bantu kami menyempurnakan BacaKado
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mt-2 mb-5">
                  BacaKado saat ini masih dalam tahap pengembangan aktif. Jika kamu punya ide fitur, menemukan kendala, atau ingin memberi saran, kami sangat senang mendengarnya!
                </p>

                <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="feedback-message"
                      className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1"
                    >
                      Pesan atau Saran
                    </label>
                    <textarea
                      id="feedback-message"
                      rows={4}
                      required
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Contoh: Tambah variasi musik santai, atau opsi amplop warna pastel..."
                      className="w-full text-xs sm:text-sm rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feedback-contact"
                      className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1"
                    >
                      Nama / Kontak Kamu (Opsional)
                    </label>
                    <input
                      id="feedback-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Misal: Ikram / @username / 0812..."
                      className="w-full text-xs sm:text-sm rounded-2xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="flex-1 bg-neutral-900 hover:bg-black disabled:opacity-50 text-white text-xs sm:text-sm font-medium py-3 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? "Mengirim..." : "Kirim Masukan"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-950 mb-1">
                  Terima kasih banyak!
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto mb-6">
                  Masukan berhargamu telah kami catat untuk pengembangan BacaKado selanjutnya.
                </p>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-full transition-all active:scale-[0.98]"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
