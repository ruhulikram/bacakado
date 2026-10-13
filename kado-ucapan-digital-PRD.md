# PRD — Project Requirements Document

## 1. Overview

**Nama Produk (sementara):** BacaKado — SaaS Website Ucapan untuk Indonesia

**Masalah yang Diselesaikan:**
Saat ini, tren "website ucapan ulang tahun" atau kado digital sedang ramai di TikTok dan Instagram. Namun, untuk mendapatkannya, orang harus memesan lewat jasa pembuat dengan biaya mahal, waktu tunggu lama, dan proses yang merepotkan. Di sisi lain, banyak orang Indonesia yang ingin memberikan kejutan personal kepada pacar, sahabat, atau keluarga, tetapi tidak punya kemampuan teknis untuk membuatnya sendiri.

**Tujuan Utama Aplikasi:**
1. Membuat siapa pun bisa membuat website ucapan personal **dalam 5 menit di HP**, tanpa perlu keahlian teknis.
2. Memberikan pengalaman emosional yang berkesan bagi penerima: amplop yang dibuka, kartu foto dan teks, musik, lalu penutup yang mengharukan.
3. Menjadi mesin pertumbuhan organik lewat tombol **"Bikin Punyamu Sendiri"** yang ditaruh di akhir setiap kado.
4. Menghasilkan pendapatan lewat model murni **Pay-Per-Gift (Rp 5.000 per kado via QRIS Mayar)**.

**Nilai Jual Unik:** *"Bikin sendiri, bukan pesan orang lain"* — cepat, terjangkau (Rp 5.000), personal, dan bisa dicoba dulu sebelum bayar.

---

## 2. Requirements

**Kebutuhan Fungsional Utama:**
- Penerima dapat membuka kado digital melalui link unik tanpa perlu login atau aplikasi tambahan.
- Pembuat dapat membuat kado lengkap (tema, pembuka, kartu, musik, penutup) tanpa login terlebih dahulu.
- Pengguna baru dipandu masuk cepat via Google OAuth saat hendak **menerbitkan/membayar (delayed login)** untuk meminimalkan friksi.
- Kado yang sudah dipublish dapat dibagikan sekali sentuh ke WhatsApp dan media sosial.
- Penerima bisa mengirim balasan kepada pengirim langsung dari halaman kado.
- Pengguna dapat melihat kado-kado orang lain sebagai contoh dan ide (galeri).

**Kebutuhan Non-Fungsional:**
- **Mobile-first** — hampir seluruh penerima membuka dari HP; tampilan harus nyaman di layar kecil.
- **Cepat & ringan** — halaman kado harus memuat cepat agar momen dramatis tidak rusak oleh loading lama.
- **Musik hanya diputar setelah interaksi pertama** (buka amplop) agar tidak diblokir otomatis oleh browser (mendukung file audio instrumental bebas royalti atau video embed YouTube).
- **Keamanan & Privasi Maksimal:**
  - Kado ber-PIN dilindungi hashing server-side bcrypt (`pgcrypto`), rate-limiting 5x percobaan (kunci 15 menit), dan konten kartu tidak dikirim ke browser sebelum lolos verifikasi DB (`unlock_gift`).
  - Kolom status pembayaran dilindungi trigger database; hanya service role setelah verifikasi API Mayar yang berhak menandai kado lunas (`settlePayment`).
- **Skalabilitas** — harus tahan jika banyak link kado dibuka bersamaan (efek viral TikTok).

---

## 3. Core Features

Fitur di bawah ini dikelompokkan sesuai fase roadmap yang telah disetujui.

### Fase 1 — Halaman Kado *(pengalaman penerima, inti produk)*
- **Amplop Pembuka** — Penerima mengetuk amplop untuk membuka kejutan dengan rasa penasaran.
- **Proteksi PIN Rahasia (Passcode)** — Bila kado diproteksi PIN, penerima memasukkan PIN sebelum amplop bisa dibuka (divalidasi aman di database).
- **Kartu Foto & Teks** — Kartu berisi foto dan tulisan digeser satu per satu seperti cerita.
- **Musik Latar** — Lagu pilihan (audio instrumental bebas royalti atau pemutar YouTube tersemat) mulai diputar begitu amplop dibuka.
- **Penutup & Balas Ucapan** — Confetti champagne dan form untuk mengirim balasan langsung ke pengirim.
- **Bikin Punyamu Sendiri** — Tombol ajakan di akhir halaman supaya penerima ikut membuat kadonya sendiri.

### Fase 2 — BacaKado Custom Studio *(pengalaman pembuat: interaktif ala Canva & Spline)*

Transformasi dari form wizard bertahap menjadi **Creative Custom Studio WYSIWYG** (3-kolom layout):
- **Gerbang Awal — Penentuan Nuansa Kado (4 Pilihan Utama):**
  Sebelum masuk ke studio, pengguna memilih 1 dari 4 nuansa kado terarah:
  1. **Buat Ucapan** — Momen umum, pencapaian, hari raya, atau apresiasi tulus.
  2. **Buat Ulang Tahun** — Perayaan ceria dengan partikel kilau emas, kue, dan lilin.
  3. **Buat Pacar** — Nuansa romantis bertabur kelopak mawar dan pendar hati lembut.
  4. **Buat Temen** — Persahabatan hangat, santai, dan penuh memori kebersamaan.
  *(Pilihan nuansa ini otomatis memuat palet warna, musik latar default, dan draf pembuka di studio)*.

- **Struktur Workspace Custom Studio:**
  1. **Top Navigation Bar (Studio Header):**
     - Nama Penerima (bisa diedit langsung in-place, misal: *"Kado untuk Rara 💌"*).
     - Indikator Status Simpan Otomatis (*Auto-save indicator* ke LocalStorage).
     - Undo / Redo controls.
     - Viewport Switcher: Mode Layar Smartphone (9:16) vs Responsive View.
     - Tombol **"Uji Buka Kado" (Live Simulation)**: Mengetes alur pembukaan amplop 3D dan geser kartu layaknya penerima.
     - Tombol Aksi Utama: **"Terbitkan Kado ↗"** (memicu Checkout Modal Rp 5.000).

  2. **Sidebar Kiri — Elements & Asset Library (Drawer Alat):**
     - **Tab Kartu Cerita (Slides / Deck):** Daftar tumpukan kartu polaroid, tambah kartu baru, hapus kartu, dan drag-and-drop urutan kartu.
     - **Tab Teks & Pesan:** Pilihan ukuran judul, teks isi, dan *Quick Presets* (rekomendasi kalimat pembuka/penutup emosional).
     - **Tab Foto & Galeri:** Upload foto langsung dari kamera/galeri HP ke Supabase Storage, opsi ganti foto kartu.
     - **Tab Stiker & iOS Emojis:** 32 Apple Retina Emojis PNG, pita kado, washi tape dekoratif, dan stempel segel lilin.
     - **Tab Musik & Audio:** Pustaka audio instrumental bebas royalti (piano, akustik, lofi) serta kolom tautan YouTube kustom.

  3. **Canvas Tengah — Live Interactive WYSIWYG Stage:**
     - Pratinjau kanvas langsung tempat kado dirancang.
     - **Manipulasi Langsung (Direct Manipulation):** Pengguna dapat mengetuk dan mengedit teks secara langsung (*inline editing*), menggeser foto, menambahkan stiker/emoji ke atas kartu, serta mengatur rotasi kemiringan polaroid.
     - Visualisasi realistis amplop 3D bertekstur, segel lilin fisik, dan dek kartu polaroid scrapbook.

  4. **Sidebar Kanan — Inspector & Customization Panel (Properti):**
     - **Tab Desain & Styling:**
       - Pengaturan Kartu Aktif: Pilihan font (*Instrument Serif Italic* vs *Plus Jakarta Sans*), warna teks, sudut rotasi kartu (-5° s/d +5°), dan jenis bingkai polaroid.
       - Efek Partikel Melayang: Kelopak mawar, kilauan bintang, confetti emas, atau pendar neon.
     - **Tab Pengaturan Global (Kado):**
       - Gembok PIN Rahasia: Sakelar proteksi PIN (4-6 digit) untuk privasi intim.
       - Kontrol Musik: Pengaturan volume, autoplay saat amplop dibuka, dan sinkronisasi piringan vinyl.

### Fase 3 — Simpan & Bagikan Link
- **Simpan Draf Otomatis** — Draf kado tersimpan di localStorage agar pengguna bisa mencoba editor tanpa hambatan awal.
- **Publish & Checkout** — Sheet bergaya Apple Pay/Receipt seharga Rp 5.000 via QRIS Mayar.
- **Masuk Cepat (Google Auth)** — Cukup 1 klik masuk dengan akun Google untuk menyimpan kado di dasbor.
- **Link Khusus Unlisted** — Dapatkan link unik tahan tabrakan (auto-retry 5x + UNIQUE constraint DB).
- **Bagikan Cepat** — Kirim link kado sekali sentuh ke WhatsApp dengan template ucapan siap kirim.

### Fase 3 — Galeri Kado *(alasan pengguna kembali lagi)*
- **Jelajah Kado** — Telusuri kado publik yang dibagikan pengguna lain.
- **Cari per Tema** — Filter kado berdasarkan tema.
- **Kado Populer** — Lihat kado yang paling banyak dibuka.

### Fase 4 — Kado Saya (Dasbor Pengguna)
- **Daftar Kado** — Lihat semua kado yang pernah dibuat beserta status tayang dan tautannya.
- **Statistik Kado** — Pantau jumlah kali dibuka (view count).
- **Kotak Masuk Balasan** — Baca pesan balasan dari penerima di satu tempat (hanya pemilik yang memiliki akses RLS).
- **Aksi Cepat** — Salin link, bagikan ke WhatsApp, lihat kado, atau hapus kado.

### Fase 4 — Model Monetisasi (Pay-Per-Gift)
- **Harga Bersahabat:** Rp 5.000 sekali bayar per kado via QRIS / E-Wallet (Mayar.id).
- **Fitur Lengkap yang Didapat:**
  - Kartu foto & narasi teks tanpa batas di Custom Studio.
  - Tampilan bersih tanpa watermark atau iklan.
  - Gembok PIN rahasia opsional berkeamanan tinggi.
  - Tautan *unlisted* permanen aktif selamanya.
  - Form balasan interaktif dari penerima.

---

## 4. User Flow

**A. Perjalanan Pembuat di Custom Studio (5 menit di HP/Desktop, tanpa login dulu)**
1. **Langkah 1: Masuk dari Landing Page** → Ketuk **"Bikin Kado Sekarang"**.
2. **Langkah 2: Pilih Nuansa Kado** → Memilih salah satu dari 4 nuansa (*Buat Ucapan, Buat Ulang Tahun, Buat Pacar, Buat Temen*).
3. **Langkah 3: Masuk ke BacaKado Custom Studio** → Sistem otomatis memuat template kanvas, musik, dan palet sesuai nuansa yang dipilih.
4. **Langkah 4: Personalisasi Kanvas (WYSIWYG)**:
   - Ketik nama penerima di header kanvas.
   - Edit kalimat pembuka dan kartu-kartu polaroid (ketuk teks untuk edit langsung, upload foto kenangan, sisipkan stiker/emoji).
   - Atur musik latar dan aktifkan Gembok PIN (opsional) di panel Inspector kanan.
5. **Langkah 5: Uji Buka Kado (Simulasi)** → Ketuk tombol *Uji Kado* untuk merasakan pengalaman buka amplop 3D dan alur cerita dari sudut pandang penerima.
6. **Langkah 6: Terbitkan Kado (Rp 5.000)** → Ketuk *Terbitkan Kado* → Masuk Cepat Google OAuth (Delayed Login) → Bayar QRIS Mayar Rp 5.000.
7. **Langkah 7: Konfirmasi & Berbagi** → Pembayaran lunas → selebrasi confetti → tautan unik siap dibagikan ke WhatsApp.

**B. Perjalanan Penerima (momen emosional)**
1. Menerima link dari WhatsApp/media sosial → membuka di HP.
2. Melihat pembuka: *"Ada surat buat kamu, [Nama] 💌"* (bila kado ber-PIN, masukkan PIN/tanggal rahasia).
3. Mengetuk amplop → amplop terbuka → lagu latar (audio/YouTube) mulai diputar.
4. Menggeser kartu foto & narasi teks satu per satu.
5. Tiba di penutup: confetti champagne, form balasan ucapan, dan tombol pemutar ulang.
6. Melihat tombol **"Bikin Punyamu Sendiri"** → ketuk → langsung membuka editor untuk membuat kado baru.

**C. Perjalanan Pengguna yang Kembali Lagi**
1. Masuk ke akun lewat Google OAuth.
2. Buka **Kado Saya** → lihat daftar kado, total pembukaan, dan pesan balasan masuk.
3. Atau buka **Galeri Kado** untuk mencari inspirasi kado lainnya.

---

## 5. Architecture

Sistem ini menggunakan arsitektur modern berbasis web dengan Next.js sebagai frontend & server, Supabase sebagai backend + database, dan Vercel sebagai tempat deploy.

**Gambaran Komponen:**
- **Frontend (Next.js 16 di Vercel)** — Menyajikan halaman publik kado (SSR/SSG agar cepat), editor kado, galeri, dashboard akun, dan middleware session refresh (`proxy.ts`).
- **Supabase Backend & Database** — PostgreSQL dengan Row Level Security (RLS), Supabase Auth (Google OAuth), Storage bucket `gift-images`, serta ekstensi `pgcrypto` untuk keamanan PIN.
- **Server Actions & Admin Client** — Server-side logic Next.js yang memanggil Mayar API, RPC PostgreSQL, dan Supabase Service Role client (`SUPABASE_SERVICE_ROLE_KEY`) untuk settlement kado berbayar.
- **Payment Gateway (Mayar.id)** — Menangani pembayaran QRIS otomatis seharga Rp 5.000 sekali bayar per kado.
- **CDN / Edge Vercel** — Mempercepat penyajian halaman kado yang berpotensi viral.

```mermaid
sequenceDiagram
    participant P as Pembuat (HP)
    participant FE as Next.js (App Router)
    participant SB as Supabase (DB + Storage)
    participant MY as Mayar (QRIS)
    participant R as Penerima (HP)

    P->>FE: Susun kado di Editor (tema, narasi, foto, musik/YouTube)
    P->>FE: Buka modal Terbitkan Kado (Rp 5.000)
    alt Belum Login
        FE->>FE: Masuk Cepat via Google OAuth (Delayed Login)
    end
    FE->>SB: Simpan kado (status: draft, has_passcode jika ada PIN)
    FE->>MY: Buat invoice Mayar Rp 5.000
    MY-->>FE: URL Pembayaran QRIS
    FE-->>P: Buka halaman pembayaran QRIS Mayar
    P->>MY: Bayar via QRIS / E-Wallet
    MY->>FE: Webhook pemberitahuan / Polling berkala
    FE->>MY: settlePayment() (verifikasi status invoice langsung ke Mayar API)
    FE->>SB: Service Role aktifkan kado (status: published, is_premium: true)
    FE-->>P: Tampilkan Tautan Kado Unik (Share ke WhatsApp)
    P->>R: Kirim link via WhatsApp
    R->>FE: Buka link kado
    alt Kado Diproteksi PIN
        FE-->>R: Amplop terkunci PIN
        R->>FE: Input PIN
        FE->>SB: RPC unlock_gift(slug, pin)
        SB-->>FE: Verifikasi hash bcrypt & kembalikan kartu
    end
    FE-->>R: Buka amplop → kartu cerita → penutup confetti (+ musik/YouTube)
    R->>FE: Kirim balasan ucapan
    FE->>SB: Simpan balasan ke tabel replies (RLS private ke pembuat)
    SB-->>P: Pesan balasan tampil di Dasbor Kado Saya
```

---

## 6. Database Schema

Berikut tabel-tabel utama pada Supabase (PostgreSQL) yang telah diperkuat dengan Security Hardening:

**Tabel `users` (auth.users)** — akun pembuat kado
- Dikelola oleh Supabase Auth (Google OAuth).

**Tabel `gifts`** — metadata kado utama
- `id` (uuid, PK) — identitas kado.
- `user_id` (uuid, FK → auth.users.id) — pemilik kado.
- `recipient_name` (text) — nama penerima.
- `opening_text` (text) — kalimat pembuka.
- `theme` (text) — tema: ulang tahun, anniversary, wisuda, Lebaran, Valentine.
- `closing_text` (text) — teks penutup.
- `music_url` (text) — URL audio lokal bebas royalti atau tautan YouTube.
- `slug` (text, unik) — slug tautan (contoh: `untuk-rara`).
- `status` (text) — `draft` / `published` (dilindungi trigger DB `protect_gift_paid_fields`).
- `is_premium` (boolean) — penanda status lunas (dilindungi trigger DB).
- `has_passcode` (boolean) — penanda apakah kado memiliki proteksi PIN rahasia.
- `is_public` (boolean) — tampil di galeri atau unlisted (default false untuk kado berbayar demi privasi).
- `view_count` (int) — statistik kali dibuka (diperbarui via RPC `increment_view_count`).
- `like_count` (int) — jumlah suka.
- `created_at` (timestamptz) — waktu dibuat.
- `published_at` (timestamptz) — waktu diterbitkan.

**Tabel `gift_passcodes`** — proteksi hash PIN (keamanan tinggi)
- `gift_id` (uuid, PK, FK → gifts.id) — ID kado.
- `hash` (text) — hash PIN dengan bcrypt (`extensions.crypt(..., gen_salt('bf'))`).
- `failed_attempts` (integer, default 0) — counter percobaan salah.
- `locked_until` (timestamptz, nullable) — timestamp pembekuan akses jika 5x berturut-turut salah (15 menit lockout).

**Tabel `cards`** — kartu cerita di dalam kado
- `id` (uuid, PK) — identitas kartu.
- `gift_id` (uuid, FK → gifts.id) — kado pemilik kartu.
- `order_index` (int) — urutan kartu.
- `text_content` (text) — narasi kartu.
- `image_url` (text) — tautan foto di Supabase Storage `gift-images`.
- `metadata` (jsonb, default '{}') — data kustomisasi studio (kemiringan kartu, gaya font, stiker & koordinat elemen).
- *RLS:* Kartu kado yang memiliki `has_passcode = true` disembunyikan dari query publik biasa dan hanya bisa diperoleh via RPC `unlock_gift()`.

**Tabel `replies`** — pesan balasan dari penerima kado
- `id` (uuid, PK) — identitas balasan.
- `gift_id` (uuid, FK → gifts.id) — kado yang dibalas.
- `sender_name` (text) — nama pengirim balasan.
- `message` (text) — isi pesan balasan.
- `created_at` (timestamptz) — waktu balasan dikirim.
- *RLS:* Siapa saja boleh mengirim (`INSERT`), namun hanya pemilik kado (`auth.uid() = user_id`) yang berhak membaca (`SELECT`).

**Tabel `gift_views`** — log pembukaan kado
- `id` (uuid, PK) — identitas catatan view.
- `gift_id` (uuid, FK → gifts.id) — kado yang dibuka.
- `opened_at` (timestamptz) — waktu pembukaan kado.

**Tabel `payments`** — riwayat transaksi Mayar
- `id` (uuid, PK) — identitas pembayaran.
- `user_id` (uuid, FK → auth.users.id) — pengguna pembuat kado.
- `gift_id` (uuid, FK → gifts.id) — kado yang dibayar.
- `mayar_invoice_id` (text, unique index) — ID invoice Mayar.
- `payment_url` (text) — URL invoice QRIS Mayar.
- `amount` (numeric, default 5000) — nominal tagihan (Rp 5.000).
- `status` (text) — `pending` / `paid` / `failed` / `expired`.
- `paid_at` (timestamptz) — waktu konfirmasi lunas.
- `created_at` (timestamptz) — waktu invoice dibuat.

```mermaid
erDiagram
    users ||--o{ gifts : "membuat"
    users ||--o{ payments : "melakukan"
    gifts ||--o| gift_passcodes : "diamankan_oleh"
    gifts ||--o{ cards : "berisi"
    gifts ||--o{ replies : "menerima"
    gifts ||--o{ gift_views : "tercatat"
    gifts ||--o{ payments : "dibayar"

    gifts {
        uuid id PK
        uuid user_id FK
        text recipient_name
        text opening_text
        text theme
        text closing_text
        text music_url
        text slug
        text status
        boolean is_premium
        boolean has_passcode
        boolean is_public
        int view_count
        timestamptz published_at
    }
    gift_passcodes {
        uuid gift_id PK,FK
        text hash
        int failed_attempts
        timestamptz locked_until
    }
    cards {
        uuid id PK
        uuid gift_id FK
        int order_index
        text text_content
        text image_url
    }
    replies {
        uuid id PK
        uuid gift_id FK
        text sender_name
        text message
        timestamptz created_at
    }
    gift_views {
        uuid id PK
        uuid gift_id FK
        timestamptz opened_at
    }
    payments {
        uuid id PK
        uuid user_id FK
        uuid gift_id FK
        text mayar_invoice_id
        numeric amount
        text status
        timestamptz paid_at
    }
```

---

## 7. Tech Stack

**Frontend:** Next.js 16.3.5 (App Router) + React 19.2.8 — arsitektur Server Components & Server Actions dengan gaya desain Apple Minimalist (palet monokrom titanium, hairline border, kaca buram `apple-glass`, tipografi Plus Jakarta Sans & Instrument Serif). Didukung `proxy.ts` middleware untuk session refresh otomatis.

**Backend & Database:** Supabase (PostgreSQL) — Row Level Security (RLS), Supabase Service Role client (`SUPABASE_SERVICE_ROLE_KEY`) untuk operasi pembayaran terproteksi, serta ekstensi `pgcrypto` untuk hashing PIN.

**Autentikasi:** Supabase Auth dengan integrasi Google OAuth satu sentuhan (Google-First Delayed Login).

**Penyimpanan Aset:** Supabase Storage (bucket publik `gift-images` untuk foto kartu) dan folder lokal `public/music/` untuk audio instrumental bebas royalti, plus dukungan sematan audio YouTube.

**Payment Gateway:** Mayar.id — pembayaran instan QRIS dan E-Wallet seharga **Rp 5.000 sekali bayar** dengan verifikasi idempoten langsung ke Mayar API (`settlePayment`).

**Deployment:** Vercel (Edge Network & Serverless Next.js).

**Ringkasan Teknologi:**
| Bagian | Teknologi | Keterangan |
|---|---|---|
| Frontend | Next.js 16 + React 19 | Server Actions, Apple Minimalist UI |
| Styling | Tailwind CSS v4 + Lucide Icons | Desain monokrom bersih & elegan |
| Database | Supabase PostgreSQL + pgcrypto | RLS, Triggers, RPC `unlock_gift` |
| Autentikasi | Supabase Auth (Google OAuth) | Delayed Login tanpa friksi |
| Storage | Supabase Storage (`gift-images`) | Upload foto kartu ucapan |
| Musik & Audio | Pixabay Free Instrumental & YouTube | Pemutar audio HTML5 & YouTube embed |
| Pembayaran | Mayar.id (QRIS Rp 5.000) | Settlement terverifikasi server-side |
| Deployment | Vercel | Hosting serverless & CDN global |