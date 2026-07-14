"use client";

import { useState, useEffect } from "react";
import DemoSidebar from "@/components/demo/DemoSidebar";
import ApplicationCard from "@/app/applications/ApplicationCard";
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
// Tuodaan valmis demodata projektin omasta tiedostosta
import { DEMO_APPLICATIONS } from "@/lib/demo-data";

// Määritellään tyyppi vastaamaan demodataasi tarvittaessa
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
  company_logo?: string | null;
};

export default function DemoHome() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Suodatetaan mahdolliset suosikit/tallennetut pois, jos halutaan näyttää vain varsinaiset hakemukset kuten tilastoissa
      const initialData = DEMO_APPLICATIONS.filter(
        (app) => !["suosikki", "tallennettu"].includes(app.status?.toLowerCase().trim() || "")
      );
      
      setApplications(initialData as Application[]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const deleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
    setDialogOpen(false);
  };

  const filtered = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen flex bg-slate-100 dark:bg-[#12141c]">
      <DemoSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-400 mx-auto gap-10 ">
          
          <ApplicationDialog
            app={selectedApplication}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            isDemo={true}
          />

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-200 to-violet-600 dark:from-indigo-500/20 dark:to-violet-600/20 p-3 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white dark:text-indigo-400" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Hakemukset <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md ml-2 font-normal">Demo</span>
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3 ml-5 md:ml-[37px]">
                Täällä voit hakea, tarkastella tai poistaa demoversioon kuuluvia työhakemuksia.
              </p>
            </div>
          </div>

          {/* SEARCH + BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

            <button
              onClick={() => toast.info("Hakemusten lisääminen ei ole käytössä demoversiossa.")}
              className="px-6 py-4 rounded-2xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all cursor-pointer opacity-80"
            >
              + Lisää hakemus
            </button>
          </div>

          {/* APPLICATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
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
                <div 
                  key={app.id} 
                  onClickCapture={(e) => {
                    e.stopPropagation();
                    setSelectedApplication(app);
                    setDialogOpen(true);
                  }}
                >
                  <ApplicationCard
                    app={app}
                    onChange={() => {}} 
                    isDemo={true}
                    onDelete={() => deleteApplication(app.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700">
                <div className="col-span-full">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                    Ei hakemuksia
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Hakutuloksia ei löytynyt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}