import Link from "next/link";
import { GALLERY_MOCK } from "@/lib/mock-data";
import { PREMIUM_PRICE_LABEL } from "@/lib/utils";

export default function HomePage() {
  const featured = GALLERY_MOCK.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-neutral-900 selection:text-white">

      {/* ── Apple-Grade Minimalist Navbar ─────────────────────── */}
      <nav className="sticky top-0 z-40 apple-glass">
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity">
            BacaKado
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/galeri" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
              Galeri
            </Link>
            <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
              Kado Saya
            </Link>
            <Link
              href="/buat"
              className="bg-neutral-900 hover:bg-black text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all active:scale-[0.98]"
            >
              Bikin Kado
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium tracking-wide uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
          Kado Digital Personal
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] text-neutral-950 leading-[1.08] mb-6">
          Ucapan yang dirancang <br className="hidden sm:inline" />
          selayaknya karya seni.
        </h1>

        <p className="text-base sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Ciptakan situs ucapan personal dengan amplop beranimasi, kartu foto kenangan, dan musik latar. Selesai dalam 5 menit langsung dari ponselmu.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/buat"
            className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white font-medium text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.98] shadow-sm"
          >
            Bikin Kado Sekarang
          </Link>
          <Link
            href="/untuk-rara"
            className="w-full sm:w-auto border border-neutral-200/90 hover:border-neutral-300 text-neutral-800 hover:text-black font-medium text-sm px-7 py-3.5 rounded-full transition-all hover:bg-neutral-50"
          >
            Lihat Contoh Kado ↗
          </Link>
        </div>

        <p className="text-xs text-neutral-400">
          Coba buat gratis di editor · Cuma <span className="text-neutral-700 font-semibold">{PREMIUM_PRICE_LABEL}</span> saat terbitkan via QRIS
        </p>
      </section>

      {/* ── Visual Showcase Frame ─────────────────────────────── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-[#F5F5F7] border border-neutral-200/70 p-6 sm:p-12 overflow-hidden">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-200/80 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-xl mx-auto mb-4">
              ✉️
            </div>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
              Pratinjau Kado
            </p>
            <h3 className="italic-display text-2xl text-neutral-900 mb-2">
              Ada sesuatu buat kamu, Rara
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Ketuk amplop untuk memulai alur cerita penuh kenangan dan musik latar.
            </p>
            <div className="h-36 rounded-xl bg-neutral-100 overflow-hidden relative border border-neutral-200/60 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop"
                alt="Kenangan"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200/60">
              <span>Buka Amplop</span>
              <span className="text-neutral-400">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Apple-Style 3 Steps ───────────────────────────────── */}
      <section className="bg-[#F5F5F7] py-20 sm:py-28 px-6 border-t border-neutral-200/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-2">
              Alur Sederhana
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              Tiga langkah menuju momen yang tak terlupakan.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-400 tracking-wider">01</span>
                <h3 className="text-lg font-semibold text-neutral-900 mt-4 mb-2">
                  Susun Ceritamu
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Pilih nuansa kado, tuliskan kalimat pembuka yang menyentuh, dan unggah foto-foto kenangan kalian.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-400 tracking-wider">02</span>
                <h3 className="text-lg font-semibold text-neutral-900 mt-4 mb-2">
                  Proteksi PIN Rahasia
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Kunci kado dengan tanggal jadian atau kode rahasia opsional, agar momen berdua tetap terasa intim dan aman.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-400 tracking-wider">03</span>
                <h3 className="text-lg font-semibold text-neutral-900 mt-4 mb-2">
                  Bagikan Sekali Sentuh
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Dapatkan tautan unik yang aktif selamanya. Bagikan langsung via WhatsApp saat tengah malam tiba.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Works ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-2">
              Inspirasi Kado
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Cerita yang telah tersampaikan.
            </h2>
          </div>
          <Link href="/galeri" className="text-sm font-medium text-neutral-900 hover:text-black flex items-center gap-1">
            Lihat semua kado <span>→</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {featured.map((gift) => (
            <Link
              key={gift.id}
              href={`/${gift.slug}`}
              className="group rounded-2xl border border-neutral-200/70 p-6 hover:border-neutral-400 transition-all bg-white hover:shadow-md"
            >
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Kado untuk
              </p>
              <h3 className="italic-display text-2xl text-neutral-900 mb-4 group-hover:text-black">
                {gift.recipient_name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-6">
                &ldquo;{gift.opening_text}&rdquo;
              </p>
              <div className="flex justify-between items-center text-[11px] text-neutral-400 border-t border-neutral-100 pt-4">
                <span>{gift.cards.length} kartu cerita</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-neutral-900 font-medium">Buka ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Minimalist Apple Callout ──────────────────────────── */}
      <section className="bg-neutral-950 text-white py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400 mb-4">
            Mulai Hari Ini
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
            Berikan kejutan yang akan ia kenang selalu.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-10">
            Hanya {PREMIUM_PRICE_LABEL} sekali bayar. Tanpa langganan, tanpa iklan.
          </p>
          <Link
            href="/buat"
            className="inline-block bg-white text-neutral-950 font-medium text-sm px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-all active:scale-[0.98]"
          >
            Bikin Kado Sekarang
          </Link>
        </div>
      </section>

      {/* ── Apple-Style Minimal Footer ────────────────────────── */}
      <footer className="border-t border-neutral-200/60 py-10 px-6 bg-white text-neutral-400 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} BacaKado. Dirancang dengan minimalis untuk momen berharga.</p>
          <div className="flex items-center gap-6 text-neutral-500">
            <Link href="/galeri" className="hover:text-neutral-900 transition-colors">Galeri</Link>
            <Link href="/buat" className="hover:text-neutral-900 transition-colors">Editor Kado</Link>
            <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Kado Saya</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
