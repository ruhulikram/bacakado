"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift as GiftIcon,
  Eye,
  MessageSquareHeart,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Trash2,
  Plus,
  LogOut,
  Sparkles,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import { UserGift, Reply } from "@/lib/types";
import { getTheme } from "@/lib/mock-data";
import { deleteGift } from "@/app/actions/gift";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface DashboardClientProps {
  userEmail: string;
  initialGifts: UserGift[];
}

export function DashboardClient({
  userEmail,
  initialGifts,
}: DashboardClientProps) {
  const router = useRouter();
  const [gifts, setGifts] = useState<UserGift[]>(initialGifts);
  const [activeTab, setActiveTab] = useState<"kado" | "balasan">("kado");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Compute aggregated stats
  const totalViews = gifts.reduce((acc, g) => acc + (g.view_count || 0), 0);
  const allReplies: { reply: Reply; gift: UserGift }[] = gifts.flatMap((g) =>
    (g.replies || []).map((r) => ({ reply: r, gift: g }))
  );
  allReplies.sort(
    (a, b) =>
      new Date(b.reply.created_at).getTime() -
      new Date(a.reply.created_at).getTime()
  );

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleCopy(slug: string, giftId: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(giftId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(giftId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  async function handleDelete(giftId: string) {
    setDeletingId(giftId);
    const res = await deleteGift(giftId);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
    } else {
      alert(res.error || "Gagal menghapus kado");
    }
  }

  function getWhatsAppShareUrl(slug: string, recipientName: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${slug}`;
    const text = encodeURIComponent(
      `Hai ${recipientName}! Ada surat kado spesial buat kamu nih 💌 Buka di sini ya:\n${url}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-bold text-gray-900 text-xl tracking-tight flex items-center gap-1.5"
            >
              <span className="text-xl">💌</span>
              <span>BacaKado</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-100 hidden sm:inline-block">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/buat">
              <Button
                size="sm"
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Bikin Kado Baru
              </Button>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Keluar akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Profile & Greeting */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Kado Saya 🎁
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Masuk sebagai <span className="font-medium text-gray-700">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2.5 text-pink-600 mb-2">
              <div className="p-2 bg-pink-50 rounded-xl">
                <GiftIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Kado Dibuat
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {gifts.length}
            </p>
            <span className="text-[11px] text-gray-400 sm:hidden">Kado</span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2.5 text-purple-600 mb-2">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Total Dibuka
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {totalViews}
            </p>
            <span className="text-[11px] text-gray-400 sm:hidden">Dilihat</span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-600 mb-2">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Balasan Masuk
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {allReplies.length}
            </p>
            <span className="text-[11px] text-gray-400 sm:hidden">Balasan</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("kado")}
            className={`pb-3 text-sm font-semibold relative transition-colors ${
              activeTab === "kado"
                ? "text-pink-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Daftar Kado ({gifts.length})
            {activeTab === "kado" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("balasan")}
            className={`pb-3 text-sm font-semibold relative transition-colors flex items-center gap-1.5 ${
              activeTab === "balasan"
                ? "text-pink-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pesan Balasan ({allReplies.length})
            {allReplies.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500" />
            )}
            {activeTab === "balasan" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content: Kado Saya */}
        {activeTab === "kado" && (
          <div>
            {gifts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300 max-w-md mx-auto my-6">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Belum ada kado digital
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Buat website kado spesial untuk orang tersayang dalam 5 menit langsung dari HP!
                </p>
                <Link href="/buat">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
                    Bikin Kado Sekarang ✨
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {gifts.map((gift) => {
                  const theme = getTheme(gift.theme);
                  const isOpened = gift.view_count > 0;
                  const replyCount = gift.replies?.length || 0;

                  return (
                    <div
                      key={gift.id}
                      className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Header Card */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${theme.gradient}`}
                          >
                            {theme.label}
                          </span>

                          {/* View Status Pill */}
                          {isOpened ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Dibuka {gift.view_count}x
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Belum dibuka
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                          Untuk {gift.recipient_name}
                        </h3>

                        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                          Dibuat {formatDate(gift.created_at)}
                        </p>

                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Jumlah kartu:</span>
                            <span className="font-medium text-gray-700">
                              {gift.cards?.length || 0} kartu
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Balasan masuk:</span>
                            <span className="font-medium text-pink-600">
                              {replyCount} pesan
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopy(gift.slug, gift.id)}
                            className="p-2 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs flex items-center gap-1"
                            title="Salin Link Kado"
                          >
                            {copiedId === gift.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-[11px] text-green-600 font-medium">
                                  Tersalin!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium hidden sm:inline">
                                  Salin
                                </span>
                              </>
                            )}
                          </button>

                          {/* Share WhatsApp */}
                          <a
                            href={getWhatsAppShareUrl(
                              gift.slug,
                              gift.recipient_name
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-[#25D366] hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs"
                            title="Kirim ke WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* View Gift */}
                          <Link
                            href={`/${gift.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs"
                            title="Buka Halaman Kado"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>

                        {/* Delete Button */}
                        <div>
                          {confirmDeleteId === gift.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(gift.id)}
                                disabled={deletingId === gift.id}
                                className="px-2 py-1 bg-red-600 text-white rounded-lg text-[11px] font-medium hover:bg-red-700 transition-colors"
                              >
                                {deletingId === gift.id ? "..." : "Ya, Hapus"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700 text-[11px]"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(gift.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                              title="Hapus kado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Kotak Masuk Balasan */}
        {activeTab === "balasan" && (
          <div>
            {allReplies.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300 max-w-md mx-auto my-6">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Belum ada balasan ucapan
                </h3>
                <p className="text-gray-500 text-sm">
                  Ketika penerima kado membuka amplop dan mengirim pesan balasan dari halaman penutup, pesannya akan langsung tercatat di sini! 💌
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl">
                {allReplies.map(({ reply, gift }) => (
                  <div
                    key={reply.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-pink-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                          {reply.sender_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {reply.sender_name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Membalas kado untuk:{" "}
                            <Link
                              href={`/${gift.slug}`}
                              target="_blank"
                              className="font-medium text-pink-600 hover:underline"
                            >
                              {gift.recipient_name}
                            </Link>
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-gray-400 sm:text-right">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>

                    <div className="bg-pink-50/40 rounded-xl p-3.5 border border-pink-100 text-sm text-gray-700 italic relative">
                      &ldquo;{reply.message}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
