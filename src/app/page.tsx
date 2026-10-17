import Link from "next/link";
import { Plus } from "lucide-react";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { HeroEnvelope } from "@/components/HeroEnvelope";
import { FeatureVideo } from "@/components/FeatureVideo";
import { StatsBar } from "@/components/StatsBar";
import { LANDING_THEME_KEY as THEME_KEY } from "@/lib/utils";

// Statistik diambil ulang dari database paling lama tiap 10 menit (ISR)
export const revalidate = 600;
import { Footer } from "@/components/ui/demo";

const FEATURES = [
  {
    video: "polaroid",
    videoLabel: "Dua kartu polaroid diletakkan bertumpuk, lalu selotip washi ditempel",
    title: "Dek polaroid kenangan",
    body: "Foto dan tulisan disusun jadi kartu yang digeser satu per satu. Jumlah kartunya bebas.",
  },
  {
    video: "vinyl",
    videoLabel: "Piringan vinyl diletakkan lalu mulai berputar, equalizer ikut bergerak",
    title: "Lagu yang menyimpan cerita",
    body: "Musik mulai diputar saat amplop dibuka. Pilih instrumental yang tersedia atau tempel link YouTube.",
  },
  {
    video: "pin",
    videoLabel: "PIN 1402 diketik satu per satu, lalu kotak berubah hijau: PIN benar, amplop terbuka",
    title: "Gembok rahasia berdua",
    body: "Kunci dengan tanggal jadian atau kode yang cuma kalian tahu. Isinya tidak terbuka sebelum PIN-nya benar.",
  },
];

export default function HomePage() {

  return (
    <div
      id="landing"
      suppressHydrationWarning
      className="min-h-screen bg-[#FAF8F5] text-[#1D1D1F] dark:bg-[#0F0E0D] dark:text-neutral-100 selection:bg-neutral-900 selection:text-white transition-colors"
    >
      {/* Pasang tema tersimpan sebelum paint supaya mode gelap tidak berkedip terang */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.getElementById("landing").classList.add("dark")}catch(e){}`,
        }}
      />
      {/* ── Top Announcement Banner (Landing Page Only) ───────── */}
      <AnnouncementBanner />

      {/* ── Unified Navbar (1440px Grid Alignment) ────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0F0E0D]/85 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-neutral-900 dark:text-white text-lg sm:text-xl tracking-tight flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <IosEmoji symbol="💌" size={22} />
            <span>BacaKado</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="h-8 xs:h-9 px-3.5 sm:px-4 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/10 transition-all active:scale-95"
            >
              Login
            </Link>
            <Link
              href="/buat"
              className="h-8 xs:h-9 px-3.5 sm:px-4.5 bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 btn-apple-spring"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bikin kado</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero: amplop asli yang bisa langsung dibuka ── */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.02em] text-neutral-950 dark:text-neutral-50 leading-[1.05] mb-6">
            Kirim surat yang benar&#8209;benar dibuka.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            Amplop bersegel lilin, kartu foto kenangan, dan lagu kalian berdua. Kamu susun dari HP dalam lima menit, dia buka lewat satu link WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-4">
            <Link
              href="/buat"
              className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold text-sm px-8 h-12 rounded-full transition-all active:scale-[0.98] flex items-center justify-center btn-apple-spring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/30"
            >
              Bikin kado sekarang
            </Link>
            <Link
              href="/untuk-rara"
              className="w-full sm:w-auto border border-neutral-300 hover:border-neutral-500 text-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-500 dark:text-neutral-100 font-semibold text-sm px-7 h-12 rounded-full transition-colors bg-white/60 dark:bg-white/5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/20"
            >
              Lihat kado contoh
            </Link>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Coba gratis di editor. Bayar <span className="text-neutral-900 dark:text-white font-semibold">{PREMIUM_PRICE_LABEL}</span> lewat QRIS hanya saat diterbitkan.
          </p>
        </div>

        <HeroEnvelope />
      </section>

      <StatsBar />

      {/* ── Fitur: 3 kartu sejajar, video sebagai media ── */}
      <section id="fitur" className="py-14 sm:py-20 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto">
        <div className="mb-8 sm:mb-10 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
            Kehangatan surat nyata di layar smartphone.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Dibuat supaya membukanya terasa seperti membuka kado sungguhan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {FEATURES.map((f) => (
            <article key={f.video} className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-3 pb-5 flex flex-col">
              <FeatureVideo name={f.video} label={f.videoLabel} className="rounded-2xl border border-neutral-100 dark:border-neutral-800" />
              <h3 className="mt-4 px-2 text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{f.title}</h3>
              <p className="mt-1 px-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── BacaKado Interactive Footer (Landing Page Only) ─────── */}
      <Footer />
    </div>
  );
}
