"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, Loader2, Trash2, Link as LinkIcon, RefreshCw } from "lucide-react";
import { uploadGiftImage } from "@/lib/supabase/storage";
import { Input } from "@/components/ui/input";

interface CardImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function CardImageUpload({ value, onChange }: CardImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const result = await uploadGiftImage(file);
    setUploading(false);

    // Reset input value so same file can be re-selected if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      onChange(result.url);
    }
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* State 1: Image already exists */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-between p-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border bg-white">
              {/* Using img tag to support external or blob URLs without strict next/image remote patterns */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Kartu"
                className="w-full h-full object-cover"
                onError={() => setError("Gambar tidak dapat dimuat")}
              />
            </div>
            <div className="truncate text-xs text-gray-500">
              <p className="font-medium text-gray-700 truncate">Foto terpasang</p>
              <p className="truncate text-[11px] text-gray-400">{value}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
              title="Ganti foto"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Hapus foto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* State 2: No image */
        <div>
          {!useUrlMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-pink-200 hover:border-pink-400 rounded-xl bg-pink-50/40 hover:bg-pink-50 text-pink-600 text-xs font-medium transition-all group active:scale-[0.99]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                    <span>Mengunggah foto...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    <span>Pilih Foto dari Galeri</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setUseUrlMode(true)}
                className="p-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-400 hover:text-gray-600 bg-white transition-colors"
                title="Input via URL web"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Paste URL foto (https://...)"
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  className="rounded-xl text-xs h-9"
                />
                <button
                  type="button"
                  onClick={() => setUseUrlMode(false)}
                  className="px-2.5 py-1.5 text-xs text-pink-600 hover:text-pink-700 whitespace-nowrap font-medium"
                >
                  Upload File
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
