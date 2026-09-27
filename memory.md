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
| **Framework** | Next.js 16.3.5 (App Router) + React 19.2.8 | Server Actions, SSR & Dynamic Routes |
| **Proxy / Session** | `src/proxy.ts` (@supabase/ssr) | Auto-refresh session token cookies di setiap request Next.js |
| **Bahasa** | TypeScript 5 | Type-safe (lulus `tsc --noEmit` tanpa error) |
| **Styling** | Tailwind CSS v4 + Apple Minimalist Design System | Palet monokrom titanium, hairline borders, frosted glass (`apple-glass`), tanpa warna gradien norak |
| **Tipografi** | `Plus Jakarta Sans` (Apple-style tracking & hierarchy) & `Instrument Serif` | Di-load lewat `next/font/google` di [layout.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/layout.tsx) |
| **Animasi** | CSS Transitions + Apple-style champagne confetti | Animasi pembukaan amplop minimalis & transisi kartu fluid |
| **Backend / DB** | Supabase (PostgreSQL, Auth, RLS, Storage) + `pgcrypto` | Terhubung aktif ke project `dgrdgjbysivubxifvlaf` |
| **Payment Gateway** | Mayar.id (QRIS Rp 5.000) | Settlement terverifikasi langsung via Mayar API & Admin Service Role |

---

## 3. Status Database & Backend (Supabase)

- **Project Ref:** `dgrdgjbysivubxifvlaf`
- **Konfigurasi Lingkungan ([.env.local](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/.env.local)):**
  - `NEXT_PUBLIC_SUPABASE_URL=https://dgrdgjbysivubxifvlaf.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xlDbW6-zv_g5cr7IiGW_zw_IHcUL18J`
  - `SUPABASE_SERVICE_ROLE_KEY=` *(Service Role Key untuk bypass RLS pada proses settlement kado berbayar di server)*
  - `MAYAR_API_KEY=` *(API Key Mayar Sandbox / Production)*
  - `MAYAR_WEBHOOK_TOKEN=` *(Token verifikasi webhook Mayar)*
  - `NEXT_PUBLIC_MAYAR_ENV=sandbox` *(Opsi: `sandbox` atau `production`)*
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` *(Base URL aplikasi untuk redirect pembayaran)*
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
1. **Landing Page ([src/app/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/page.tsx)):**
   - Mengusung standar **Apple Minimalist Design** (monokrom titanium, hairline border, kaca buram `apple-glass`).
   - Hero section berwibawa dengan tipografi serif elegan dan tombol CTA *"Bikin Kado"*.
   - Menampilkan label harga dinamis `{PREMIUM_PRICE_LABEL}` (Rp 5.000).
   - Tombol *"Lihat contoh kado"* langsung membuka preview demo `/untuk-rara`.
   - Visual showcase mockup kartu presisi, bagian alur 3 langkah (*01, 02, 03*), dan footer monokrom bersih.
2. **Gift Experience Penerima ([src/components/gift/GiftExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/GiftExperience.tsx)):**
   - Alur 4 tahap: `cover` ➔ `envelope` (amplop arsitektural minimalis) ➔ `cards` (kartu foto & narasi teks) ➔ `closing` (champagne confetti + pesan penutup).
   - **Gembok PIN Rahasia Server-Side:** Jika kado memiliki `has_passcode = true`, konten kartu ucapan tidak dikirim ke browser sebelum diverifikasi oleh database via RPC `unlock_gift`. Dilengkapi proteksi brute-force (kunci 15 menit jika 5x berturut-turut salah).
   - **Audio Ganda:** Mendukung file audio lokal instrumental bebas royalti (`<audio>`) atau pemutar tersemat YouTube (`<iframe>` playsinline + autoplay begitu amplop dibuka).
   - Form balasan langsung dari penerima ke pengirim tersimpan otomatis ke tabel `replies`.
   - Tombol viral loop *"Bikin Punyamu Sendiri"*.
   - Fallback otomatis ke data mock ([src/lib/mock-data.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/mock-data.ts)) jika diakses via demo slug.
3. **Editor Kado Pembuat ([src/app/buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx)):**
   - Wizard 5 langkah: Nuansa ➔ Pesan Awal ➔ Kartu Ucapan & Foto ➔ Musik Latar ➔ Pratinjau Interaktif.
   - Pilihan musik: Instrumental Bebas Royalti (Pixabay) atau link YouTube kustom dengan validasi regex (`youtubeId`) realtime.
   - Upload foto kartu asli ([src/components/gift/CardImageUpload.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/CardImageUpload.tsx)) terintegrasi ke Supabase Storage `gift-images` (dengan opsi fallback link URL).
   - Pratinjau interaktif real-time di step 5 persis seperti yang dilihat penerima kado.
4. **Publish Modal & Checkout Sheet ([src/components/gift/PublishModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/PublishModal.tsx)):**
   - Didesain seperti **Apple Pay / Apple Store Receipt**:
     - *Stage 1 (Checkout):* Ringkasan tagihan Rp 5.000 (`PREMIUM_PRICE_LABEL`), daftar benefit kado, dan input opsional PIN/Passcode proteksi.
     - *Stage 2 (Google-First Auth Gate):* Delayed Login disederhanakan — cukup 1 sentuhan *"Lanjutkan dengan Google & Bayar"* tanpa form email/password yang memperlambat konversi. Draf disimpan di `localStorage` dan dieksekusi via `usePendingPublish`.
     - *Stage 3 (Payment Waiting):* Membuka invoice QRIS Mayar di tab baru, polling otomatis setiap 2.5 detik untuk mendeteksi konfirmasi pembayaran, serta tombol verifikasi manual *"Saya Sudah Bayar"*.
5. **Modal Berbagi Sukses ([src/components/gift/ShareSuccessModal.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/ShareSuccessModal.tsx)):**
   - Selebrasi champagne confetti begitu pembayaran berhasil diverifikasi.
   - Tombol 1-klik salin tautan kado (dengan feedback status tersalin).
   - Tombol 1-klik kirim langsung ke WhatsApp dengan template pesan ucapan manis yang sudah terformat.
   - Tombol akses langsung ke halaman kado dan navigasi ke dasbor pengguna.
6. **Session Proxy ([src/proxy.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/proxy.ts)):**
   - Proxy/middleware untuk me-refresh cookie session token Supabase di setiap request Next.js agar sesi pengguna tidak hilang saat navigasi antar Server Actions/Components.

### 🟡 Berfungsi Penuh (Dijadwalkan untuk Refresh Gaya Apple Minimalist)
1. **Dashboard "Kado Saya" ([src/app/dashboard/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/page.tsx)):**
   - Dilengkapi login gate Google-First ([DashboardAuthView.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardAuthView.tsx)).
   - Menampilkan metrik: Total Kado Dibuat, Total Dibuka, dan Balasan Masuk.
   - Tab Daftar Kado (salin link, share WhatsApp, lihat kado, hapus kado) dan Tab Kotak Masuk Balasan.
   - *Status UI:* Fungsional 100%, siap diselaraskan dari styling warna lama ke Apple Minimalist Design System.
2. **Galeri Kado ([src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx)):**
   - Menampilkan kado-kado publik beserta metrik view count dan kartu.
   - *Status UI:* Fungsional 100%, siap diselaraskan dari styling warna lama ke Apple Minimalist Design System.

### 💌 Arsitektur Sistem Balasan (Gift Replies Flow)
- **Titik Pengiriman:** Tahap penutup (*closing stage*) di [GiftExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/GiftExperience.tsx) setelah semua kartu selesai dibuka dan confetti meledak.
- **Data yang Dikirim:** Penerima memasukkan `Nama` dan `Pesan Balasan`.
- **Eksekusi Server:** Ditangani oleh Server Action `submitReply` ([src/app/actions/tracking.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/actions/tracking.ts)).
- **Penyimpanan:** Tersimpan di tabel `replies` PostgreSQL Supabase (`gift_id`, `sender_name`, `message`, `created_at`).
- **Hak Akses & Privasi (RLS):** Siapa saja yang membuka kado publik boleh mengirim balasan (`INSERT`), namun **hanya pemilik akun pembuat kado (`auth.uid() = user_id`) yang berhak membaca (`SELECT`)** seluruh balasan yang masuk.
- **Tampilan Pembuat:** Pembuat kado dapat membaca seluruh balasan masuk di [Dasbor Kado Saya](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/page.tsx) pada tab **"Pesan Balasan"** lengkap dengan identitas pengirim, tanggal kirim, kado yang dituju, serta teks balasannya.

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

### 2. Penyeragaman Apple Minimalist UI (Dasbor & Galeri)
- [ ] Refactor UI [src/app/dashboard/DashboardClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardClient.tsx) ke palet monokrom titanium, hairline borders, dan pill buttons khas Apple.
- [ ] Refactor UI [src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx) menghapus CSS variables lama (`--k-warm-white`, `--k-midnight`) dan menerapkan gaya showcase yang konsisten.

### 3. Peningkatan Sistem Balasan (Gift Replies Roadmap)
- [ ] **Notifikasi Email Otomatis (Resend):** Kirim notifikasi instan ke email pembuat kado saat penerima mengirimkan balasan dari halaman kado.
- [ ] **Opsi Balas via WhatsApp:** Tambahkan tombol opsional bagi penerima untuk mengirimkan balasan langsung ke WhatsApp pengirim kado (jika nomor WA diinput pembuat).
- [ ] **Reaksi Cepat / Audio:** Eksplorasi tombol emoji reaction (❤️, 🥹, 🥳) atau upload voice note singkat dari penerima kado.

### 4. Aset Audio Fisik & Custom Audio
- [x] Musik instrumental bebas royalti (Pixabay) di folder `public/music/` (`piano-lembut.mp3`, `akustik-ceria.mp3`, `sinematik-haru.mp3`, `hangat-keluarga.mp3`, `lofi-santai.mp3`).
- [x] Fitur pemutar lagu YouTube kustom via input link video.

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
- **Halaman Utama (Landing Page):** [src/app/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/page.tsx)
- **Editor Kado (Buat):** [src/app/buat/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/buat/page.tsx)
- **Halaman Kado Dinamis (Penerima):** [src/app/[slug]/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/[slug]/page.tsx)
- **Dasbor Kado Saya:** [src/app/dashboard/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/page.tsx), [DashboardClient.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardClient.tsx), [DashboardAuthView.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/dashboard/DashboardAuthView.tsx)
- **Galeri Kado:** [src/app/galeri/page.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/app/galeri/page.tsx)
- **Komponen Gift Experience:**
  - Pengalaman Membuka Kado: [src/components/gift/GiftExperience.tsx](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/components/gift/GiftExperience.tsx)
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
- **Middleware & Utility:**
  - Session Proxy: [src/proxy.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/proxy.ts)
  - Utility & Format Harga: [src/lib/utils.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/utils.ts)
- **Data & Tipe:**
  - Upload Supabase Storage: [src/lib/supabase/storage.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/supabase/storage.ts)
  - Mock Data & Pilihan Lagu: [src/lib/mock-data.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/mock-data.ts)
  - Definisi TypeScript: [src/lib/types.ts](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/src/lib/types.ts)
- **Skema Database & Migrasi:** [supabase/schema.sql](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/supabase/schema.sql)
- **Konfigurasi Lingkungan:** [.env.local](file:///c:/Users/ikram/OneDrive/Desktop/bacakado/.env.local)

