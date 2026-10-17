"use client";

import Link from "next/link";
import { DIcons } from "dicons";
import { IosEmoji } from "@/components/ui/IosEmoji";
import ThemeToggle from "@/components/ui/footer";
import { Component } from "@/components/ui/iphone";

export function DemoOne() {
  return (
    <div className="w-full min-h-[600px] flex items-center justify-center mx-auto relative p-6">
      <Component />
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\\'4\\' height=\\'4\\' viewBox=\\'0 0 6 6\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'6\\' cy=\\'6\\' r=\\'1\\' fill=\\'%23aaa\\' fill-opacity=\\'0.25\\' /%3E%3C/svg%3E')",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

const navigation = {
  categories: [
    {
      id: "bacakado",
      name: "BacaKado",
      sections: [
        {
          id: "momen",
          name: "Momen Spesial",
          items: [
            { name: "Ulang Tahun", href: "/buat?theme=ulang-tahun" },
            { name: "Anniversary & Pasangan", href: "/buat?theme=pacar" },
            { name: "Wisuda & Kelulusan", href: "/buat?theme=wisuda" },
            { name: "Teman & Sahabat", href: "/buat?theme=temen" },
          ],
        },
        {
          id: "fitur",
          name: "Fitur Sentuhan Fisik",
          items: [
            { name: "Amplop 3D & Segel Lilin", href: "/#fitur" },
            { name: "Dek Polaroid Swipe", href: "/#fitur" },
            { name: "Piringan Vinyl & Musik", href: "/#fitur" },
            { name: "Gembok PIN Rahasia", href: "/#fitur" },
          ],
        },
        {
          id: "navigasi",
          name: "Navigasi Cepat",
          items: [
            { name: "Bikin Kado Sekarang", href: "/buat" },
            { name: "Galeri Inspirasi", href: "/galeri" },
            { name: "Kado Saya (Dasbor)", href: "/dashboard" },
            { name: "Pratinjau Demo Rara", href: "/untuk-rara" },
          ],
        },
        {
          id: "info",
          name: "Informasi & Bantuan",
          items: [
            { name: "Tentang BacaKado", href: "/" },
            { name: "Tarif QRIS Rp 5.000", href: "/#tarif" },
            { name: "Bebas Watermark", href: "/#fitur" },
            { name: "Aktif Selamanya", href: "/#fitur" },
          ],
        },
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 border border-dotted border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 transition-transform text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-neutral-50/50 dark:bg-neutral-900/50`;

export function Footer() {
  return (
    <footer className="border-neutral-200/80 dark:border-neutral-800 mx-auto w-full border-t bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] pt-12 pb-6">
        {/* Brand Header */}
        <div className="relative grid items-center justify-center gap-6 pb-2 md:flex md:justify-between">
          <Link href="/" className="shrink-0 flex items-center justify-center md:justify-start">
            <div className="flex items-center gap-2.5">
              <IosEmoji symbol="💌" size={32} />
              <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                BacaKado
              </span>
            </div>
          </Link>
          <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-left max-w-2xl">
            BacaKado menghadirkan kehangatan surat fisik ke layar ponsel cerdas. Rancang kado ucapan digital personal dengan amplop 3D interaktif, segel lilin beranimasi, dek foto kenangan bergaya scrapbook, dan iringan musik latar yang berputar otomatis — siap dalam lima menit langsung dari HP tanpa keahlian teknis.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="py-10 border-y border-dotted border-neutral-200 dark:border-neutral-800 my-8">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 leading-6"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <p
                    id={`${category.id}-${section.id}-heading`}
                    className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-3 tracking-wide"
                  >
                    {section.name}
                  </p>
                  <ul
                    role="list"
                    aria-labelledby={`${category.id}-${section.id}-heading`}
                    className="flex flex-col space-y-2.5"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          href={item.href}
                          className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Social Icons & Theme Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              aria-label="Email"
              href="mailto:contact@bacakado.com"
              rel="noreferrer"
              target="_blank"
              className={Underline}
              title="Kirim Email"
            >
              <DIcons.Mail strokeWidth={1.5} className="h-4 w-4" />
            </Link>
            <Link
              aria-label="X Twitter"
              href="https://x.com"
              rel="noreferrer"
              target="_blank"
              className={Underline}
              title="Twitter"
            >
              <DIcons.X className="h-4 w-4" />
            </Link>
            <Link
              aria-label="Instagram"
              href="https://instagram.com"
              rel="noreferrer"
              target="_blank"
              className={Underline}
              title="Instagram"
            >
              <DIcons.Instagram className="h-4 w-4" />
            </Link>
            <Link
              aria-label="WhatsApp"
              href="https://wa.me"
              rel="noreferrer"
              target="_blank"
              className={Underline}
              title="WhatsApp"
            >
              <DIcons.WhatsApp className="h-4 w-4" />
            </Link>
            <Link
              aria-label="YouTube"
              href="https://youtube.com"
              rel="noreferrer"
              target="_blank"
              className={Underline}
              title="YouTube"
            >
              <DIcons.YouTube className="h-4 w-4" />
            </Link>
          </div>

          <ThemeToggle />
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-row items-center justify-center gap-1.5 flex-wrap">
            <span>©</span>
            <span>{new Date().getFullYear()}</span>
            <span className="font-semibold text-neutral-900 dark:text-white">BacaKado</span>
            <span>·</span>
            <span>Dirancang dengan kehangatan untuk momen terbaikmu di Indonesia</span>
            <DIcons.Heart className="text-rose-500 mx-1 h-3.5 w-3.5 inline animate-pulse" />
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Tanpa langganan · QRIS Otomatis · Tautan Aktif Selamanya
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
