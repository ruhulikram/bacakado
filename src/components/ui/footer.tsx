"use client";

import { useEffect, useState } from "react";
import { DIcons } from "dicons";
import { useTheme } from "next-themes";

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-dotted border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/60 p-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`rounded-full p-2 transition-all ${mounted && theme === "light"
              ? "bg-black text-white shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          title="Mode Terang"
        >
          <DIcons.Sun className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Mode Terang</span>
        </button>

        <button
          type="button"
          onClick={handleScrollTop}
          className="px-2.5 py-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          title="Kembali ke Atas"
        >
          <DIcons.ArrowUp className="h-3.5 w-3.5" />
          <span className="sr-only">Kembali ke Atas</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`rounded-full p-2 transition-all ${mounted && theme === "dark"
              ? "bg-white text-black shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          title="Mode Gelap"
        >
          <DIcons.Moon className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Mode Gelap</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;
