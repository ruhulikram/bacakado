"use client";

import { useState } from "react";
import { Envelope3D } from "@/components/gift/Envelope3D";

// Amplop asli di hero: pengunjung langsung mencoba momen yang akan dirasakan penerima
export function HeroEnvelope() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <Envelope3D
        recipientName="Rara"
        openingText="Selamat ulang tahun. Buka pelan-pelan ya, ada cerita kita di dalam 💌"
        onOpen={() => {}}
        onOpeningStateChange={setOpened}
        previewMode
      />
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 h-5" aria-live="polite">
        {opened ? "Begini rasanya jadi penerima. Ketuk suratnya untuk menutup." : "Ketuk segel lilinnya."}
      </p>
    </div>
  );
}
