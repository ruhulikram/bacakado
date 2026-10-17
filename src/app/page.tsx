import Link from "next/link";
import { Plus, Disc3, ShieldCheck, Layers, Sparkles, Lock } from "lucide-react";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { StatsCounter } from "@/components/StatsCounter";
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="h-8 xs:h-9 px-3.5 sm:px-4 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80 transition-all active:scale-95"
            >
              Login
            </Link>
            <Link
              href="/buat"
              className="h-8 xs:h-9 px-3.5 sm:px-4.5 bg-neutral-900 hover:bg-black text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 btn-apple-spring"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Kado</span>
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

      {/* ── Key Metrics & Social Proof Bar ──────────────────── */}
      <StatsCounter />

      {/* ── Rhythmic Bento Grid (Physical Details Reimagined - Option 1) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:pl-[35px] sm:pr-[85px] max-w-[1440px] mx-auto">
        <div className="mb-10 sm:mb-14 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-2.5">
            Kehangatan surat nyata di layar smartphone.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Dirancang dengan sentuhan fisik nyata agar orang tersayang merasakan kehangatan dan debaran layaknya membuka kado sungguhan.
          </p>
        </div>

        {/* 4-Cell Tactile Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Cell 1: Sensasi Buka Amplop Nyata (Wide 2-cols on desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 mb-3.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sentuhan Pembuka</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2.5 tracking-tight">
                  Sensasi Buka Amplop Nyata
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                  Sentuh segel lilin untuk membuka lipatan amplop 3D, diiringi letupan confetti lembut dan debaran kejutan yang tak terlupakan.
                </p>

                <div className="pt-4 border-t border-neutral-100 flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-medium">5 Stempel Segel:</span>
                  <div className="flex items-center -space-x-1.5">
                    {["seal-love.svg", "seal-rose.svg", "seal-star.svg", "seal-leaf.svg", "seal-grad.svg"].map((seal, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-white border border-neutral-200/80 p-0.5 shadow-2xs transition-transform hover:scale-125 hover:z-10"
                        title="Stempel Lilin"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/gift/${seal}`} alt="Stempel Segel" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Tactile Mockup Stage */}
              <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-neutral-50 border border-neutral-200/70 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {/* Decorative floating note */}
                <div className="absolute top-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/60 shadow-2xs flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
                  <IosEmoji symbol="💌" size={14} />
                  <span>Untuk Seseorang yang Teristimewa</span>
                </div>

                {/* Envelope Silhouette with 3D Wax Seal */}
                <div className="relative mt-4 flex items-center justify-center">
                  <div className="w-48 sm:w-56 h-32 sm:h-36 bg-gradient-to-b from-[#F7F2EC] to-[#EFE7DE] rounded-xl border border-neutral-300/80 shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    {/* Flap fold silhouette */}
                    <div className="absolute top-0 inset-x-0 h-16 border-b border-neutral-300/60 bg-gradient-to-b from-white/30 to-transparent" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                    
                    {/* Central 3D Embossed Wax Seal */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 p-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-rose-400/40 animate-wax-glow cursor-pointer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/gift/seal-love.svg" alt="Segel Lilin" className="w-12 h-12 object-contain filter drop-shadow" />
                    </div>

                    <div className="absolute bottom-2 text-[10px] font-medium text-neutral-400 tracking-wider uppercase">
                      Tap untuk membuka
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cell 2: Dek Polaroid Kenangan */}
          <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 mb-3.5">
                <IosEmoji symbol="📷" size={13} />
                <span>Kenangan Abadi</span>
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">
                Dek Polaroid Kenangan
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-4">
                Sentuh dan geser setiap lembar foto kenangan berhias selotip washi tape. Selipkan kata-kata tulus yang tersimpan rapi.
              </p>
            </div>

            {/* Visual: Stacked Polaroid Cards Mockup */}
            <div className="my-2 py-4 relative flex items-center justify-center min-h-[160px]">
              {/* Back Card (slight tilt right) */}
              <div className="absolute w-44 sm:w-48 bg-white p-2 pb-5 rounded-lg border border-neutral-200 shadow-xs rotate-3 opacity-60 pointer-events-none">
                <div className="w-full h-24 bg-neutral-100 rounded" />
              </div>

              {/* Front Card (tilt left with photo & washi tape) */}
              <div className="relative w-44 sm:w-48 bg-white p-2.5 pb-3 rounded-lg border border-neutral-200/90 shadow-md -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                {/* Washi tape sticker */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-200/80 border border-amber-300/70 -rotate-2 rounded-2xs shadow-2xs z-10" />
                
                {/* Photo */}
                <div className="w-full h-24 rounded overflow-hidden bg-neutral-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1522168637698-f490d9f2c82f?w=400&h=300&fit=crop"
                    alt="Foto Kenangan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <p className="mt-2 text-[10px] text-center font-medium text-neutral-600 truncate">
                  14 Feb · Bahagia bersamamu ✨
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
              <Layers size={14} className="text-neutral-500" />
              <span>Dukungan kartu foto & catatan tanpa batas</span>
            </div>
          </div>

          {/* Cell 3: Piringan Vinyl & Musik Latar */}
          <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/60 mb-3.5">
                <IosEmoji symbol="🎵" size={13} />
                <span>Melodi Kenangan</span>
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">
                Lagu yang Menyimpan Cerita
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-4">
                Piringan vinyl berputar otomatis melantunkan melodi kenangan begitu surat terbuka. Lengkap dengan koleksi instrumen romantis siap pakai.
              </p>
            </div>

            {/* Visual: Spinning Vinyl Record & Music Pill */}
            <div className="my-2 py-3 flex flex-col items-center justify-center relative">
              <div className="relative flex items-center justify-center">
                {/* Vinyl Record */}
                <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 shadow-md relative flex items-center justify-center animate-spin-slow">
                  {/* Concentric Grooves */}
                  <div className="absolute inset-2 rounded-full border border-neutral-700/60" />
                  <div className="absolute inset-4 rounded-full border border-neutral-700/40" />
                  <div className="absolute inset-6 rounded-full border border-neutral-700/40" />
                  {/* Center Sticker */}
                  <div className="w-8 h-8 rounded-full bg-rose-500 border border-white/30 flex items-center justify-center shadow-inner text-[10px]">
                    ❤️
                  </div>
                </div>

                {/* Equalizer Wave Badge */}
                <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-neutral-900/90 text-white backdrop-blur-md text-[10px] font-semibold flex items-center gap-2 shadow-sm">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-rose-400 rounded-full" style={{ animation: "eq-bounce-1 0.7s ease-in-out infinite" }} />
                    <span className="w-0.5 bg-rose-400 rounded-full" style={{ animation: "eq-bounce-2 0.6s ease-in-out infinite" }} />
                    <span className="w-0.5 bg-rose-400 rounded-full" style={{ animation: "eq-bounce-3 0.8s ease-in-out infinite" }} />
                    <span className="w-0.5 bg-rose-400 rounded-full" style={{ animation: "eq-bounce-4 0.5s ease-in-out infinite" }} />
                  </div>
                  <span>Now Playing</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
              <Disc3 size={14} className="text-neutral-500" />
              <span>Autoplay otomatis & tautan lagu YouTube</span>
            </div>
          </div>

          {/* Cell 4: Gembok Rahasia Berdua (Wide 2-cols on desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-3.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Privat</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2.5 tracking-tight">
                  Gembok Rahasia Berdua
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                  Kunci kado dengan tanggal jadian atau kode rahasia berdua. Pesan dan foto tersimpan aman di ruang privat kalian sampai kuncinya dibuka.
                </p>

                <div className="pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <Lock size={14} className="text-emerald-600 shrink-0" />
                  <span>Hanya ia yang memegang kode rahasia yang dapat membuka</span>
                </div>
              </div>

              {/* Passcode Mockup Stage */}
              <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-neutral-50 to-amber-50/30 border border-neutral-200/70 p-5 flex flex-col items-center justify-center overflow-hidden shadow-inner text-center">
                {/* Clue Prompt */}
                <div className="px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/70 shadow-2xs text-[11px] font-medium text-neutral-700 mb-4 flex items-center gap-1.5">
                  <IosEmoji symbol="💡" size={13} />
                  <span>Petunjuk: Tanggal jadian kita berdua 💕</span>
                </div>

                {/* Passcode Digits Box */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-12 rounded-xl bg-white border border-neutral-300 shadow-2xs flex items-center justify-center font-bold text-base text-neutral-800">
                    1
                  </div>
                  <div className="w-10 h-12 rounded-xl bg-white border border-neutral-300 shadow-2xs flex items-center justify-center font-bold text-base text-neutral-800">
                    4
                  </div>
                  <div className="w-10 h-12 rounded-xl bg-emerald-50 border-2 border-emerald-500 shadow-xs flex items-center justify-center font-bold text-base text-emerald-600">
                    0
                  </div>
                  <div className="w-10 h-12 rounded-xl bg-emerald-50 border-2 border-emerald-500 shadow-xs flex items-center justify-center font-bold text-base text-emerald-600">
                    2
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>PIN Terverifikasi · Amplop Terbuka</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BacaKado Interactive Footer (Landing Page Only) ─────── */}
      <Footer />
    </div>
  );
}
