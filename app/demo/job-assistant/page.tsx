"use client";

import { useState } from "react";
import Link from "next/link";
import DemoSidebar from "@/components/demo/DemoSidebar";
import {
  Search,
  CheckCircle2,
  ChevronRight,
  Zap,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// MOCK-DATA DEMOVIERAILEVILLE
export const DEMO_JOBS = [
  {
    id: "demo-1",
    job_title: "Senior Full Stack Developer",
    company: "RELEX Solutions",
    location: "Helsinki (Hybrid)",
    company_logo: "/demo-logos/relex.webp",
    created_at: "2026-08-10T10:00:00Z",
    status: "tallennettu",
    employment_type: "Kokoaikainen",
  },
  {
    id: "demo-2",
    job_title: "AI Specialist & Automation Architect",
    company: "Futurice",
    location: "Etätyö / Tampere",
    company_logo: "/demo-logos/futurice.webp",
    created_at: "2026-08-11T12:30:00Z",
    status: "suosikki",
    employment_type: "Kokoaikainen",
  },
  {
    id: "demo-3",
    job_title: "Frontend Developer (React & Next.js)",
    company: "KONE",
    location: "Espoo",
    company_logo: "/demo-logos/kone.png",
    created_at: "2026-08-12T08:15:00Z",
    status: "tallennettu",
    employment_type: "Kokoaikainen",
  },
];

export default function JobAssistantDemoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const handleImageError = (jobId: string) => {
    setFailedLogos((prev) => ({ ...prev, [jobId]: true }));
  };

  const filteredJobs = DEMO_JOBS.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.job_title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <DemoSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* 1. DEMO BANNER */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Interaktiivinen Demoversio</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tämä on esikatselunäkymä valmiilla esimerkkityöpaikoilla.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shrink-0"
            >
              Luo tili & tallenna omia ➔
            </Link>
          </div>

          {/* 2. HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">
              <Sparkles size={16} />
              <span>Duunify Job Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tekoälyavustaja työhakemuksiin
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base max-w-2xl">
              Räätälöi täydellisesti kohdennetut hakemukset sekunneissa omien
              tallennettujen työpaikkoidesi pohjalta.
            </p>
          </div>

          {/* 3. STEP INDICATOR SUORAAN SIVULLA */}
          <div className="mb-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Valitse työpaikka</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Tarkista tiedot</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>Valmis hakemus</span>
              </div>
            </div>
          </div>

          {/* 4. MAIN CARD */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl shadow-sm overflow-hidden">
            
            {/* CARD HEADER & SEARCH */}
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1F2937]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Valitse työpaikkailmoitus</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Valitse yksi tallennetuista demo-työpaikoista jatkaaksesi.
                  </p>
                </div>

                {/* SEARCH INPUT */}
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

            {/* 5. JOB LISTING (KORTIT SUORAAN MÄPÄTTYIKSI) */}
            <div className="divide-y divide-slate-100 dark:divide-[#1F2937]">
              {filteredJobs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  Ei hakutuloksia hakusanalla "{searchQuery}".
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 sm:p-8 hover:bg-slate-50/80 dark:hover:bg-[#161f30] transition flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* LOGO */}
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden mt-1">
                        {job.company_logo && !failedLogos[job.id] ? (
                          <img
                            src={job.company_logo}
                            alt={`${job.company} logo`}
                            className="w-full h-full object-contain p-2"
                            onError={() => handleImageError(job.id)}
                          />
                        ) : (
                          <Building2
                            size={22}
                            className="text-slate-400 dark:text-slate-500"
                          />
                        )}
                      </div>

                      {/* TIEDOT */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                          {job.job_title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={13} />
                            {job.employment_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SUORA LINKKI DEMO-ID SIVULLE */}
                    <div className="shrink-0 pt-2 sm:pt-0">
                      <Link
                        href={`/demo/job-assistant/${job.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm shadow-indigo-600/20"
                      >
                        Valitse tämä
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CARD FOOTER */}
            <div className="px-6 sm:px-8 py-5 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-[#1F2937]">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>
                  Valitsemasi työpaikka käyttää Duunifyyn tallennettua työpaikkailmoitusta.
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM HELP LINK */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Etkö löydä haluamaasi työpaikkaa?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Rekisteröidy ja lisää omia ilmoituksia
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}