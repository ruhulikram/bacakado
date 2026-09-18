import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyMayarWebhookToken } from "@/lib/mayar";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-mayar-token");
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!verifyMayarWebhookToken(token)) {
      return NextResponse.json({ error: "Unauthorized webhook token" }, { status: 401 });
    }

    const payload = await req.json();
    console.log("Mayar Webhook Received:", JSON.stringify(payload, null, 2));

    // Mayar webhook event can be 'payment.received', 'invoice.paid', or payload.status === 'PAID'
    const event = payload.event || payload.type;
    const data = payload.data || payload;

    const isPaid =
      event === "payment.received" ||
      event === "invoice.paid" ||
      data.status === "PAID" ||
      data.status === "SUCCESS";

    if (isPaid) {
      const giftId = data.extraData?.giftId || data.giftId;
      const invoiceId = data.id || data.invoiceId;

      if (giftId) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error: rpcErr } = await supabase.rpc("mark_gift_paid", {
          p_gift_id: giftId,
          p_invoice_id: invoiceId || null,
        });

        if (rpcErr) {
          console.error("Failed to mark gift as paid:", rpcErr);
          return NextResponse.json({ error: rpcErr.message }, { status: 500 });
        }

        console.log(`Kado ${giftId} successfully upgraded to Premium!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook processing error";
    console.error("Mayar webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
