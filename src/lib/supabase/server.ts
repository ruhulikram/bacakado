import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkHostOnline } from "./dns-guard";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let hostname = "";
  try {
    if (url) hostname = new URL(url).hostname;
  } catch {}

  return createServerClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (input, init = {}) => {
          if (hostname) {
            const alive = await checkHostOnline(hostname);
            if (!alive) {
              throw new DOMException(`Supabase host ${hostname} is unreachable`, "AbortError");
            }
          }
          return fetch(input, {
            ...init,
            signal: init.signal || AbortSignal.timeout(2000),
          });
        },
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
