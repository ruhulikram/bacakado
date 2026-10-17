"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, Theme } from "@/lib/types";
import { THEME_OPTIONS } from "@/lib/mock-data";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";
import { StudioStage } from "./StudioHeader";
import { triggerHaptic } from "@/lib/haptics";
import { IPhone } from "@/components/ui/iphone";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Trash2,
  Sparkles,
  Lightbulb,
  Maximize2,
  RefreshCw,
  Heart,
  Volume2,
  Move,
  RotateCw,
} from "lucide-react";
import { uploadGiftImage } from "@/lib/supabase/storage";
import { playWaxSealPop, playPaperSlide, playCardFlip, playStickerSnap } from "@/lib/sfx";

interface DraggableStickerProps {
  sticker: string;
  x?: number;
  y?: number;
  rotate?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUpdatePosition?: (x: number, y: number, rotate?: number) => void;
  onRemove?: () => void;
}

function DraggableSticker({
  sticker,
  x = 86,
  y = 14,
  rotate = 12,
  containerRef,
  onUpdatePosition,
  onRemove,
}: DraggableStickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x, y, rotate });
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setPos({ x, y, rotate });
    }
  }, [x, y, rotate, isDragging]);

  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    dragStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
      containerWidth: rect.width,
      containerHeight: rect.height,
    };

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch { }

    setIsDragging(true);
    setShowControls(true);
    triggerHaptic("selection");
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current) return;
    e.stopPropagation();

    const { startX, startY, startPosX, startPosY, containerWidth, containerHeight } = dragStartRef.current;
    if (containerWidth === 0 || containerHeight === 0) return;

    const deltaX = ((e.clientX - startX) / containerWidth) * 100;
    const deltaY = ((e.clientY - startY) / containerHeight) * 100;

    // Constrain inside card boundaries (between 7% and 93%)
    const clampedX = Math.max(7, Math.min(93, startPosX + deltaX));
    const clampedY = Math.max(7, Math.min(93, startPosY + deltaY));

    setPos((prev) => ({
      ...prev,
      x: Math.round(clampedX * 10) / 10,
      y: Math.round(clampedY * 10) / 10,
    }));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { }

    setIsDragging(false);
    dragStartRef.current = null;
    playStickerSnap();
    triggerHaptic("medium");
    onUpdatePosition?.(pos.x, pos.y, pos.rotate);
  }

  function handleCycleRotation(e: React.MouseEvent) {
    e.stopPropagation();
    const rotations = [-18, -6, 0, 12, 24];
    const nextIdx = (rotations.indexOf(pos.rotate) + 1) % rotations.length;
    const nextRot = rotations[nextIdx];
    setPos((prev) => ({ ...prev, rotate: nextRot }));
    onUpdatePosition?.(pos.x, pos.y, nextRot);
    triggerHaptic("selection");
    playStickerSnap();
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={(e) => {
        e.stopPropagation();
        setShowControls((prev) => !prev);
      }}
      className={`group absolute z-30 select-none touch-none transition-shadow ${isDragging ? "cursor-grabbing z-40 scale-110" : "cursor-grab"
        }`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
      }}
      title="Tahan & geser untuk atur posisi stiker ini di kartu"
    >
      {/* Sticker badge frame */}
      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 shadow-md border flex items-center justify-center transition-all ${isDragging
            ? "border-rose-400 ring-4 ring-rose-500/25 shadow-2xl"
            : "border-black/10 hover:border-rose-400 hover:ring-2 hover:ring-rose-200 hover:shadow-lg"
          }`}
      >
        <IosEmoji symbol={sticker} size={26} />
      </div>

      {/* Geser badge on hover */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <Move size={8} />
        <span>Geser</span>
      </div>

      {/* Floating Coordinates indicator while dragging */}
      {isDragging && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] font-medium px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none"
        >
          {Math.round(pos.x)}%, {Math.round(pos.y)}%
        </div>
      )}

      {/* Floating Canva-style Quick Controls (Rotate & Remove) */}
      <div
        className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full shadow-lg pointer-events-auto shrink-0 transition-opacity ${showControls || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        style={{ transform: `rotate(${-pos.rotate}deg)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rotate Chip */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleCycleRotation}
          className="text-[9px] font-medium px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-0.5"
          title="Ubah sudut kemiringan"
        >
          <RotateCw size={9} />
          <span>{pos.rotate}°</span>
        </button>

        <span className="text-white/30 text-[9px]">•</span>

        {/* Remove Chip */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="text-[10px] px-1 py-0.5 rounded text-rose-300 hover:text-rose-100 hover:bg-rose-500/30 transition-colors font-bold"
          title="Lepas stiker"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface StudioCanvasProps {
  cards: Card[];
  activeCardIndex: number;
  onSelectCard: (index: number) => void;
  onUpdateCardText: (id: string, text: string) => void;
  onUpdateCardImage: (id: string, url: string) => void;
  onUpdateCardImagePosition: (id: string, pos: "center" | "top" | "bottom") => void;
  onUpdateCardStickerPosition?: (id: string, x: number, y: number, rotate?: number) => void;
  onRemoveCardSticker?: (id: string) => void;
  onSetCardSticker?: (id: string, sticker: string, position?: { x: number; y: number; rotate?: number }) => void;
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  activeStage: StudioStage;
  onStageChange: (stage: StudioStage) => void;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  openingText: string;
  onOpeningTextChange: (text: string) => void;
  closingText: string;
  onClosingTextChange: (text: string) => void;
  theme: Theme;
  onOpenSimulation: () => void;
}

export function StudioCanvas({
  cards,
  activeCardIndex,
  onSelectCard,
  onUpdateCardText,
  onUpdateCardImage,
  onAddCard,
  onRemoveCard,
  activeStage,
  onStageChange,
  recipientName,
  onRecipientNameChange,
  openingText,
  onOpeningTextChange,
  closingText,
  onClosingTextChange,
  theme,
  onUpdateCardImagePosition,
  onUpdateCardStickerPosition,
  onRemoveCardSticker,
  onSetCardSticker,
  onOpenSimulation,
}: StudioCanvasProps) {
  const [envelopePreviewOpen, setEnvelopePreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOverCard, setIsDragOverCard] = useState(false);
  const canvasFileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCardRef = useRef<HTMLDivElement | null>(null);
  const canvasCardRef = useRef<HTMLDivElement | null>(null);

  function handleCardDrop(
    e: React.DragEvent<HTMLDivElement>,
    cardId: string,
    containerRef: React.RefObject<HTMLDivElement | null>
  ) {
    e.preventDefault();
    setIsDragOverCard(false);
    const stk = e.dataTransfer.getData("application/bacakado-sticker") || e.dataTransfer.getData("text/plain");
    if (!stk || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const relY = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
    onSetCardSticker?.(cardId, stk, {
      x: Math.round(relX * 10) / 10,
      y: Math.round(relY * 10) / 10,
      rotate: 12,
    });
    playStickerSnap();
    triggerHaptic("medium");
  }

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const currentCard = cards[activeCardIndex] || cards[0];

  function handleToggleEnvelope() {
    setEnvelopePreviewOpen((prev) => {
      const next = !prev;
      if (next) {
        playWaxSealPop();
        setTimeout(playPaperSlide, 150);
      }
      return next;
    });
  }

  async function handleDirectPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentCard) return;

    setIsUploading(true);
    triggerHaptic("selection");
    const res = await uploadGiftImage(file);
    setIsUploading(false);

    if (canvasFileInputRef.current) canvasFileInputRef.current.value = "";

    if (res.url) {
      onUpdateCardImage(currentCard.id, res.url);
      triggerHaptic("success");
    }
  }

  function handlePrevCard() {
    if (activeCardIndex > 0) {
      triggerHaptic("selection");
      playCardFlip();
      onSelectCard(activeCardIndex - 1);
    }
  }

  function handleNextCard() {
    triggerHaptic("selection");
    playCardFlip();
    if (activeCardIndex < cards.length - 1) {
      onSelectCard(activeCardIndex + 1);
    } else {
      onStageChange("closing");
    }
  }

  return (
    <div className="flex-1 h-[calc(100dvh-56px)] lg:h-[calc(100vh-64px)] overflow-y-auto relative bg-[#F5F3EF] flex flex-col items-center justify-between px-3 pt-3 pb-24 lg:p-8 select-none">
      {/* Background Studio Ambience & Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#D6D1C7 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <input
        ref={canvasFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleDirectPhotoUpload}
      />

      {/* ── Center Stage Area (Mobile Frame or Fluid Stage) ────── */}
      <div
        className="z-10 my-auto flex items-center justify-center w-full"
      >
        {/* Bingkai iPhone hanya di desktop; di HP kanvas tampil langsung selebar layar */}
          <IPhone
            className="w-full max-w-[340px] sm:max-w-[370px] h-[640px] sm:h-[680px] shadow-2xl transition-all duration-300"
            screenClassName={`overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-b ${currentTheme.gradient} lg:border lg:border-neutral-800/50 lg:shadow-inner`}
          >
            {/* STAGE: ENVELOPE */}
            {activeStage === "envelope" && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                <div className="text-center mb-3">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => onRecipientNameChange(e.target.value)}
                    placeholder="Nama penerima"
                    className="font-serif italic text-2xl font-normal text-center text-neutral-900 bg-transparent border-b border-neutral-300/60 focus:border-neutral-900 focus:outline-none w-full pb-0.5"
                  />
                </div>

                {/* 3D Envelope Element */}
                <div
                  onClick={handleToggleEnvelope}
                  className="relative w-48 h-48 cursor-pointer group my-2"
                  title="Ketuk untuk membuka amplop"
                >
                  {/* Back Panel */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gift/back-panel.svg" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ zIndex: 1 }} />

                  {/* Paper Note */}
                  <div
                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out flex flex-col items-center justify-center ${envelopePreviewOpen ? "-translate-y-[45%] scale-105 drop-shadow-md" : "translate-y-0 scale-95"
                      }`}
                    style={{ zIndex: envelopePreviewOpen ? 6 : 2 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/gift/Paper.svg" alt="" className="w-full h-full object-contain" />
                    <div className="absolute left-[12%] right-[12%] top-[24%] bottom-[40%] flex flex-col items-center justify-center text-center">
                      <p className="font-serif italic text-[11px] font-bold text-neutral-900 truncate w-full">
                        {recipientName ? `Untuk ${recipientName}` : "Untuk Kamu"}
                      </p>
                      <p className="text-[9px] text-neutral-600 italic line-clamp-2 mt-0.5">
                        {openingText || "Kalimat pertama yang dia baca"}
                      </p>
                    </div>
                  </div>

                  {/* Front Panel */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gift/front-panel.svg" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ zIndex: 3 }} />

                  {/* Flap */}
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700"
                    style={{
                      zIndex: envelopePreviewOpen ? 1 : 4,
                      transformOrigin: "50% 23.6%",
                      transform: envelopePreviewOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/gift/top-panel.svg" alt="" className="w-full h-full object-contain" />
                  </div>

                  {/* Wax Seal */}
                  <div
                    className={`absolute transition-all duration-300 ${envelopePreviewOpen ? "opacity-0 scale-125" : "opacity-100 scale-100 group-hover:scale-110"
                      }`}
                    style={{
                      left: "50%",
                      top: "61%",
                      width: "42px",
                      height: "42px",
                      transform: "translate(-50%, -50%) rotate(-8deg)",
                      zIndex: 10,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentTheme.sealSvg} alt="" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                </div>

                {/* Opening Note In-place Editor */}
                <div className="w-full mt-3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-xs">
                  <label className="text-[11px] font-medium text-neutral-500 block mb-1">
                    Kalimat di sampul
                  </label>
                  <textarea
                    value={openingText}
                    onChange={(e) => onOpeningTextChange(e.target.value)}
                    placeholder="Kalimat pertama yang dia baca"
                    rows={2}
                    className="w-full text-xs text-neutral-800 bg-transparent resize-none focus:outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* STAGE: POLAROID CARD */}
            {activeStage === "card" && currentCard && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                {/* Polaroid Frame */}
                <div
                  ref={mobileCardRef}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                    setIsDragOverCard(true);
                  }}
                  onDragLeave={() => setIsDragOverCard(false)}
                  onDrop={(e) => handleCardDrop(e, currentCard.id, mobileCardRef)}
                  className={`w-full polaroid-frame rounded-3xl p-3.5 bg-white shadow-xl relative transition-all duration-300 ${isDragOverCard ? "ring-4 ring-rose-400 ring-offset-4 ring-offset-rose-50 border-rose-400" : ""
                    }`}
                >
                  {isDragOverCard && (
                    <div className="absolute inset-0 z-30 bg-rose-500/10 backdrop-blur-2xs rounded-3xl border-2 border-dashed border-rose-400 flex items-center justify-center pointer-events-none">
                      <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Lepas di sini
                      </span>
                    </div>
                  )}

                  {/* Washi Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 pointer-events-none z-20">
                    <div className={`w-full h-full ${currentTheme.tapeStyle} opacity-90`} />
                  </div>

                  {/* Draggable & Stickable Sticker Badge */}
                  {currentCard.sticker && (
                    <DraggableSticker
                      sticker={currentCard.sticker}
                      x={currentCard.sticker_x}
                      y={currentCard.sticker_y}
                      rotate={currentCard.sticker_rotate}
                      containerRef={mobileCardRef}
                      onUpdatePosition={(newX, newY, newRot) =>
                        onUpdateCardStickerPosition?.(currentCard.id, newX, newY, newRot)
                      }
                      onRemove={() => onRemoveCardSticker?.(currentCard.id)}
                    />
                  )}

                  {/* Photo Area */}
                  {currentCard.image_url ? (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 shadow-inner mb-3 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentCard.image_url}
                        alt="Foto Kenangan"
                        className={`w-full h-full object-cover ${currentCard.image_position === "top"
                            ? "object-top"
                            : currentCard.image_position === "bottom"
                              ? "object-bottom"
                              : "object-center"
                          }`}
                      />
                      {/* Smart Focal Point / Crop Overlay controls */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] text-neutral-300">Fokus:</span>
                        {(["top", "center", "bottom"] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic("selection");
                              onUpdateCardImagePosition(currentCard.id, pos);
                            }}
                            className={`px-1 rounded capitalize transition-colors ${(currentCard.image_position || "center") === pos
                                ? "bg-white text-black font-bold"
                                : "text-white/80 hover:bg-white/20"
                              }`}
                          >
                            {pos === "top" ? "Atas" : pos === "center" ? "Tengah" : "Bawah"}
                          </button>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => canvasFileInputRef.current?.click()}
                          className="p-2 rounded-xl bg-white text-neutral-800 text-xs font-semibold flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                        >
                          <RefreshCw size={13} />
                          <span>Ganti</span>
                        </button>
                        <button
                          onClick={() => onUpdateCardImage(currentCard.id, "")}
                          className="p-2 rounded-xl bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => canvasFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/70 hover:bg-neutral-50 flex flex-col items-center justify-center gap-1.5 mb-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:scale-110 transition-transform">
                        <Camera size={16} />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-700">
                        {isUploading ? "Mengunggah..." : "Tambah foto"}
                      </span>
                    </button>
                  )}

                  {/* Direct Text Area Editor */}
                  <div className="px-1">
                    <textarea
                      value={currentCard.text_content}
                      onChange={(e) => onUpdateCardText(currentCard.id, e.target.value)}
                      placeholder="Tulis pesanmu untuk kartu ini"
                      rows={3}
                      className={`w-full text-sm leading-relaxed text-neutral-900 bg-transparent resize-none focus:outline-none border-b border-transparent focus:border-neutral-300 transition-colors font-serif italic`}
                    />
                  </div>

                  {/* Polaroid Bottom Signature */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-100 mt-2">
                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                      <Heart size={10} className="fill-rose-500" />
                      <span>Untuk {recipientName || "Kamu"}</span>
                    </span>
                    <span>
                      Kartu {activeCardIndex + 1} dari {cards.length}
                    </span>
                  </div>
                </div>

                {/* Card Switcher on Stage */}
                <div className="flex items-center justify-between w-full mt-3 px-1">
                  <button
                    onClick={handlePrevCard}
                    disabled={activeCardIndex === 0}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${activeCardIndex === 0
                        ? "text-neutral-300 cursor-not-allowed"
                        : "bg-white/80 hover:bg-white text-neutral-800 shadow-2xs"
                      }`}
                  >
                    <ChevronLeft size={14} />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    className="p-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-2xs flex items-center gap-1 transition-all"
                  >
                    <span>{activeCardIndex < cards.length - 1 ? "Kartu berikutnya" : "Ke penutup"}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE: CLOSING */}
            {activeStage === "closing" && (
              <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-300 p-2">
                <div className="w-14 h-14 rounded-3xl bg-white shadow-md border border-black/5 flex items-center justify-center mb-3">
                  <IosEmoji symbol="✨" size={28} />
                </div>

                <h3 className="font-serif italic text-xl font-normal text-neutral-900 mb-3">
                  Pesan penutup
                </h3>

                <div className="w-full bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white/70 shadow-sm text-left">
                  <textarea
                    value={closingText}
                    onChange={(e) => onClosingTextChange(e.target.value)}
                    placeholder="Kalimat terakhir sebelum dia membalas"
                    rows={4}
                    className="w-full text-xs text-neutral-800 bg-transparent resize-none focus:outline-none placeholder:text-neutral-400 leading-relaxed font-sans"
                  />
                </div>

              </div>
            )}
          </IPhone>
      </div>
    </div>
  );
}
