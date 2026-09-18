"use server";

import { createClient } from "@/lib/supabase/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function recordView(giftId: string) {
  if (!giftId || !UUID_REGEX.test(giftId)) return;
  try {
    const supabase = await createClient();
    await Promise.all([
      supabase.from("gift_views").insert({ gift_id: giftId }),
      supabase.rpc("increment_view_count", { p_gift_id: giftId }),
    ]);
  } catch {
    // ignore tracking errors on views
  }
}

export async function submitReply(
  giftId: string,
  senderName: string,
  message: string
): Promise<{ error?: string }> {
  if (!senderName.trim() || !message.trim())
    return { error: "Nama dan pesan tidak boleh kosong" };

  if (!UUID_REGEX.test(giftId)) {
    // Mock / demo gift success
    return {};
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("replies").insert({
      gift_id: giftId,
      sender_name: senderName.trim(),
      message: message.trim(),
    });
    return error ? { error: error.message } : {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Gagal mengirim balasan" };
  }
}
