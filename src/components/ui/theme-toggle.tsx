"use client";

import { useEffect, useState } from "react";
import { DIcons } from "dicons";
import { LANDING_THEME_KEY as THEME_KEY } from "@/lib/utils";

// Dark mode khusus landing page: kelas .dark dipasang di wrapper #landing (bukan <html>),
// jadi Studio, halaman kado, dan Dasbor tidak ikut berubah.

function applyTheme(dark: boolean) {
  document.getElementById("landing")?.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(THEME_KEY) === "dark";
    } catch {}
    setDark(saved);
    applyTheme(saved); // juga berlaku saat landing dibuka lewat navigasi client
  }, []);

  function choose(next: boolean) {
    setDark(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
  }

  const base = "rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400";
  const on = "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
  const off = "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white";

  return (
    <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-1">
      <button type="button" onClick={() => choose(false)} aria-pressed={!dark} aria-label="Mode terang" className={`${base} ${dark ? off : on}`}>
        <DIcons.Sun className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <a href="#" aria-label="Kembali ke atas" className={`${base} px-2.5 ${off}`}>
        <DIcons.ArrowUp className="h-3.5 w-3.5" />
      </a>
      <button type="button" onClick={() => choose(true)} aria-pressed={dark} aria-label="Mode gelap" className={`${base} ${dark ? on : off}`}>
        <DIcons.Moon className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
