# 💌 BacaKado

> Platform web kado ucapan digital personal dan interaktif dengan estetika minimalis elegan khas Apple.

BacaKado memudahkan siapa saja membuat website kado digital beranimasi indah (amplop interaktif, kartu cerita & foto, musik pengiring, dan proteksi PIN rahasia) hanya dalam **5 menit langsung dari HP** tanpa keahlian teknis.

---

## ✨ Fitur Utama

- **Editor Kado Interaktif:** Wizard 5 langkah yang intuitif, upload foto langsung ke Supabase Storage, dan live preview real-time.
- **Pengalaman Penerima yang Elegan:** Desain *Apple Minimalist*, amplop arsitektural interaktif, audio otomatis, dan efek *champagne confetti*.
- **Proteksi PIN Rahasia:** Kunci kado dengan PIN/tanggal spesial agar pesan hanya bisa dibuka oleh orang yang dituju.
- **Sistem Balasan Pesan:** Penerima kado bisa langsung menulis pesan balasan yang tersimpan aman ke dasbor pengirim.
- **Pembayaran QRIS Terintegrasi:** Terhubung dengan gateway pembayaran Mayar (Rp 4.000 / kado) dengan simulator lokal untuk kemudahan testing.
- **Dasbor Pengirim:** Pantau status kado, jumlah views, dan kotak masuk pesan balasan dari penerima.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Bahasa:** TypeScript 5
- **Styling:** Tailwind CSS v4 + Apple Minimalist Design System
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Storage)
- **Payment Gateway:** Mayar.id (QRIS & E-Wallet)

---

## 🚀 Memulai (Quick Start)

### 1. Clone & Install Dependensi

```bash
git clone https://github.com/ruhulikram/bacakado.git
cd bacakado
npm install
```

### 2. Konfigurasi Environment

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi variabel di `.env.local` sesuai kredensial Anda:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mayar Payment Gateway (Opsional untuk testing lokal — simulator aktif otomatis jika kosong)
MAYAR_API_KEY=
MAYAR_WEBHOOK_TOKEN=
NEXT_PUBLIC_MAYAR_ENV=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Database Supabase

Jalankan seluruh query SQL dari file `supabase/schema.sql` di **Supabase SQL Editor** dashboard Anda.

### 4. Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📄 Lisensi

Private & Proprietary © BacaKado.
