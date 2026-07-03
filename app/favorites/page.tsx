"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Bookmark, Filter, Clock, Search, X } from "lucide-react";
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import AddApplicationForm from "@/app/applications/AddApplicationForm";


type FavoriteJob = {
  id: string;
  company: string;
  job_title: string;
  location: string;
  salary: string;
  days_left?: number;
  status: string;
  valid_through?: string;
  notes?: string;
  job_description?: string;
  job_url?: string;
  applied_date?: string;
  cv_url?: string;
};

export default function SavedJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Kaikki");
  const [jobs, setJobs] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FavoriteJob | null>(null);

  const handleOpenJob = (job: FavoriteJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const fetchFavorites = useCallback(async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("status", "Tallennettu")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Virhe suosikkien haussa:", error);
    }

    if (!error && data) {
      const today = new Date().getTime();

      const formattedData = data.map((job: any) => {
        let days = 0;
        if (job.valid_through) {
          const deadlineDate = new Date(job.valid_through).getTime();
          days = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        }
        return { ...job, days_left: days };
      });
      setJobs(formattedData as FavoriteJob[]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  function handleAddSuccess() {
    setShowForm(false); // Sulje lomake
    fetchFavorites(); // Päivitä lista, jotta uusi tallennus näkyy heti
  }

  const expiringSoon = jobs.filter(
    (j) => typeof j.days_left === "number" && j.days_left <= 7 && j.days_left > 0
  ).length;
  const activePlans = jobs.filter((j) => j.status === "Aiot hakea").length;
  const archived = jobs.filter((j) => j.status === "Arkistoitu").length;

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-[1500px] mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="bg-gradient-to-br from-indigo-200 to-violet-600 p-2.5 sm:p-3 rounded-xl text-amber-600 shrink-0">
                  <Bookmark className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
                </span>
                Tallennetut työpaikat
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Työpaikat, jotka haluat hakea myöhemmin.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 bg-white rounded-xl font-medium text-sm whitespace-nowrap">
                <Filter size={16} /> <span className="hidden xs:inline">Suodattimet</span>
              </button>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="flex-1 sm:flex-initial bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold text-sm whitespace-nowrap"
              >
                {showForm ? "Sulje lomake" : "+ Tallenna työpaikka"}
              </button>
            </div>
          </div>

          {/* INLINE LOMAKE */}
          {showForm && (
            <div className="mb-8 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                aria-label="Sulje lomake"
              >
                <X size={18} />
              </button>
              <AddApplicationForm onSuccess={handleAddSuccess} />
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-xs sm:text-sm">
                Tallennettua työpaikkaa
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{jobs.length}</p>
              <p className="text-[11px] sm:text-xs text-indigo-600 mt-2 font-medium">
                +4 viime viikolla
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-xs sm:text-sm">Päättyy pian</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{expiringSoon}</p>
              <p className="text-[11px] sm:text-xs text-indigo-600 mt-2 font-medium">
                Seuraavan 7 päivän aikana
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-xs sm:text-sm">Aiot hakea</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{activePlans}</p>
              <p className="text-[11px] sm:text-xs text-indigo-600 mt-2 font-medium">
                Merkitty aktiiviseksi
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-xs sm:text-sm">Arkistoitu</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{archived}</p>
              <p className="text-[11px] sm:text-xs text-indigo-600 mt-2 font-medium">
                Piilotetut työpaikat
              </p>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 min-w-0 order-2 lg:order-1">
              {/* Tabs: vaakascrollautuva mobiilissa, ei rivity rumasti */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
                {["Kaikki", "Aiot hakea", "Päättyy pian", "Arkistoitu"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap shrink-0 ${
                      activeTab === tab
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y">
                {loading ? (
                  <div className="p-12 text-center text-slate-500">
                    Ladataan työpaikkoja...
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm">
                    Ei vielä tallennettuja työpaikkoja.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => handleOpenJob(job)}
                      className="w-full p-4 sm:p-6 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-left border-b last:border-0"
                    >
                      <div className="flex gap-3 sm:gap-4 min-w-0">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold bg-sky-100 text-sky-700">
                          {job.company?.[0] || "G"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm sm:text-base truncate">
                            {job.job_title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 truncate">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm sm:text-base">{job.salary}</p>
                        <p className="text-xs sm:text-sm text-amber-600 flex items-center gap-1 justify-end whitespace-nowrap">
                          <Clock size={13} /> {job.days_left ?? 0} pv
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2 space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 border rounded-xl p-3">
                  <Search size={18} className="shrink-0" />
                  <input
                    className="w-full bg-transparent outline-none text-sm min-w-0"
                    placeholder="Hae tallennetuista..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationDialog open={isModalOpen} onOpenChange={setIsModalOpen} app={selectedJob} />
    </main>
  );
}