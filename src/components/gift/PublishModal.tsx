"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { publishGift, DraftGift } from "@/app/actions/gift";
import { initiatePayment, checkPaymentStatus } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DRAFT_KEY = "kadoin_pending_draft";

interface Props {
  draft: DraftGift;
  onClose: () => void;
  onPublished: (slug: string) => void;
}

type ModalStage = "checkout" | "auth" | "payment_wait";
type AuthTab = "daftar" | "masuk";

export function PublishModal({ draft, onClose, onPublished }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [stage, setStage] = useState<ModalStage>("checkout");
  const [passcode, setPasscode] = useState("");
  const [currentUser, setCurrentUser] = useState<unknown | null>(null);

  // Auth states
  const [tab, setTab] = useState<AuthTab>("daftar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Payment states
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [activeGiftId, setActiveGiftId] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Check user session on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [supabase]);

  // Handler saat user klik tombol "Lanjut Bayar"
  async function handleProceedToPayment() {
    setError("");
    const updatedDraft: DraftGift = {
      ...draft,
      isPremium: true,
      passcode: passcode.trim() ? passcode.trim() : undefined,
    };

    if (!currentUser) {
      setStage("auth");
      return;
    }

    await executePublish(updatedDraft);
  }

  // Eksekusi inisiasi kado & invoice Mayar
  async function executePublish(currentDraft: DraftGift) {
    setLoading(true);
    setError("");

    // 1. Simpan kado sebagai draft terlebih dahulu
    const pubRes = await publishGift(currentDraft, { isDraftOnly: true });
    if (pubRes.error || !pubRes.giftId) {
      setError(pubRes.error || "Gagal menyiapkan kado");
      setLoading(false);
      return;
    }

    setActiveGiftId(pubRes.giftId);
    setActiveSlug(pubRes.slug || null);

    // 2. Buat invoice pembayaran Mayar
    const payRes = await initiatePayment({
      giftId: pubRes.giftId,
      recipientName: currentDraft.recipientName,
      passcode: currentDraft.passcode,
    });

    if (payRes.error || !payRes.paymentUrl) {
      setError(payRes.error || "Gagal membuat tagihan pembayaran Mayar");
      setLoading(false);
      return;
    }

    setPaymentUrl(payRes.paymentUrl);
    setLoading(false);
    setStage("payment_wait");

    // Buka link invoice Mayar di tab baru
    window.open(payRes.paymentUrl, "_blank");

    // Mulai polling status pembayaran tiap 2.5 detik
    startPaymentPolling(pubRes.giftId, pubRes.slug || "");
  }

  // Polling cek status bayar
  function startPaymentPolling(giftId: string, slug: string) {
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      const res = await checkPaymentStatus(giftId);
      if (res.isPaid) {
        if (pollInterval.current) clearInterval(pollInterval.current);
        onPublished(res.slug || slug);
      }
    }, 2500);
  }

  // Cek manual tombol "Saya Sudah Bayar"
  async function handleManualCheck() {
    if (!activeGiftId) return;
    setLoading(true);
    const res = await checkPaymentStatus(activeGiftId);
    setLoading(false);
    if (res.isPaid) {
      if (pollInterval.current) clearInterval(pollInterval.current);
      onPublished(res.slug || activeSlug || "");
    } else {
      setError("Pembayaran belum terdeteksi. Silakan selesaikan scan QRIS terlebih dahulu.");
    }
  }

  // Handle Login / Registrasi Email
  async function handleEmailAuth() {
    setError("");
    setLoading(true);
    const fn =
      tab === "daftar"
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

    const { data, error: authErr } = await fn;
    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    setCurrentUser(data.user);
    const updatedDraft: DraftGift = {
      ...draft,
      isPremium: true,
      passcode: passcode.trim() ? passcode.trim() : undefined,
    };
    await executePublish(updatedDraft);
  }

  // Handle Login Google
  async function handleGoogleAuth() {
    const updatedDraft: DraftGift = {
      ...draft,
      isPremium: true,
      passcode: passcode.trim() ? passcode.trim() : undefined,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDraft));
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/buat?publish=1`,
      },
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl border border-black/[0.08] relative">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs transition-colors"
        >
          ✕
        </button>

        {/* ── STAGE 1: APPLE-STYLE CHECKOUT SHEET ─────────────────── */}
        {stage === "checkout" && (
          <div>
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Aktivasi Kado
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Ringkasan Penerbitan
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Kado untuk <span className="font-semibold text-neutral-800">{draft.recipientName}</span>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#F5F5F7] rounded-2xl p-5 mb-5 border border-neutral-200/60">
              <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-neutral-200/80">
                <div>
                  <h3 className="font-medium text-neutral-900 text-sm">Akses Kado Digital</h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Aktif permanen, tanpa batas waktu</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-semibold tracking-tight text-neutral-900">Rp 4.000</span>
                  <span className="text-[10px] block text-neutral-400">sekali bayar</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 text-sm">✓</span>
                  <span>Semua kartu foto & teks ucapan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 text-sm">✓</span>
                  <span>Tautan pribadi & bebas dari tanda air</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 text-sm">✓</span>
                  <span>Pemutaran audio otomatis beresolusi penuh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 text-sm">✓</span>
                  <span>Penerima dapat mengirim balasan langsung</span>
                </div>
              </div>

              {/* Input PIN Rahasia (Opsional) */}
              <div className="mt-4 pt-4 border-t border-neutral-200/80">
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Proteksi Kunci PIN (Opsional)
                </label>
                <Input
                  type="text"
                  maxLength={8}
                  placeholder="Contoh: 2410 atau tanggal spesial"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-white rounded-xl text-xs h-10 border-neutral-200 focus-visible:ring-neutral-900 focus-visible:border-neutral-900"
                />
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Bila diisi, penerima wajib memasukkan kode ini sebelum amplop terbuka.
                </p>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

            <Button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full h-12 font-medium text-sm transition-all active:scale-[0.98] shadow-sm"
            >
              {loading ? "Menyiapkan Tagihan..." : "Lanjut Bayar Rp 4.000 via QRIS"}
            </Button>

            <p className="text-[11px] text-neutral-400 text-center mt-3">
              Mendukung semua e-wallet & aplikasi perbankan melalui QRIS Mayar
            </p>
          </div>
        )}

        {/* ── STAGE 2: APPLE-STYLE AUTHENTIKASI ────────────────────── */}
        {stage === "auth" && (
          <div>
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-1">
                Langkah Terakhir
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Masuk ke Akun
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Agar kado dan tautanmu tersimpan dengan aman di dasbor.
              </p>
            </div>

            {/* Apple Segmented Control */}
            <div className="flex bg-neutral-100 p-1 rounded-full mb-5">
              {(["daftar", "masuk"] as AuthTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${
                    tab === t ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {t === "daftar" ? "Daftar Akun" : "Masuk"}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-4">
              <Input
                type="email"
                placeholder="Alamat email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl text-xs h-11 border-neutral-200 focus-visible:ring-neutral-900"
              />
              <Input
                type="password"
                placeholder="Kata sandi (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl text-xs h-11 border-neutral-200 focus-visible:ring-neutral-900"
                onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}

            <Button
              onClick={handleEmailAuth}
              disabled={loading || !email || password.length < 6}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full h-11 text-xs font-medium mb-3 transition-all active:scale-[0.98]"
            >
              {loading ? "Memproses..." : tab === "daftar" ? "Daftar & Lanjut Bayar" : "Masuk & Lanjut Bayar"}
            </Button>

            <div className="relative flex items-center my-4">
              <div className="flex-1 border-t border-neutral-200/80" />
              <span className="px-3 text-neutral-400 text-[11px]">atau</span>
              <div className="flex-1 border-t border-neutral-200/80" />
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full border border-neutral-200/90 hover:border-neutral-300 rounded-full h-11 text-xs font-medium text-neutral-700 flex items-center justify-center gap-2.5 transition-colors hover:bg-neutral-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Lanjutkan dengan Google
            </button>

            <button
              onClick={() => setStage("checkout")}
              className="mt-4 text-neutral-400 text-xs block mx-auto hover:text-neutral-700 transition-colors"
            >
              ← Kembali ke rincian
            </button>
          </div>
        )}

        {/* ── STAGE 3: APPLE-STYLE WAITING FOR PAYMENT ─────────────── */}
        {stage === "payment_wait" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin mx-auto mb-5" />

            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-1">
              Menunggu Konfirmasi Pembayaran
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Total tagihan: <span className="font-semibold text-neutral-900">Rp 4.000</span>
            </p>

            <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-5 text-xs text-left text-neutral-600 border border-neutral-200/60 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-medium text-neutral-800">Sistem mendeteksi transaksi otomatis</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Jendela pembayaran Mayar telah dibuka di tab baru. Jika tertutup, klik tombol di bawah:
              </p>
              {paymentUrl && (
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white border border-neutral-200/90 text-neutral-900 font-medium py-2 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Buka Halaman Pembayaran QRIS ↗
                </a>
              )}
            </div>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <Button
              onClick={handleManualCheck}
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full h-11 text-xs font-medium mb-2 transition-all active:scale-[0.98]"
            >
              {loading ? "Memeriksa Status..." : "Saya Sudah Bayar (Cek Sekarang)"}
            </Button>

            <button
              onClick={() => {
                if (pollInterval.current) clearInterval(pollInterval.current);
                setStage("checkout");
              }}
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors mt-2"
            >
              Batal atau ubah rincian kado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook untuk menangani redirect dari OAuth Google
export function usePendingPublish(
  onPublished?: (slug: string, draft: DraftGift) => void
) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.get("publish")) return;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    localStorage.removeItem(DRAFT_KEY);

    const draft: DraftGift = JSON.parse(raw);
    publishGift(draft).then(({ slug, error }) => {
      if (slug) {
        if (onPublished) {
          onPublished(slug, draft);
        } else {
          router.push(`/${slug}`);
        }
      } else {
        console.error("publish failed:", error);
      }
    });
  }, [router, onPublished]);
}
