"use client";

// 1. Tämä pakottaa middlewaren tarkistamaan sivun joka kerta
export const dynamic = "force-dynamic"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import AddApplicationForm from "@/app/applications/AddApplicationForm";
import ApplicationCard from "@/app/applications/ApplicationCard";
import ApplicationStats from "@/components/applications/ApplicationStats";
import Sidebar from "@/components/Sidebar";
import { Briefcase, Filter } from "lucide-react";

type Application = {
  id: string;
  company: string;
  job_title: string;
  location: string;
  status: string;
  notes: string;
  applied_date: string;
  job_description: string;
  job_url?: string;
};

export default function Home() {
  const router = useRouter(); 
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, [router]);

  async function deleteApplication(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    fetchApplications();
  }

  // Suodatetaan hakemukset hakusanan sekä valitun tilan (statusFilter) mukaan
  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      app.status?.toLowerCase().trim() === statusFilter.toLowerCase().trim();

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen flex bg-slate-100 dark:bg-[#12141c]">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-400 mx-auto gap-10 ">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-200 to-violet-600 dark:from-indigo-500/20 dark:to-violet-600/20 p-3 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white dark:text-indigo-400" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Työpaikat ja hakemukset
                </h1>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3 ml-5 md:ml-[37px]">
                Täällä voit lisätä, hakea, tallentaa, poistaa tai muuttaa työhakemuksiesi, tai ilmoitusten tilaa. 
              </p>
            </div>
          </div>

          {/* TILASTOT */}
          <ApplicationStats applications={applications} loading={loading} />
          
          {/* SEARCH + FILTER + BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Hakukenttä */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Hae yritystä tai tehtävää..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 pl-12 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Status-suodatin */}
            <div className="relative min-w-[180px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Filter className="h-4 w-4" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 pl-11 pr-8 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-slate-100 cursor-pointer appearance-none"
              >
                <option value="all">Suodata</option>
                <option value="haettu">Haettu</option>
                <option value="haastattelu">Haastattelu</option>
                <option value="tarjous">Tarjous</option>
                <option value="hylätty">Hylätty</option>
                <option value="tallennettu">Tallennettu</option>
              </select>
            </div>

            {/* Lisää-painike */}
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                showForm
                  ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30 dark:hover:bg-red-500/30"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              }`}
            >
              {showForm ? "✕ Sulje" : "+ Lisää työpaikka"}
            </button>
          </div>

        {/* FORM */}
          {showForm && (
            <div className="mb-10 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out fill-mode-both">
              <AddApplicationForm
                onSuccess={() => {
                  fetchApplications();
                  setShowForm(false);
                }}
              />
            </div>
          )}

          {/* APPLICATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm animate-pulse flex flex-col gap-4"
                >
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
                  <div className="mt-4 h-20 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
                  <div className="flex gap-2 mt-auto">
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  </div>
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onChange={fetchApplications}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700">
                <div className="col-span-full">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                    {search || statusFilter !== "all"
                      ? "Ei hakemuksia valituilla ehdoilla"
                      : "Ei hakemuksia vielä"}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {search || statusFilter !== "all"
                      ? "Kokeile muuttaa hakusanaa tai suodatinta."
                      : "Aloita lisäämällä ensimmäinen hakemuksesi."}
                  </p>
                  {!search && statusFilter === "all" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-medium"
                    >
                      + Lisää ensimmäinen hakemus
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}