# ELEMENT.MD — Panduan Standar Desain Web & Spesifikasi Komponen (iOS Style x Gift Experience)

Dokumen ini merupakan panduan terpusat (*Single Source of Truth*) untuk seluruh elemen antarmuka (UI), token desain, tipografi, ukuran, padding, serta komponen pelengkap kado & ucapan di aplikasi **BacaKado**.

Tujuan panduan ini adalah menggabungkan **standar industri web modern (WCAG 2.1, W3C, Responsive Touch Targets)** dengan **keanggunan Apple iOS Human Interface Guidelines (HIG)** dan estetika emosional kado personal (*craftsmanship*).

---

## 1. Analisis & Prinsip Fondasi: Standar Web x iOS Style

| Parameter | Standar Web (W3C / WCAG) | Prinsip iOS HIG (Apple) | Sintesis BacaKado |
|---|---|---|---|
| **Grid & Spacing** | Kelipatan 4px / 8px | Grid 8pt dengan inset margin 16pt / 20pt | **8-Point Rhythm**: Padding & margin konsisten (`4, 8, 12, 16, 20, 24, 32, 48, 64px`). |
| **Touch Target** | WCAG Target Size: min 24×24px (AA) / 44×44px (AAA) | Minimum 44×44pt untuk seluruh elemen interaktif | **Mobile Touch First**: Seluruh tombol, field, dan tab interaktif memiliki area sentuh minimal **44×44px** di smartphone. |
| **Tipografi** | Skala modular (1.200 - 1.250), line-height 1.4 - 1.6 | Skala tipografi dinamis (*Large Title* s/d *Caption*), font system ber-tracking rapat | **Dual-Font System**: Sans-serif modern (*Plus Jakarta Sans*) ber-tracking rapat (-0.02em) dipadukan dengan aksen puitis klasik (*Instrument Serif Italic*). |
| **Corner Radius** | `border-radius` standar (4px - 8px) | *Continuous Corner Curves* (Squircle) yang sangat halus | **Squircle Scale**: Menggunakan radius lembut (`12px, 16px, 24px, 32px`, dan `9999px pill`), tanpa sudut patah kaku. |
| **Material & Depth** | Box shadow konvensional, flat card | *Translucent Materials*, blur 20-30px, border tipis 1px berkabut | **Translucent Glassmorphism**: `apple-glass` (backdrop-blur-md, saturasi tinggi, border 1px `rgba(0,0,0,0.06)`). |
| **Warna & Kontras** | Rasio kontras teks min 4.5:1 (WCAG AA) | Warna cerah dinamis, background lembut terpisah kontras | **Warm Paper Palette**: Latar dasar krem hangat (`#FAF8F5`), putih susu (`#FFFFFF`), teks gelap legam (`#1D1D1F`), dan aksen mawar/emas. |

---

## 2. Token Desain Dasar (Design Tokens)

### 2.1. Skala Spacing & Padding (8-Point Grid System)

Gunakan token ini untuk menentukan padding (`p-*`), margin (`m-*`), dan jarak antar-elemen (`gap-*`).

| Token | Ukuran | Kelas Tailwind | Penggunaan Spesifik |
|---|---|---|---|
| **2XS** | `4px` | `p-1`, `gap-1` | Jarak mikro antar ikon dan teks inline, padding toolbar emoji. |
| **XS** | `8px` | `p-2`, `gap-2` | Padding badge kecil, celah elemen dalam list rapat. |
| **SM** | `12px` | `p-3`, `gap-3` | Padding internal input kecil, padding tombol kompak, gap tombol aksi. |
| **MD** | `16px` | `p-4`, `gap-4` | **Standar Inset iOS:** Padding dasar kartu mobile, margin kiri-kanan halaman HP (`px-4`). |
| **LG** | `20px` | `p-5`, `gap-5` | Padding kartu konten nyaman, celah grid galeri. |
| **XL** | `24px` | `p-6`, `gap-6` | Margin halaman tablet/desktop (`px-6`), padding modal dialog. |
| **2XL** | `32px` | `p-8`, `gap-8` | Padding modal besar, jarak antar section form. |
| **3XL** | `48px` | `p-12`, `gap-12` | Padding vertikal section halaman (*Hero / Gallery section*). |
| **4XL** | `64px` | `p-16`, `gap-16` | Jarak pemisah makro antar blok section landing page. |

---

### 2.2. Skala Tipografi & Hirarki Teks

Aplikasi menggunakan kombinasi:
1. **Sans-serif Primer:** `Plus Jakarta Sans` (Representasi visual modern khas Apple SF Pro).
2. **Serif Aksen:** `Instrument Serif` (Gaya puitis, editorial, dan hangat untuk ucapan kado).

| Level Tipografi | Ukuran (px / rem) | Font Family | Weight | Tracking & Leading | Kelas Tailwind |
|---|---|---|---|---|---|
| **Large Title / Hero** | `36px - 44px` (2.25 - 2.75rem) | Instrument Serif (Italic) | Normal (400) | `tracking-tight leading-[1.15]` | `font-serif italic text-4xl sm:text-5xl tracking-tight` |
| **Title 1 (H1)** | `28px - 32px` (1.75 - 2.0rem) | Plus Jakarta Sans / Serif | Medium / SemiBold | `tracking-tight leading-tight` | `text-2xl sm:text-3xl font-bold tracking-tight` |
| **Title 2 (H2)** | `22px - 24px` (1.375 - 1.5rem) | Plus Jakarta Sans | SemiBold (600) | `tracking-tight leading-snug` | `text-xl sm:text-2xl font-semibold tracking-tight` |
| **Title 3 (H3)** | `18px - 20px` (1.125 - 1.25rem) | Plus Jakarta Sans | SemiBold (600) | `tracking-normal leading-snug` | `text-lg font-semibold` |
| **Body (Normal)** | `15px - 16px` (0.9375 - 1.0rem) | Plus Jakarta Sans | Regular (400) | `tracking-normal leading-relaxed` | `text-sm sm:text-base leading-relaxed` |
| **Callout / Medium** | `14px` (0.875rem) | Plus Jakarta Sans | Medium (500) | `tracking-normal leading-normal` | `text-sm font-medium` |
| **Footnote / Subtext**| `12px - 13px` (0.75 - 0.8125rem) | Plus Jakarta Sans | Regular / Medium | `tracking-normal leading-normal` | `text-xs text-neutral-500` |
| **Caption / Badge** | `10px - 11px` (0.625 - 0.6875rem) | Plus Jakarta Sans | Bold (700) | `tracking-[0.15em] uppercase` | `text-[11px] font-semibold uppercase tracking-wider` |

---

### 2.3. Radius Sudut (Corner Curvature / Squircles)

Hindari sudut lancip kaku (0px). Ikuti tingkatan kurva iOS berikut:

| Nama Radius | Nilai | Kelas Tailwind | Penggunaan Elemen |
|---|---|---|---|
| **Radius S** | `8px` | `rounded-lg` | Badge kecil, thumbnail mini, item tag. |
| **Radius M** | `12px` | `rounded-xl` | Tombol sekunder, input form, pill segmented control. |
| **Radius L** | `16px` | `rounded-2xl` | Kartu kecil, widget audio mini, dropdown menu. |
| **Radius XL** | `24px` | `rounded-3xl` | Kartu Polaroid, kontainer section utama, kartu kado. |
| **Radius XXL** | `32px` | `rounded-[32px]` / `rounded-4xl` | Modal Sheet, lembar amplop 3D, mockup smartphone. |
| **Full Pill** | `9999px` | `rounded-full` | Tombol CTA utama, status view pill, avatar, tombol like counter. |

---

### 2.4. Palet Warna & Transparansi Material (iOS Materiality)

#### Warna Dasar (Neutral & Background)
- **Paper Light (Latar Hangat Utama):** `#FAF8F5` (`bg-[#FAF8F5]`) — Menghilangkan kesan putih rumah sakit yang silau; memberikan tekstur kertas buku mewah.
- **Card Surface:** `#FFFFFF` (`bg-white`) — Permukaan kartu murni.
- **Dark Surface:** `#18181B` / `#121214` — Permukaan malam / midnight.
- **Border Default:** `rgba(0, 0, 0, 0.07)` s/d `rgba(0, 0, 0, 0.1)` (`border-neutral-200/80` atau `border-black/[0.08]`).
- **Divider Hairline:** `rgba(0, 0, 0, 0.05)` (`border-neutral-100`).

#### Warna Aksen Emosional & Interaksi
- **Rose Velvet (Cinta/Romantis):** `#F43F5E` (Hover: `#E11D48`, Background Tint: `#FFF1F2`).
- **Champagne Gold (Ulang Tahun/Elegan):** `#F59E0B` (Hover: `#D97706`, Background Tint: `#FEF3C7`).
- **Emerald Mint (Keberhasilan/Sukses):** `#10B981` (Hover: `#059669`, Background Tint: `#ECFDF5`).
- **Midnight Indigo (Galaxy/Misteri):** `#6366F1` (Hover: `#4F46E5`, Background Tint: `#EEF2FF`).
- **WhatsApp Green:** `#25D366` (Hover: `#20BA59`).

#### Material Transparan (*Vibrancy & Blur*)
```css
/* Efek Kaca Apple Terang */
.apple-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* Efek Kaca Apple Gelap */
.apple-glass-dark {
  background: rgba(22, 22, 23, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## 3. Komponen Antarmuka Web Standar (iOS UI Library)

### 3.1. Tombol (Buttons)

Seluruh tombol harus memenuhi **tinggi minimum 44px di mobile** agar nyaman ditekan jempol, memiliki umpan balik sentuh (*active scale 97%*), dan transisi mulus.

#### 1. Primary Button (Tombol Utama / CTA)
- **Tinggi:** 44px - 48px (`h-11` atau `h-12`)
- **Radius:** `rounded-full` (Gaya Apple Dynamic Button)
- **Style:** Background hitam pekat / warna tema, teks putih, bayangan halus.
```tsx
<button className="h-11 px-6 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">
  <span>Lanjut ke Pembayaran</span>
  <ArrowRight size={14} />
</button>
```

#### 2. Secondary Pill Button (Tombol Sekunder)
- **Tinggi:** 40px - 44px
- **Radius:** `rounded-full`
- **Style:** Background putih, border lembut, teks netral gelap.
```tsx
<button className="h-11 px-5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-2">
  <ChevronLeft size={14} />
  <span>Kembali</span>
</button>
```

#### 3. Tinted Soft Button (Tombol Aksen Lembut)
- **Tinggi:** 36px - 40px
- **Style:** Warna latar pastel 10-15% opacity, teks berwarna senada.
```tsx
<button className="h-9 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5">
  <Heart size={14} className="fill-rose-500" />
  <span>Kirim Cinta</span>
</button>
```

#### 4. Icon Touch Button (44×44px Standard)
- Area sentuh minimal 44×44px meskipun ikon berukuran 16-20px.
```tsx
<button className="w-11 h-11 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-black/5 transition-colors">
  <Share2 size={18} />
</button>
```

---

### 3.2. Form Input & Kontrol (Inputs & Forms)

Mengikuti tata letak form bergaya **iOS Inset Grouped Table** (bidang input bersih berlatar abu-abu sangat muda atau putih dengan border lembut).

#### 1. Text Input Standar
- **Tinggi:** 44px (`h-11`)
- **Radius:** `rounded-xl`
- **Padding:** `px-3.5`
- **Font Size:** Minimal `16px` di mobile (atau `text-xs sm:text-sm` dengan cegah auto-zoom iOS Safari: `text-[16px] sm:text-sm`).
```tsx
<div className="space-y-1.5">
  <label className="text-xs font-semibold text-neutral-700 block">
    Nama Penerima
  </label>
  <input
    type="text"
    placeholder="Contoh: Rara"
    className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-200/90 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
  />
</div>
```

#### 2. Textarea Ucapan
- **Radius:** `rounded-2xl`
- **Resize:** `resize-none`
```tsx
<textarea
  rows={3}
  placeholder="Tuliskan ucapan kenangan..."
  className="w-full p-3.5 rounded-2xl bg-white border border-neutral-200/90 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all resize-none"
/>
```

#### 3. iOS Segmented Control (Pilihan Tab Geser)
- Kontainer abu-abu oval berisi pill aktif putih melayang dengan bayangan lembut.
```tsx
<div className="p-1 rounded-full bg-neutral-100 flex items-center gap-1 border border-neutral-200/60 max-w-xs">
  <button className="flex-1 py-1.5 rounded-full text-xs font-semibold text-neutral-900 bg-white shadow-2xs transition-all">
    Daftar Kado
  </button>
  <button className="flex-1 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-all">
    Balasan Masuk
  </button>
</div>
```

---

### 3.3. Modal & Lembar Bawah (iOS Bottom Sheet / Dialog)

Pada perangkat mobile, modal idealnya muncul dari bawah (*Bottom Sheet*) dengan pegangan geser (*drag handle*), sementara pada desktop menjadi centered dialog berlatar blur.

```tsx
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
  <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/[0.08] relative">
    {/* Mobile Drag Indicator Pill */}
    <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-4 sm:hidden" />
    
    {/* Konten Modal */}
    <div className="text-center">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Judul Lembar
      </h2>
      <p className="text-xs text-neutral-500 mt-1">
        Keterangan singkat penjelasan modal.
      </p>
    </div>
  </div>
</div>
```

---

## 4. Komponen Spesifik Keperluan Kado & Ucapan (Gift Experience Elements)

Bagian ini memuat spesifikasi teknis dan visual untuk elemen-elemen estetika kado yang dapat Anda rancang dan kembangkan lebih lanjut.

---

### 4.1. Amplop 3D Realistis & Segel Lilin (Envelope & Wax Seal)

Elemen visual utama saat kado pertama kali dibuka oleh penerima.

#### Spesifikasi Amplop 3D:
- **Dimensi Luar:** Mobile: `310px × 215px`, Tablet/Desktop: `350px × 235px`.
- **Perspektif 3D:** Kontainer diberi style `perspective: 1200px`.
- **Flap Penutup (Lipatan Atas):** 
  - Dibentuk menggunakan CSS borders segitiga transparan.
  - Transformasi rotasi buka: `rotateX(180deg)` dengan durasi `700ms cubic-bezier(0.4, 0, 0.2, 1)`.
  - `transform-origin: top`.
- **Surat di Dalam Saku:**
  - Meluncur keluar saat dibuka: `-translate-y-20` (mobile) atau `-translate-y-24` (desktop).

#### Spesifikasi Segel Lilin Timbul (Wax Seal Embossed):
- **Bentuk:** Lingkaran timbul berdiameter `54px` (mobile) / `58px` (desktop).
- **Variasi Lilin:**
  - *Ruby Wax:* `radial-gradient(circle at 35% 35%, #F43F5E, #9F1239 80%)` dengan box-shadow ganda luar-dalam.
  - *Gold Wax:* `radial-gradient(circle at 35% 35%, #FDE047, #B45309 85%)`.
  - *Emerald Wax:* `radial-gradient(circle at 35% 35%, #34D399, #065F46 85%)`.
- **Animasi Pendar:** Menggunakan `@keyframes wax-seal-glow` (pendaran cincin halus 2.5s).
- **Interaksi Klik:** Memancarkan ledakan micro-sparkle canvas confetti (28 partikel) dan delay transisi `950ms` sebelum beralih ke dek kartu.

---

### 4.2. Dek Kartu Foto Polaroid & Scrapbook (Polaroid Card Deck)

Format tampilan foto dan teks kenangan yang memberi nuansa fisik (*tactile*) layaknya memegang foto cetak asli.

#### Spesifikasi Bingkai Polaroid:
- **Warna Bingkai:** Putih murni (`#FFFFFF`) dengan border hairline `1px solid rgba(0, 0, 0, 0.06)`.
- **Proporsi Padding Khas Polaroid:**
  - Atas, kiri, kanan: `16px` (`p-4`).
  - Bagian bawah (area tulisan pesan): `24px` s/d `28px` (`pb-6` / `pb-7`).
- **Aspek Rasio Foto:** `aspect-[4/3]` atau `aspect-square`, sudut foto sedikit melengkung `rounded-2xl`.
- **Efek Kemiringan Organik (Organic Tilt):**
  - Tumpukan kartu diacak dengan sudut kemiringan antara `-1.8deg` sampai `+1.8deg` (`-1.5deg`, `+1.8deg`, `-0.9deg`, `+1.4deg`).
- **Selotip Washi Tape:**
  - Letak: Menempel di tepi atas tengah (`-top-3 left-1/2 -translate-x-1/2`).
  - Lebar & Tinggi: `110px × 24px`.
  - Tepi bergerigi: `border-left: 2px dashed`, `border-right: 2px dashed`.
  - Transparansi: Opacity 85-90% dengan backdrop blur 2px.
- **Tumpukan Melayang (Card Stack Peeking):**
  - Kartu berikutnya sedikit mengintip di balik kartu aktif (Layer 1: scale 0.96 rotate 1deg, Layer 2: scale 0.92 rotate -2deg).
- **Lembaran Tanpa Foto (Love Letter Classic):**
  - Jika kartu tidak memiliki foto, area foto otomatis berganti menjadi lembaran kertas bertinta hangat (`bg-amber-50/50 border border-amber-100/80`) dengan ikon gulungan surat (`<IosEmoji symbol="📜" size={32} />`).

---

### 4.3. Pemutar Musik Piringan Vinyl & Equalizer (Vinyl Record Player)

Menghadirkan kenikmatan audio berwujud fisik yang tersinkronisasi saat amplop dibuka.

#### Spesifikasi Piringan Hitam:
- **Diameter:** Mini pill: `40px × 40px`, Display: `120px × 120px`.
- **Tekstur Alur (Grooves):** Kombinasi multi-inset box shadow cincin konsentris warna putih transparan 4% dan hitam 80%.
- **Efek Pantulan Cahaya (Vinyl Shine):** `conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.12) 40deg, ...)` yang memberikan kilau dinamis saat berputar.
- **Rotasi Otomatis:** `@keyframes spin-slow` (360° dalam 8 detik, linear tak terhingga).
- **Soundwave Visualizer:** 4 batang vertikal berayun dinamis (`eq-bounce-1` s/d `eq-bounce-4`) yang aktif saat audio berputar dan diam datar saat jeda.

---

### 4.4. Atmosfer Ruang & Partikel Melayang (Floating Ambience)

Latar belakang dinamis yang memberikan nyawa dan kehangatan pada halaman tanpa membebani performa browser HP:

| Tema Kado | Jenis Partikel | Aset Emoji / Simbol | Karakteristik Animasi |
|---|---|---|---|
| **Romantis / Pacar** | Kelopak mawar & Hati | 🌸 / 💕 | Kelopak berayun zigzag turun ke bawah, hati melayang perlahan naik ke atas. |
| **Ulang Tahun** | Confetti & Kerlip Emas | ✨ / 🎉 | Kerlip bintang berdenyut (*scale 0.85 ke 1.25*), kilau emas hangat. |
| **Wisuda & Prestasi** | Bintang Kejora | ⭐ / ✨ | Pendar bintang bertaburan dengan latar gradient hangat/terang. |
| **Midnight Galaxy** | Neon Hearts & Stars | 💜 / ✨ | Partikel indigo berpendar dengan latar gelap pekat bertabur bintang malam. |
| **Latar Sentral Glow** | Radial Gradient | Warna glow tema | Radial blur 120px di tengah layar berlatar opacity 20%. |

---

### 4.5. Interaksi Selebrasi & Balasan (Closing & Interaction)

Di akhir perjalanan kado, hadirkan momen emosional timbal balik:

1. **Multi-Wave Celebration Confetti:**
   - Gelombang 1 (0ms): 70 partikel emas & mawar spread 80°.
   - Gelombang 2 (450ms): 50 partikel sekunder spread 100°.
2. **Tombol "Kirim Peluk & Cinta" (Reaction Burst):**
   - Pill berlatar rose lembut dengan love counter interaktif.
   - Setiap ketukan menghasilkan letupan confetti hati mini (16 partikel) dan menambah angka suka (`+1, +2, ...`).
3. **Form Balasan Kartu Pos (Postcard Container):**
   - Bingkai kartu pos rapi di mana penerima dapat menulis nama dan pesan balasan singkat.
   - Begitu terkirim, kartu beralih ke state ucapan terima kasih dengan `<IosEmoji symbol="🎉" />`, dan pesan tersimpan otomatis ke dasbor pengirim.
4. **Viral Loop CTA:**
   - Tombol penutup yang memicu siklus viral: *"Bikin Kado Personal Punyamu Sendiri ↗"* menuju `/buat`.

---

### 4.6. Sistem iOS Emoji (Standar Penggunaan & Skala)

Untuk menjaga konsistensi tampilan Apple Retina di seluruh perangkat (Android, Windows, iOS):

#### Hirarki Ukuran Emoji:
- **Mikro / Inline Button (12px - 14px):** Untuk badge status, label preset, atau ikon tombol kecil (`size={14}`).
- **Inline Text / Regular (16px - 18px):** Untuk emoji di dalam kalimat paragraf atau input text (`size={18}`).
- **Sub-Header / Card Highlight (20px - 24px):** Untuk judul kartu atau ringkasan dasbor (`size={22}`).
- **Komponen Spesial (32px - 42px):** Untuk segel amplop, penutup kartu pos, dan ikon kosong (*empty state*) (`size={36}`).

#### Cara Penggunaan Komponen:
```tsx
import { IosEmoji, EmojiText, IosEmojiBar } from "@/components/ui/IosEmoji";

// 1. Menampilkan satu emoji Apple Retina
<IosEmoji symbol="💌" size={24} />

// 2. Mengurai teks bebas (otomatis ganti unicode jadi emoji Apple)
<EmojiText text="Selamat ulang tahun Rara! 🎂✨ Semoga selalu bahagia ❤️" size={18} />

// 3. Menampilkan toolbar ketuk untuk menyisipkan emoji di formulir
<IosEmojiBar onSelect={(emoji) => appendEmoji(emoji)} />
```

---

## 5. Ringkasan Kelas Preset Tailwind CSS Siap Pakai (Cheat Sheet)

| Kebutuhan Komponen | Kelas Tailwind Siap Pakai |
|---|---|
| **Latar Halaman Utama** | `min-h-screen bg-[#FAF8F5] text-neutral-900 antialiased` |
| **Navbar Kaca Blur** | `bg-white/80 backdrop-blur-md border-b border-neutral-200/60 sticky top-0 z-20` |
| **Kartu Kontainer Standar** | `bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all p-5 sm:p-6` |
| **Kartu Bingkai Polaroid** | `polaroid-frame rounded-3xl p-4 sm:p-5 relative` |
| **Tombol CTA Utama** | `h-11 sm:h-12 px-6 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2` |
| **Tombol Pill Sekunder** | `h-10 sm:h-11 px-5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]` |
| **Tombol Reaksi Cinta** | `px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-all active:scale-95 shadow-2xs flex items-center gap-2` |
| **Field Input Teks** | `w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-200/90 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all` |
| **Textarea Ucapan** | `w-full p-3.5 rounded-2xl bg-white border border-neutral-200/90 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all resize-none` |
| **Badge / Status Pill** | `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs` |
| **Bottom Sheet Modal** | `w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/[0.08]` |

---

## 6. Pedoman Do & Don't (Aturan Baku Desain)

### ✅ LAKUKAN (DO):
1. **Gunakan Spacing Kelipatan 4/8:** Selalu gunakan margin dan padding standar (`p-4`, `p-5`, `p-6`).
2. **Prioritaskan Touch Targets 44px:** Pastikan setiap tombol dan kolom form di mobile dapat disentuh jempol dengan mudah tanpa sengaja menekan elemen lain di dekatnya.
3. **Gunakan `<EmojiText />`:** Untuk setiap pesan teks buatan pengguna (ucapan kado, balasan), selalu gunakan `<EmojiText />` agar emoji tampil seragam dan tidak pecah menjadi emoji sistem Android/Windows yang kaku.
4. **Gunakan Transisi Halus & Feedback Sentuh:** Tambahkan `active:scale-95` atau `active:scale-[0.98]` pada elemen yang bisa diklik.
5. **Gunakan Shadow Lembut Difus:** Gunakan `shadow-xs`, `shadow-sm`, atau `shadow-2xs`. Hindari bayangan hitam pekat dengan opacity tinggi.

### ❌ HINDARI (DON'T):
1. **Jangan Gunakan Sudut Lancip Kaku:** Hindari `rounded-none` atau radius sangat kecil (1-2px) untuk kartu dan tombol utama.
2. **Jangan Gunakan Border Hitam Tebal:** Hindari `border-2 border-black` yang terkesan kasar seperti gaya Neo-brutalism kecuali secara sengaja diminta.
3. **Jangan Memasang Emoji Mentah di Teks Komponen:** Hindari menulis string unicode langsung `<span>❤️</span>` tanpa komponen `<IosEmoji />` karena akan dirender sebagai emoji bawaan Android/Windows.
4. **Jangan Buat Area Klik Lebih Kecil dari 36px di Mobile:** Jangan pernah membuat tombol atau ikon interaktif dengan tinggi/lebar di bawah 36px tanpa tambahan padding klik.
5. **Jangan Lupa Status Loading & Disabled:** Setiap tombol yang memicu Server Action atau verifikasi API wajib menampilkan indikator loading (*spinner / status disabled*).
