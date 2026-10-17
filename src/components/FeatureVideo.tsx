"use client";

import { useEffect, useRef } from "react";

// Video fitur: mulai dari awal saat kartu terlihat, jeda saat keluar layar.
// prefers-reduced-motion → hanya poster (frame state akhir).
export function FeatureVideo({ name, label, className = "" }: { name: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={`/fitur/${name}.mp4`}
      poster={`/fitur/${name}.jpg`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      className={`w-full aspect-[4/3] object-cover ${className}`}
    />
  );
}
