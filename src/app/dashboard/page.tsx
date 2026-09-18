import { createClient } from "@/lib/supabase/server";
import { getMyGifts } from "@/app/actions/gift";
import { DashboardClient } from "./DashboardClient";
import { DashboardAuthView } from "./DashboardAuthView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kado Saya — BacaKado",
  description: "Kelola kado digital yang telah kamu buat dan lihat pesan balasan dari penerima.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <DashboardAuthView />;
  }

  const { gifts } = await getMyGifts();

  return (
    <DashboardClient
      userEmail={user.email || "Pengguna"}
      initialGifts={gifts || []}
    />
  );
}
