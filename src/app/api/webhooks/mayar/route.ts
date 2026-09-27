import { NextRequest, NextResponse } from "next/server";
import { verifyMayarWebhookToken, settlePayment } from "@/lib/mayar";
import { createAdminClient } from "@/lib/supabase/admin";

// Webhook hanya pemicu: status lunas selalu diverifikasi ulang ke API Mayar
// di settlePayment, jadi payload palsu tidak bisa membuka premium.
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-mayar-token");
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!verifyMayarWebhookToken(token)) {
      return NextResponse.json({ error: "Unauthorized webhook token" }, { status: 401 });
    }

    const payload = await req.json();
    const data = payload.data || payload;

    let giftId: string | undefined = data.extraData?.giftId;
    if (!giftId) {
      const ids = [data.id, data.invoiceId, data.productId, data.transactionId].filter(
        (v): v is string => typeof v === "string"
      );
      if (ids.length) {
        const { data: payment } = await createAdminClient()
          .from("payments")
          .select("gift_id")
          .in("mayar_invoice_id", ids)
          .maybeSingle();
        giftId = payment?.gift_id;
      }
    }

    const paid = giftId ? await settlePayment(giftId) : false;
    return NextResponse.json({ received: true, paid });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook processing error";
    console.error("Mayar webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
