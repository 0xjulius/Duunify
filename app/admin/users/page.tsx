// app/admin/users/page.tsx
import { createClient } from "@/lib/supabase-server";
import UsersTable from "@/components/Admin/UsersTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // 1. Haetaan nykyisen kirjautuneen admin-käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Haetaan kaikki profiilit sekä adminin oma ilmoitusasetus rinnakkain
  const [profilesResult, adminProfileResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, created_at")
      .order("created_at", { ascending: false }),
    user
      ? supabase
          .from("profiles")
          .select("notify_new_users")
          .eq("id", user.id)
          .single()
      : null,
  ]);

  const profiles = profilesResult.data;
  const currentAdminNotify = adminProfileResult?.data?.notify_new_users ?? false;

  // 3. Haetaan hakemusten määrät kuten ennenkin
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
      {/* Välitetään adminin oma id ja ilmoitusasetuksen alkutila komponentille */}
      <UsersTable 
        users={users} 
        currentAdminId={user?.id || ""} 
        initialNotifySettings={currentAdminNotify} 
      />
    </main>
  );
}