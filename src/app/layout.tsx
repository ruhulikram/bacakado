import type { Metadata } from "next";
import { Arimo, Newsreader } from "next/font/google";
import "./globals.css";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
  display: "swap",
});

// Serif surat untuk momen emosional (judul amplop, kartu, penutup)
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BacaKado · Kado Digital Personal untuk Indonesia",
  description:
    "Bikin website ucapan ulang tahun, anniversary, wisuda dalam 5 menit. Tanpa skill teknis, langsung dari HP.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${arimo.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
