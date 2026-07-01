// app/admin/users/page.tsx
import { createClient } from "@/lib/supabase-server";
import UsersTable from "@/components/Admin/UsersTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .order("created_at", { ascending: false });

  const { data: apps } = await supabase.from("applications").select("user_id");

  const appCounts: Record<string, number> = {};
  (apps || []).forEach((a) => {
    appCounts[a.user_id] = (appCounts[a.user_id] || 0) + 1;
  });

  const users = (profiles || []).map((p) => ({
    ...p,
    applicationCount: appCounts[p.id] || 0,
  }));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Käyttäjät</h1>
      <UsersTable users={users} />
    </main>
  );
}