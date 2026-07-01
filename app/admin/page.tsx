import { createClient } from "@/lib/supabase-server";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: appCount },
    { count: weekCount },
    { data: statusRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase.from("applications").select("status"),
  ]);

  const statusCounts: Record<string, number> = {};
  (statusRows || []).forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const stats = [
    { label: "Käyttäjät", value: userCount ?? 0, icon: Users },
    { label: "Hakemukset yhteensä", value: appCount ?? 0, icon: Briefcase },
    { label: "Uusia 7 päivässä", value: weekCount ?? 0, icon: TrendingUp },
  ];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Yleiskatsaus</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
              <s.icon size={20} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Clock size={18} className="text-slate-400" />
          Hakemukset tilan mukaan
        </h2>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => {
            const pct = appCount ? Math.round((count / appCount) * 100) : 0;
            return (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">{status}</span>
                  <span className="text-slate-400">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6D67F2] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}