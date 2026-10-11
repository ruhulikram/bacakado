import dns from "node:dns";

let isHostOnline: boolean | null = null;
let lastCheckTime = 0;

/**
 * Cek apakah hostname Supabase terdaftar di DNS publik.
 * Di-cache selama 60 detik agar tidak membebani query DNS lokal.
 */
export async function checkHostOnline(hostname: string): Promise<boolean> {
  const now = Date.now();
  if (isHostOnline !== null && now - lastCheckTime < 60000) {
    return isHostOnline;
  }
  try {
    await new Promise<void>((resolve, reject) => {
      dns.lookup(hostname, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    isHostOnline = true;
  } catch {
    isHostOnline = false;
  }
  lastCheckTime = now;
  return isHostOnline;
}
