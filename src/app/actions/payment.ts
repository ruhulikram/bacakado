"use server";

import { createClient } from "@/lib/supabase/server";
import { createMayarInvoice } from "@/lib/mayar";

export async function initiatePayment(params: {
  giftId: string;
  recipientName: string;
  passcode?: string;
}): Promise<{ paymentUrl?: string; invoiceId?: string; isMock?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Login dulu ya 😊" };

    // Update passcode if specified
    if (params.passcode) {
      await supabase
        .from("gifts")
        .update({ passcode: params.passcode.trim() })
        .eq("id", params.giftId)
        .eq("user_id", user.id);
    }

    // Buat invoice Mayar
    const invoiceRes = await createMayarInvoice({
      giftId: params.giftId,
      userId: user.id,
      recipientName: params.recipientName,
      customerName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Teman BacaKado",
      customerEmail: user.email || "user@bacakado.id",
      amount: 4000,
    });

    if (!invoiceRes.success || !invoiceRes.paymentUrl) {
      return { error: invoiceRes.error || "Gagal membuat link pembayaran" };
    }

    // Simpan ke tabel payments
    await supabase.from("payments").insert({
      user_id: user.id,
      gift_id: params.giftId,
      mayar_invoice_id: invoiceRes.invoiceId,
      payment_url: invoiceRes.paymentUrl,
      amount: 4000,
      status: "pending",
    });

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
}> {
  try {
    const supabase = await createClient();
    const { data: gift } = await supabase
      .from("gifts")
      .select("id, slug, is_premium, status")
      .eq("id", giftId)
      .single();

    if (!gift) return { isPaid: false };

    return {
      isPaid: Boolean(gift.is_premium),
      slug: gift.slug,
    };
  } catch {
    return { isPaid: false };
  }
}
