import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SquareActivity,
  UserCheck,
  AlertCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";

type AdminLog = {
  id: string;
  created_at: string;
  action: string;
  details: string;
  ip_address: string;
  status: "success" | "failure" | "warning" | "critical" | "info";
  category: string;
  profiles: {
    email: string;
    role: string;
    avatar_url?: string;
  } | null;
};

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Jämäkät ja puhtaat kontrastivärit (Solid-tunnisteet valkoisella tekstillä)
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-600 text-white font-semibold";
      case "failure":
        return "bg-rose-600 text-white font-semibold";
      case "warning":
        return "bg-amber-500 text-slate-950 font-bold";
      case "critical":
        return "bg-red-800 text-white font-black uppercase tracking-wider";
      case "info":
      default:
        return "bg-blue-600 text-white font-semibold";
    }
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: logs, error } = (await supabase
    .from("admin_logs")
    .select(
      `
    id,
    created_at,
    action,
    details,
    ip_address,
    status,
    category,
    user_id,
    profiles!admin_logs_user_id_fkey (
      email,
      role,
      avatar_url
    )
  `,
    )
    .order("created_at", { ascending: false })
    .limit(100)) as unknown as { data: AdminLog[] | null; error: any };

  if (error) {
    console.error("Virhe lokien haussa:", error);
  }

  const totalLogs = logs?.length || 0;
  const loginActions =
    logs?.filter(
      (l) =>
        l.action.toLowerCase().includes("login") ||
        l.action.toLowerCase().includes("kirjautuminen"),
    ).length || 0;
  const warningActions =
    logs?.filter(
      (l) =>
        l.action.toLowerCase().includes("error") ||
        l.action.toLowerCase().includes("warning") ||
        l.action.toLowerCase().includes("virhe") ||
        l.status === "failure" ||
        l.status === "critical",
    ).length || 0;

  return (
    <div className="space-y-8">
      {/* Otsikkoalue */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <SquareActivity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Tapahtumaloki
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Seuraa järjestelmän tapahtumia, käyttäjien toimia ja automaattisia
              lokituksia.
            </p>
          </div>
        </div>
      </div>

      {/* Tilastokortit vahvoilla reunuksilla / ikoneilla */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-xl text-white">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tapahtumia yhteensä
            </p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {totalLogs} kpl
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kirjautumiset
            </p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">
              {loginActions} kpl
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-rose-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-600 rounded-xl text-white">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              Varoitukset / Virheet
            </p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {warningActions} kpl
            </p>
          </div>
        </div>
      </div>

      {/* Lokitaulukko */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <h3 className="text-sm font-bold tracking-wide">
            Viimeisimmät järjestelmätapahtumat
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="px-6 py-3.5">Aikaleima</th>
                <th className="px-6 py-3.5">Käyttäjä</th>
                <th className="px-6 py-3.5">Tila / Toiminto</th>
                <th className="px-6 py-3.5">Kuvaus</th>
                <th className="px-6 py-3.5">IP-Osoite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 font-medium"
                  >
                    <AlertCircle
                      className="mx-auto text-slate-400 mb-3"
                      size={32}
                    />
                    Ei tapahtumalokeja saatavilla tietokannasta.
                  </td>
                </tr>
              ) : (
                logs.map((log: AdminLog) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition border-b border-slate-100"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("fi-FI")}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {log.profiles ? (
                          <img
                            src={
                              log.profiles.avatar_url ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(log.profiles.email)}&backgroundColor=4f46e5&textColor=ffffff`
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full border border-slate-300 object-cover flex-shrink-0"
                          />
                        ) : (
                          <img
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=system&backgroundColor=4f46e5"
                            alt="System Avatar"
                            className="w-8 h-8 rounded-full border border-slate-300 object-cover flex-shrink-0"
                          />
                        )}

                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">
                            {log.profiles?.email || (
                              <span className="text-indigo-600 font-extrabold uppercase text-xs tracking-wider">
                                Järjestelmä
                              </span>
                            )}
                          </span>
                          {log.profiles?.role === "admin" && (
                            <span className="w-fit mt-0.5 text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs tracking-wide ${getStatusStyles(log.status || "info")}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 max-w-sm font-medium text-slate-800 break-words"
                      title={log.details}
                    >
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 font-bold whitespace-nowrap">
                      {log.ip_address || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
