"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, AlertCircle } from "lucide-react";
import DownloadButton from "../DownloadButton";

type Application = {
  id: string;
  company: string;
  job_title: string;
  status: string;
  created_at: string;
  location?: string;
  applied_date?: string;
  job_url?: string;
  notes?: string;
  job_description?: string;
};

const getStatusBadgeClass = (status: string) => {
  const s = status?.toLowerCase().trim();
  if (["haastattelu", "interview"].includes(s))
    return "bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
  if (["tarjous", "offer"].includes(s))
    return "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
  if (["hylätty", "hylätyt", "rejected"].includes(s))
    return "bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20";
  if (["ei vastausta", "no response"].includes(s))
    return "bg-slate-50/50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-500/20";
  return "bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20";
};

export default function RecentApplications({
  onOpenApplication,
  demoApps,
}: {
  onOpenApplication: (app: Application, isDemo?: boolean) => void;
  demoApps?: Application[];
}) {
  const [apps, setApps] = useState<Application[]>(demoApps ? demoApps.slice(0, 4) : []);
  const [loading, setLoading] = useState(!demoApps);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isDemoMode = !!demoApps;

  useEffect(() => {
    if (demoApps) return;

    async function fetchRecent() {
      try {
        setErrorMsg(null);
        setLoading(true);
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Supabase-virhe aktiviteeteissa:", error);
          setErrorMsg(error.message);
        } else if (data) {
          setApps(data);
        }
      } catch (err) {
        console.error("Yllättävä virhe:", err);
        setErrorMsg("Yhteysvirhe tietoja haettaessa.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col h-[340px] animate-pulse">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5 p-6 shadow-sm flex flex-col h-[340px] justify-between text-red-800 dark:text-red-300">
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
          <AlertCircle className="text-red-500 dark:text-red-400" size={32} />
          <h3 className="font-bold text-sm text-red-950 dark:text-red-200">Datan lataus epäonnistui</h3>
          <p className="text-xs text-red-700 dark:text-red-300 max-w-[240px] break-words font-mono bg-white dark:bg-slate-900 p-2 rounded border border-red-200 dark:border-red-500/30">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col h-[340px] justify-between">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Viimeisimmät aktiviteetit</h2>
          <DownloadButton data={apps} fileName="tyohakemukset_30pv" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Neljä viimeisintä aktiviteettiasi.</p>

        <div className="mt-4 flex flex-col">
          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Ei vielä hakemuksia.</p>
              <p className="text-xs text-slate-300 dark:text-slate-600 mt-0.5">Lisää ensimmäinen! 🚀</p>
            </div>
          ) : (
            apps.map((app) => (
              <button
                key={app.id}
                onClick={() => onOpenApplication(app, isDemoMode)}
                className="w-full flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0 group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg -mx-2 px-2 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    <Building2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {app.company || "Tuntematon yritys"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {app.job_title || "Ei tehtävänimikettä"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border capitalize flex-shrink-0 tracking-tight ${getStatusBadgeClass(app.status)}`}
                >
                  {app.status || "Haettu"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}