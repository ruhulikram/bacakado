import Link from "next/link";
import { DIcons } from "dicons";
import { IosEmoji } from "@/components/ui/IosEmoji";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Isi `href` dengan URL akun BacaKado yang asli. Ikon hanya tampil jika href terisi.
const SOCIAL_LINKS: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Email", href: "mailto:contact@bacakado.com", icon: <DIcons.Mail strokeWidth={1.5} className="h-4 w-4" /> },
  { label: "Instagram", href: "", icon: <DIcons.Instagram className="h-4 w-4" /> },
  {
    label: "TikTok",
    href: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.77a5.7 5.7 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
      </svg>
    ),
  },
  { label: "WhatsApp", href: "", icon: <DIcons.WhatsApp className="h-4 w-4" /> },
  { label: "YouTube", href: "", icon: <DIcons.YouTube className="h-4 w-4" /> },
  { label: "X", href: "", icon: <DIcons.X className="h-4 w-4" /> },
];

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
            { name: "Ucapan & Pencapaian", href: "/buat?theme=ucapan" },
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
            { name: "Bikin kado", href: "/buat" },
            { name: "Galeri Inspirasi", href: "/galeri" },
            { name: "Kado Saya (Dasbor)", href: "/dashboard" },
            { name: "Pratinjau Demo Rara", href: "/untuk-rara" },
          ],
        },
        {
          id: "info",
          name: "Informasi & Bantuan",
          items: [
            { name: "Tarif QRIS Rp 5.000", href: "/#fitur" },
            { name: "Hubungi Kami", href: "mailto:contact@bacakado.com" },
          ],
        },
      ],
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-neutral-200/80 dark:border-neutral-800 mx-auto w-full border-t bg-white dark:bg-[#0F0E0D] transition-colors">
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

        {/* Sosmed & tema */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                {s.icon}
              </a>
            ))}
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
            <DIcons.Heart className="text-rose-500 mx-1 h-3.5 w-3.5 inline" />
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
