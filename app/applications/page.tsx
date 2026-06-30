"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import AddApplicationForm from "@/app/applications/AddApplicationForm";
import ApplicationCard from "@/app/applications/ApplicationCard";
import Sidebar from "@/components/Sidebar";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
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
  }, []);

  async function deleteApplication(id: string) {
    await supabase.from("applications").delete().eq("id", id);

    fetchApplications();
  }

  const filtered = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    Haettu: applications.filter((a) => a.status === "Haettu").length,
    Haastattelu: applications.filter((a) => a.status === "Haastattelu").length,
    Hylätty: applications.filter((a) => a.status === "Hylätty").length,
    Tarjous: applications.filter((a) => a.status === "Tarjous").length,
  };

  return (
    <main className="min-h-screen flex bg-slate-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-400 mx-auto gap-10 ">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Hakemukset</h1>

              <p className="text-slate-500 mt-1">
                Tässä näkymässä näet kaikki hakemuksesi ja niiden tilat. Pidä
                kirjaa työnhaustasi ja seuraa edistymistäsi helposti!
              </p>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider ">
              <p className="bg-blue-400 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm ">
                Haettu <span>{stats.Haettu}</span>
              </p>

              <p className="bg-yellow-400 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-black">
                Haastattelu <span>{stats.Haastattelu}</span>
              </p>

              <p className="bg-red-400 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                Hylätty <span>{stats.Hylätty}</span>
              </p>

              <p className="bg-green-500 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                Tarjous <span>{stats.Tarjous}</span>
              </p>
            </div>
          </div>

          {/* SEARCH + BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all cursor-pointer ${showForm ? "bg-red-500 text-white hover:bg-red-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
            >
              {showForm ? "✕ Sulje" : "+ Lisää hakemus"}
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="mb-10">
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
              // Skeleton loading state
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-pulse flex flex-col gap-4"
                >
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
                  <div className="mt-4 h-20 w-full bg-slate-100 rounded-2xl" />
                  <div className="flex gap-2 mt-auto">
                    <div className="h-8 w-20 bg-slate-200 rounded-xl" />
                    <div className="h-8 w-20 bg-slate-200 rounded-xl" />
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
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
                <div className="col-span-full">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Ei hakemuksia vielä
                  </h2>
                  <p className="text-slate-500 mb-6">
                    Aloita lisäämällä ensimmäinen hakemuksesi.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
                  >
                    + Lisää ensimmäinen hakemus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
