"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2 } from "lucide-react";
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
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (["tarjous", "offer"].includes(s))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["hylätty", "hylätyt", "rejected"].includes(s))
    return "bg-red-50 text-red-700 border-red-200";
  if (["ei vastausta", "no response"].includes(s))
    return "bg-slate-50 text-slate-600 border-slate-200";
  return "bg-blue-50 text-indigo-700 border-blue-200";
};

export default function RecentApplications({
  onOpenApplication,
  demoApps,
}: {
  // Lisätään onOpenApplication-funktiolle valinnainen toinen parametri isDemo
  onOpenApplication: (app: Application, isDemo?: boolean) => void;
  demoApps?: Application[];
}) {
  const [apps, setApps] = useState<Application[]>(demoApps ? demoApps.slice(0, 4) : []);
  const [loading, setLoading] = useState(!demoApps);
  
  // Tunnistetaan dynaamisesti, ollaanko demotilassa
  const isDemoMode = !!demoApps;

  useEffect(() => {
    if (demoApps) return;

    async function fetchRecent() {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setApps(data);
      }
      setLoading(false);
    }
    fetchRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px] animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-6 bg-slate-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px] justify-between">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Viimeisimmät aktiviteetit</h2>
          <DownloadButton data={apps} fileName="tyohakemukset_30pv" />
        </div>

        <p className="text-xs text-slate-400">Neljä viimeisintä aktiviteettiasi.</p>

        <div className="mt-2.5 flex flex-col">
          {apps.length === 0 ? (
            <p className="text-sm text-slate-400 py-12 text-center">Ei vielä hakemuksia. Lisää ensimmäinen! 🚀</p>
          ) : (
            apps.map((app) => (
              <button
                key={app.id}
                // Välitetään tieto demotilasta eteenpäin, kun hakemus avataan
                onClick={() => onOpenApplication(app, isDemoMode)}
                className="w-full flex items-center justify-between py-2 border-b border-slate-50 last:border-0 group transition-all hover:bg-slate-50 rounded-lg -mx-2 px-2 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-11 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <Building2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate leading-tight">
                      {app.company || "Tuntematon yritys"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {app.job_title || "Ei tehtävänimikettä"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded-md border capitalize flex-shrink-0 ${getStatusBadgeClass(app.status)}`}
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