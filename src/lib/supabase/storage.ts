import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "gift-images";
const MAX_SIZE_MB = 5;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

export interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadGiftImage(file: File): Promise<UploadResult> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar (JPG, PNG, WebP, dll)" };
  }

  // Validate size
  if (file.size > MAX_BYTES) {
    return { error: `Ukuran gambar maksimal ${MAX_SIZE_MB}MB` };
  }

  try {
    const supabase = createClient();

    // Sanitize file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanExt = ext.replace(/[^a-z0-9]/g, "");
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}-${randomId}.${cleanExt}`;
    const filePath = `cards/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.warn("Storage upload failed:", uploadError.message);
      // Give user-friendly error
      if (
        uploadError.message.includes("bucket") ||
        uploadError.message.includes("not found")
      ) {
        return {
          error:
            "Bucket penyimpanan belum dibuat di Supabase. Silakan gunakan URL foto eksternal atau jalankan SQL schema.",
        };
      }
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengunggah foto";
    return { error: msg };
  }
}
