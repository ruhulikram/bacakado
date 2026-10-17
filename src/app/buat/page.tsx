"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Theme, Card, Gift } from "@/lib/types";
import { THEME_OPTIONS, MUSIC_OPTIONS, GALLERY_MOCK } from "@/lib/mock-data";
import { DraftGift, getGiftForEdit, updateGift } from "@/app/actions/gift";
import { checkPaymentStatus } from "@/app/actions/payment";
import { PublishModal, usePendingPublish } from "@/components/gift/PublishModal";
import { ShareSuccessModal } from "@/components/gift/ShareSuccessModal";
import { youtubeId } from "@/lib/utils";

// Custom Studio Components
import { StudioThemeGate } from "@/components/studio/StudioThemeGate";
import { StudioHeader, StudioStage } from "@/components/studio/StudioHeader";
import { StudioLeftDrawer } from "@/components/studio/StudioLeftDrawer";
import { StudioCanvas } from "@/components/studio/StudioCanvas";
import { StudioRightInspector } from "@/components/studio/StudioRightInspector";
import { StudioSimulatorModal } from "@/components/studio/StudioSimulatorModal";
import { X, Check } from "lucide-react";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";

const DRAFT_STORAGE_KEY = "bacakado_custom_studio_draft_v2";

interface Snapshot {
  cards: Card[];
  openingText: string;
  closingText: string;
  recipientName: string;
}

const THEME_STARTERS: Record<
  Theme,
  {
    opening: (name: string) => string;
    closing: string;
    card1: string;
    card2: string;
    musicId: string;
  }
> = {
  ucapan: {
    opening: (name) => `Ada sepucuk pesan manis yang ingin kusampaikan padamu, ${name || "kamu"} 💌✨`,
    closing: "Semoga hari-harimu selalu dipenuhi ketenangan dan senyuman. Terima kasih sudah hadir dalam hidupku. ✨",
    card1: "Terima kasih sudah selalu ada dan membawa warna indah dalam hari-hariku. 🌸",
    card2: "Semoga setiap langkahmu selalu dipeluk ketenangan dan hal-hal baik. ✨",
    musicId: "piano-lembut",
  },
  "ulang-tahun": {
    opening: (name) => `Ada kejutan spesial buat kamu di hari bahagia ini, ${name || "kamu"} 🎂✨`,
    closing: "Selamat ulang tahun! Semoga segala harapan dan impianmu terwujud. Bangga banget sama kamu, teruslah bahagia! 🎉",
    card1: "Selamat ulang tahun! Semoga tahun ini membawa ribuan alasan baru untuk tersenyum lebar. 🎂🎉",
    card2: "Teruslah bersinar dan jangan pernah berhenti percaya pada mimpi-mimpimu. 🌟",
    musicId: "akustik-ceria",
  },
  pacar: {
    opening: (name) => `Sebuah surat kecil penuh cinta buat orang paling spesial dalam hidupku, ${name || "kamu"} ❤️`,
    closing: "Terima kasih sudah selalu ada dan melengkapi setiap hariku. Aku semakin bersyukur memilikimu. Sayang kamu selamanya. 🌹❤️",
    card1: "Setiap momen bersamamu selalu jadi bagian favorit dari hariku. Terima kasih sudah jadi rumah ternyaman. 🌹",
    card2: "Aku bersyukur semesta mempertemukan kita. Semoga kita selalu saling menjaga dan melengkapi. 💕",
    musicId: "piano-lembut",
  },
  temen: {
    opening: (name) => `Buat temen terbaikku yang selalu ada di suka dan duka, ${name || "kamu"} ✨💌`,
    closing: "Terima kasih atas tawa, cerita konyol, dan kebersamaan yang gak pernah ada habisnya. Temenan selamanya ya! ✨",
    card1: "Makasih udah selalu nemenin dari cerita seru sampai obrolan random tengah malem. Gak pernah bosen temenan sama kamu! 🧸",
    card2: "Apapun tantangan ke depan, kita hadapi bareng-bareng. Sukses terus ya buat kita! 🥂",
    musicId: "lofi-santai",
  },
  anniversary: {
    opening: (name) => `Selamat hari jadi kita, ${name || "sayang"} 💍❤️`,
    closing: "Terima kasih untuk setiap tahun yang kita lewati bersama. Cinta ini selalu bertambah setiap harinya. 🌹",
    card1: "Mengingat kembali hari pertama kita bertemu, aku tahu kamu adalah takdir terindahku. ❤️",
    card2: "Mari terus menua bersama dengan ribuan cerita manis berikutnya. ✨",
    musicId: "piano-lembut",
  },
  wisuda: {
    opening: (name) => `Selamat atas kelulusanmu, ${name || "sahabatku"}! Bangga banget 🎓✨`,
    closing: "Perjalanan baru telah menanti. Langkah dengan percaya diri, kamu pasti berhasil! 🌟",
    card1: "Semua perjuangan, lelah, dan air mata akhirnya terbayar tuntas hari ini! 🎓",
    card2: "Dunia luas menunggumu untuk menorehkan karya-karya hebat. Teruslah berkilau! ✨",
    musicId: "sinematik-haru",
  },
  lebaran: {
    opening: (name) => `Taqabbalallahu minna wa minkum, selamat Idul Fitri ${name || "sekeluarga"} 🌙✨`,
    closing: "Mohon maaf lahir dan batin. Semoga berkah dan kedamaian selalu menyertai kita semua. 🕌",
    card1: "Semoga hari kemenangan ini membawa hangatnya kebersamaan dan pengampunan. 🌙",
    card2: "Terima kasih atas silaturahmi yang tak pernah putus. Sehat dan bahagia selalu! ✨",
    musicId: "hangat-keluarga",
  },
  valentine: {
    opening: (name) => `Happy Valentine's Day untuk orang termanis di hatiku, ${name || "kamu"} 💖🌹`,
    closing: "Cinta ini sederhana, tapi seluas semesta untukmu. Selamat hari kasih sayang! 🌹",
    card1: "Terima kasih sudah membuat dunia terasa lebih indah dan hangat setiap hari. 💖",
    card2: "Kamu adalah hadiah terindah yang pernah kumiliki. Sayang kamu selalu! 🥰",
    musicId: "piano-lembut",
  },
};

export default function BuatPage() {
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // Mayar payment redirect handling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment_success") === "1") {
      const giftId = params.get("gift_id");
      if (giftId) {
        checkPaymentStatus(giftId).then((res) => {
          if (res.isPaid && res.slug) {
            setPublishedSlug(res.slug);
            if (res.recipientName) setRecipientName(res.recipientName);
            window.history.replaceState({}, "", "/buat");
          }
        });
      }
    }
  }, []);

  // Continue pending publish flow after auth
  usePendingPublish();

  // Studio Mode: Initial Gate or Interactive Workspace
  const [viewMode, setViewMode] = useState<"gate" | "studio">("gate");
  const [gateTheme, setGateTheme] = useState<Theme | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  // Core Gift State
  const [theme, setTheme] = useState<Theme>("ucapan");
  const [recipientName, setRecipientName] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [closingText, setClosingText] = useState("");
  const [cards, setCards] = useState<Card[]>([
    { id: "c1", order_index: 0, text_content: "" },
  ]);
  const [musicId, setMusicId] = useState("piano-lembut");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [hasPasscode, setHasPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");

  // Studio Controls & Viewport State
  const [activeStage, setActiveStage] = useState<StudioStage>("card");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Mobile Drawer Toggle state
  const [mobileDrawer, setMobileDrawer] = useState<"none" | "left" | "right">("none");

  // Modals & Editing State
  const [showSimulation, setShowSimulation] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateToastMessage, setUpdateToastMessage] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Undo / Redo: snapshot direkam otomatis (debounce) setiap isi kado berubah
  const [hist, setHist] = useState<{ stack: Snapshot[]; index: number }>({ stack: [], index: -1 });
  const skipSnapshot = useRef(false);

  useEffect(() => {
    if (viewMode !== "studio") return;
    if (skipSnapshot.current) {
      skipSnapshot.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const snap: Snapshot = { cards, openingText, closingText, recipientName };
      setHist((h) => {
        const last = h.stack[h.index];
        if (last && JSON.stringify(last) === JSON.stringify(snap)) return h;
        const stack = [...h.stack.slice(0, h.index + 1), snap].slice(-50);
        return { stack, index: stack.length - 1 };
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [viewMode, cards, openingText, closingText, recipientName]);

  function applySnapshot(index: number) {
    const target = hist.stack[index];
    if (!target) return;
    triggerHaptic("selection");
    skipSnapshot.current = true;
    setCards(target.cards);
    setOpeningText(target.openingText);
    setClosingText(target.closingText);
    setRecipientName(target.recipientName);
    setHist((h) => ({ ...h, index }));
  }

  // Load template from gallery, edit existing gift, or restore saved draft on initial client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const editSlug = params.get("edit");
      const templateSlug = params.get("template");
      const themeParam = params.get("theme") as Theme | null;

      // Check if user came from Dashboard to edit an existing owned gift
      if (editSlug) {
        getGiftForEdit(editSlug).then((res) => {
          if (res.gift) {
            const g = res.gift;
            setEditingGiftId(g.id);
            setTheme(g.theme);
            setRecipientName(g.recipient_name || "");
            setOpeningText(g.opening_text || "");
            setClosingText(g.closing_text || "");
            if (g.cards && g.cards.length > 0) {
              setCards(g.cards);
            }
            if (g.music_url) {
              const matchedMusic = MUSIC_OPTIONS.find((m) => m.url === g.music_url);
              if (matchedMusic) {
                setMusicId(matchedMusic.id);
              } else if (g.music_url.includes("youtube.com") || g.music_url.includes("youtu.be")) {
                setMusicId("youtube");
                setYoutubeUrl(g.music_url);
              }
            }
            setHasPasscode(Boolean(g.has_passcode));
            setViewMode("studio");
            setActiveStage("card");
            setActiveCardIndex(0);
          }
        });
        return;
      }

      // Check if user came from Galeri to remix a template
      if (templateSlug) {
        const templateGift = GALLERY_MOCK.find((g) => g.slug === templateSlug);
        if (templateGift) {
          const normTheme =
            templateGift.theme === "anniversary" || templateGift.theme === "valentine"
              ? "pacar"
              : templateGift.theme === "wisuda" || templateGift.theme === "lebaran"
              ? "temen"
              : (templateGift.theme as Theme);

          setTheme(normTheme);
          setRecipientName(templateGift.recipient_name || "");
          setOpeningText(templateGift.opening_text || "");
          setClosingText(templateGift.closing_text || "");
          if (templateGift.cards && templateGift.cards.length > 0) {
            setCards(templateGift.cards);
          }
          if (templateGift.music_url) {
            const matchedMusic = MUSIC_OPTIONS.find((m) => m.url === templateGift.music_url);
            if (matchedMusic) setMusicId(matchedMusic.id);
          }
          setViewMode("studio");
          setActiveStage("card");
          setActiveCardIndex(0);
          return;
        }
      }

      // Nuansa dari URL (mis. link footer): pilih di gerbang, nama tetap ditanya
      if (themeParam && THEME_STARTERS[themeParam]) {
        setGateTheme(themeParam);
        return;
      }

      // Fallback: restore saved draft
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.recipientName) setRecipientName(parsed.recipientName);
        if (parsed.openingText) setOpeningText(parsed.openingText);
        if (parsed.closingText) setClosingText(parsed.closingText);
        if (parsed.cards && parsed.cards.length > 0) setCards(parsed.cards);
        if (parsed.musicId !== undefined) setMusicId(parsed.musicId);
        if (parsed.youtubeUrl) setYoutubeUrl(parsed.youtubeUrl);
        if (parsed.hasPasscode !== undefined) setHasPasscode(parsed.hasPasscode);
        if (parsed.passcode) setPasscode(parsed.passcode);

        // Draf lama tidak langsung membuka studio: gerbang menawarkan "Lanjutkan"
        if (parsed.recipientName || parsed.openingText) {
          setResumeName(parsed.recipientName || "");
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save draft periodically
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setTimeout(() => {
      try {
        const draftObj = {
          theme,
          recipientName,
          openingText,
          closingText,
          cards,
          musicId,
          youtubeUrl,
          hasPasscode,
          passcode,
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftObj));
      } catch {
        // Ignore storage quotas
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [theme, recipientName, openingText, closingText, cards, musicId, youtubeUrl, hasPasscode, passcode]);

  // Handle Theme Selection from Gate
  // Nuansa yang dipilih di gerbang = base kado baru: teks, kartu, dan musik selalu dari nuansa itu
  function handleSelectThemeAndContinue(selectedTheme: Theme, recipient: string) {
    if (
      resumeName !== null &&
      !window.confirm(`Draf ${resumeName ? `untuk ${resumeName} ` : ""}akan diganti kado baru. Lanjut?`)
    ) {
      return;
    }
    const starter = THEME_STARTERS[selectedTheme] || THEME_STARTERS.ucapan;
    const name = recipient || "Kamu";
    setTheme(selectedTheme);
    setRecipientName(recipient);
    setOpeningText(starter.opening(name));
    setClosingText(starter.closing);
    setMusicId(starter.musicId);
    setYoutubeUrl("");
    setHasPasscode(false);
    setPasscode("");
    setCards([
      { id: "c1", order_index: 0, text_content: starter.card1 },
      { id: "c2", order_index: 1, text_content: starter.card2 },
    ]);
    setHist({ stack: [], index: -1 });
    setResumeName(null);
    setViewMode("studio");
    setActiveStage("card");
    setActiveCardIndex(0);
  }

  // Reset / Start fresh draft
  function handleResetDraft() {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm(
      "Mulai kado baru?\nSemua isi kartu dan teks saat ini akan dibersihkan dari draf."
    );
    if (!confirmed) return;

    triggerHaptic("medium");
    localStorage.removeItem(DRAFT_STORAGE_KEY);

    setTheme("ucapan");
    setRecipientName("");
    setOpeningText("");
    setClosingText("");
    setCards([{ id: "c1", order_index: 0, text_content: "" }]);
    setMusicId("piano-lembut");
    setYoutubeUrl("");
    setHasPasscode(false);
    setPasscode("");
    setResumeName(null);
    setViewMode("gate");
    setActiveStage("envelope");
    setHist({ stack: [], index: -1 });
  }

  // Card Manipulation Helpers
  function handleAddCard() {
    triggerHaptic("medium");
    const newCard: Card = {
      id: Date.now().toString(),
      order_index: cards.length,
      text_content: "",
    };
    setCards((prev) => [...prev, newCard]);
    setActiveCardIndex(cards.length);
    setActiveStage("card");
  }

  function handleDuplicateCard(id: string) {
    const cardToDup = cards.find((c) => c.id === id);
    if (!cardToDup) return;
    const dup: Card = {
      id: Date.now().toString(),
      order_index: cards.length,
      text_content: cardToDup.text_content,
      image_url: cardToDup.image_url,
    };
    setCards((prev) => [...prev, dup]);
    setActiveCardIndex(cards.length);
  }

  function handleRemoveCard(id: string) {
    if (cards.length <= 1) return;
    setCards((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      return filtered.map((c, idx) => ({ ...c, order_index: idx }));
    });
    setActiveCardIndex((prev) => Math.max(0, prev - 1));
  }

  function handleMoveCard(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= cards.length) return;
    setCards((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((c, i) => ({ ...c, order_index: i }));
    });
    setActiveCardIndex(toIndex);
  }

  function handleSetCardSticker(sticker: string, position?: { x: number; y: number; rotate?: number }) {
    const current = cards[activeCardIndex];
    if (!current) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === current.id
          ? {
              ...c,
              sticker: sticker || undefined,
              sticker_x: sticker ? position?.x ?? c.sticker_x ?? 86 : undefined,
              sticker_y: sticker ? position?.y ?? c.sticker_y ?? 14 : undefined,
              sticker_rotate: sticker ? position?.rotate ?? c.sticker_rotate ?? 12 : undefined,
            }
          : c
      )
    );
  }

  function handleUpdateCardStickerPosition(id: string, x: number, y: number, rotate?: number) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              sticker_x: Math.round(x * 10) / 10,
              sticker_y: Math.round(y * 10) / 10,
              sticker_rotate: rotate !== undefined ? rotate : (c.sticker_rotate ?? 12),
            }
          : c
      )
    );
  }

  function handleRemoveCardSticker(id: string) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              sticker: undefined,
              sticker_x: undefined,
              sticker_y: undefined,
              sticker_rotate: undefined,
            }
          : c
      )
    );
  }

  function handleUpdateCardImagePosition(id: string, pos: "center" | "top" | "bottom") {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, image_position: pos } : c))
    );
  }

  function handleUpdateCardText(id: string, text: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, text_content: text } : c)));
  }

  function handleUpdateCardImage(id: string, url: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, image_url: url } : c)));
  }

  function handleApplyPresetText(text: string, target: "opening" | "card" | "closing") {
    if (target === "opening") {
      setOpeningText(text);
    } else if (target === "closing") {
      setClosingText(text);
    } else {
      const activeCard = cards[activeCardIndex];
      if (activeCard) {
        handleUpdateCardText(activeCard.id, text);
      }
    }
  }

  // Active Music Label
  const activeMusicOption = MUSIC_OPTIONS.find((m) => m.id === musicId);
  const activeMusicTitle =
    musicId === "youtube"
      ? "Lagu YouTube Pilihan"
      : activeMusicOption
      ? activeMusicOption.label
      : "Tanpa musik latar";

  async function handleSaveUpdate() {
    if (!editingGiftId) return;
    setIsUpdating(true);
    triggerHaptic("medium");
    const draftData: DraftGift = {
      recipientName: recipientName || "Kamu",
      openingText: openingText || `Ada sesuatu buat ${recipientName || "kamu"} 💌`,
      closingText: closingText || "Semoga hari-harimu selalu menyenangkan.",
      theme,
      musicId,
      youtubeUrl: isYoutube ? youtubeUrl : undefined,
      cards: cards.map((c) => ({
        text_content: c.text_content,
        image_url: c.image_url,
        image_position: c.image_position,
        sticker: c.sticker,
        sticker_x: c.sticker_x,
        sticker_y: c.sticker_y,
        sticker_rotate: c.sticker_rotate,
      })),
      passcode: hasPasscode && passcode.trim() ? passcode.trim() : undefined,
    };
    const res = await updateGift(editingGiftId, draftData);
    setIsUpdating(false);
    if (res.success) {
      triggerHaptic("success");
      setUpdateToastMessage("Perubahan tersimpan");
      setTimeout(() => setUpdateToastMessage(null), 3500);
    } else {
      setErrorToast(res.error || "Kado belum tersimpan. Periksa koneksi lalu coba lagi.");
      setTimeout(() => setErrorToast(null), 4000);
    }
  }

  // Prepare Draft Object for Publishing
  const isYoutube = musicId === "youtube";
  const draftGift: DraftGift = {
    recipientName: recipientName || "Kamu",
    openingText: openingText || `Ada sesuatu buat ${recipientName || "kamu"} 💌`,
    closingText: closingText || "Semoga hari-harimu selalu menyenangkan.",
    theme,
    musicId,
    youtubeUrl: isYoutube ? youtubeUrl : undefined,
    cards: cards.map((c) => ({
      text_content: c.text_content,
      image_url: c.image_url,
      image_position: c.image_position,
      sticker: c.sticker,
      sticker_x: c.sticker_x,
      sticker_y: c.sticker_y,
      sticker_rotate: c.sticker_rotate,
    })),
    passcode: hasPasscode && passcode.trim() ? passcode.trim() : undefined,
  };

  // Prepare Live Preview Gift Object
  const previewGift: Gift = {
    id: "preview",
    slug: "preview",
    recipient_name: recipientName || "Kamu",
    opening_text: openingText || `Ada sesuatu buat ${recipientName || "kamu"} 💌`,
    theme,
    closing_text: closingText || "Semoga hari-harimu selalu dipenuhi kebahagiaan.",
    music_url: isYoutube ? youtubeUrl : activeMusicOption?.url,
    cards: cards.filter((c) => c.text_content.trim() || c.image_url || c.sticker),
    status: "draft",
    is_premium: true,
    has_passcode: hasPasscode,
    view_count: 0,
    like_count: 0,
    is_public: false,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1F] flex flex-col overflow-hidden">
      {/* ── STEP 1: INITIAL THEME GATE ────────────────────────── */}
      {viewMode === "gate" ? (
        <StudioThemeGate
          key={gateTheme ?? "none"}
          initialTheme={gateTheme}
          initialRecipient=""
          resumeName={resumeName}
          onResume={() => {
            setResumeName(null);
            setViewMode("studio");
          }}
          onSelectThemeAndContinue={handleSelectThemeAndContinue}
        />
      ) : (
        /* ── STEP 2: INTERACTIVE CUSTOM STUDIO ───────────────── */
        <div className="flex flex-col h-screen overflow-hidden relative">
          {/* Toast Notification */}
          {updateToastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check size={12} />
              </div>
              <span>{updateToastMessage}</span>
              <Link
                href="/dashboard"
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1 shrink-0"
              >
                Ke Dasbor ↗
              </Link>
            </div>
          )}

          {/* Top Bar Header */}
          <StudioHeader
            recipientName={recipientName}
            onUpdateRecipientName={setRecipientName}
            activeStage={activeStage}
            onStageChange={setActiveStage}
            cardsCount={cards.length}
            canUndo={hist.index > 0}
            canRedo={hist.index < hist.stack.length - 1}
            onUndo={() => applySnapshot(hist.index - 1)}
            onRedo={() => applySnapshot(hist.index + 1)}
            onOpenSimulation={() => setShowSimulation(true)}
            onOpenPublish={() => setShowPublish(true)}
            isEditing={Boolean(editingGiftId)}
            isSavingUpdate={isUpdating}
            onSaveUpdate={handleSaveUpdate}
          />

          {/* Main 3-Column Studio Workspace */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Sidebar Drawer (Desktop) */}
            <div className="hidden lg:flex">
              <StudioLeftDrawer
                cards={cards}
                activeCardIndex={activeCardIndex}
                onSelectCard={setActiveCardIndex}
                onAddCard={handleAddCard}
                onDuplicateCard={handleDuplicateCard}
                onRemoveCard={handleRemoveCard}
                onMoveCard={handleMoveCard}
                activeStage={activeStage}
                onStageChange={setActiveStage}
                recipientName={recipientName}
                openingText={openingText}
                closingText={closingText}
                onApplyPresetText={handleApplyPresetText}
                onSetCardSticker={handleSetCardSticker}
                activeCard={cards[activeCardIndex]}
                activeCardSticker={cards[activeCardIndex]?.sticker}
                onUpdateCardStickerPosition={(x, y, rot) => {
                  const curr = cards[activeCardIndex];
                  if (curr) handleUpdateCardStickerPosition(curr.id, x, y, rot);
                }}
                onRemoveCardSticker={() => {
                  const curr = cards[activeCardIndex];
                  if (curr) handleRemoveCardSticker(curr.id);
                }}
                onUpdateActiveCardImage={(url) => {
                  const curr = cards[activeCardIndex];
                  if (curr) handleUpdateCardImage(curr.id, url);
                }}
                musicId={musicId}
                onSelectMusic={setMusicId}
                youtubeUrl={youtubeUrl}
                onChangeYoutubeUrl={setYoutubeUrl}
                theme={theme}
              />
            </div>

            {/* Center Canvas (WYSIWYG Workstage) */}
            <StudioCanvas
              cards={cards}
              activeCardIndex={activeCardIndex}
              onSelectCard={setActiveCardIndex}
              onUpdateCardText={handleUpdateCardText}
              onUpdateCardImage={handleUpdateCardImage}
              onUpdateCardImagePosition={handleUpdateCardImagePosition}
              onUpdateCardStickerPosition={handleUpdateCardStickerPosition}
              onRemoveCardSticker={handleRemoveCardSticker}
              onSetCardSticker={(id, stk, pos) => handleSetCardSticker(stk, pos)}
              onAddCard={handleAddCard}
              onRemoveCard={handleRemoveCard}
              activeStage={activeStage}
              onStageChange={setActiveStage}
              recipientName={recipientName}
              onRecipientNameChange={setRecipientName}
              openingText={openingText}
              onOpeningTextChange={setOpeningText}
              closingText={closingText}
              onClosingTextChange={setClosingText}
              theme={theme}
              onOpenSimulation={() => setShowSimulation(true)}
            />

            {/* Right Inspector Panel (Desktop) */}
            <div className="hidden xl:flex">
              <StudioRightInspector
                theme={theme}
                onThemeChange={setTheme}
                hasPasscode={hasPasscode}
                onTogglePasscode={setHasPasscode}
                passcode={passcode}
                onPasscodeChange={setPasscode}
                recipientName={recipientName}
                onRecipientNameChange={setRecipientName}
                musicTitle={activeMusicTitle}
                onResetDraft={handleResetDraft}
              />
            </div>

            {/* ── Mobile: bottom sheet (Media / Nuansa) ─────────── */}
            {mobileDrawer !== "none" && (
              <div
                className="lg:hidden fixed inset-0 z-50 bg-black/40 flex flex-col justify-end"
                onClick={() => setMobileDrawer("none")}
              >
                <div
                  role="dialog"
                  aria-label={mobileDrawer === "left" ? "Kartu, teks & media" : "Nuansa & pengaturan"}
                  onClick={(e) => e.stopPropagation()}
                  className="h-[75dvh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
                >
                  <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">
                      {mobileDrawer === "left" ? "Kartu, teks & media" : "Nuansa & pengaturan"}
                    </span>
                    <button
                      onClick={() => setMobileDrawer("none")}
                      aria-label="Tutup"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden [&>aside]:h-full [&>aside]:w-full [&>aside]:border-0">
                    {mobileDrawer === "left" ? (
                        <StudioLeftDrawer
                          cards={cards}
                          activeCardIndex={activeCardIndex}
                          onSelectCard={(idx) => {
                            setActiveCardIndex(idx);
                            setMobileDrawer("none");
                          }}
                          onAddCard={handleAddCard}
                          onDuplicateCard={handleDuplicateCard}
                          onRemoveCard={handleRemoveCard}
                          onMoveCard={handleMoveCard}
                          activeStage={activeStage}
                          onStageChange={(s) => {
                            setActiveStage(s);
                            setMobileDrawer("none");
                          }}
                          recipientName={recipientName}
                          openingText={openingText}
                          closingText={closingText}
                          onApplyPresetText={handleApplyPresetText}
                          onSetCardSticker={handleSetCardSticker}
                          activeCard={cards[activeCardIndex]}
                          activeCardSticker={cards[activeCardIndex]?.sticker}
                          onUpdateCardStickerPosition={(x, y, rot) => {
                            const curr = cards[activeCardIndex];
                            if (curr) handleUpdateCardStickerPosition(curr.id, x, y, rot);
                          }}
                          onRemoveCardSticker={() => {
                            const curr = cards[activeCardIndex];
                            if (curr) handleRemoveCardSticker(curr.id);
                          }}
                          onUpdateActiveCardImage={(url) => {
                            const curr = cards[activeCardIndex];
                            if (curr) handleUpdateCardImage(curr.id, url);
                          }}
                          musicId={musicId}
                          onSelectMusic={setMusicId}
                          youtubeUrl={youtubeUrl}
                          onChangeYoutubeUrl={setYoutubeUrl}
                          theme={theme}
                        />
                    ) : (
                        <StudioRightInspector
                          theme={theme}
                          onThemeChange={setTheme}
                          hasPasscode={hasPasscode}
                          onTogglePasscode={setHasPasscode}
                          passcode={passcode}
                          onPasscodeChange={setPasscode}
                          recipientName={recipientName}
                          onRecipientNameChange={setRecipientName}
                          musicTitle={activeMusicTitle}
                    onResetDraft={handleResetDraft}
                        />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Mobile: bottom tab bar ───────────────────────── */}
            <nav
              aria-label="Bagian kado"
              className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-black/[0.08] grid grid-cols-5 pb-[env(safe-area-inset-bottom)]"
            >
              {([
                { key: "envelope", label: "Sampul", emoji: "✉️" },
                { key: "card", label: `Kartu (${cards.length})`, emoji: "📷" },
                { key: "closing", label: "Penutup", emoji: "✨" },
                { key: "left", label: "Media", emoji: "🎵" },
                { key: "right", label: "Nuansa", emoji: "🎨" },
              ] as const).map((tab) => {
                const isSheet = tab.key === "left" || tab.key === "right";
                const active = isSheet ? mobileDrawer === tab.key : mobileDrawer === "none" && activeStage === tab.key;
                return (
                  <button
                    key={tab.key}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      triggerHaptic("selection");
                      if (tab.key === "left" || tab.key === "right") {
                        setMobileDrawer(tab.key);
                      } else {
                        setMobileDrawer("none");
                        setActiveStage(tab.key);
                      }
                    }}
                    className={`h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                      active ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    <span className={active ? "" : "opacity-50 grayscale"}>
                      <IosEmoji symbol={tab.emoji} size={20} />
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── Live Simulation Unboxing Modal ────────────────────── */}
      {showSimulation && (
        <StudioSimulatorModal
          gift={previewGift}
          onClose={() => setShowSimulation(false)}
          onPublish={() => {
            setShowSimulation(false);
            setShowPublish(true);
          }}
        />
      )}

      {/* ── Publish / Mayar QRIS Checkout Modal ───────────────── */}
      {showPublish && (
        <PublishModal
          draft={draftGift}
          onClose={() => setShowPublish(false)}
          onPublished={(slug) => {
            setShowPublish(false);
            setPublishedSlug(slug);
          }}
        />
      )}

      {/* ── Share Success Modal ───────────────────────────────── */}
      {publishedSlug && (
        <ShareSuccessModal
          slug={publishedSlug}
          recipientName={recipientName || "dia"}
          onClose={() => setPublishedSlug(null)}
        />
      )}
    </div>
  );
}
