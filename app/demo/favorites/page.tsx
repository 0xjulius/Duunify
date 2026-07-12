"use client";

import { useState } from "react";
import { toast } from "sonner";
import DemoSidebar from "@/components/demo/DemoSidebar";
import {
  Bookmark,
  Filter,
  Clock,
  Search,
  X,
  Trash2,
  ArchiveRestore,
  Eye,
} from "lucide-react";
import { buildDemoFavoriteJobs, DemoFavoriteJob } from "@/lib/demo-data";
import ApplicationDialog from "@/app/applications/ApplicationDialog";

type StatType = "tallennetut" | "uudet" | "paattyvat" | "arkistoidut" | null;

function computeDaysLeft(job: DemoFavoriteJob) {
  if (!job.valid_through) return 0;
  const today = new Date().getTime();
  const deadline = new Date(job.valid_through).getTime();
  return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
}

export default function DemoFavoritesPage() {
  const [activeTab, setActiveTab] = useState("Kaikki");
  // Tarkoituksella ilman setJobs-mutaatiota käytössä muualla — data pysyy
  // aina samana, koska demossa ei saa arkistoida/palauttaa mitään.
  const [jobs] = useState<DemoFavoriteJob[]>(() => buildDemoFavoriteJobs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<DemoFavoriteJob | null>(null);
  const [activeStatFilter, setActiveStatFilter] = useState<StatType>(null);

  function handleOpenJob(job: DemoFavoriteJob) {
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  // Arkistointi/palautus on tarkoituksella pois käytöstä demoversiossa.
  // Ei muuteta tilaa millään tavalla — vain ilmoitetaan käyttäjälle.
  function handleDisabledAction(e: React.MouseEvent) {
    e.stopPropagation();
    toast.info("Tämä toiminto ei ole käytössä demoversiossa.");
  }

  function handleDemoFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Uuden työpaikan tallentaminen ei ole käytössä demoversiossa.");
    setShowForm(false);
  }

  const activeJobs = jobs.filter((j) => j.status === "Tallennettu");
  const archivedJobs = jobs.filter((j) => j.status === "Arkistoitu");

  const expiringSoonJobs = activeJobs.filter((j) => {
    const days = computeDaysLeft(j);
    return j.valid_through && days <= 7 && days > 0;
  });

  const addedLastWeekJobs = activeJobs.filter((j) => {
    const createdAt = new Date(j.created_at).getTime();
    const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    return createdAt >= sevenDaysAgo;
  });

  const filteredActiveJobs = activeJobs.filter((job) => {
    if (activeTab === "Päättyy pian") {
      const days = computeDaysLeft(job);
      return job.valid_through && days <= 7 && days > 0;
    }
    return true;
  });

  function getStatModalJobs() {
    switch (activeStatFilter) {
      case "tallennetut":
        return activeJobs;
      case "uudet":
        return addedLastWeekJobs;
      case "paattyvat":
        return expiringSoonJobs;
      case "arkistoidut":
        return archivedJobs;
      default:
        return [];
    }
  }

  function getStatModalTitle() {
    switch (activeStatFilter) {
      case "tallennetut":
        return "Aktiiviset suosikit";
      case "uudet":
        return "Uudet tällä viikolla lisätyt";
      case "paattyvat":
        return "Haku umpeutumassa pian";
      case "arkistoidut":
        return "Arkistoidut työpaikat";
      default:
        return "";
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <DemoSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-[1500px] mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <span className="bg-gradient-to-br from-indigo-200 to-violet-600 p-2.5 sm:p-3 rounded-xl shrink-0">
                  <Bookmark className="h-6 w-6 text-white" />
                </span>
                Tallennetut työpaikat{" "}
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md font-normal">
                  Demo
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                Työpaikat, jotka haluat laittaa talteen.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl font-medium text-sm whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Filter size={16} />{" "}
                <span className="hidden xs:inline">Suodattimet</span>
              </button>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="flex-1 sm:flex-initial bg-indigo-600 dark:bg-indigo-500 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                {showForm ? "Sulje lomake" : "+ Tallenna työpaikka"}
              </button>
            </div>
          </div>

          {/* KEVYT DEMO-LOMAKE */}
          {showForm && (
            <div className="mb-8 relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-6">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                aria-label="Sulje lomake"
              >
                <X size={18} />
              </button>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">
                Tallenna uusi työpaikka
              </h3>
              <form
                onSubmit={handleDemoFormSubmit}
                className="space-y-3 max-w-md"
              >
                <input
                  placeholder="Työpaikan linkki (esim. duunitori.fi/...)"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Hae tiedot ja tallenna
                </button>
              </form>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
            <button
              onClick={() => setActiveStatFilter("tallennetut")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all text-left hover:border-indigo-500 dark:hover:border-indigo-400 group relative overflow-hidden"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Tallennetut paikat
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {activeJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium flex items-center gap-1">
                Aktiiviset suosikit
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("uudet")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all text-left hover:border-emerald-500 dark:hover:border-emerald-400 group relative overflow-hidden"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Uudet tällä viikolla
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {addedLastWeekJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                +{addedLastWeekJobs.length} viimeisen 7pv aikana
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("paattyvat")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all text-left hover:border-amber-500 dark:hover:border-amber-400 group relative overflow-hidden"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Päättyy pian
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {expiringSoonJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium flex items-center gap-1">
                Haku umpeutumassa
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("arkistoidut")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all text-left hover:border-rose-500 dark:hover:border-rose-400 group relative overflow-hidden"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Arkistoidut
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {archivedJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium flex items-center gap-1">
                <Trash2 size={12} /> Siirretty roskakoriin
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                />
              </p>
            </button>
          </div>

          {/* PÄÄSISÄLTÖ */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8 items-start">
            <div className="xl:col-span-3 min-w-0">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar h-[38px] items-center">
                {["Kaikki", "Päättyy pian"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-white border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-sm transition-colors">
                {filteredActiveJobs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    Ei aktiivisia työpaikkoja tässä näkymässä.
                  </div>
                ) : (
                  filteredActiveJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleOpenJob(job)}
                      className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                          {job.company?.[0] || "G"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm sm:text-base truncate text-slate-900 dark:text-slate-100">
                            {job.job_title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden xs:block">
                          <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                            {job.salary}
                          </p>
                          <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end whitespace-nowrap">
                            <Clock size={13} /> {computeDaysLeft(job)} pv
                          </p>
                        </div>
                        <button
                          onClick={handleDisabledAction}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60"
                          title="Ei käytössä demossa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center h-[38px]">
                <h3 className="font-bold text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Trash2 size={16} /> Roskakori
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-sm transition-colors min-h-[140px] max-h-[400px] overflow-y-auto">
                {archivedJobs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs my-auto">
                    Roskakori on tyhjä.
                  </div>
                ) : (
                  archivedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleOpenJob(job)}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer opacity-75 hover:opacity-100"
                    >
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                          {job.job_title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {job.company}
                        </p>
                      </div>
                      <button
                        onClick={handleDisabledAction}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60 shrink-0"
                        title="Ei käytössä demossa"
                      >
                        <ArchiveRestore size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-950/40">
                  <Search size={18} className="shrink-0" />
                  <input
                    className="w-full bg-transparent outline-none text-sm min-w-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Hae tallennetuista..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS MODAL */}
      <div
        onClick={() => setActiveStatFilter(null)}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
          activeStatFilter
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] cursor-default transition-all duration-300 ${
            activeStatFilter
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {getStatModalTitle()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Yhteensä {getStatModalJobs().length} paikkaa
              </p>
            </div>
            <button
              onClick={() => setActiveStatFilter(null)}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
            {getStatModalJobs().length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                Ei kohteita tässä kategoriassa.
              </div>
            ) : (
              getStatModalJobs().map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setActiveStatFilter(null);
                    handleOpenJob(job);
                  }}
                  className="py-3 sm:py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 -mx-2 rounded-xl transition-colors text-left"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                      {job.job_title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {job.status === "Tallennettu" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        Suosikki
                      </span>
                    )}
                    {job.status === "Arkistoitu" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        Arkistoitu
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {computeDaysLeft(job)} pv
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Oikea ApplicationDialog avautuu myös demossa */}
      <ApplicationDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        app={selectedJob as any}
        isDemo={true}
      />
    </main>
  );
}
