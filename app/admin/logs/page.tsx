import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  SquareActivity,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
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

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams.page) || 1;
  const searchQuery = resolvedParams.search || "";
  const statusFilter = resolvedParams.status || "all";
  const itemsPerPage = 20;

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
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  let query = supabase.from("admin_logs").select(
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
    { count: "exact" },
  );

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (searchQuery) {
    query = query.or(
      `action.ilike.%${searchQuery}%,details.ilike.%${searchQuery}%`,
    );
  }

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: logs,
    error,
    count,
  } = (await query
    .order("created_at", { ascending: false })
    .range(from, to)) as unknown as {
    data: AdminLog[] | null;
    error: any;
    count: number | null;
  };

  if (error) console.error("Virhe lokien haussa:", error);

  const totalLogs = count || 0;
  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-600 dark:bg-emerald-500 text-white font-semibold shadow-sm";
      case "failure":
        return "bg-rose-600 dark:bg-rose-500 text-white font-semibold shadow-sm";
      case "warning":
        return "bg-amber-500 dark:bg-amber-400 text-slate-950 font-bold shadow-sm";
      case "critical":
        return "bg-red-800 dark:bg-red-700 text-white font-black uppercase tracking-wider animate-pulse shadow-md";
      case "info":
      default:
        return "bg-blue-600 dark:bg-[#3B82F6] text-white font-semibold shadow-sm";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Otsikkoalue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 dark:bg-blue-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 dark:shadow-blue-500/10">
            <SquareActivity size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tapahtumaloki
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Reaaliaikaiset järjestelmätapahtumat ja ylläpidon valvonta.
            </p>
          </div>
        </div>
      </div>

      {/* Työkalurivi — Päivitetty yönsininen tausta */}
      <div className="bg-white/60 dark:bg-[#111827] backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-[#1F2937]/50 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <form method="GET" className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={16}
            />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Hae toimintoa tai kuvausta..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {statusFilter !== "all" && (
              <input type="hidden" name="status" value={statusFilter} />
            )}
          </div>
          <button
            type="submit"
            className="h-10 px-4 bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-600 dark:hover:bg-blue-700 transition"
          >
            Hae
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mr-1 hidden lg:inline">
            Tila:
          </span>
          {[
            { id: "all", label: "Kaikki" },
            { id: "success", label: "Onnistunut" },
            { id: "failure", label: "Virhe" },
            { id: "warning", label: "Varoitus" },
            { id: "critical", label: "Kriittinen" },
          ].map((btn) => {
            const isActive = statusFilter === btn.id;
            const params = new URLSearchParams();
            if (searchQuery) params.set("search", searchQuery);
            if (btn.id !== "all") params.set("status", btn.id);

            return (
              <Link
                key={btn.id}
                href={`?${params.toString()}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 dark:bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-[#0B0F19] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#0B0F19]/80"
                }`}
              >
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lokitaulukko — Päivitetty yönsininen tausta */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F2937]/50 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] divide-y divide-slate-100 dark:divide-[#1F2937]/40">
            {/* Otsikkorivi */}
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 dark:border-[#1F2937]/50 bg-slate-50 dark:bg-[#0B0F19] px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Aikaleima</div>
              <div className="col-span-3">Käyttäjä</div>
              <div className="col-span-2">Tila / Toiminto</div>
              <div className="col-span-3">Kuvaus</div>
              <div className="col-span-2">IP-Osoite</div>
            </div>

            {/* Sisältörivit */}
            {!logs || logs.length === 0 ? (
              <div className="px-6 py-16 text-center text-slate-400">
                <AlertCircle
                  className="mx-auto text-slate-300 dark:text-slate-700 mb-3"
                  size={40}
                />
                <p className="font-medium text-slate-500">
                  Ei hakukriteereitä vastaavia lokeja löytynyt.
                </p>
              </div>
            ) : (
              logs.map((log: AdminLog) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-[#0B0F19]/30 transition text-sm text-slate-700 dark:text-slate-300"
                >
                  {/* AIKALEIMA */}
                  <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {new Date(log.created_at).toLocaleString("fi-FI")}
                  </div>

                  {/* KÄYTTÄJÄ */}
                  <div className="col-span-3 font-medium min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {log.profiles ? (
                        <img
                          src={
                            log.profiles.avatar_url ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(log.profiles.email)}&backgroundColor=4f46e5&textColor=ffffff`
                          }
                          alt="Avatar"
                          className="w-8 h-8 rounded-full border border-slate-300 dark:border-zinc-700 object-cover flex-shrink-0"
                        />
                      ) : (
                        <img
                          src="https://api.dicebear.com/7.x/bottts/svg?seed=system&backgroundColor=4f46e5"
                          alt="System Avatar"
                          className="w-8 h-8 rounded-full border border-slate-300 dark:border-zinc-700 object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {log.profiles?.email || (
                            <span className="text-indigo-600 dark:text-[#3B82F6] font-extrabold uppercase text-xs tracking-wider">
                              Järjestelmä
                            </span>
                          )}
                        </span>
                        {log.profiles?.role === "admin" && (
                          <span className="w-fit mt-0.5 text-[9px] bg-slate-900 dark:bg-[#0B0F19] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider border dark:border-[#1F2937]/50">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TILA / TOIMINTO */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1.5 rounded text-xs tracking-wide min-w-[130px] text-center ${getStatusStyles(log.status || "info")}`}
                    >
                      {log.action}
                    </span>
                  </div>

                  {/* KUVAUS */}
                  <div className="col-span-3 font-normal text-slate-600 dark:text-zinc-300 break-words pr-2">
                    {log.details}
                  </div>

                  {/* IP-OSOITE */}
                  <div className="col-span-2 text-xs font-mono text-slate-500 dark:text-slate-400 font-bold truncate">
                    {log.ip_address || "—"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-[#1F2937]/50 flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Näytetään sivulla{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {currentPage}
              </span>{" "}
              / <span className="font-bold">{totalPages}</span> (Yhteensä{" "}
              {totalLogs} riviä)
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`?${new URLSearchParams({
                  ...(searchQuery && { search: searchQuery }),
                  ...(statusFilter !== "all" && { status: statusFilter }),
                  page: String(Math.max(1, currentPage - 1)),
                }).toString()}`}
                className={`p-2 rounded-lg border border-slate-200 dark:border-[#1F2937]/50 transition ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0B0F19]"
                }`}
              >
                <ChevronLeft size={16} />
              </Link>

              <Link
                href={`?${new URLSearchParams({
                  ...(searchQuery && { search: searchQuery }),
                  ...(statusFilter !== "all" && { status: statusFilter }),
                  page: String(Math.min(totalPages, currentPage + 1)),
                }).toString()}`}
                className={`p-2 rounded-lg border border-slate-200 dark:border-[#1F2937]/50 transition ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0B0F19]"
                }`}
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}