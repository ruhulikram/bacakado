/**
 * Mayar Payment Gateway API Integration Helper
 * Mendukung Sandbox (api.mayar.io), Production (api.mayar.id),
 * dan Local Simulator fallback jika API Key belum dipasang.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { PREMIUM_PRICE } from "@/lib/utils";

export interface CreateInvoiceParams {
  giftId: string;
  userId: string;
  recipientName: string;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  amount?: number;
}

export interface MayarInvoiceResult {
  success: boolean;
  invoiceId?: string;
  paymentUrl?: string;
  isMock?: boolean;
  error?: string;
}

const MAYAR_API_KEY = process.env.MAYAR_API_KEY?.trim() || "";
const MAYAR_ENV = process.env.NEXT_PUBLIC_MAYAR_ENV || "sandbox";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export { PREMIUM_PRICE };

const BASE_URL =
  MAYAR_ENV === "production"
    ? "https://api.mayar.id/hl/v1"
    : "https://api.mayar.io/hl/v1";

/**
 * Membuat Invoice pembayaran Mayar (QRIS, E-Wallet, Transfer).
 * Jika MAYAR_API_KEY belum disetel di .env.local, secara otomatis mengembalikan
 * link Simulator agar pengujian lokal tetap berjalan 100%.
 */
export async function createMayarInvoice(
  params: CreateInvoiceParams
): Promise<MayarInvoiceResult> {
  const amount = params.amount || PREMIUM_PRICE;
  const redirectUrl = `${APP_URL}/buat?payment_success=1&gift_id=${params.giftId}`;

  // Fallback simulator jika belum ada API Key (hanya di development)
  if (!MAYAR_API_KEY) {
    if (IS_PRODUCTION) {
      return { success: false, error: "Pembayaran belum dikonfigurasi (MAYAR_API_KEY kosong)" };
    }
    const mockInvoiceId = `mock_inv_${Date.now()}`;
    const mockPaymentUrl = `/api/payment/mock?invoice_id=${mockInvoiceId}&gift_id=${params.giftId}&amount=${amount}`;
    return {
      success: true,
      invoiceId: mockInvoiceId,
      paymentUrl: mockPaymentUrl,
      isMock: true,
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/invoice/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAYAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params.customerName || "Teman BacaKado",
        email: params.customerEmail,
        mobile: params.customerMobile || "081234567890",
        redirectUrl,
        description: `Akses Kado Premium BacaKado untuk ${params.recipientName}`,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            quantity: 1,
            rate: amount,
            description: "Akses Kado Premium BacaKado (Tanpa Watermark + PIN)",
          },
        ],
        extraData: {
          giftId: params.giftId,
          userId: params.userId,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Mayar API Error:", data);
      return {
        success: false,
        error: data.message || data.error || "Gagal membuat invoice Mayar",
      };
    }

    // Mayar API mengembalikan link invoice di data.link atau data.url
    const paymentUrl = data.data?.link || data.data?.url || data.link || data.url;
    const invoiceId = data.data?.id || data.id;

    return {
      success: true,
      invoiceId,
      paymentUrl,
      isMock: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan Mayar";
    console.error("Mayar fetch exception:", msg);
    return {
      success: false,
      error: msg,
    };
  }
}

/**
 * Validasi Webhook Mayar Token
 */
export function verifyMayarWebhookToken(tokenHeader: string | null): boolean {
  const secret = process.env.MAYAR_WEBHOOK_TOKEN?.trim();
  // Jika webhook token belum diset di .env.local, kita izinkan untuk kemudahan dev
  if (!secret) return true;
  return tokenHeader === secret;
}

export const isMockInvoice = (id: string) => id.startsWith("mock_inv_");

/**
 * Ambil status invoice langsung dari Mayar — sumber kebenaran pembayaran.
 * Body webhook tidak pernah dipercaya begitu saja.
 */
async function getMayarInvoice(
  invoiceId: string
): Promise<{ paid: boolean; amount: number } | null> {
  if (!MAYAR_API_KEY) return null;
  try {
    const res = await fetch(`${BASE_URL}/invoice/${encodeURIComponent(invoiceId)}`, {
      headers: { Authorization: `Bearer ${MAYAR_API_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const inv = (await res.json()).data;
    return {
      paid: String(inv?.status).toLowerCase() === "paid",
      amount: Number(inv?.amount) || 0,
    };
  } catch {
    return null;
  }
}

/** Tandai kado lunas + terbit. Hanya dipanggil setelah pembayaran terverifikasi. */
export async function markGiftPaid(giftId: string) {
  const db = createAdminClient();
  const now = new Date().toISOString();
  // Gift dulu: kalau gagal, payment tetap pending dan bisa di-retry.
  const { error } = await db
    .from("gifts")
    .update({ is_premium: true, status: "published", published_at: now })
    .eq("id", giftId);
  if (error) throw error;
  await db.from("payments").update({ status: "paid", paid_at: now }).eq("gift_id", giftId);
}

/**
 * Cek pembayaran terakhir sebuah kado ke Mayar; tandai lunas bila sudah dibayar.
 * Idempoten — aman dipanggil dari polling maupun webhook.
 */
export async function settlePayment(giftId: string): Promise<boolean> {
  const db = createAdminClient();
  const { data: payment } = await db
    .from("payments")
    .select("mayar_invoice_id, amount, status")
    .eq("gift_id", giftId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!payment?.mayar_invoice_id) return false;
  if (payment.status === "paid") return true;
  if (isMockInvoice(payment.mayar_invoice_id)) return false; // mock ditandai via /api/payment/mock

  const invoice = await getMayarInvoice(payment.mayar_invoice_id);
  if (!invoice?.paid || invoice.amount < Number(payment.amount)) return false;

  await markGiftPaid(giftId);
  return true;
}
