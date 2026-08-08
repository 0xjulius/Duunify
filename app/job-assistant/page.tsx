"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar"; // <-- Varmista että tämä polku on oikein
import {
  Sparkles,
  Briefcase,
  MapPin,
  Clock3,
  ChevronRight,
  Search,
  Building2,
  CheckCircle2,
  Loader2,
  BookmarkX,
} from "lucide-react";

type SavedJob = {
  id: string;
  job_title: string;
  company: string;
  location: string;
  employment_type?: string;
  created_at?: string;
  description?: string;
  tags?: string[];
  status?: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Äskettäin";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "Äskettäin";
  }
};

export default function JobAssistantPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  async function fetchSavedJobs() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .in("status", ["suosikki", "tallennettu", "Suosikki", "Tallennettu"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Virhe tallennettujen työpaikkojen haussa:", error);
    } else if (data) {
      setJobs(data as SavedJob[]);
    }

    setLoading(false);
  }

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.job_title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    /* Kääritään koko näkymä flex-kontaineriin, jotta Sidebar ja sisältö asettuvat vierekkäin */
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      
      {/* Sivupalkki tulee tänne vasemmalle */}
      <Sidebar />

      {/* Pääsisältö, joka vie lopun tilasta */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* HEADER */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Sparkles size={23} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Työnhakuavustaja
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Räätälöi hakemuksesi valitsemaasi työpaikkaan.
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Valitse tallentamasi työpaikkailmoitus. Duunify käyttää ilmoitusta,
              CV:täsi ja pohjasaatekirjettäsi räätälöidyn saatekirjeen
              muodostamiseen.
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              Valitse työpaikka
            </div>

            <ChevronRight
              size={16}
              className="text-slate-300 dark:text-slate-700"
            />

            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 text-sm">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                2
              </div>
              Tarkista asiakirjat
            </div>

            <ChevronRight
              size={16}
              className="text-slate-300 dark:text-slate-700"
            />

            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 text-sm">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                3
              </div>
              Luo saatekirje
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl shadow-sm overflow-hidden">
            {/* CARD HEADER */}
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1F2937]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Valitse työpaikkailmoitus</h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Valitse yksi tallennetuista työpaikoista.
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hae työpaikoista..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#0B0F19] text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* JOB LIST */}
            <div className="p-4 sm:p-6 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-indigo-600" />
                  <p className="text-sm font-medium">Haetaan tallennettuja työpaikkoja...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                    <BookmarkX size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                    Ei tallennettuja työpaikkoja
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                    {searchQuery
                      ? "Hakuehdoillasi ei löytynyt yhtään työpaikkaa."
                      : "Sinulla ei ole vielä tallennettuja työpaikkoja. Tallenna työpaikkoja suosikkeihin aloittaaksesi."}
                  </p>
                  <Link
                    href="/favorites"
                    className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                  >
                    Siirry tallennettuihin
                  </Link>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/job-assistant/${job.id}`}
                    className="group block"
                  >
                    <div className="relative rounded-2xl border border-slate-200 dark:border-[#1F2937] p-5 sm:p-6 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/[0.03] transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                        {/* COMPANY ICON */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Building2
                              size={22}
                              className="text-slate-500 dark:text-slate-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                {job.job_title}
                              </h3>
                            </div>

                            <p className="font-medium text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                              {job.company}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} />
                                {job.location || "Ei sijaintia"}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Briefcase size={13} />
                                {job.employment_type || "Kokoaikainen"}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock3 size={13} />
                                Tallennettu {formatDate(job.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* TAGS */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 lg:max-w-xs">
                            {job.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ARROW */}
                        <div className="flex items-center justify-end lg:justify-center shrink-0">
                          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            Valitse
                            <ChevronRight
                              size={18}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      {job.description && (
                        <div className="mt-4 lg:ml-16">
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="px-6 sm:px-8 py-5 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-[#1F2937]">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-500" />

                <span>
                  Valitsemasi työpaikka käyttää Duunifyyn tallennettua
                  työpaikkailmoitusta.
                </span>
              </div>
            </div>
          </div>

          {/* EMPTY / INFO */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Etkö löydä haluamaasi työpaikkaa?
            </p>

            <Link
              href="/favorites"
              className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Katso tallennetut työpaikat
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}