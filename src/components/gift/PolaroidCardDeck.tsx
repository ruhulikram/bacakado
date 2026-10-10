"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Heart, Hand } from "lucide-react";
import { Card } from "@/lib/types";
import { IosEmoji, EmojiText } from "@/components/ui/IosEmoji";
import { triggerHaptic } from "@/lib/haptics";

interface PolaroidCardDeckProps {
  cards: Card[];
  recipientName: string;
  onFinish: () => void;
  isDark?: boolean;
  tapeStyle?: "washi-tape" | "washi-tape-gold";
}

// Apple WWDC 2018 Fluid Interface Momentum & Rubber-band Formulas (SKILL.md)
function projectMomentum(initialVelocity: number, decelerationRate = 0.998): number {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

function rubberband(overshoot: number, dimension = 350, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

export function PolaroidCardDeck({
  cards,
  recipientName,
  onFinish,
  isDark = false,
  tapeStyle = "washi-tape",
}: PolaroidCardDeckProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Gesture drag & momentum state (Apple Design Direct Manipulation)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [hasSwipedGesture, setHasSwipedGesture] = useState(false);

  const dragHistory = useRef<{ x: number; t: number }[]>([]);
  const pointerStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const sortedCards = [...cards].sort((a, b) => a.order_index - b.order_index);
  const total = sortedCards.length;
  const current = sortedCards[index];

  // Pre-calculated organic tilts for the deck cards
  const tilts = ["-1.5deg", "1.8deg", "-0.9deg", "1.4deg", "-1.8deg"];
  const currentTilt = tilts[index % tilts.length];

  function handleNext() {
    triggerHaptic("medium");
    if (index < total - 1) {
      setDirection("next");
      setIndex((i) => i + 1);
    } else {
      triggerHaptic("burst");
      onFinish();
    }
  }

  function handlePrev() {
    if (index > 0) {
      triggerHaptic("medium");
      setDirection("prev");
      setIndex((i) => i - 1);
    }
  }

  // ── Touch & Pointer Events (1:1 Direct Manipulation) ───────
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isExiting) return;
    // Only capture primary button / touch
    if (e.button !== 0) return;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    pointerStart.current = { x: e.clientX, y: e.clientY };
    dragHistory.current = [{ x: e.clientX, t: Date.now() }];
    setIsDragging(true);
    triggerHaptic("selection");
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || isExiting) return;

    let deltaX = e.clientX - pointerStart.current.x;
    const deltaY = (e.clientY - pointerStart.current.y) * 0.2; // constrain vertical drift

    // SKILL.md Principle 9: Rubber-band at boundaries
    if (index === 0 && deltaX > 0) {
      deltaX = rubberband(deltaX, 350, 0.5);
    } else if (index === total - 1 && deltaX < 0) {
      // Soft resistance when at the last card before finishing
      deltaX = rubberband(deltaX, 350, 0.65);
    }

    setDragOffset({ x: deltaX, y: deltaY });

    // Track position history for velocity calculation
    const now = Date.now();
    const history = dragHistory.current;
    history.push({ x: e.clientX, t: now });
    if (history.length > 5) history.shift();
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture was already released
    }

    // SKILL.md Principle 5 & 6: Velocity handoff & Momentum projection
    const history = dragHistory.current;
    let velocity = 0;
    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = (newest.t - oldest.t) / 1000;
      if (dt > 0.01) {
        velocity = (newest.x - oldest.x) / dt; // px per second
      }
    }

    const projectedX = dragOffset.x + projectMomentum(velocity);

    // Commit Thresholds: drag distance > 85px OR projected > 160px OR fast flick > 450px/s
    const commitNext =
      dragOffset.x < -85 || projectedX < -160 || (velocity < -450 && dragOffset.x < -30);
    const commitPrev =
      index > 0 &&
      (dragOffset.x > 85 || projectedX > 160 || (velocity > 450 && dragOffset.x > 30));

    if (commitNext) {
      setHasSwipedGesture(true);
      triggerHaptic("medium");
      setIsExiting(true);
      setExitDirection("left");

      setTimeout(() => {
        setDragOffset({ x: 0, y: 0 });
        setIsExiting(false);
        setExitDirection(null);
        handleNext();
      }, 230);
    } else if (commitPrev) {
      setHasSwipedGesture(true);
      triggerHaptic("medium");
      setIsExiting(true);
      setExitDirection("right");

      setTimeout(() => {
        setDragOffset({ x: 0, y: 0 });
        setIsExiting(false);
        setExitDirection(null);
        handlePrev();
      }, 230);
    } else {
      // Animate spring return to origin
      triggerHaptic("selection");
      setDragOffset({ x: 0, y: 0 });
    }
  }

  // Calculate dynamic card transform
  const dynamicRotation = isExiting
    ? exitDirection === "left"
      ? "-18deg"
      : "18deg"
    : `calc(${currentTilt} + ${dragOffset.x * 0.06}deg)`;

  const dynamicTranslateX = isExiting
    ? exitDirection === "left"
      ? "-130%"
      : "130%"
    : `${dragOffset.x}px`;

  const dynamicTranslateY = isExiting ? "10px" : `${dragOffset.y}px`;

  // Peeking cards depth scale
  const dragAbs = Math.abs(dragOffset.x);
  const peekingScale1 = Math.min(0.96 + dragAbs * 0.00015, 1.0);
  const peekingScale2 = Math.min(0.92 + dragAbs * 0.00012, 0.95);

  return (
    <div className="z-10 w-full max-w-sm sm:max-w-md mx-auto select-none px-2 animate-in fade-in duration-500 touch-fluid">
      {/* Deck Indicator & Progress */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
            Kenangan
          </span>
          <span className="text-xs font-bold text-rose-500">
            {index + 1} / {total}
          </span>
        </div>

        {/* Progress Heart Bar */}
        <div className="flex items-center gap-1.5">
          {sortedCards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                triggerHaptic("selection");
                setIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 btn-apple-spring ${
                i === index
                  ? "w-6 bg-rose-500 shadow-xs"
                  : i < index
                  ? "w-2 bg-rose-300/80"
                  : "w-2 bg-neutral-200"
              }`}
              title={`Buka kartu ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card Deck Layering (Stacked Photo Effect) */}
      <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
        {/* Peeking Background Card 2 (Bottom layer) */}
        {index + 2 < total && (
          <div
            className="absolute inset-x-4 top-4 h-[430px] rounded-3xl bg-white/70 border border-black/5 shadow-md pointer-events-none transform -rotate-2 opacity-50 transition-transform duration-300"
            style={{
              zIndex: 1,
              transform: `scale(${peekingScale2}) rotate(-2deg)`,
            }}
          />
        )}

        {/* Peeking Background Card 1 (Middle layer) */}
        {index + 1 < total && (
          <div
            className="absolute inset-x-2 top-2 h-[440px] rounded-3xl bg-white/85 border border-black/5 shadow-lg pointer-events-none transform rotate-1 opacity-70 transition-transform duration-300"
            style={{
              zIndex: 2,
              transform: `scale(${peekingScale1}) rotate(1deg)`,
            }}
          />
        )}

        {/* Active Polaroid Card Surface with Direct Touch Manipulation */}
        <div
          ref={cardRef}
          key={current?.id || index}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`w-full polaroid-frame rounded-3xl p-4 sm:p-5 touch-none cursor-grab active:cursor-grabbing ${
            isDragging
              ? "shadow-2xl scale-[1.02] transition-none"
              : isExiting
              ? "transition-all duration-200 ease-in opacity-0"
              : "transition-all duration-300 ease-out animate-in fade-in"
          }`}
          style={{
            zIndex: 10,
            transform: `translate3d(${dynamicTranslateX}, ${dynamicTranslateY}, 0) rotate(${dynamicRotation})`,
          }}
        >
          {/* Decorative Washi Tape on Top Center */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded-xs flex items-center justify-center pointer-events-none z-20">
            <div className={`w-full h-full ${tapeStyle} opacity-90`} />
          </div>

          {/* Photo Frame or Love Letter Note */}
          {current?.image_url ? (
            <div className="w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-inner mb-4 relative aspect-[4/3] group pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image_url}
                alt="Kenangan bersama"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs">
                <IosEmoji symbol="📷" size={12} />
                <span>Foto #{index + 1}</span>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-amber-50/50 border border-amber-100/80 p-5 mb-4 text-center relative overflow-hidden pointer-events-none">
              <IosEmoji symbol="📜" size={32} className="mb-1" />
              <p className="text-[11px] font-semibold tracking-widest text-amber-800/80 uppercase">
                Catatan Kasih
              </p>
              <div className="w-8 h-0.5 bg-amber-300 mx-auto mt-1 mb-2 rounded-full" />
            </div>
          )}

          {/* Card Message Text */}
          <div className="px-2 pt-1 pb-3 text-center sm:text-left pointer-events-none">
            <p className="font-serif italic text-lg sm:text-xl text-neutral-900 leading-relaxed whitespace-pre-wrap">
              &ldquo;<EmojiText text={current?.text_content} size={20} />&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-400 font-medium border-t border-neutral-100 pt-3">
              <span className="flex items-center gap-1 text-rose-500">
                <Heart size={12} className="fill-rose-500" />
                <span>Untuk {recipientName}</span>
              </span>
              <span>Halaman {index + 1} dari {total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Gesture Hint (Fades out once user has swiped) */}
      {!hasSwipedGesture && (
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-neutral-400 font-medium animate-pulse">
          <Hand size={12} className="text-rose-400" />
          <span>Geser kartu ↔ untuk membolak-balik kenangan</span>
        </div>
      )}

      {/* Navigation Controls (Retained for accessibility & convenience) */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border btn-apple-spring ${
            index === 0
              ? "opacity-30 cursor-not-allowed border-neutral-200 text-neutral-400"
              : "border-neutral-200 bg-white/90 hover:bg-white text-neutral-800 shadow-xs hover:border-neutral-300 active:scale-95"
          }`}
        >
          <ChevronLeft size={14} />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-md active:scale-95 btn-apple-spring transition-all group"
        >
          {index < total - 1 ? (
            <>
              <span>Lanjut Baca</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          ) : (
            <>
              <span>Buka Pesan Penutup</span>
              <Sparkles size={14} className="text-amber-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
