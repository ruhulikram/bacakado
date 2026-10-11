import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkHostOnline } from "@/lib/supabase/dns-guard";

// Refresh token Supabase hanya jika request memiliki cookie sesi auth dan host online,
// sehingga tidak memperlambat TTFB (Time to First Byte) dan LCP pada pengunjung publik.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Hanya periksa sesi jika browser membawa cookie auth Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );

  if (!hasAuthCookie) {
    return response;
  }

  // Lindungi dari delay AuthRetryableFetchError (25s) jika host Supabase belum aktif di DNS
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let hostname = "";
  try {
    if (url) hostname = new URL(url).hostname;
  } catch {}

  if (hostname) {
    const isOnline = await checkHostOnline(hostname);
    if (!isOnline) {
      return response;
    }
  }

  try {
    const supabase = createServerClient(
      url,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: (url, options = {}) =>
            fetch(url, {
              ...options,
              signal: options.signal || AbortSignal.timeout(1800),
            }),
        },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
            Object.entries(headers ?? {}).forEach(([key, value]) =>
              response.headers.set(key, value)
            );
          },
        },
      }
    );

    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 1000)),
    ]);
  } catch {
    // Abaikan kegagalan jaringan di middleware agar response tidak terblokir
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",
  ],
};
