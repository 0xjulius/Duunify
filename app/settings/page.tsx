import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || "";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url || "";
  const phone = user.user_metadata?.phone || "";
  const location = user.user_metadata?.location || "";

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <div className="flex-shrink-0 border-r border-slate-200 bg-white">
        <Sidebar />
      </div>

      <SettingsClient
        userId={user.id}
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        phone={phone}
        location={location}
      />
    </div>
  );
}