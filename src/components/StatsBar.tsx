import { readdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { MUSIC_OPTIONS, THEME_OPTIONS } from "@/lib/mock-data";

// Angka asli dari sistem. Hitungan pakai service role (hanya count, tanpa data pribadi)
// karena gift_views dikunci RLS untuk pemilik. Gagal/offline → null → statistik itu tidak tampil.
async function getGiftStats() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const db = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(3000) }) },
    });
    const [gifts, views] = await Promise.all([
      db.from("gifts").select("id", { count: "exact", head: true }).eq("status", "published"),
      db.from("gift_views").select("id", { count: "exact", head: true }),
    ]);
    if (gifts.error || views.error) return null;
    return { gifts: gifts.count ?? 0, views: views.count ?? 0 };
  } catch {
    return null;
  }
}

export async function StatsBar() {
  const live = await getGiftStats();
  const stickers = readdirSync(path.join(process.cwd(), "public/emojis/ios")).filter((f) => f.endsWith(".png")).length;
  const fmt = (n: number) => n.toLocaleString("id-ID");

  const stats = [
    live && live.gifts > 0 && { value: fmt(live.gifts), label: "kado sudah diterbitkan" },
    live && live.views > 0 && { value: fmt(live.views), label: "kali amplop dibuka" },
    { value: fmt(stickers + THEME_OPTIONS.length + MUSIC_OPTIONS.length), label: "pilihan stiker, nuansa, dan musik" },
  ].filter(Boolean) as { value: string; label: string }[];

  // Hanya angka katalog (belum ada data kado) → bar tidak perlu tampil sendirian
  if (stats.length < 2) return null;

  return (
    <section aria-label="BacaKado dalam angka" className="border-y border-neutral-200/70 dark:border-neutral-800 bg-white/60 dark:bg-white/[0.03]">
      <div className="max-w-[1440px] mx-auto px-4 sm:pl-[35px] sm:pr-[85px] py-6 sm:py-8 grid grid-cols-1 sm:grid-flow-col sm:auto-cols-fr gap-5 sm:gap-10">
        {stats.map((s) => (
          <p key={s.label} className="flex items-baseline gap-2.5 sm:block">
            <span className="font-serif text-3xl sm:text-4xl text-neutral-950 dark:text-neutral-50 tabular-nums leading-none sm:block">{s.value}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 sm:block sm:mt-2">{s.label}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
