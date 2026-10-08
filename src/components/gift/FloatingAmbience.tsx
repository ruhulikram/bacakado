"use client";

import { useMemo } from "react";

interface FloatingAmbienceProps {
  type?: "petals-hearts" | "confetti-sparkles" | "stars" | "sparkles" | "galaxy-hearts";
  glowColor?: string;
  isDark?: boolean;
}

export function FloatingAmbience({
  type = "petals-hearts",
  glowColor = "rgba(244, 63, 94, 0.15)",
  isDark = false,
}: FloatingAmbienceProps) {
  // Generate stable random particles on mount
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 3) % 94}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${6 + (i % 5) * 2}s`,
      size: 14 + (i % 4) * 6,
      rotate: `${(i * 35) % 360}deg`,
      sway: i % 2 === 0 ? "18px" : "-18px",
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Ambient Radial Glow in the Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[110px] pointer-events-none"
        style={{
          background: glowColor,
        }}
      />

      {/* Floating Particles by Theme */}
      {type === "petals-hearts" && (
        <>
          {particles.slice(0, 10).map((p) => (
            <div
              key={`petal-${p.id}`}
              className="absolute pointer-events-none text-rose-300/70 select-none"
              style={{
                left: p.left,
                top: "-5%",
                fontSize: `${p.size}px`,
                animation: `petal-drift ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              🌸
            </div>
          ))}
          {particles.slice(10).map((p) => (
            <div
              key={`heart-${p.id}`}
              className="absolute pointer-events-none text-rose-400/60 select-none"
              style={{
                left: p.left,
                bottom: "-5%",
                fontSize: `${p.size - 2}px`,
                animation: `float-heart ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              💕
            </div>
          ))}
        </>
      )}

      {type === "confetti-sparkles" && (
        <>
          {particles.map((p) => (
            <div
              key={`sparkle-${p.id}`}
              className="absolute pointer-events-none select-none"
              style={{
                left: p.left,
                top: `${(p.id * 11) % 90}%`,
                fontSize: `${p.size - 4}px`,
                animation: `star-pulse ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              {p.id % 3 === 0 ? "✨" : p.id % 3 === 1 ? "🌟" : "🎉"}
            </div>
          ))}
        </>
      )}

      {type === "stars" && (
        <>
          {particles.map((p) => (
            <div
              key={`star-${p.id}`}
              className="absolute pointer-events-none select-none"
              style={{
                left: p.left,
                top: `${(p.id * 12) % 88}%`,
                fontSize: `${p.size - 4}px`,
                animation: `star-pulse ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              {p.id % 2 === 0 ? "✨" : "⭐"}
            </div>
          ))}
        </>
      )}

      {type === "galaxy-hearts" && (
        <>
          {particles.slice(0, 9).map((p) => (
            <div
              key={`galaxy-star-${p.id}`}
              className="absolute pointer-events-none select-none text-pink-300/80"
              style={{
                left: p.left,
                top: `${(p.id * 13) % 90}%`,
                fontSize: `${p.size - 4}px`,
                animation: `star-pulse ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              ✨
            </div>
          ))}
          {particles.slice(9).map((p) => (
            <div
              key={`galaxy-heart-${p.id}`}
              className="absolute pointer-events-none select-none text-pink-400/70"
              style={{
                left: p.left,
                bottom: "-5%",
                fontSize: `${p.size}px`,
                animation: `float-heart ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              💖
            </div>
          ))}
        </>
      )}

      {type === "sparkles" && (
        <>
          {particles.map((p) => (
            <div
              key={`soft-sparkle-${p.id}`}
              className="absolute pointer-events-none select-none"
              style={{
                left: p.left,
                top: `${(p.id * 14) % 85}%`,
                fontSize: `${p.size - 4}px`,
                animation: `star-pulse ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
              }}
            >
              ✨
            </div>
          ))}
        </>
      )}
    </div>
  );
}
