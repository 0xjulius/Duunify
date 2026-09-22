"use client";

import { useState } from "react";
import { toast } from "sonner";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoHeader from "@/components/demo/DemoHeader";
import DemoBanner from "@/components/demo/DemoBanner";
import PageHeader from "@/components/PageHeader";
import { CompanyLogo } from "@/components/applications/CompanyLogo";
import {
  Bookmark,
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
  // Pidetään tila muuttumattomana demoa varten
  const [jobs] = useState<DemoFavoriteJob[]>(() => buildDemoFavoriteJobs());
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<DemoFavoriteJob | null>(null);

  // Tila stat-modalille
  const [activeStatFilter, setActiveStatFilter] = useState<StatType>(null);

  const handleOpenJob = (job: DemoFavoriteJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Arkistointi/palautus on poissa käytöstä demoversiossa
  function handleDisabledAction(e: React.MouseEvent) {
    e.stopPropagation();
    toast.info("Tämä toiminto ei ole käytössä demoversiossa.");
  }

  function handleDemoFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Uuden työpaikan tallentaminen ei ole käytössä demoversiossa.");
    setShowForm(false);
  }

  // --- STATS-LASKURIT JA SUODATUKSET ---
  const activeJobs = jobs.filter(
    (j) => j.status?.toLowerCase() !== "arkistoitu"
  );
  const archivedJobs = jobs.filter(
    (j) => j.status?.toLowerCase() === "arkistoitu"
  );

  const expiringSoonJobs = activeJobs.filter((j) => {
    const days = computeDaysLeft(j);
    return j.valid_through && days <= 7 && days > 0;
  });

  const addedLastWeekJobs = activeJobs.filter((j) => {
    if (!j.created_at) return false;
    const createdAt = new Date(j.created_at).getTime();
    const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    return createdAt >= sevenDaysAgo;
  });

  const filteredActiveJobs = activeJobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.job_title.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "Päättyy pian") {
      const days = computeDaysLeft(job);
      return job.valid_through && days <= 7 && days > 0;
    }
    return true;
  });

  const getStatModalJobs = () => {
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
  };

  const getStatModalTitle = () => {
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
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <DemoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Yläpalkki sijoitettuna sisältöalueen yläosaan reunasta reunaan */}
        <DemoHeader
          userName="Maija Meikäläinen"
          userEmail="maija.meikalainen@demo.fi"
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-6 pb-24 lg:pb-10 text-slate-900 dark:text-slate-50">
          <DemoBanner />

          {/* HEADER PAGEHEADER-KOMPONENTILLA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <PageHeader
              title="Tallennetut työpaikat"
              description="Työpaikat, jotka haluat laittaa talteen."
              icon={Bookmark}
              isDemo={true}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Hakupalkki */}
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Hae suosikeista..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm cursor-pointer"
              >
                {showForm ? "Sulje lomake" : "+ Tallenna työpaikka"}
              </button>
            </div>
          </div>

          {/* INLINE DEMO-LOMAKE */}
          {showForm && (
            <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-6 shadow-md">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
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
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
                >
                  Hae tiedot ja tallenna
                </button>
              </form>
            </div>
          )}

          {/* STATS KORTIT */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setActiveStatFilter("tallennetut")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all text-left hover:border-indigo-500 dark:hover:border-indigo-400 group relative overflow-hidden cursor-pointer"
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto hidden sm:block"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("uudet")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all text-left hover:border-emerald-500 dark:hover:border-emerald-400 group relative overflow-hidden cursor-pointer"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Uudet tällä viikolla
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {addedLastWeekJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                +{addedLastWeekJobs.length} viim. 7pv aikana
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto hidden sm:block"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("paattyvat")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all text-left hover:border-amber-500 dark:hover:border-amber-400 group relative overflow-hidden cursor-pointer"
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto hidden sm:block"
                />
              </p>
            </button>

            <button
              onClick={() => setActiveStatFilter("arkistoidut")}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all text-left hover:border-rose-500 dark:hover:border-rose-400 group relative overflow-hidden cursor-pointer"
            >
              <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Arkistoidut
              </h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {archivedJobs.length}
              </p>
              <p className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium flex items-center gap-1">
                <Trash2 size={12} /> Arkistossa
                <Eye
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto hidden sm:block"
                />
              </p>
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* VASEN REUNA: AKTIIVISET TYÖPAIKAT */}
            <div className="xl:col-span-3 min-w-0 flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
                {["Kaikki", "Päättyy pian"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-white border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-sm transition-colors">
                {filteredActiveJobs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    Ei aktiivisia työpaikkoja tässä näkymässä.
                  </div>
                ) : (
                  filteredActiveJobs.map((job) => {
                    const daysLeft = computeDaysLeft(job);
                    return (
                      <div
                        key={job.id}
                        onClick={() => handleOpenJob(job)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          {/* Yrityksen Logo */}
                          <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 flex items-center justify-center rounded-xl overflow-hidden">
                            <CompanyLogo
                              logo={job.company_logo}
                              company={job.company}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm sm:text-base truncate text-slate-900 dark:text-slate-100">
                              {job.job_title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {job.company} • {job.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          {Boolean(job.valid_through) && (
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 justify-end whitespace-nowrap">
                                <Clock size={13} /> {daysLeft} pv
                              </p>
                            </div>
                          )}
                          <button
                            onClick={handleDisabledAction}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60"
                            title="Ei käytössä demossa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* OIKEA REUNA: ROSKAKORI / ARKISTO */}
            <div className="flex flex-col gap-3 w-full">
              <h3 className="font-bold text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Trash2 size={16} /> Arkistoidut / Roskakori
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-sm transition-colors min-h-[120px] max-h-[350px] overflow-y-auto">
                {archivedJobs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    Ei arkistoituja kohteita.
                  </div>
                ) : (
                  archivedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleOpenJob(job)}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer opacity-80 hover:opacity-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="h-8 w-8 shrink-0 flex items-center justify-center">
                          <CompanyLogo
                            logo={job.company_logo}
                            company={job.company}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-semibold text-xs sm:text-sm truncate text-slate-900 dark:text-slate-100">
                            {job.job_title}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisabledAction}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60 shrink-0"
                        title="Ei käytössä demossa"
                      >
                        <ArchiveRestore size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
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
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                {getStatModalTitle()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Yhteensä {getStatModalJobs().length} paikkaa
              </p>
            </div>
            <button
              onClick={() => setActiveStatFilter(null)}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800/60">
            {getStatModalJobs().length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                Ei kohteita tässä kategoriassa.
              </div>
            ) : (
              getStatModalJobs().map((job) => {
                const daysLeft = computeDaysLeft(job);
                return (
                  <div
                    key={job.id}
                    onClick={() => {
                      setActiveStatFilter(null);
                      handleOpenJob(job);
                    }}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 -mx-2 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center">
                        <CompanyLogo
                          logo={job.company_logo}
                          company={job.company}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {job.job_title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {daysLeft} pv
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <ApplicationDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        app={selectedJob as any}
        isDemo={true}
      />
    </div>
  );
}