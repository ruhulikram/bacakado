import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGiftBySlug } from "@/app/actions/gift";
import { GiftExperience } from "@/components/gift/GiftExperience";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gift = await getGiftBySlug(slug);

  if (!gift) {
    return {
      title: "Kado Digital Tidak Ditemukan · BacaKado",
      description: "Tautan kado digital mungkin sudah kedaluwarsa atau belum diterbitkan.",
    };
  }

  const name = gift.recipient_name || "Kamu";
  const title = `Surat Spesial untuk ${name} 💌 · BacaKado`;
  const description = gift.opening_text
    ? `"${gift.opening_text}" · Buka amplop dan dengarkan musiknya sekarang ✨`
    : `Ada sepucuk surat kado digital personal yang menunggumu. Buka amplopnya sekarang ✨`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "BacaKado",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GiftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gift = await getGiftBySlug(slug);
  if (!gift) notFound();
  return <GiftExperience gift={gift} />;
}
