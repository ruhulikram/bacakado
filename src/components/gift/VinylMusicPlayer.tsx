"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { youtubeId } from "@/lib/utils";

interface VinylMusicPlayerProps {
  musicUrl?: string;
  autoPlayTrigger?: boolean;
  recipientName?: string;
  isDark?: boolean;
}

export function VinylMusicPlayer({
  musicUrl,
  autoPlayTrigger = false,
  recipientName = "Spesial",
  isDark = false,
}: VinylMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ytId = youtubeId(musicUrl);

  // Trigger play when envelope opens
  useEffect(() => {
    if (autoPlayTrigger && !hasStarted && musicUrl) {
      setHasStarted(true);
      if (!ytId && audioRef.current) {
        audioRef.current.volume = 0.55;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay policy might require manual tap
            setIsPlaying(false);
          });
      } else if (ytId) {
        setIsPlaying(true);
      }
    }
  }, [autoPlayTrigger, hasStarted, musicUrl, ytId]);

  if (!musicUrl) return null;

  function togglePlay() {
    if (ytId) {
      setIsPlaying((prev) => !prev);
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  function toggleMute() {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  }

  // Derive display title
  const songTitle = ytId
    ? "Lagu Pilihan Spesial"
    : musicUrl.includes("piano")
    ? "Piano Lembut — Melodi Tenang"
    : musicUrl.includes("akustik")
    ? "Akustik Ceria — Hari Bahagia"
    : musicUrl.includes("sinematik")
    ? "Sinematik Haru — Momen Indah"
    : musicUrl.includes("hangat")
    ? "Hangat Keluarga — Harmoni"
    : musicUrl.includes("lofi")
    ? "Lo-Fi Santai — Detik Berharga"
    : "Melodi Musik Spesial";

  return (
    <div className="fixed top-4 right-4 z-40 max-w-[280px] sm:max-w-xs transition-all animate-in fade-in slide-in-from-top-3 duration-500">
      {!ytId && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Hidden/Minimally embedded YouTube player when using YT URL */}
      {ytId && hasStarted && (
        <div
          className={`overflow-hidden transition-all duration-300 rounded-2xl mb-2 shadow-xl border ${
            isPlaying ? "h-24 w-44 opacity-100" : "h-0 w-0 opacity-0 pointer-events-none"
          }`}
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${
              isPlaying ? "1" : "0"
            }&loop=1&playlist=${ytId}&playsinline=1`}
            title="Lagu Latar"
            allow="autoplay; encrypted-media"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Floating Spotify-Style Pill Widget */}
      <div
        className={`flex items-center gap-2.5 p-2 pr-3.5 rounded-full backdrop-blur-xl border shadow-lg transition-all ${
          isDark
            ? "bg-[#16161D]/85 border-white/10 text-white shadow-black/40"
            : "bg-white/85 border-black/10 text-neutral-900 shadow-neutral-300/40"
        }`}
      >
        {/* Rotating Mini Vinyl Record */}
        <div
          onClick={togglePlay}
          className="relative w-10 h-10 rounded-full flex-shrink-0 cursor-pointer select-none group"
          title={isPlaying ? "Klik untuk jeda lagu" : "Klik untuk putar lagu"}
        >
          <div
            className={`w-full h-full rounded-full vinyl-disc relative flex items-center justify-center ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
          >
            {/* Vinyl light shine sheen */}
            <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />

            {/* Center Sticker */}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow-inner ${
                isDark
                  ? "bg-rose-500 text-white"
                  : "bg-gradient-to-tr from-amber-400 to-rose-400 text-neutral-900"
              }`}
            >
              ❤️
            </div>
            {/* Center spindle hole */}
            <div className="w-1 h-1 bg-black rounded-full absolute z-10" />
          </div>

          {/* Hover Play/Pause Overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </div>
        </div>

        {/* Song Info & Equalizer */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold tracking-tight truncate leading-tight">
              {songTitle}
            </p>
          </div>

          {/* Audio Visualizer & Subtitle */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-rose-500 rounded-full" style={{ animation: "eq-bounce-1 0.7s ease-in-out infinite" }} />
                <span className="w-0.5 bg-rose-500 rounded-full" style={{ animation: "eq-bounce-2 0.6s ease-in-out infinite" }} />
                <span className="w-0.5 bg-rose-500 rounded-full" style={{ animation: "eq-bounce-3 0.8s ease-in-out infinite" }} />
                <span className="w-0.5 bg-rose-500 rounded-full" style={{ animation: "eq-bounce-4 0.5s ease-in-out infinite" }} />
              </div>
            ) : (
              <span className="text-[10px] text-neutral-400 font-medium">Jeda</span>
            )}
            <span className="text-[10px] opacity-60 truncate">
              {isPlaying ? "Memutar musik" : "Ketuk untuk putar"}
            </span>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={togglePlay}
            className={`p-1.5 rounded-full transition-all active:scale-95 ${
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-neutral-800"
            }`}
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {!ytId && (
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-all active:scale-95 ${
                isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-black/5 text-neutral-500"
              }`}
              aria-label={isMuted ? "Bunyikan" : "Bisukan"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
