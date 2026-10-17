"use client";

import { useState, useEffect } from "react";
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
  Edit3,
  Search,
  X,
} from "lucide-react";
import { UserGift, Reply } from "@/lib/types";
import { getTheme } from "@/lib/mock-data";
import { deleteGift } from "@/app/actions/gift";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";

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
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [localDraft, setLocalDraft] = useState<{
    recipientName?: string;
    theme?: string;
    cardsCount?: number;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bacakado_custom_studio_draft_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.recipientName || parsed.cards?.length > 1 || parsed.openingText)) {
          setLocalDraft({
            recipientName: parsed.recipientName || "Seseorang",
            theme: parsed.theme || "ucapan",
            cardsCount: parsed.cards?.length || 1,
          });
        }
      }
    } catch {}
  }, []);

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

  async function handleCopyQuote(quote: string, id: string) {
    try {
      await navigator.clipboard.writeText(quote);
      setCopiedQuoteId(id);
      setTimeout(() => setCopiedQuoteId(null), 2000);
    } catch {}
  }

  const publishedCount = gifts.filter((g) => g.status === "published").length;
  const draftCount = gifts.filter((g) => g.status === "draft").length;

  const filteredGifts = gifts.filter((g) => {
    if (statusFilter === "published" && g.status !== "published") return false;
    if (statusFilter === "draft" && g.status !== "draft") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.recipient_name?.toLowerCase().includes(q);
      const matchTheme = g.theme?.toLowerCase().includes(q);
      if (!matchName && !matchTheme) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/60 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="font-bold text-neutral-900 text-lg sm:text-xl tracking-tight flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <IosEmoji symbol="💌" size={22} />
              <span>BacaKado</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 xs:gap-3">
            <Link href="/buat">
              <Button
                size="sm"
                className="bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-semibold shadow-sm h-8 xs:h-9 px-3 xs:px-4 transition-all active:scale-95 flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span className="hidden xs:inline">Bikin kado baru</span>
                <span className="xs:hidden">Bikin kado</span>
              </Button>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
              title="Keluar akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] pt-6 sm:pt-8">
        {/* Profile & Greeting */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
              <span>Kado Saya</span>
              <IosEmoji symbol="🎁" size={24} />
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Masuk sebagai <span className="font-medium text-neutral-800">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-neutral-100 rounded-xl">
                <IosEmoji symbol="🎁" size={16} />
              </div>
              <span className="text-xs font-medium text-neutral-500 hidden sm:inline">
                Kado Dibuat
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums">
              {gifts.length}
            </p>
            <span className="text-[11px] text-neutral-400 sm:hidden">Kado</span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-neutral-100 rounded-xl">
                <IosEmoji symbol="👁️" size={16} />
              </div>
              <span className="text-xs font-medium text-neutral-500 hidden sm:inline">
                Total Dibuka
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums">
              {totalViews}
            </p>
            <span className="text-[11px] text-neutral-400 sm:hidden">Dilihat</span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-neutral-100 rounded-xl">
                <IosEmoji symbol="💌" size={16} />
              </div>
              <span className="text-xs font-medium text-neutral-500 hidden sm:inline">
                Balasan Masuk
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums">
              {allReplies.length}
            </p>
            <span className="text-[11px] text-neutral-400 sm:hidden">Balasan</span>
          </div>
        </div>

        {/* ── Spotlight: Draf di Browser Lokal ───────────────── */}
        {localDraft && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-neutral-200/80 flex items-center justify-center shrink-0">
                <IosEmoji symbol="🎨" size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 px-2.5 py-0.5 rounded-full">
                    Draf di perangkat ini
                  </span>
                  <span className="text-xs text-neutral-400">• Belum diterbitkan</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mt-1">
                  Kado untuk {localDraft.recipientName} ({localDraft.cardsCount} kartu)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Draf kado ini tersimpan otomatis di perangkatmu dan siap dilanjutkan di Custom Studio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/buat">
                <Button
                  size="sm"
                  className="bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-semibold px-4 h-9 shadow-xs transition-all active:scale-95"
                >
                  <span>Lanjutkan di Studio</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("bacakado_custom_studio_draft_v2");
                  setLocalDraft(null);
                }}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white/80 rounded-full transition-colors text-xs"
                title="Abaikan draf ini"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("kado")}
            className={`pb-3 text-xs sm:text-sm font-semibold relative transition-colors ${
              activeTab === "kado"
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Daftar Kado ({gifts.length})
            {activeTab === "kado" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("balasan")}
            className={`pb-3 text-xs sm:text-sm font-semibold relative transition-colors flex items-center gap-1.5 ${
              activeTab === "balasan"
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Pesan Balasan ({allReplies.length})
            {allReplies.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
            {activeTab === "balasan" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content: Kado Saya */}
        {activeTab === "kado" && (
          <div>
            {/* Search & Status Filter Bar */}
            {gifts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs self-start">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      statusFilter === "all"
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Semua ({gifts.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                      statusFilter === "published"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-emerald-700"
                    }`}
                  >
                    <span>Terbit ({publishedCount})</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                      statusFilter === "draft"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-amber-700"
                    }`}
                  >
                    <span>Draf ({draftCount})</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Cari penerima atau tema..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-xs pl-8 pr-7 py-2 rounded-2xl border border-neutral-200/80 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs placeholder:text-neutral-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {gifts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-neutral-300 max-w-md mx-auto my-6">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
                  <IosEmoji symbol="💌" size={36} />
                </div>
                <h3 className="font-serif italic text-2xl font-medium text-neutral-900 mb-1">
                  Belum ada kado digital
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm mb-6">
                  Buat website kado spesial untuk orang tersayang dalam 5 menit langsung dari HP!
                </p>
                <Link href="/buat">
                  <Button className="bg-neutral-900 hover:bg-black text-white rounded-full px-6 text-xs font-semibold h-10 shadow-sm transition-all active:scale-95">
                    <span>Bikin kado</span>
                    <IosEmoji symbol="✨" size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200/80 max-w-md mx-auto my-6 shadow-xs">
                <IosEmoji symbol="🔍" size={32} className="mx-auto mb-2" />
                <h3 className="font-semibold text-neutral-800 text-sm mb-1">
                  Kado tidak ditemukan
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Tidak ada kado yang cocok dengan kriteria filter atau pencarian Anda.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="rounded-full text-xs font-medium"
                >
                  Reset Filter & Pencarian
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredGifts.map((gift) => {
                  const theme = getTheme(gift.theme);
                  const isOpened = gift.view_count > 0;
                  const replyCount = gift.replies?.length || 0;
                  const coverCard = gift.cards?.find((c) => c.image_url);

                  return (
                    <div
                      key={gift.id}
                      className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Top Header Card */}
                      <div className="p-5 sm:p-6">
                        {/* Cover Image Preview if Available */}
                        {coverCard?.image_url && (
                          <div className="mb-3.5 h-32 w-full rounded-2xl overflow-hidden bg-neutral-100 relative group-hover:scale-101 transition-transform">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={coverCard.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <span className="absolute bottom-2 left-2 text-[10px] text-white font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <IosEmoji symbol="📷" size={11} />
                              <span>{gift.cards.length} kartu cerita</span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${theme.gradient}`}
                          >
                            {theme.label}
                          </span>

                          {/* Monetization / Publication Status */}
                          {gift.status === "published" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                              <IosEmoji symbol="✨" size={11} />
                              <span>Lunas & Terbit</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                              <Clock size={11} />
                              <span>Menunggu Bayar</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif italic text-xl font-medium text-neutral-900 mb-1 truncate">
                          Untuk {gift.recipient_name}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                          <span>Dibuat {formatDate(gift.created_at)}</span>
                          {isOpened ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <Eye size={12} />
                              <span>Dibuka {gift.view_count}x</span>
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">Belum dibuka</span>
                          )}
                        </div>

                        <div className="bg-[#FAF8F5] rounded-2xl p-3.5 text-xs text-neutral-600 space-y-1.5 border border-neutral-200/60">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400 flex items-center gap-1.5">
                              <IosEmoji symbol="📷" size={13} />
                              <span>Jumlah kartu:</span>
                            </span>
                            <span className="font-semibold text-neutral-700">
                              {gift.cards?.length || 0} kartu
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400 flex items-center gap-1.5">
                              <IosEmoji symbol="💌" size={13} />
                              <span>Balasan masuk:</span>
                            </span>
                            <span className="font-semibold text-rose-600">
                              {replyCount} pesan
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="px-5 py-3.5 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Edit in Studio Button */}
                          <Link
                            href={`/buat?edit=${gift.slug}`}
                            className="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 transition-all text-xs flex items-center gap-1 shadow-2xs font-medium"
                            title="Edit kado ini di Custom Studio"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[11px] hidden sm:inline">Edit</span>
                          </Link>

                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopy(gift.slug, gift.id)}
                            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 transition-all text-xs flex items-center gap-1 shadow-2xs"
                            title="Salin Link Kado"
                          >
                            {copiedId === gift.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[11px] text-emerald-600 font-semibold">
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
                            className="p-2 rounded-xl text-[#25D366] hover:bg-white border border-transparent hover:border-neutral-200 transition-all text-xs shadow-2xs"
                            title="Kirim ke WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* View Gift */}
                          <Link
                            href={`/${gift.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 transition-all text-xs shadow-2xs"
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
                                className="px-2 py-1 text-neutral-500 hover:text-neutral-700 text-[11px]"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(gift.id)}
                              className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
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
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-neutral-300 max-w-md mx-auto my-6">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
                  <IosEmoji symbol="💕" size={36} />
                </div>
                <h3 className="font-serif italic text-2xl font-medium text-neutral-900 mb-1">
                  Belum ada balasan ucapan
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm">
                  Ketika penerima kado membuka amplop dan mengirim pesan balasan dari halaman penutup, pesannya akan langsung tercatat di sini!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl">
                {allReplies.map(({ reply, gift }) => (
                  <div
                    key={reply.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs hover:border-rose-200 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 flex items-center justify-center font-bold text-sm shadow-inner border border-rose-200/60">
                          {reply.sender_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">
                            {reply.sender_name}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Balasan untuk kado:{" "}
                            <Link
                              href={`/${gift.slug}`}
                              target="_blank"
                              className="font-medium text-rose-600 hover:underline"
                            >
                              {gift.recipient_name}
                            </Link>
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-neutral-400 sm:text-right">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 rounded-2xl p-4 border border-rose-100 text-sm text-neutral-800 italic relative shadow-inner">
                      &ldquo;<EmojiText text={reply.message} size={16} />&rdquo;
                    </div>

                    {/* Reply Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() =>
                          handleCopyQuote(
                            `"${reply.message}" · ${reply.sender_name} (Balasan untuk ${gift.recipient_name})`,
                            reply.id
                          )
                        }
                        className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors text-[11px] font-medium"
                      >
                        {copiedQuoteId === reply.id ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Kutipan Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Salin Kutipan</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Makasih banyak atas ucapannya, ${reply.sender_name}! ❤️ Seneng banget kamu suka kado digitalnya.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                        title="Kirim pesan terima kasih ke WhatsApp"
                      >
                        <MessageCircle size={14} />
                        <span>Kirim Terima Kasih</span>
                      </a>
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
