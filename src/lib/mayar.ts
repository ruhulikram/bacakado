/**
 * Mayar Payment Gateway API Integration Helper
 * Mendukung Sandbox (api.mayar.io), Production (api.mayar.id),
 * dan Local Simulator fallback jika API Key belum dipasang.
 */

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
  const amount = params.amount || 4000;
  const redirectUrl = `${APP_URL}/buat?payment_success=1&gift_id=${params.giftId}`;

  // Fallback simulator jika belum ada API Key
  if (!MAYAR_API_KEY) {
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
