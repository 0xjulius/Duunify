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

  // Määritellään värit erikseen jokaiselle kortille kuvan tyylin mukaan
  const stats = [
    { 
      label: "Käyttäjät", 
      value: userCount ?? 0, 
      icon: Users,
      textStyle: "text-blue-500 dark:text-[#3B82F6]",
      bgStyle: "dark:bg-[#111827] dark:border-[#1F2937]/50",
      iconBg: "bg-blue-500/10 text-blue-500 dark:text-[#3B82F6] dark:bg-[#3B82F6]/10"
    },
    { 
      label: "Hakemukset yhteensä", 
      value: appCount ?? 0, 
      icon: Briefcase,
      textStyle: "text-amber-500 dark:text-[#FBBF24]",
      bgStyle: "dark:bg-[#111827] dark:border-[#1F2937]/50",
      iconBg: "bg-amber-500/10 text-amber-500 dark:text-[#FBBF24] dark:bg-[#FBBF24]/10"
    },
    { 
      label: "Uusia 7 päivässä", 
      value: weekCount ?? 0, 
      icon: TrendingUp,
      textStyle: "text-purple-500 dark:text-[#A855F7]",
      bgStyle: "dark:bg-[#111827] dark:border-[#1F2937]/50",
      iconBg: "bg-purple-500/10 text-purple-500 dark:text-[#A855F7] dark:bg-[#A855F7]/10"
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
        Yleiskatsaus
      </h1>

      {/* Kortit yksilöllisillä väreillä */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden ${s.bgStyle}`}
          >
            <div>
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 ${s.textStyle}`}>{s.label}</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center absolute top-6 right-6 ${s.iconBg}`}>
              <s.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Tilastolaatikko yönsinisellä taustalla */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F2937]/50 shadow-sm">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 text-base">
          <Clock size={18} className="text-slate-400 dark:text-slate-500" />
          Hakemukset tilan mukaan
        </h2>
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const pct = appCount ? Math.round((count / appCount) * 100) : 0;
            return (
              <div key={status} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold capitalize">{status}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-[#0B0F19] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 dark:bg-[#3B82F6] rounded-full transition-all duration-500"
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