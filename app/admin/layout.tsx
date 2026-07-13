import { requireAdmin } from "@/lib/supabase-admin";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Analytics } from "@vercel/analytics/next"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    // Päivitetty dark:bg-[#0B0F19] (Syvä yönsininen OLED-tausta)
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <Analytics/>
      <AdminSidebar adminName={profile?.full_name || profile?.email || "Admin"} />
      <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>
    </div>
  );
}