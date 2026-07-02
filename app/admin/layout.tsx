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
    <div className="flex min-h-screen bg-slate-50">
      <Analytics/>
      <AdminSidebar adminName={profile?.full_name || profile?.email || "Admin"} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}