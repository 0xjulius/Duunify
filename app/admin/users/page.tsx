import { createClient } from "@/lib/supabase-server";
import { createClient as createAdminClient } from "@supabase/supabase-js"; // Lisää tämä
import UsersTable from "@/components/Admin/UsersTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // Käytetään admin-asiakasta pääsemään käsiksi auth.users -tauluun
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Haetaan profiilit JA kaikki auth.users -tiedot
  const [profilesResult, authUsersResult, adminProfileResult] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, avatar_url, role, created_at").order("created_at", { ascending: false }),
    supabaseAdmin.auth.admin.listUsers(), // Haetaan auth-käyttäjät
    user ? supabase.from("profiles").select("notify_new_users").eq("id", user.id).single() : null,
  ]);

  console.log(authUsersResult.data?.users.map(u => ({
  email: u.email,
  confirmed: u.email_confirmed_at,
  })));
  
  const profiles = profilesResult.data || [];
  const authUsers = authUsersResult.data.users || [];
  const currentAdminNotify = adminProfileResult?.data?.notify_new_users ?? false;

  // Luodaan mappi vahvistustiedoille ID:n perusteella
  const confirmationMap = new Map(
    authUsers.map(u => [u.id, !!u.email_confirmed_at])
  );

  const { data: apps } = await supabase.from("applications").select("user_id");
  const appCounts: Record<string, number> = {};
  (apps || []).forEach((a) => {
    appCounts[a.user_id] = (appCounts[a.user_id] || 0) + 1;
  });

  const users = profiles.map((p) => ({
    ...p,
    applicationCount: appCounts[p.id] || 0,
    is_confirmed: confirmationMap.get(p.id) ?? false, // Tässä tieto viedään komponentille
  }));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Käyttäjät</h1>
      <UsersTable 
        users={users} 
        currentAdminId={user?.id || ""} 
        initialNotifySettings={currentAdminNotify} 
      />
    </main>
  );
}