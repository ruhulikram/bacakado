"use server";

import { createClient } from "@/lib/supabase/server";
import { createMayarInvoice, settlePayment, PREMIUM_PRICE } from "@/lib/mayar";

export async function initiatePayment(
  giftId: string
): Promise<{ paymentUrl?: string; invoiceId?: string; isMock?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Login dulu ya 😊" };

    const { data: gift } = await supabase
      .from("gifts")
      .select("id, recipient_name, is_premium")
      .eq("id", giftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!gift) return { error: "Kado tidak ditemukan" };
    if (gift.is_premium) return { error: "Kado ini sudah dibayar" };

    // Buat invoice Mayar
    const invoiceRes = await createMayarInvoice({
      giftId: gift.id,
      userId: user.id,
      recipientName: gift.recipient_name,
      customerName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Teman BacaKado",
      customerEmail: user.email || "user@bacakado.id",
      amount: PREMIUM_PRICE,
    });

    if (!invoiceRes.success || !invoiceRes.paymentUrl) {
      return { error: invoiceRes.error || "Gagal membuat link pembayaran" };
    }

    // Simpan ke tabel payments
    const { error: payErr } = await supabase.from("payments").insert({
      user_id: user.id,
      gift_id: gift.id,
      mayar_invoice_id: invoiceRes.invoiceId,
      payment_url: invoiceRes.paymentUrl,
      amount: PREMIUM_PRICE,
      status: "pending",
    });
    if (payErr) return { error: payErr.message };

    return {
      paymentUrl: invoiceRes.paymentUrl,
      invoiceId: invoiceRes.invoiceId,
      isMock: invoiceRes.isMock,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { error: msg };
  }
}

export async function checkPaymentStatus(giftId: string): Promise<{
  isPaid: boolean;
  slug?: string;
  recipientName?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { isPaid: false };

    const { data: gift } = await supabase
      .from("gifts")
      .select("id, slug, recipient_name, is_premium")
      .eq("id", giftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!gift) return { isPaid: false };

    // ponytail: polling hits Mayar API each tick while unpaid; cache/throttle if Mayar rate-limits
    const isPaid = gift.is_premium || (await settlePayment(gift.id));
    return { isPaid, slug: gift.slug, recipientName: gift.recipient_name };
  } catch {
    return { isPaid: false };
  }
}
