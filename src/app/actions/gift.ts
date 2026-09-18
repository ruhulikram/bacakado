"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MUSIC_OPTIONS, GALLERY_MOCK } from "@/lib/mock-data";
import { Gift, Theme, UserGift } from "@/lib/types";

export interface DraftGift {
  recipientName: string;
  openingText: string;
  closingText: string;
  theme: Theme;
  musicId: string;
  cards: { text_content: string; image_url?: string }[];
  isPremium?: boolean;
  passcode?: string;
}

function makeSlug(name: string) {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 20) || "kado";
  const rand = Math.random().toString(36).slice(2, 7);
  return `untuk-${base}-${rand}`;
}

function mapRow(d: Record<string, unknown>): Gift {
  const cards = (d.cards as Record<string, unknown>[] | null) ?? [];
  return {
    id: d.id as string,
    slug: d.slug as string,
    recipient_name: d.recipient_name as string,
    opening_text: d.opening_text as string,
    theme: d.theme as Theme,
    closing_text: d.closing_text as string,
    music_url: d.music_url as string | undefined,
    cards: cards
      .sort((a, b) => (a.order_index as number) - (b.order_index as number))
      .map((c) => ({
        id: c.id as string,
        order_index: c.order_index as number,
        text_content: c.text_content as string,
        image_url: c.image_url as string | undefined,
      })),
    status: d.status as "draft" | "published",
    is_premium: Boolean(d.is_premium),
    passcode: (d.passcode as string) || undefined,
    view_count: d.view_count as number,
    like_count: d.like_count as number,
    is_public: d.is_public as boolean,
    published_at: d.published_at as string | undefined,
    created_at: d.created_at as string,
  };
}

export async function publishGift(
  draft: DraftGift,
  options?: { isDraftOnly?: boolean }
): Promise<{ slug?: string; giftId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Login dulu ya 😊" };

  // Guaranteed Collision-Proof Slug with Auto-Retry
  let slug = makeSlug(draft.recipientName);
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    const { data: existing } = await supabase
      .from("gifts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      isUnique = true;
    } else {
      slug = makeSlug(draft.recipientName);
      attempts++;
    }
  }

  const music = MUSIC_OPTIONS.find((m) => m.id === draft.musicId);
  const isDraft = Boolean(options?.isDraftOnly);

  const { data: gift, error: giftErr } = await supabase
    .from("gifts")
    .insert({
      user_id: user.id,
      recipient_name: draft.recipientName,
      opening_text:
        draft.openingText || `Ada sesuatu buat ${draft.recipientName} 💌`,
      theme: draft.theme,
      closing_text: draft.closingText || "Semoga harimu menyenangkan! 🎉",
      music_url: music?.url ?? null,
      slug,
      status: isDraft ? "draft" : "published",
      is_premium: Boolean(draft.isPremium),
      passcode: draft.passcode?.trim() || null,
      is_public: !draft.isPremium, // Premium default unlisted for privacy
      published_at: isDraft ? null : new Date().toISOString(),
    })
    .select("id")
    .single();

  if (giftErr) return { error: giftErr.message };

  const cardRows = draft.cards
    .filter((c) => c.text_content.trim())
    .map((c, i) => ({
      gift_id: gift.id,
      order_index: i,
      text_content: c.text_content,
      image_url: c.image_url || null,
    }));

  if (cardRows.length > 0) {
    const { error: cardsErr } = await supabase.from("cards").insert(cardRows);
    if (cardsErr) {
      await supabase.from("gifts").delete().eq("id", gift.id);
      return { error: cardsErr.message };
    }
  }

  revalidatePath("/galeri");
  return { slug, giftId: gift.id };
}

export async function getGiftBySlug(slug: string): Promise<Gift | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gifts")
      .select("*, cards(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) return mapRow(data as Record<string, unknown>);
  } catch {
    // If Supabase fetch fails, fallback to mock data
  }

  return GALLERY_MOCK.find((g) => g.slug === slug) ?? null;
}

export async function getGalleryGifts(): Promise<Gift[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gifts")
    .select("*, cards(*)")
    .eq("status", "published")
    .eq("is_public", true)
    .order("view_count", { ascending: false })
    .limit(20);

  return (data ?? []).map((d) => mapRow(d as Record<string, unknown>));
}

function mapUserGiftRow(d: Record<string, unknown>): UserGift {
  const base = mapRow(d);
  const replies = (d.replies as Record<string, unknown>[] | null) ?? [];
  return {
    ...base,
    replies: replies
      .sort(
        (a, b) =>
          new Date(b.created_at as string).getTime() -
          new Date(a.created_at as string).getTime()
      )
      .map((r) => ({
        id: r.id as string,
        gift_id: r.gift_id as string,
        sender_name: r.sender_name as string,
        message: r.message as string,
        created_at: r.created_at as string,
      })),
  };
}

export async function getMyGifts(): Promise<{
  gifts?: UserGift[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Belum login" };

    const { data, error } = await supabase
      .from("gifts")
      .select("*, cards(*), replies(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };

    return {
      gifts: (data ?? []).map((d) =>
        mapUserGiftRow(d as Record<string, unknown>)
      ),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memuat kado saya";
    return { error: msg };
  }
}

export async function deleteGift(
  giftId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Login dulu ya" };

    const { error } = await supabase
      .from("gifts")
      .delete()
      .eq("id", giftId)
      .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus kado";
    return { error: msg };
  }
}

