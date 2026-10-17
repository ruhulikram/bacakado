import Link from "next/link";
import type { Metadata } from "next";
import { getGalleryGifts } from "@/app/actions/gift";
import { GALLERY_MOCK } from "@/lib/mock-data";
import { Gift } from "@/lib/types";
import { Plus } from "lucide-react";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { GaleriClient } from "./GaleriClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Kado & Inspirasi Ucapan Digital · BacaKado",
  description:
    "Jelajahi kumpulan kado digital penuh kesan dari pengguna BacaKado. Temukan inspirasi kata-kata ucapan dan remix template untuk orang tersayangmu.",
};

export default async function GaleriPage() {
  let gifts: Gift[] = await getGalleryGifts();
  // Fall back to mock data so the page is never empty during development
  if (gifts.length === 0) gifts = GALLERY_MOCK;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1F]">
      {/* ── Unified Navbar (Dashboard Size & Style + 1440px Grid) ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200/60 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-neutral-900 text-lg sm:text-xl tracking-tight flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <IosEmoji symbol="💌" size={22} />
            <span>BacaKado</span>
          </Link>
          <div className="flex items-center gap-2.5 xs:gap-3.5 sm:gap-6">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
            >
              Kado Saya
            </Link>
            <Link
              href="/buat"
              className="bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-semibold shadow-sm h-8 xs:h-9 px-3 xs:px-3.5 sm:px-4 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bikin kado</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] py-10 sm:py-12">
        <div className="text-center sm:text-left mb-8">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
            Galeri kado & inspirasi ucapan
          </h1>
          <p className="text-sm text-neutral-500 max-w-lg">
            Temukan inspirasi kata-kata ucapan dan nuansa indah, atau gunakan template untuk mulai membuat kado di Studio.
          </p>
        </div>

        {/* Interactive Client Gallery */}
        <GaleriClient initialGifts={gifts} />
      </main>
    </div>
  );
}
