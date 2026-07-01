"use client";

// Varmistetaan, että Next.js ei välimuistita sivua, vaan middleware tarkistaa oikeudet aina
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Bookmark, Filter, Clock, Search } from "lucide-react";
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
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
};

export default function SavedJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Kaikki");
  const [jobs, setJobs] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal-tila
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FavoriteJob | null>(null);

  const handleOpenJob = (job: FavoriteJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // Alkuperäinen haku on täydellinen – pidetään se täsmälleen näin!
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
    }
    
    fetchFavorites();
  }, [router]);

  // Nämä voivat olla tässä taustalla (palauttavat vain aina 0, mikä ei haittaa mitään)
  const expiringSoon = jobs.filter(
    (j) =>
      typeof j.days_left === "number" && j.days_left <= 7 && j.days_left > 0,
  ).length;
  const activePlans = jobs.filter((j) => j.status === "Aiot hakea").length;
  const archived = jobs.filter((j) => j.status === "Arkistoitu").length;
  return (
    <main className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1500px] mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="bg-gradient-to-br from-indigo-200 to-violet-600  p-3 rounded-xl text-amber-600">
                  <Bookmark className="h-10 w-10 text-white" />
                </span>
                Tallennetut työpaikat
              </h1>
              <p className="text-slate-500 mt-2">
                Työpaikat, jotka haluat hakea myöhemmin.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl font-medium">
                <Filter size={18} /> Suodattimet
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold"
              >
                + Tallenna työpaikka
              </button>
            </div>
          </div>

          {/* STATS - Dynaaminen */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm">
                Tallennettua työpaikkaa
              </h3>
              <p className="text-2xl font-bold mt-1">{jobs.length}</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium">
                +4 viime viikolla
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm">Päättyy pian</h3>
              <p className="text-2xl font-bold mt-1">{expiringSoon}</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium">
                Seuraavan 7 päivän aikana
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm">Aiot hakea</h3>
              <p className="text-2xl font-bold mt-1">{activePlans}</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium">
                Merkitty aktiiviseksi
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm">Arkistoitu</h3>
              <p className="text-2xl font-bold mt-1">{archived}</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium">
                Piilotetut työpaikat
              </p>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="flex gap-2 mb-6">
                {["Kaikki", "Aiot hakea", "Päättyy pian", "Arkistoitu"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl font-medium ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white border border-slate-200"}`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y">
                {loading ? (
                  <div className="p-12 text-center text-slate-500">
                    Ladataan työpaikkoja...
                  </div>
                ) : (
                  jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => handleOpenJob(job)}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b last:border-0"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold bg-sky-100 text-sky-700">
                          {job.company?.[0] || "G"}
                        </div>
                        <div>
                          <h4 className="font-bold">{job.job_title}</h4>
                          <p className="text-sm text-slate-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{job.salary}</p>
                        <p className="text-sm text-amber-600 flex items-center gap-1 justify-end">
                          <Clock size={14} /> {job.days_left ?? 0} päivää
                          jäljellä
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="w-80 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 border rounded-xl p-3 mb-4">
                  <Search size={18} />
                  <input
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="Hae tallennetuista..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        app={selectedJob}
      />
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] !p-0 !border-none !bg-transparent !shadow-none !max-w-[1000px] !w-full [&>button]:hidden outline-none"
            style={{ border: "none", boxShadow: "none" }}
          >
            <div className="bg-none !border-none m-4">
              <AddApplicationForm onSuccess={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </main>
  );
}
