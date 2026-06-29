"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, Building2, AlertCircle } from "lucide-react";

type DeadlineApp = {
  id: string;
  company: string;
  job_title: string;
  valid_through: string;
};

export default function UpcomingDeadlines() {
  const [apps, setApps] = useState<DeadlineApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        setErrorMsg(null);
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("applications")
          .select("id, company, job_title, valid_through")
          .not("valid_through", "is", null)
          .gte("valid_through", today)
          .order("valid_through", { ascending: true })
          .limit(4); // Muutettu 4 kohdetta symmetrian vuoksi

        if (error) {
          console.error("Supabase-virhe määräajoissa:", error);
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
    fetchDeadlines();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px] animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm flex flex-col h-[340px] justify-between text-red-800">
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
          <AlertCircle className="text-red-500" size={32} />
          <h3 className="font-bold text-sm text-red-950">Datan lataus epäonnistui</h3>
          <p className="text-xs text-red-700 max-w-[240px] break-words font-mono bg-white p-2 rounded border border-red-200">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px] justify-between">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-slate-900">Tulevat määräajat</h2>
        <p className="text-xs text-slate-400 mt-0.5">Pian sulkeutuvat haut.</p>

        <div className="mt-4 flex flex-col">
          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <p className="text-sm text-slate-400 font-medium">
                Ei lähestyviä määräaikoja.
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Kaikki hallinnassa! ☕
              </p>
            </div>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 group"
              >
                {/* Vasen puoli: Ikonilaatikko + Tekstit */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
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

                {/* Oikea puoli: Päivämääräbadge */}
                <div className="flex items-center gap-1.5 flex-shrink-0 text-amber-600 bg-amber-50/50 border border-amber-100 px-2 py-1 rounded-lg">
                  <Clock size={12} />
                  <span className="text-xs font-bold tracking-tight">
                    {formatDate(app.valid_through)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}