import { notFound } from "next/navigation";
import { getGiftBySlug } from "@/app/actions/gift";
import { GiftExperience } from "@/components/gift/GiftExperience";

export const dynamic = "force-dynamic";

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
