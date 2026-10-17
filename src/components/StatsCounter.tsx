"use client";

import React from "react";
import { Gift, Palette, Zap } from "lucide-react";

export interface StatItem {
  icon: React.ReactNode;
  iconBg?: string;
  value: string;
  label: string;
}

interface StatsCounterProps {
  items?: StatItem[];
  className?: string;
}

export function StatsCounter({ items, className = "" }: StatsCounterProps) {
  const defaultItems: StatItem[] = [
    {
      icon: <Gift className="w-5 h-5 text-rose-500" strokeWidth={2} />,
      iconBg: "bg-white border-neutral-200/80 text-rose-500",
      value: "10.000+",
      label: "Kado Digital Dibuat",
    },
    {
      icon: <Palette className="w-5 h-5 text-blue-500" strokeWidth={2} />,
      iconBg: "bg-white border-neutral-200/80 text-blue-500",
      value: "50+ Elemen",
      label: "Kustomisasi Desain",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" strokeWidth={2} />,
      iconBg: "bg-white border-neutral-200/80 text-amber-500",
      value: "< 5 Menit",
      label: "Langsung Jadi dari HP",
    },
  ];

  const stats = items && items.length > 0 ? items : defaultItems;

  return (
    <section
      aria-label="Statistik BacaKado"
      className={`w-full py-7 sm:py-9 px-4 border-y border-neutral-200/60 bg-white/50 backdrop-blur-xs select-none ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] flex flex-wrap items-center justify-center gap-7 sm:gap-12 md:gap-16 lg:gap-24">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 sm:gap-3.5 group cursor-default transition-transform"
          >
            {/* Squircle Icon Tile */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200 ${
                stat.iconBg || "bg-white border-neutral-200/80 shadow-2xs"
              }`}
            >
              {stat.icon}
            </div>

            {/* Metric Value & Label */}
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 tracking-tight leading-tight">
                {stat.value}
              </span>
              <span className="text-xs text-neutral-500 font-normal leading-normal mt-0.5">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
