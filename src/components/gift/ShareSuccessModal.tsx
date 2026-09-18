"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Check, Copy, ExternalLink, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareSuccessModalProps {
  slug: string;
  recipientName?: string;
  onClose?: () => void;
}

export function ShareSuccessModal({
  slug,
  recipientName = "dia",
  onClose,
}: ShareSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setFullUrl(`${origin}/${slug}`);

    // Subtle Apple-style celebratory confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#1D1D1F", "#86868B", "#D4AF37", "#F5F5F7"],
    });
  }, [slug]);

  async function handleCopy() {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const waMessage = encodeURIComponent(
    `Hai ${recipientName}! Ada surat kado spesial buat kamu nih. Buka di sini ya:\n${fullUrl}`
  );
  const waUrl = `https://api.whatsapp.com/send?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-7 sm:p-8 w-full max-w-md shadow-2xl border border-black/[0.08] relative text-center">
        {/* Minimal Checkmark Icon */}
        <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-900 border border-neutral-200/80">
          <Check className="w-6 h-6 stroke-[2.5]" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
          Kado Berhasil Terbit
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">
          Kado Telah Siap Dibagikan
        </h2>
        <p className="text-neutral-500 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
          Tautan kado untuk <span className="font-semibold text-neutral-800">{recipientName}</span> sudah aktif permanen dan siap dikirimkan.
        </p>

        {/* Link Box */}
        <div className="bg-[#F5F5F7] border border-neutral-200/70 rounded-2xl p-3 flex items-center justify-between gap-2 mb-5">
          <span className="text-xs font-mono text-neutral-700 truncate select-all text-left pl-2">
            {fullUrl || `.../${slug}`}
          </span>
          <Button
            size="sm"
            onClick={handleCopy}
            className={`shrink-0 rounded-xl h-8 text-xs font-medium transition-all ${
              copied
                ? "bg-neutral-900 text-white hover:bg-black"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Salin
              </>
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium py-3 px-4 rounded-full text-xs transition-all active:scale-[0.98] shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            Kirim Langsung ke WhatsApp
          </a>

          <Link
            href={`/${slug}`}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-medium py-3 px-4 rounded-full text-xs transition-all active:scale-[0.98]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Halaman Kado
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <Link
            href="/dashboard"
            className="hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors"
          >
            Dasbor Kado Saya <ArrowRight className="w-3 h-3" />
          </Link>
          {onClose ? (
            <button
              onClick={onClose}
              className="hover:text-neutral-900 transition-colors"
            >
              Selesai
            </button>
          ) : (
            <Link
              href="/buat"
              onClick={() => window.location.reload()}
              className="hover:text-neutral-900 transition-colors"
            >
              Buat kado lain
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
