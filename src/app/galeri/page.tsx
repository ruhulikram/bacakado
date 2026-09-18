import Link from "next/link";
import { getGalleryGifts } from "@/app/actions/gift";
import { GALLERY_MOCK, getTheme } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Gift } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  let gifts: Gift[] = await getGalleryGifts();
  // Fall back to mock data so the page is never empty during development
  if (gifts.length === 0) gifts = GALLERY_MOCK;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--k-warm-white, #FDFAF5)" }}>
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--k-midnight, #13102B)" }}>
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="italic-display text-white text-xl">
            BacaKado
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Kado Saya
            </Link>
            <Link href="/buat">
              <span className="text-sm font-semibold px-5 py-2.5 rounded-full text-white block"
                style={{ backgroundColor: "var(--k-blush, #C7768A)" }}>
                Bikin Kado
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="italic-display text-3xl mb-1" style={{ color: "var(--k-ink, #1C1830)" }}>
          Galeri Kado
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--k-stone, #8A8499)" }}>
          Kado-kado populer dari pengguna lain
        </p>

        <div className="grid grid-cols-1 gap-3">
          {gifts.map((gift) => {
            const theme = getTheme(gift.theme);
            return (
              <Link key={gift.id} href={`/${gift.slug}`}>
                <div className="rounded-2xl border overflow-hidden hover:shadow-md transition-all bg-white"
                  style={{ borderColor: "#E8E5EE" }}>
                  <div className={`h-20 bg-gradient-to-br ${theme.gradient} flex items-end px-4 pb-3`}>
                    <span className="text-white/80 text-xs font-medium">
                      Untuk {gift.recipient_name}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm line-clamp-1 mb-2" style={{ color: "var(--k-stone, #8A8499)" }}>
                      {gift.opening_text}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(138,132,153,0.7)" }}>
                      <span>{gift.view_count.toLocaleString()} dibuka</span>
                      <span>·</span>
                      <span>{gift.like_count} suka</span>
                      <span>·</span>
                      <span>{gift.cards.length} kartu</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
