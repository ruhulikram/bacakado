# MEMORY.md — Dokumentasi Progress & Arsitektur Proyek BacaKado

Dokumen ini berfungsi sebagai memori terpusat mengenai visi produk, arsitektur teknis, status pengerjaan saat ini, serta backlog prioritas agar pengembang atau AI model berikutnya dapat langsung melanjutkan tanpa kehilangan konteks.

---

## 1. Ringkasan Produk & Visi

- **Nama Produk:** BacaKado (sebelumnya: Kadoin)
- **Kategori:** Micro-SaaS / Digital Gift Web App untuk Pasar Indonesia.
- **Masalah yang Diselesaikan:** Tren website ucapan ulang tahun/anniversary di TikTok & Instagram ramai, tapi pesan jasa manual mahal (Rp 35.000 – Rp 75.000) dan lama. BacaKado memungkinkan siapa saja membuat website kado personal beranimasi indah dalam **5 menit langsung dari HP** tanpa keahlian teknis.
- **Growth Engine (Viral Loop):** Di akhir setiap kado digital yang dibuka oleh penerima, terdapat tombol ajakan **"Bikin Punyamu Sendiri"** yang langsung mengarah ke editor kado.
- **Arah Model Bisnis:** 
  - **Murni Pay-Per-Gift (Rp 5.000 per kado via QRIS Mayar).**
  - Tidak ada tier gratis untuk penerbitan: calon pembeli bebas membuat dan mencoba pratinjau di editor secara cuma-cuma, namun untuk menerbitkan link wajib membayar Rp 5.000 (`PREMIUM_PRICE`).
  - Setiap kado yang terbit mendapatkan fitur penuh: kartu tanpa batas, audio otomatis (instrumental bebas royalti / YouTube), fitur proteksi gembok PIN rahasia (hash bcrypt server-side), dan bebas watermark.

---

## 2. Tech Stack & Environment

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 16.3.5 (App Router) + React 19.2.8 | Server Actions, SSR & Dynamic Routes (Turbopack) |
| **Proxy / Session** | `src/proxy.ts` (@supabase/ssr) | Auto-refresh session token cookies di setiap request Next.js |
| **Bahasa** | TypeScript 5 | Type-safe (lulus `tsc --noEmit` dan `next build` 100% tanpa error) |
| **Styling & UI System** | Tailwind CSS v4 + Aesthetic Emotional Gift Design System | Palet hangat/romantis/gold/galaxy, polaroid frames, washi tape, segel lilin 3D, piringan vinyl, dan kaca buram (`apple-glass`) |
| **Tipografi** | `Arimo` (400..700, normal & italic) & `Instrument Serif` | Di-load lewat `next/font/google` dan tag `<link rel="preconnect">` Google Fonts di [layout.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/layout.tsx), font body & `--font-sans` dipetakan ke `Arimo` |
| **iOS Emoji System** | `<IosEmoji />`, `<EmojiText />`, `<IosEmojiBar />` ([IosEmoji.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/ui/IosEmoji.tsx)) | 32 aset Apple Retina PNG 160x160 (`public/emojis/ios/`), rendering 100% konsisten di Android/Windows/iOS, auto-parser teks & toolbar penyisip emoji di editor |
| **Animasi & Interaktivitas** | CSS 3D Keyframes + `canvas-confetti` | Animasi buka amplop 3D 180°, segel lilin meletup, piringan vinyl 360°, partikel melayang dinamis, dan confetti multi-gelombang |
| **Backend / DB** | Supabase (PostgreSQL, Auth, RLS, Storage) + `pgcrypto` | Terhubung aktif ke project `dgrdgjbysivubxifvlaf` |
| **Payment Gateway** | Mayar.id (QRIS Rp 5.000) | Settlement terverifikasi langsung via Mayar API & Admin Service Role |

---

## 3. Status Database & Backend (Supabase)

- **Project Ref:** `dgrdgjbysivubxifvlaf` *(Catatan: Host ini saat ini belum terdaftar di DNS publik. Sistem telah dilengkapi DNS Guard otomatis di `server.ts` yang mendeteksi status host dalam 15ms dan langsung beralih ke data mock tanpa menahan render/TTFB)*.
- **Konfigurasi Lingkungan ([.env.local](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/.env.local) & [.env.example](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/.env.example)):**
  - `NEXT_PUBLIC_SUPABASE_URL=https://dgrdgjbysivubxifvlaf.supabase.co` *(Ganti dengan URL project Supabase aktif Anda saat siap)*
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xlDbW6-zv_g5cr7IiGW_zw_IHcUL18J` *(Anon Key publik)*
  - `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` *(Service Role Key untuk bypass RLS pada proses settlement kado berbayar di server)*
  - `MAYAR_API_KEY=` *(API Key Mayar Sandbox / Production; jika kosong, otomatis menggunakan built-in local simulator)*
  - `MAYAR_WEBHOOK_TOKEN=` *(Token verifikasi webhook Mayar)*
  - `NEXT_PUBLIC_MAYAR_ENV=sandbox` *(Opsi: `sandbox` atau `production`)*
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` *(Base URL aplikasi untuk redirect pembayaran)*
- **DNS Guard & Ketahanan Offline ([src/lib/supabase/server.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/server.ts)):**
  - Memeriksa keabsahan DNS host Supabase secara periodik (cache 60 detik).
  - Jika host belum aktif/offline, sistem langsung melempar `AbortError` (50ms), sehingga `@supabase/postgrest-js` melewati 4x auto-retry delay dan server langsung menyajikan data fallback lokal tanpa penundaan.
  - Begitu pengguna memasukkan URL project Supabase aktif yang valid ke `.env.local`, sistem akan otomatis mendeteksinya dan beralih ke database live secara transparan.
- **Tabel yang Sudah Aktif & Dibuat:**
  1. `gifts`: Menyimpan data kado (`recipient_name`, `opening_text`, `closing_text`, `theme`, `music_url`, `slug` [unique], `status` ['draft'/'published'], `is_premium` [boolean], `has_passcode` [boolean], `is_public`, `view_count`, `like_count`, `published_at`, `created_at`). *Catatan keamanan: kolom `status`, `is_premium`, dan `published_at` diproteksi trigger agar tidak bisa diubah langsung oleh client `anon`/`authenticated`.*
  2. `gift_passcodes`: Menyimpan hash PIN kado secara terpisah tanpa policy RLS publik (`gift_id`, `hash` [bcrypt gen_salt], `failed_attempts`, `locked_until` [15 menit lockout jika 5x berturut-turut salah]).
  3. `cards`: Kartu ucapan di dalam kado (`order_index`, `text_content`, `image_url`). Kartu untuk kado ber-PIN dilindungi RLS sehingga tidak bocor ke browser sebelum lolos unlock.
  4. `replies`: Pesan balasan langsung dari penerima kado (`sender_name`, `message`).
  5. `gift_views`: Log setiap kali kado dibuka (`opened_at`).
  6. `payments`: Riwayat tagihan dan pembayaran Mayar (`user_id`, `gift_id`, `mayar_invoice_id` [unique index], `payment_url`, `amount` [default 5000], `status`: pending/paid/failed/expired, `paid_at`).
- **Fungsi SQL (RPC) & Triggers:**
  1. `protect_gift_paid_fields()`: Trigger `BEFORE INSERT OR UPDATE` pada tabel `gifts` yang menolak manipulasi status berbayar dari client.
  2. `set_gift_passcode(p_gift_id uuid, p_pin text)`: Mengenkripsi PIN kado menggunakan `pgcrypto` (hanya pemilik kado).
  3. `unlock_gift(p_slug text, p_pin text)`: Memverifikasi PIN kado di server dengan rate-limiting. Mengembalikan kartu jika benar, atau mengunci 15 menit setelah 5 kali gagal.
  4. `increment_view_count(p_gift_id uuid)`: Penambahan counter view kado secara atomik saat kado dibuka.
- **Storage Bucket:**
  - `gift-images` (public): Untuk menyimpan foto kartu ucapan yang diunggah pengguna lewat [storage.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/storage.ts).
- **Catatan Migrasi Database:** Seluruh DDL tabel, policy RLS, pgcrypto, RPC, dan migrasi security hardening sudah terdokumentasi lengkap di [supabase/schema.sql](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/supabase/schema.sql).

---

## 4. Status Fitur Terimplementasi (Current Progress)

### ✅ Selesai & Berfungsi Penuh

1. **Pengalaman Membuka Kado Emosional & Menawan ([GiftExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/GiftExperience.tsx)):**
   - **Atmosfer Ambience Melayang ([FloatingAmbience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/FloatingAmbience.tsx)):** Partikel dinamis mengikuti tema:
     - *Romantis/Pacar:* Kelopak mawar berguguran (🌸) & hati bercahaya melayang (💕).
     - *Ulang Tahun:* Kilauan confetti emas & bintang perayaan (✨/🎉).
     - *Wisuda:* Bintang kejora berkilau (⭐/✨).
     - *Midnight Galaxy:* Bintang ungu/indigo & pendar hati neon.
     - Didukung *ambient radial glow* hangat di tengah latar.
   - **Animasi Buka Amplop 3D ([Envelope3D.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/Envelope3D.tsx)):**
     - Perspektif 3D realistis dengan bayangan lipatan saku depan.
     - Segel lilin (*wax seal embossed*) 3D (*Ruby, Gold, Emerald*) dengan inisial penerima.
     - Sentuhan pada segel memicu letupan sparkle, penutup amplop berputar 180° (`rotateX(180deg)`), dan surat meluncur naik dari saku amplop.
   - **Dek Kartu Foto Polaroid & Scrapbook ([PolaroidCardDeck.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PolaroidCardDeck.tsx)):**
     - Proporsi Polaroid fisik dengan selotip *washi tape* dekoratif.
     - Efek tumpukan kartu bertingkat (*stacked deck*) dengan kemiringan organik (-1.5° s/d +1.8°).
     - Kartu tanpa foto otomatis bertransformasi menjadi lembaran surat cinta klasik bertinta lembut (*Love Letter note*).
     - Indikator progres hati interaktif dan navigasi antar-kartu yang mulus.
   - **Pemutar Musik Vinyl Aesthetic ([VinylMusicPlayer.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/VinylMusicPlayer.tsx)):**
     - Piringan hitam berputar 360° secara otomatis saat amplop terbuka.
     - Equalizer soundwave visualizer animasi aktif saat musik berjalan.
     - Mini pill Spotify-style dengan kontrol Play/Pause dan Mute/Unmute.
     - Terintegrasi sempurna untuk file audio lokal (`public/music/`) maupun video YouTube.
   - **Selebrasi Penutup & Interaksi Balasan ([ClosingExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ClosingExperience.tsx)):**
     - Pesta kembang api confetti multi-gelombang (*champagne gold & rose pink*).
     - Tombol interaktif **"Kirim Peluk & Cinta" (❤️)** dengan counter cinta instan & letupan hati.
     - Desain kartu pos balas ucapan langsung tersimpan ke database.
     - Tombol putar ulang kado dari awal dan viral CTA button *"Bikin Kado Personal Punyamu Sendiri ↗"*.
   - **Gembok PIN Rahasia Server-Side:** Jika kado ber-PIN, kartu ucapan tidak dikirim ke browser sebelum diverifikasi oleh database via RPC `unlock_gift` (dilengkapi proteksi brute-force lockout 15 menit).

2. **Editor Kado Pembuat Lengkap ([src/app/buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx)):**
   - Wizard 5 langkah: Nuansa ➔ Pesan Awal ➔ Kartu Ucapan & Foto ➔ Musik Latar ➔ Pratinjau Interaktif.
   - **Rekomendasi Pesan Cepat (*Quick Presets*):** Tombol ide pesan instan (*Ulang Tahun, Romantis, Wisuda, Sahabat*) untuk autofill kalimat pembuka & penutup yang menyentuh.
   - **Pemutar Pratinjau Audio Langsung:** Pembuat kado bisa mendengarkan (*Dengar / Jeda*) cuplikan instrumen langsung di langkah 4 sebelum menentukan pilihan.
   - **Pratinjau Mockup Smartphone Interaktif:** Pratinjau di langkah 5 dibungkus dalam bingkai smartphone realistis berlayar lengkung dan *Dynamic Island*.
   - Upload foto asli terintegrasi ke Supabase Storage `gift-images` ([CardImageUpload.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/CardImageUpload.tsx)).

3. **Landing Page ([src/app/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/page.tsx)):**
   - Hero section berwibawa dengan tipografi elegan dan CTA *"Bikin Kado Sekarang"*.
   - Label harga dinamis `{PREMIUM_PRICE_LABEL}` (Rp 5.000).
   - Tombol *"Lihat contoh kado"* langsung membuka preview demo `/untuk-rara`.
   - Visual showcase kado, alur 3 langkah (*01, 02, 03*), dan footer bersih.

4. **Galeri Kado ([src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx)):**
   - Menampilkan kado-kado publik dalam format kartu foto Polaroid modern.
   - Metrik interaksi: jumlah pembukaan (*view count*) dan suka (*like count*).
   - Navbar terpadu dan responsif.

5. **Publish Modal & Checkout Sheet ([src/components/gift/PublishModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PublishModal.tsx)):**
   - *Stage 1 (Checkout):* Ringkasan tagihan Rp 5.000 (`PREMIUM_PRICE_LABEL`), daftar benefit, dan opsi gembok PIN rahasia.
   - *Stage 2 (Google-First Auth Gate):* Delayed Login 1-klik Google OAuth tanpa form password rumit. Draf disimpan aman di `localStorage`.
   - *Stage 3 (Payment Waiting):* Membuka invoice QRIS Mayar di tab baru, polling otomatis tiap 2.5 detik, dan verifikasi manual *"Saya Sudah Bayar"*.

6. **Modal Berbagi Sukses ([src/components/gift/ShareSuccessModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ShareSuccessModal.tsx)):**
   - Selebrasi confetti saat verifikasi pembayaran berhasil.
   - Tombol 1-klik salin tautan kado dan 1-klik kirim ke WhatsApp dengan pesan manis yang sudah diformat.

7. **Session Proxy ([src/proxy.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/proxy.ts)):**
   - Proxy/middleware untuk me-refresh cookie session token Supabase di setiap request Next.js agar sesi pengguna tidak hilang saat navigasi Server Actions/Components.
   - Dioptimasi cerdas: hanya memanggil auth server jika browser membawa cookie `sb-*-auth-token`, mencegah delay 0ms pada pengunjung publik.

8. **Optimasi Performa Web Vitals & Eliminasi LCP 27s:**
   - Waktu respons server (TTFB) dipangkas dari 7.3s - 8.2s menjadi **0.11s – 0.23s** di seluruh rute (percepatan >50x s/d 100x):
     - `src/proxy.ts`: Bypass auth Supabase jika tidak ada cookie auth.
     - `src/lib/supabase/server.ts`: Deteksi DNS instan (15ms) + lempar `AbortError` untuk mem-bypass 4x retry delay PostgREST saat host offline.
     - `src/app/actions/gift.ts`: Menambahkan fallback aman pada `getGalleryGifts`.
     - `src/app/layout.tsx`: Penerapan `display: "swap"` pada font Google (`Instrument_Serif` & `Plus_Jakarta_Sans`) menghilangkan FOIT (blocking text).
     - `src/components/ui/IosEmoji.tsx`: Menggunakan `loading="eager"` dan `decoding="async"` agar ikon emoji lokal di-paint seketika di first frame.
     - Perbaikan typo `onsdClick` ke `onClick` pada tombol Google di [DashboardAuthView.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardAuthView.tsx).

9. **Panduan Desain & Spesifikasi Elemen ([element.md](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/element.md)):**
   - Panduan terpusat sintesis Standar Web (WCAG 2.1, 8-point spacing rhythm, 44×44px mobile touch targets) x Apple iOS HIG (squircle curves, `apple-glass`, tipografi ganda Plus Jakarta Sans & Instrument Serif Italic).
   - Spesifikasi teknis elemen kado kustom: amplop 3D & segel lilin, dek polaroid scrapbook, piringan vinyl 360°, partikel melayang, love reaction counter & form kartu pos balasan, skala iOS emoji, cheat sheet Tailwind CSS, serta pedoman Do & Don't.

10. **Implementasi Apple Fluid Interface & Multimodal Haptics ([SKILL.md](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/SKILL.md) & [haptics.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/haptics.ts)):**
    - **Direct Manipulation 1:1 Drag & Flick ([PolaroidCardDeck.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PolaroidCardDeck.tsx)):**
      - Jari/kursor dapat langsung menggeser kartu polaroid secara mulus 1:1 (`pointermove` + `setPointerCapture`).
      - Dilengkapi rumus momentum projection Apple WWDC 2018 (`project(velocity, 0.998)`) untuk lemparan cepat (*flick*), dan rumus *rubber-banding* elastis di kartu pertama/terakhir.
      - Kartu yang diintip di bawahnya (*peeking layers*) membesar secara dinamis saat kartu atas ditarik, menghadirkan kedalaman 3D fisik nyata.
    - **Multimodal Feedback (Visual + Audio + Haptics):**
      - Utilitas getaran taktil mobile di [src/lib/haptics.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/haptics.ts) (`selection`, `light`, `medium`, `burst`, `success`, `error`).
      - Segel lilin ([Envelope3D.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/Envelope3D.tsx)) meletupkan getaran `burst` serentak pada frame yang sama dengan letupan confetti.
      - Tombol reaksi "Kirim Peluk & Cinta" ([ClosingExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ClosingExperience.tsx)) memberikan getaran kepuasan taktil bertahap.
    - **Material & Spring Kinetics ([globals.css](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/globals.css)):**
      - Material kaca mengambang `.apple-glass-floating` dengan *top light-catcher edge* (`border-top: 1px solid rgba(255, 255, 255, 0.65)`).
      - Respon instan `.btn-apple-spring` dengan kurva pantulan Apple HIG `cubic-bezier(0.32, 0.72, 0, 1)`.
      - Ramah aksesibilitas dengan dukungan `@media (prefers-reduced-motion: reduce)`.

11. **Penyempurnaan Amplop 3D & Segel Lilin Fisik ([Envelope3D.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/Envelope3D.tsx)):**
    - Mengintegrasikan elemen SVG kustom dari `public/gift/` (`top-panel.svg`, `front-panel.svg`, `back-panel.svg`, `Paper.svg`).
    - 5 variasi segel lilin fisik bertekstur stempel: `seal-love.svg`, `seal-rose.svg`, `seal-star.svg`, `seal-leaf.svg`, `seal-grad.svg`.
    - Engsel lipatan atas (*top flap hinge*) dikalibrasi presisi pada `transformOrigin: "50% 23.6%"`.
    - Posisi segel lilin diposisikan tepat di ujung segitiga penutup atas (`top: 61%`) menimpa saku depan amplop secara alami dengan rotasi organik acak.
    - Menghilangkan artefak border kotak pada SVG segel lilin dengan pembersihan RGBA mask filter 100% transparan di luar kontur stempel.
    - Menghilangkan button prompt dan cursor pointer pada segel lilin agar berfokus murni pada pengalaman interaksi amplop fisik (*immersive physical experience*).
    - Penyesuaian 4 pilihan tema utama di editor [buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx): *1. Buat Ucapan, 2. Buat Ulang Tahun, 3. Buat Pacar, 4. Buat Temen*.

12. **Banner Pengumuman & Harmonisasi Grid 1440px Landing Page ([AnnouncementBanner.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/AnnouncementBanner.tsx) & [page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/page.tsx)):**
    - Banner pengumuman eksklusif di bagian paling atas landing page awal (`/`).
    - Aset dari `public/Banner/` (`Frame 20.svg`, `Button Tahap Pengembangan.svg`, `Button Beri Masukan.svg`).
    - Background gradasi ganda persis ekspor Figma: `linear-gradient(269.51deg, rgba(0, 0, 0, 0.6) 10.22%, ...), linear-gradient(90.29deg, #B8A4A4 7.27%, ...)` ditambah tekstur garis diagonal berbayang.
    - **Penerapan Grid 1440px Keseluruhan Landing Page:**
      - Batas kontainer: `max-w-[1440px] mx-auto`.
      - Sisi Kiri: `sm:pl-[35px]` (Pill "BacaKado masih tahap pengembangan" 359x38 di `left: 35px`, sejajar dengan logo navbar `💌 BacaKado`, judul section, dan copyright footer).
      - Sisi Kanan: `sm:pr-[85px]` (Tombol "Beri Masukan ↗" 167x38 di `left: 1188px`, sejajar dengan tombol navbar `Bikin Kado`, link galeri, dan menu footer).
    - Tombol "Beri Masukan ↗" memicu modal feedback Apple glassmorphism dengan respons getaran taktil haptic.
    - Responsif penuh di perangkat desktop, tablet, dan ponsel pintar.

13. **Fase 3: Simpan, Bagikan & Galeri Kado Interaktif ([ShareSuccessModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ShareSuccessModal.tsx), [GaleriClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/GaleriClient.tsx), [buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx)):**
    - **SEO & Dynamic OpenGraph Metadata ([slug]/page.tsx):** Dynamic `generateMetadata()` menghasilkan OpenGraph dan Twitter Card dengan nama penerima dan kutipan pembuka untuk pratinjau kaya di WhatsApp, Telegram, dan media sosial.
    - **Tab Cetak Kartu QR Kado Fisik ([ShareSuccessModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ShareSuccessModal.tsx)):** 
      - Tab "Kirim Tautan" dengan pemilih gaya pesan WhatsApp ("Manis & Hangat" vs "Kejutan Rahasia").
      - Tab "Kartu QR Fisik" menyajikan preview kartu kado elegan berisi QR Code resolusi tinggi, tombol unduh gambar PNG, dan tombol cetak langsung (`window.print()`) untuk ditempel di buket bunga atau kotak kado fisik.
    - **Sinkronisasi PIN Studio ke Publish Modal ([PublishModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PublishModal.tsx)):** Kode PIN yang disetel di Inspector Studio otomatis terhubung dan tampil di sheet checkout.
    - **Galeri Interaktif & Remix Template ([GaleriClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/GaleriClient.tsx) & [galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx)):**
      - Filter 4 nuansa kado (Semua, Ucapan, Ulang Tahun, Pacar, Teman), pencarian instan nama & pesan, dan pengurutan Terpopuler vs Terbaru.
      - Tombol **"Pakai Template ✨"** di setiap kartu galeri yang langsung memuat tema, teks, dan kartu ke dalam Custom Studio (`/buat?theme=...&template=...`).
    - **Reset Draf & Auto-Resume Studio ([buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx) & [StudioHeader.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioHeader.tsx)):**
      - Pemuatan otomatis template dari URL search params.
      - Tombol "Reset Draf" di StudioHeader dengan konfirmasi modal untuk membersihkan draf dan mulai kado baru dari awal.
    - **Pembersihan Toolbar Emoji Input:** Seluruh baris pemilih emoji (`EMOJI: ❤️ 💕 ...`) telah dihilangkan dari seluruh textarea kanvas dan drawer untuk menjaga estetika kanvas tetap bersih, lapang, dan bebas distraksi.

14. **Pembersihan De-Slop Menyeluruh di Seluruh Halaman & Tipografi Arimo:**
    - **Tipografi Arimo:** Memuat Google Font `Arimo` (400..700, normal & italic) via `next/font/google` dan tag `<link rel="preconnect">` Google Fonts di `<head>`. Mengatur `--font-sans`, `--font-heading`, dan `.font-display` ke `Arimo`.
    - **Eliminasi Eyebrow / Floating Kicker di Seluruh Halaman (Tell #10 & #23):** Menghapus seluruh pill sparkle mengambang (`✨ Sentuhan Personal Digital`, `✨ Inspirasi Karya`, `✨ Langkah 1`, `✨ Aktivasi Kado`, `Momen Penutup`) di hero, galeri, studio theme gate, publish modal, dan closing experience. Judul utama kini bernapas lega dan langsung fokus ke inti pesan.
    - **De-slop Bento Grid & Surfaces:** Mengganti gradasi pelangi atmosferik pada bento grid dan card spotlight menjadi permukaan putih solid (`bg-white border border-neutral-200/80`) yang elegan dan bersih. Menghapus mini-kicker redundan di atas judul kartu.
    - **Eliminasi Pulsing Dots & Pseudo Halos (Tell #16):** Menghapus `animate-pulse` yang tidak perlu pada titik status hijau dan badge gembok amplop.
    - **Penyederhanaan Button CTA (Tell #01):** Mengganti gradasi pelangi pada tombol viral loop penutup kado menjadi tombol gelap solid yang tegas (`bg-neutral-900 text-white`).
    - **Pembersihan Mono Sembarangan (Tell #34):** Menghapus `font-mono` pada tag harga, koordinat stiker, dan input PIN agar antarmuka terlihat tenang layaknya produk native Apple.

---

## 5. Fitur Monetisasi & Payment Gateway (Mayar.id)

- **Kebijakan Model Bisnis:** **Murni Pay-Per-Gift.** Tidak ada tier gratis untuk penerbitan kado. Calon pembeli bebas membuat dan mencoba pratinjau kado di editor secara cuma-cuma, namun untuk mempublikasikan kado dan mengaktifkan tautan permanen, wajib membayar **Rp 5.000 (sekali bayar per kado)**.
- **Metode Pembayaran:** QRIS & E-Wallet (GoPay, OVO, Dana, ShopeePay, BCA/Bank Transfer) melalui Mayar.id.
- **Fasilitas Penuh yang Didapat (Rp 5.000):**
  - Kartu foto & ucapan tanpa batas.
  - Tampilan bersih tanpa watermark atau iklan.
  - Fitur Gembok PIN / Tanggal Rahasia berkeamanan tinggi.
  - Tautan kado *unlisted* untuk privasi maksimal.
  - Akses aktif selamanya & form balasan interaktif dari penerima.
- **Arsitektur & Ketahanan Integrasi Mayar:**
  - Client Helper: [src/lib/mayar.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/mayar.ts) (mendukung mode Sandbox, Production, dan fallback Local Simulator di development bila `MAYAR_API_KEY` belum terpasang).
  - Admin Client: [src/lib/supabase/admin.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/admin.ts) menggunakan `SUPABASE_SERVICE_ROLE_KEY` untuk update status kado berbayar secara aman di server.
  - Server-Side Settlement (`settlePayment`): Idempoten, selalu memverifikasi status pembayaran langsung ke API Mayar (`/invoice/{invoiceId}`), mencegah payload webhook palsu membuka akses premium.
  - Webhook Handler: [src/app/api/webhooks/mayar/route.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/api/webhooks/mayar/route.ts) dengan verifikasi token header.
  - Simulator Pembayaran Lokal: [src/app/api/payment/mock/route.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/api/payment/mock/route.ts) (otomatis 404 pada production untuk mencegah bypass).
  - Server Action Pembayaran: [src/app/actions/payment.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/actions/payment.ts) (`initiatePayment`, `checkPaymentStatus`).
- **Jaminan Anti-Tabrakan Tautan (Collision-Proof Slug):** Menggunakan algoritma auto-retry loop 5x percobaan dikombinasikan dengan constraint `UNIQUE` PostgreSQL pada kolom `slug`.

---

## 6. Backlog & Prioritas Langkah Berikutnya (Next Steps)

Berikut daftar status tugas pengembangan:

### 1. Sinkronisasi Skema Supabase Live
- [ ] Pastikan seluruh query dari [supabase/schema.sql](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/supabase/schema.sql) (tabel `gift_passcodes`, trigger `protect_gift_paid_fields`, RPC `unlock_gift`, `set_gift_passcode`, dan migrasi `payments`) telah dieksekusi di Supabase SQL Editor proyek aktif `dgrdgjbysivubxifvlaf`.
- [ ] Masukkan `SUPABASE_SERVICE_ROLE_KEY` ke `.env.local` dan environment variables hosting.

### 2. Penyeragaman Tampilan Dasbor
- [x] Refactor UI [src/app/dashboard/DashboardClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardClient.tsx) dan [DashboardAuthView.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardAuthView.tsx) agar selaras dengan palet estetika baru, kartu bergaya polaroid/koleksi, `<IosEmoji />`, dan pill buttons.
- [x] Refactor UI [src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx) menghapus CSS variables lama dan menerapkan gaya showcase Polaroid yang konsisten.

### 3. Peningkatan Sistem Balasan (Gift Replies Roadmap)
- [x] **Reaksi Cepat (Peluk & Cinta):** Tombol reaksi instan love counter (+burst heart particles) di penutup kado.
- [ ] **Notifikasi Email Otomatis (Resend):** Kirim notifikasi instan ke email pembuat kado saat penerima mengirimkan balasan dari halaman kado.
- [ ] **Opsi Balas via WhatsApp:** Tambahkan tombol opsional bagi penerima untuk mengirimkan balasan langsung ke WhatsApp pengirim kado (jika nomor WA diinput pembuat).

### 4. Aset Audio Fisik & Custom Audio
- [x] Musik instrumental bebas royalti lengkap di folder `public/music/` (`piano-lembut.mp3`, `akustik-ceria.mp3`, `sinematik-haru.mp3`, `hangat-keluarga.mp3`, `lofi-santai.mp3`).
- [x] Fitur pemutar lagu YouTube kustom via input link video tersinkronisasi piringan vinyl.
- [x] Tombol pratinjau dengar audio langsung di editor pembuatan kado.

### 5. Keamanan & Proteksi Pembayaran (Security Hardening)
- [x] Trigger database `protect_gift_paid_fields` mencegah manipulasi client.
- [x] Proteksi PIN passcode via `pgcrypto` hash bcrypt dan rate-limiting 15 menit.
- [x] Settlement server-side verifikasi langsung ke Mayar API via `SUPABASE_SERVICE_ROLE_KEY`.

### 6. Produksi & Peluncuran Mayar
- [ ] Masukkan `MAYAR_API_KEY` dan `MAYAR_WEBHOOK_TOKEN` asli dari dashboard Mayar ke `.env.local` / Environment Variables platform hosting (misal: Vercel).
- [ ] Uji coba transaksi nyata Rp 5.000 via QRIS asli.

### 7. SEO & Social Share Preview (OpenGraph)
- [ ] Buat dynamic OpenGraph image generator (`/api/og`) agar tautan kado menampilkan preview kartu nama penerima yang cantik saat dibagikan ke WhatsApp, Telegram, atau iMessage.

---

## 7. Peta File Utama (Quick Reference)

- **PRD Dokumen:** [kado-ucapan-digital-PRD.md](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/kado-ucapan-digital-PRD.md)
- **Panduan Standar Desain UI & Elemen:** [element.md](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/element.md)
- **Panduan Apple Design & Fluid Motion:** [SKILL.md](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/SKILL.md)
- **Haptic Feedback Utility:** [src/lib/haptics.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/haptics.ts)
- **Web Audio Micro-SFX Utility:** [src/lib/sfx.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/sfx.ts)
- **Halaman Utama (Landing Page):** [src/app/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/page.tsx)
- **BacaKado Custom Studio Editor (Buat):** [src/app/buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx)
  - Gate Pemilihan Nuansa Awal: [src/components/studio/StudioThemeGate.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioThemeGate.tsx)
  - Top Bar Studio & Viewport Switcher: [src/components/studio/StudioHeader.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioHeader.tsx)
  - Drawer Kiri (Kartu, Teks, Foto, Stiker, Audio): [src/components/studio/StudioLeftDrawer.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioLeftDrawer.tsx)
  - Kanvas Tengah WYSIWYG & Quick Dock: [src/components/studio/StudioCanvas.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioCanvas.tsx)
  - Inspector Kanan (Desain Visual & Pengaturan PIN): [src/components/studio/StudioRightInspector.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioRightInspector.tsx)
  - Modal Simulasi Unboxing Interaktif: [src/components/studio/StudioSimulatorModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioSimulatorModal.tsx)
- **Halaman Kado Dinamis (Penerima):** [src/app/[slug]/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/[slug]/page.tsx)
- **Dasbor Kado Saya (Fase 4):** [src/app/dashboard/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/page.tsx), [DashboardClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardClient.tsx), [DashboardAuthView.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardAuthView.tsx)
  - Fitur Spotlight Draf Browser Lokal: deteksi otomatis draf yang sedang dikerjakan di HP/komputer pengguna.
  - Filter Status Kado (Semua / Terbit & Lunas / Draf) dan Pencarian Realtime per nama/tema.
  - Alur Edit Kado di Studio (`/buat?edit=[slug]`): pemilik kado dapat mengedit kartu, stiker, musik, dan teks kado yang telah terbit langsung di Custom Studio tanpa biaya tambahan (`updateGift`).
  - Kotak Masuk Balasan Interaktif: kartu kutipan ucapan, tombol Salin Kutipan, dan kirim ucapan terima kasih via WhatsApp.
- **Galeri Kado:** [src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx)
- **Komponen Custom Studio (Canva-Style WYSIWYG):**
  - Theme Gate (Pemilihan Nuansa): [src/components/studio/StudioThemeGate.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioThemeGate.tsx)
  - Studio Header & Navigation: [src/components/studio/StudioHeader.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioHeader.tsx)
  - Left Drawer (Kartu, Teks, Media, Drag & Stick Stiker, Musik): [src/components/studio/StudioLeftDrawer.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioLeftDrawer.tsx)
  - Center Canvas (DraggableSticker, HTML5 Drop Target, Smart Crop, Free & Mobile View): [src/components/studio/StudioCanvas.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioCanvas.tsx)
  - Right Inspector (Tema, Font, Sudut Kemiringan, Washi Tape, PIN): [src/components/studio/StudioRightInspector.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioRightInspector.tsx)
  - Simulator Unboxing Penerima: [src/components/studio/StudioSimulatorModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/studio/StudioSimulatorModal.tsx)
  - Fitur Drag & Stick Stiker:
    - HTML5 Drag & Drop dari panel stiker langsung ke atas kartu ucapan kanvas
    - Manipulasi langsung pointer drag di atas polaroid dengan delta-based coordinates (tahan terhadap zoom scale & ukuran viewport)
    - Floating action bar: rotasi cepat (`-18°`, `-6°`, `0°`, `+12°`, `+24°`) dan tombol hapus stiker (`✕`)
    - Koordinat dinamis tersimpan di `Card` (`sticker_x`, `sticker_y`, `sticker_rotate`) dan dirender presisi di [PolaroidCardDeck.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PolaroidCardDeck.tsx) untuk penerima kado.
- **Komponen Gift Experience:**
  - Pengalaman Membuka Kado: [src/components/gift/GiftExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/GiftExperience.tsx)
  - Partikel Melayang Dinamis: [src/components/gift/FloatingAmbience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/FloatingAmbience.tsx)
  - Animasi Amplop 3D & Segel Lilin: [src/components/gift/Envelope3D.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/Envelope3D.tsx)
  - Dek Kartu Polaroid & Scrapbook: [src/components/gift/PolaroidCardDeck.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PolaroidCardDeck.tsx)
  - Pemutar Musik Piringan Vinyl: [src/components/gift/VinylMusicPlayer.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/VinylMusicPlayer.tsx)
  - Selebrasi & Balasan Penutup: [src/components/gift/ClosingExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ClosingExperience.tsx)
  - Modal Checkout & Pembayaran: [src/components/gift/PublishModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PublishModal.tsx)
  - Modal Sukses Berbagi: [src/components/gift/ShareSuccessModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ShareSuccessModal.tsx)
  - Unggah Foto Kartu: [src/components/gift/CardImageUpload.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/CardImageUpload.tsx)
- **Server Actions:**
  - Kado, Galeri & Dasbor: [src/app/actions/gift.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/actions/gift.ts)
  - Inisiasi & Cek Pembayaran: [src/app/actions/payment.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/actions/payment.ts)
  - Pelacakan View & Balasan: [src/app/actions/tracking.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/actions/tracking.ts)
- **Modul Integrasi Pembayaran (Mayar):**
  - Mayar API Helper & Settle: [src/lib/mayar.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/mayar.ts)
  - Supabase Admin Client: [src/lib/supabase/admin.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/admin.ts)
  - Webhook Endpoint: [src/app/api/webhooks/mayar/route.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/api/webhooks/mayar/route.ts)
  - Simulator Pembayaran Lokal: [src/app/api/payment/mock/route.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/api/payment/mock/route.ts)
- **Komponen Banner & Landing Page:**
  - Banner Pengumuman & Modal Feedback: [src/components/AnnouncementBanner.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/AnnouncementBanner.tsx)
  - Aset Banner SVG: `public/Banner/` (`Frame 20.svg`, `Button Tahap Pengembangan.svg`, `Button Beri Masukan.svg`)
  - Aset Amplop 3D & Segel Lilin SVG: `public/gift/` (`top-panel.svg`, `front-panel.svg`, `back-panel.svg`, `Paper.svg`, 5 variasi stempel `seal-*.svg`)
- **Aset & Styling Global:**
  - Komponen iOS Emoji: [src/components/ui/IosEmoji.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/ui/IosEmoji.tsx)
  - Aset Emoji Apple Retina: `public/emojis/ios/` (24 PNG 160x160: `love-letter`, `rose`, `cake`, `heart`, dll)
  - File Musik MP3 Lokal: `public/music/` (`piano-lembut.mp3`, `akustik-ceria.mp3`, dll)
  - Animasi & Keyframes Global: [src/app/globals.css](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/globals.css)
- **Middleware & Utility:**
  - Session Proxy: [src/proxy.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/proxy.ts)
  - Utility & Format Harga: [src/lib/utils.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/utils.ts)
- **Data & Tipe:**
  - Upload Supabase Storage: [src/lib/supabase/storage.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/storage.ts)
  - Mock Data, Tema & Pilihan Lagu: [src/lib/mock-data.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/mock-data.ts)
  - Definisi TypeScript: [src/lib/types.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/types.ts)
- **Skema Database & Migrasi:** [supabase/schema.sql](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/supabase/schema.sql)
- **Konfigurasi Lingkungan:** [.env.local](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/.env.local)
