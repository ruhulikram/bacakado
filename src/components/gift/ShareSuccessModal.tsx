"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Check, Copy, ExternalLink, MessageCircle, ArrowRight, QrCode, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";

interface ShareSuccessModalProps {
  slug: string;
  recipientName?: string;
  onClose?: () => void;
}

type ShareTab = "link" | "qr";

export function ShareSuccessModal({
  slug,
  recipientName = "dia",
  onClose,
}: ShareSuccessModalProps) {
  const [activeTab, setActiveTab] = useState<ShareTab>("link");
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");
  const [waStyle, setWaStyle] = useState<"sweet" | "surprise">("sweet");
  const qrRef = useRef<HTMLDivElement>(null);

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
    triggerHaptic("selection");
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

  const qrImageUrl = fullUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=15&data=${encodeURIComponent(fullUrl)}`
    : "";

  const waMessages = {
    sweet: `Hai ${recipientName}! Ada surat kado spesial buat kamu nih 💌 Dengarkan alunan musik dan buka amplopnya di sini ya:\n${fullUrl}`,
    surprise: `Ada kejutan kecil menunggumu hari ini, ${recipientName} ✨ Buka amplop rahasiamu di sini ya:\n${fullUrl}`,
  };

  const currentWaMessage = waMessages[waStyle];
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentWaMessage)}`;

  function handlePrintQR() {
    triggerHaptic("medium");
    window.print();
  }

  function handleDownloadQR() {
    triggerHaptic("medium");
    if (!qrImageUrl) return;
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `QR-Kado-${recipientName}.png`;
    link.target = "_blank";
    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-black/[0.08] relative text-center max-h-[92vh] overflow-y-auto">
        {/* Aesthetic Header Icon */}
        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100 shadow-2xs">
          <IosEmoji symbol="💌" size={28} />
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-0.5">
          Kado Berhasil Terbit
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 mb-1">
          Kado Telah Siap Dibagikan
        </h2>
        <p className="text-neutral-500 text-xs mb-4 max-w-xs mx-auto leading-relaxed">
          Tautan kado untuk <span className="font-semibold text-neutral-800">{recipientName}</span> sudah aktif permanen.
        </p>

        {/* Tab Switcher: Bagikan Link vs Cetak QR Kado Fisik */}
        <div className="flex items-center bg-neutral-100/90 p-1 rounded-2xl border border-neutral-200/60 mb-5 text-xs font-medium">
          <button
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("link");
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "link"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Share2 size={13} />
            <span>Kirim Tautan</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("qr");
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "qr"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <QrCode size={13} />
            <span>Kartu QR Fisik</span>
          </button>
        </div>

        {/* ── TAB 1: KIRIM TAUTAN & WHATSAPP ─────────────────────── */}
        {activeTab === "link" && (
          <div className="animate-in fade-in duration-150">
            {/* Link Box */}
            <div className="bg-[#F5F5F7] border border-neutral-200/70 rounded-2xl p-2.5 flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-medium text-neutral-800 truncate select-all text-left pl-2">
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

            {/* WA Style Selector */}
            <div className="text-left mb-3">
              <p className="text-[11px] font-medium text-neutral-500 mb-1.5">
                Gaya Pesan WhatsApp:
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setWaStyle("sweet")}
                  className={`px-3 py-2 rounded-xl text-left border transition-all ${
                    waStyle === "sweet"
                      ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900 shadow-2xs"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  💌 Manis & Hangat
                </button>
                <button
                  type="button"
                  onClick={() => setWaStyle("surprise")}
                  className={`px-3 py-2 rounded-xl text-left border transition-all ${
                    waStyle === "surprise"
                      ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900 shadow-2xs"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  ✨ Kejutan Rahasia
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mb-5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic("medium")}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium py-3 px-4 rounded-2xl text-xs transition-all active:scale-[0.98] shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                Kirim via WhatsApp
              </a>

              <Link
                href={`/${slug}`}
                onClick={() => triggerHaptic("selection")}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-medium py-2.5 px-4 rounded-2xl text-xs transition-all active:scale-[0.98]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka Halaman Kado
              </Link>
            </div>
          </div>
        )}

        {/* ── TAB 2: KARTU QR CODE KADO FISIK ─────────────────────── */}
        {activeTab === "qr" && (
          <div className="animate-in fade-in duration-150 text-left">
            {/* Printable Gift Card Container */}
            <div
              ref={qrRef}
              className="bg-[#FAF8F5] p-4 rounded-2xl border border-neutral-200/80 shadow-xs mb-4 text-center relative overflow-hidden"
            >
              {/* Header Accent */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/60 text-[11px] font-medium text-neutral-500">
                <span>BacaKado</span>
                <span className="flex items-center gap-1 text-neutral-700">
                  <IosEmoji symbol="💌" size={12} />
                  <span>Kado digital</span>
                </span>
              </div>

              <p className="text-xs font-semibold text-neutral-800 mb-1">
                Kado Spesial untuk {recipientName}
              </p>
              <p className="text-[10px] text-neutral-500 mb-3">
                Arahkan kamera ponselmu ke kode di bawah untuk membuka surat & alunan lagu
              </p>

              {/* QR Image Box */}
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-center">
                {qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrImageUrl}
                    alt={`QR Code Kado untuk ${recipientName}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
                )}
              </div>

              <p className="text-[10px] text-neutral-500 mt-2 font-medium">
                {fullUrl ? fullUrl.replace(/^https?:\/\//, "") : ""}
              </p>
            </div>

            {/* QR Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="rounded-xl text-xs h-9 border-neutral-200 hover:bg-neutral-50 text-neutral-700 flex items-center justify-center gap-1.5"
              >
                <Download size={13} />
                <span>Unduh Gambar</span>
              </Button>
              <Button
                size="sm"
                onClick={handlePrintQR}
                className="rounded-xl text-xs h-9 bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-1.5"
              >
                <Printer size={13} />
                <span>Cetak Kartu</span>
              </Button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <Link
            href="/dashboard"
            onClick={() => triggerHaptic("selection")}
            className="hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors"
          >
            Dasbor Kado Saya <ArrowRight className="w-3 h-3" />
          </Link>
          {onClose ? (
            <button
              onClick={() => {
                triggerHaptic("selection");
                onClose();
              }}
              className="hover:text-neutral-900 transition-colors font-medium"
            >
              Tutup
            </button>
          ) : (
            <Link
              href="/buat"
              onClick={() => {
                triggerHaptic("selection");
                window.location.reload();
              }}
              className="hover:text-neutral-900 transition-colors"
            >
              Buat kado baru
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

