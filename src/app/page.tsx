import Link from "next/link";
import { Plus, Disc3, ShieldCheck, Layers } from "lucide-react";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Footer } from "@/components/ui/demo";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D1D1F] selection:bg-neutral-900 selection:text-white">
      {/* ── Top Announcement Banner (Landing Page Only) ───────── */}
      <AnnouncementBanner />

      {/* ── Unified Navbar (1440px Grid Alignment) ────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-200/60 shadow-2xs">
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
              href="/galeri"
              className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
            >
              Galeri
            </Link>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
            >
              Kado Saya
            </Link>
            <Link
              href="/buat"
              className="bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-semibold shadow-sm h-8 xs:h-9 px-3.5 sm:px-4.5 transition-all active:scale-95 flex items-center gap-1.5 btn-apple-spring"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bikin Kado Sekarang</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Clean Centered Editorial Hero Section ───────────── */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-neutral-950 leading-[1.12] mb-5">
            Ucapan digital yang dirancang selayaknya karya seni fisik.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            Amplop 3D, kartu foto kenangan, dan musik latar. Selesai dalam lima menit langsung dari ponselmu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link
              href="/buat"
              className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 btn-apple-spring"
            >
              <span>Bikin Kado Sekarang</span>
              <IosEmoji symbol="💌" size={16} />
            </Link>
            <Link
              href="/untuk-rara"
              className="w-full sm:w-auto border border-neutral-300/80 hover:border-neutral-400 text-neutral-800 hover:text-black font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all hover:bg-white/80 bg-white/40 flex items-center justify-center gap-1.5 btn-apple-spring"
            >
              <span>Lihat Contoh Rara</span>
              <span>↗</span>
            </Link>
          </div>

          <p className="text-xs text-neutral-400">
            Coba gratis di editor · Cuma <span className="text-neutral-700 font-semibold">{PREMIUM_PRICE_LABEL}</span> saat terbitkan via QRIS
          </p>
        </div>
      </section>

      {/* ── Rhythmic Bento Grid (Physical Details Reimagined) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto border-t border-neutral-200/60">
        <div className="mb-10 sm:mb-14 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
            Kehangatan surat nyata di layar smartphone.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Setiap detail dirancang agar penerima merasakan sentuhan emosional layaknya membuka bungkusan kado sungguhan.
          </p>
        </div>

        {/* 4-Cell Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Cell 1: Amplop 3D & Segel Lilin (Wide 2-cols on desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-4">
                <IosEmoji symbol="✉️" size={18} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Amplop 3D & Segel Lilin Embossed
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg leading-relaxed">
                Penutup amplop berputar 180° secara fisik saat segel lilin disentuh. Dilengkapi letupan confetti champagne dan getaran taktil yang memukau.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gift/seal-love.svg" alt="Segel Lilin" className="w-7 h-7 object-contain" />
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                Pilihan 5 stempel segel: Mawar, Bintang, Cinta, Daun, dan Topi Wisuda.
              </p>
            </div>
          </div>

          {/* Cell 2: Dek Polaroid & Washi Tape */}
          <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-4">
                <Layers size={18} className="text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Dek Polaroid & Washi Tape
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Sentuh dan geser kartu foto satu per satu dengan simulasi inersia fisik Apple. Dihiasi selotip washi tape dan stiker dekoratif.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-600 font-medium">
              <IosEmoji symbol="📷" size={16} />
              <span>Dukungan kartu foto dan catatan tanpa batas</span>
            </div>
          </div>

          {/* Cell 3: Piringan Vinyl & Musik Otomatis */}
          <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-4">
                <Disc3 size={18} className="text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Piringan Vinyl & Musik Latar
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Piringan vinyl berputar 360° otomatis saat amplop terbuka. Gunakan koleksi instrumen bebas royalti atau tautkan lagu YouTube favorit.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-600 font-medium">
              <IosEmoji symbol="🎵" size={16} />
              <span>Autoplay aman tanpa terblokir browser</span>
            </div>
          </div>

          {/* Cell 4: Gembok PIN Rahasia Server-Side (Wide 2-cols on desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center mb-4">
                <ShieldCheck size={18} className="text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Gembok PIN Rahasia Server-Side
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg leading-relaxed">
                Kunci kado dengan tanggal jadian atau kode rahasia berdua. Isi kartu ucapan tidak dikirim ke browser sebelum lolos verifikasi PIN di database.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 border border-neutral-200/70 text-xs font-semibold tracking-widest text-neutral-800">
                <span>••••</span>
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                Dilengkapi proteksi pembekuan 15 menit jika 5 kali berturut-turut salah.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Warm Tactile Callout ─── */}
      <section className="py-16 sm:py-24 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto border-t border-neutral-200/60">
        <div className="rounded-[36px] bg-neutral-50 border border-neutral-200/80 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-950 mb-3">
            Berikan kejutan yang akan ia kenang selalu.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
            Hanya {PREMIUM_PRICE_LABEL} sekali bayar. Tanpa langganan, tanpa iklan, dan tautan aktif selamanya.
          </p>

          <Link
            href="/buat"
            className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.98] shadow-sm btn-apple-spring"
          >
            <span>Bikin Kado Sekarang</span>
            <IosEmoji symbol="🎁" size={16} />
          </Link>
        </div>
      </section>

      {/* ── BacaKado Interactive Footer (Landing Page Only) ─────── */}
      <Footer />
    </div>
  );
}
