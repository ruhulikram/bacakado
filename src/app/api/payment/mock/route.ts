import { NextRequest, NextResponse } from "next/server";
import { markGiftPaid } from "@/lib/mayar";
import { PREMIUM_PRICE, PREMIUM_PRICE_LABEL } from "@/lib/utils";

const notFound = () => NextResponse.json({ error: "Not found" }, { status: 404 });
const isProduction = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
  if (isProduction) return notFound();
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("invoice_id") || "mock_inv";
  const giftId = searchParams.get("gift_id");
  const amount = searchParams.get("amount") || String(PREMIUM_PRICE);

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Simulasi Pembayaran QRIS Mayar</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center border border-gray-100">
        <div class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          Simulator Mayar QRIS
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-1">Konfirmasi Pembayaran</h1>
        <p class="text-xs text-gray-500 mb-5">Nomor Invoice: <span class="font-mono text-gray-700 font-medium">${invoiceId}</span></p>

        <div class="bg-pink-50/70 border border-pink-100 rounded-2xl p-4 mb-5 text-left">
          <div class="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Item</span>
            <span class="font-medium text-gray-800">BacaKado Premium</span>
          </div>
          <div class="flex justify-between items-center text-xs text-gray-600 mb-2">
            <span>Fitur</span>
            <span class="text-pink-600 font-medium">Tanpa Watermark + PIN</span>
          </div>
          <div class="border-t border-pink-200/60 pt-2 flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-900">Total Bayar</span>
            <span class="text-lg font-bold text-pink-600">Rp ${Number(amount).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div class="p-3 bg-gray-50 border rounded-2xl mb-6">
          <div class="w-36 h-36 bg-white mx-auto border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
            <svg class="w-12 h-12 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span class="text-[10px] font-medium tracking-wider">QRIS SIMULASI</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-2">Mode Sandbox / Pengembangan Lokal</p>
        </div>

        <form method="POST" action="/api/payment/mock">
          <input type="hidden" name="giftId" value="${giftId || ""}" />
          <input type="hidden" name="invoiceId" value="${invoiceId}" />
          <button type="submit" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full text-sm transition-transform active:scale-95 shadow-md shadow-pink-200">
            Simulasikan Bayar Sukses (${PREMIUM_PRICE_LABEL}) →
          </button>
        </form>

        <a href="/buat" class="block text-xs text-gray-400 hover:text-gray-600 mt-3">Batalkan Pembayaran</a>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  if (isProduction) return notFound();
  try {
    const formData = await req.formData();
    const giftId = formData.get("giftId") as string;

    if (giftId) await markGiftPaid(giftId);

    return NextResponse.redirect(
      new URL(`/buat?payment_success=1&gift_id=${giftId}`, req.url)
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
