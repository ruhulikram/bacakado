import Link from "next/link";
import { getGalleryGifts } from "@/app/actions/gift";
import { GALLERY_MOCK, getTheme } from "@/lib/mock-data";
import { Gift } from "@/lib/types";
import { Sparkles, Heart, Eye } from "lucide-react";
import { IosEmoji } from "@/components/ui/IosEmoji";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  let gifts: Gift[] = await getGalleryGifts();
  // Fall back to mock data so the page is never empty during development
  if (gifts.length === 0) gifts = GALLERY_MOCK;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1F]">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 apple-glass">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity flex items-center gap-1.5">
            <IosEmoji symbol="💌" size={18} />
            <span>BacaKado</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
            >
              Kado Saya
            </Link>
            <Link
              href="/buat"
              className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs"
            >
              Bikin Kado
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center sm:text-left mb-10">
          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-rose-500 mb-1">
            <Sparkles size={12} />
            <span>Inspirasi Karya</span>
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mb-2">
            Galeri Kado Publik
          </h1>
          <p className="text-sm text-neutral-500 max-w-lg">
            Temukan inspirasi kata-kata ucapan dan nuansa indah dari kado yang telah dibagikan pengguna lain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gifts.map((gift) => {
            const theme = getTheme(gift.theme);
            const firstCard = gift.cards[0];
            return (
              <Link key={gift.id} href={`/${gift.slug}`} className="group">
                <div className="polaroid-frame rounded-3xl p-4 bg-white transition-all duration-300 group-hover:-translate-y-1">
                  {/* Photo or Aesthetic Gradient Card Header */}
                  <div className={`h-40 rounded-2xl overflow-hidden relative mb-3.5 bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-3.5 border border-black/5`}>
                    {firstCard?.image_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={firstCard.image_url}
                          alt={gift.recipient_name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </>
                    ) : null}

                    <div className="relative z-10 flex justify-between items-start">
                      <IosEmoji symbol={theme.emoji} size={20} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-neutral-800 px-2 py-0.5 rounded-full shadow-2xs">
                        {theme.label}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <p className="text-xs font-semibold text-white drop-shadow-sm">
                        Untuk {gift.recipient_name}
                      </p>
                    </div>
                  </div>

                  <div className="px-1">
                    <p className="font-serif italic text-sm text-neutral-800 line-clamp-2 mb-3 leading-snug">
                      &ldquo;{gift.opening_text}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium pt-2.5 border-t border-neutral-100">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{gift.view_count.toLocaleString()} dibuka</span>
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <Heart size={12} className="fill-rose-500" />
                        <span>{gift.like_count}</span>
                      </span>
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
