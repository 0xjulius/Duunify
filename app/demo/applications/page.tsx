"use client";

import { useState, useEffect } from "react";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoHeader from "@/components/demo/DemoHeader";
import ApplicationCard from "@/app/applications/ApplicationCard";
import ApplicationRow from "@/components/applications/ApplicationRow";
import PageHeader from "@/components/PageHeader";
import { Briefcase, Filter, LayoutGrid, List as ListIcon } from "lucide-react";
import { toast } from "sonner";
// Tuodaan valmis demodata projektin omasta tiedostosta
import { DEMO_APPLICATIONS } from "@/lib/demo-data";

// Shadcn UI Select -tuonnit suodatinta varten
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Määritellään tyyppi vastaamaan demodataasi
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Suodatetaan mahdolliset suosikit/tallennetut pois, jos halutaan näyttää vain varsinaiset hakemukset
      const initialData = DEMO_APPLICATIONS.filter(
        (app) => !["suosikki", "tallennettu"].includes(app.status?.toLowerCase().trim() || "")
      );
      
      setApplications(initialData as Application[]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const deleteApplication = (_id: string) => {
    toast.info("Hakemusten poistaminen ei ole käytössä demoversiossa.");
  };

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
      <DemoSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Yläpalkki sijoitettuna sisältöalueen yläosaan reunasta reunaan */}
        <DemoHeader
          userName="Maija Meikäläinen"
          userEmail="maija.meikalainen@demo.fi"
        />

        <div className="p-3 sm:p-5 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-10 w-full">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-200 to-violet-600 dark:from-indigo-500/20 dark:to-violet-600/20 p-3 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white dark:text-indigo-400" />
                </div>
                <PageHeader
                  title="Työpaikat"
                  description="Tutustu esimerkkikohteisiin ja niiden tietoihin. Rekisteröidy käyttäjäksi, jos haluat hakea uusia työpaikkoja, muuttaa hakemusten tiloja tai hallinnoida listaasi."
                  isDemo={true}
                />
              </div>
            </div>
          </div>

          {/* SEARCH + FILTER + VIEW TOGGLE + BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
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
              <div className="w-full sm:w-[220px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="!h-[58px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">
                    <div className="flex items-center gap-2 truncate">
                      <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <SelectValue placeholder="Suodata tila..." />
                    </div>
                  </SelectTrigger>

                  <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-slate-100">
                    <SelectItem value="all">Kaikki tilat</SelectItem>
                    <SelectItem value="haettu">Haettu</SelectItem>
                    <SelectItem value="haastattelu">Haastattelu</SelectItem>
                    <SelectItem value="tarjous">Tarjous</SelectItem>
                    <SelectItem value="hylätty">Hylätty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* NÄKYMÄN VAIHTOPAINIKKEET */}
              <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Korttinäkymä"
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="Rivinäkymä"
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Lisää työpaikka -painike */}
              <button
                onClick={() => toast.info("Hakemusten lisääminen ei ole käytössä demoversiossa.")}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all cursor-pointer opacity-80 whitespace-nowrap shadow-sm"
              >
                + Lisää työpaikka
              </button>
            </div>
          </div>

          {/* APPLICATIONS VIEW (GRID tai LIST) */}
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm animate-pulse flex flex-col gap-4"
                >
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filtered.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onChange={() => {}}
                    isDemo={true}
                    onDelete={() => deleteApplication(app.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed xl:table-auto">
                    <thead className="hidden xl:table-header-group">
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <th className="p-4 pl-6">Tehtävä & Yritys</th>
                        <th className="p-4">Tila</th>
                        <th className="p-4">Sijainti</th>
                        <th className="p-4">Päivämäärä</th>
                        <th className="p-4 pr-6 text-right">Toiminnot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                      {filtered.map((app) => (
                        <ApplicationRow
                          key={app.id}
                          app={app}
                          isDemo={true}
                          onDelete={deleteApplication}
                          onChange={() => {}}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {search || statusFilter !== "all"
                  ? "Ei hakemuksia valituilla ehdoilla"
                  : "Ei hakemuksia"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {search || statusFilter !== "all"
                  ? "Kokeile muuttaa hakusanaa tai suodatinta."
                  : "Hakutuloksia ei löytynyt."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}