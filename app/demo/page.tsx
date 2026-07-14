"use client";

import { useState, useEffect } from "react";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoBanner from "@/components/demo/DemoBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ImpactRatingCard from "@/components/dashboard/ImpactRatingCard";
import ConsistencyCard from "@/components/dashboard/ConsistencyCard";
import LocationsCard from "@/components/dashboard/LocationsChart";
import ApplicationsChart from "@/components/dashboard/ApplicationChart";
import ApplicationTrendChart from "@/components/dashboard/ApplicationTrendChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import RecentApplications from "@/components/dashboard/RecentApplications";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import { DemoCompanyLogo } from "@/components/demo/DemoCompanyLogo";
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Star,
  LayoutDashboard,
  X,
} from "lucide-react";
import {
  DEMO_APPLICATIONS,
  computeDemoStats,
  computeDemoLocationStats,
} from "@/lib/demo-data";

type StatFilterType =
  | "total"
  | "pending"
  | "favorites"
  | "interviews"
  | "offers"
  | "rejected"
  | null;

const getStatusBadgeClass = (status: string) => {
  const s = status?.toLowerCase().trim() || "";
  if (["haastattelu", "interview"].includes(s)) {
    return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
  }
  if (["tarjous", "offer"].includes(s)) {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }
  if (["hylätty", "hylätyt", "rejected"].includes(s)) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
  if (["suosikki", "tallennettu"].includes(s)) {
    return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  }
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
};

export default function DemoDashboardPage() {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isDemoClick, setIsDemoClick] = useState(false);
  const [activeStatFilter, setActiveStatFilter] = useState<StatFilterType>(null);
  
  // Estetään hydraatiovirheet (aikaleimat ja kellonajat vain selaimessa)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = computeDemoStats();
  const locationStats = computeDemoLocationStats();
  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  const getStatModalJobs = () => {
    return DEMO_APPLICATIONS.filter((app) => {
      const s = app.status?.toLowerCase().trim() || "";
      switch (activeStatFilter) {
        case "total":
          return !["suosikki", "tallennettu"].includes(s);
        case "pending":
          return ![
            "suosikki",
            "tallennettu",
            "haastattelu",
            "interview",
            "tarjous",
            "offer",
            "hylätty",
            "hylätyt",
            "rejected",
          ].includes(s);
        case "favorites":
          return ["suosikki", "tallennettu"].includes(s);
        case "interviews":
          return ["haastattelu", "interview"].includes(s);
        case "offers":
          return ["tarjous", "offer"].includes(s);
        case "rejected":
          return ["hylätty", "hylätyt", "rejected"].includes(s);
        default:
          return false;
      }
    });
  };

  const getStatModalTitle = () => {
    switch (activeStatFilter) {
      case "total":
        return "Kaikki lähetetyt hakemukset";
      case "pending":
        return "Meneillään olevat haut";
      case "favorites":
        return "Tallennetut suosikit";
      case "interviews":
        return "Kutsutut haastattelut";
      case "offers":
        return "Saadut työtarjoukset";
      case "rejected":
        return "Päättyneet / Hylätyt hakemukset";
      default:
        return "";
    }
  };

  const getGreeting = () => {
    if (!mounted) return "Hei,";
    const hour = new Date().getHours();
    if (hour < 9) return "Hyvää huomenta,";
    if (hour < 12) return "Hyvää aamupäivää,";
    if (hour < 14) return "Hyvää päivää,";
    if (hour < 18) return "Hyvää iltapäivää,";
    if (hour < 22) return "Hyvää iltaa,";
    return "Hyvää myöhäisiltaa,";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || !mounted) return "";
    try {
      const date = new Date(dateString);
      const pvm = date.toLocaleDateString("fi-FI", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      const klo = date.toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${pvm} klo ${klo}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <DemoSidebar />

      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-6 pb-24 lg:pb-10">
        <ApplicationDialog
          app={selectedApplication}
          open={open}
          onOpenChange={setOpen}
          isDemo={isDemoClick || true}
        />

        <DemoBanner />

        <header className="mb-8">
          <h1 className="text-xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
            {getGreeting()}
            <span>Demokäyttäjä 👋</span>
          </h1>

          {mounted && (
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-xl mb-6">
              {new Date().toLocaleDateString("fi-FI", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              • Klo {new Date().getHours()}:
              {new Date().getMinutes().toString().padStart(2, "0")}
            </p>
          )}

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3.5 rounded-2xl shadow-md">
              <LayoutDashboard className="h-10 w-10 text-white" />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Yleiskatsaus
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm md:text-lg">
                Työnhakusi yhdellä silmäyksellä
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          <section className="grid gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-6">
              <StatsCard
                title="Hakemukset"
                value={stats.total}
                subtitle={<span>hakemuksia yhteensä</span>}
                color="blue"
                icon={<Briefcase className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("total")}
              />
            </div>
            <div className="md:col-span-6">
              <StatsCard
                title="Vireillä olevat hakemukset"
                value={stats.pending}
                subtitle={
                  stats.pending > 0
                    ? "Meneillään olevat"
                    : "Ei aktiivisia hakuja"
                }
                color="amber"
                icon={<Clock className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("pending")}
              />
            </div>

            <div className="md:col-span-3">
              <StatsCard
                title="Tallennetut"
                value={stats.favorites}
                subtitle={
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Katso suosikit
                  </span>
                }
                color="amber"
                icon={<Star className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("favorites")}
              />
            </div>
            <div className="md:col-span-3">
              <StatsCard
                title="Haastattelut"
                value={stats.interviews}
                subtitle={`${interviewPercentage} % hakemuksista`}
                color="violet"
                icon={<Calendar className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("interviews")}
              />
            </div>
            <div className="md:col-span-3">
              <StatsCard
                title="Tarjoukset"
                value={stats.offers}
                subtitle={
                  stats.offers > 0
                    ? "Upea saavutus! 🎉"
                    : "Uusia ovia avautuu pian.."
                }
                color="green"
                icon={<CheckCircle2 className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("offers")}
              />
            </div>
            <div className="md:col-span-3">
              <StatsCard
                title="Hylätyt"
                value={stats.rejected}
                subtitle={
                  stats.rejected === 0
                    ? "Ei vielä hylkäyksiä!"
                    : "Olet tavoitetta lähempänä."
                }
                color="red"
                icon={<XCircle className="h-6 w-6" />}
                onClick={() => setActiveStatFilter("rejected")}
              />
            </div>
          </section>

          <section className="flex flex-col gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex flex-col gap-6">
                <ImpactRatingCard
                  pending={stats.pending}
                  rejected={stats.rejected}
                  favorites={stats.favorites}
                />
                <ConsistencyCard percentage={stats.consistency} />
              </div>

              <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationsCard demoData={locationStats} />
                <ApplicationsChart demoApplications={DEMO_APPLICATIONS} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <ApplicationTrendChart demoApplications={DEMO_APPLICATIONS} />
              </div>
              <div className="lg:col-span-4">
                <ActivityHeatmap demoApplications={DEMO_APPLICATIONS} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <RecentApplications
                  demoApps={DEMO_APPLICATIONS as any}
                  onOpenApplication={(app, isDemo) => {
                    setSelectedApplication(app);
                    setIsDemoClick(!!isDemo);
                    setOpen(true);
                  }}
                />
              </div>
              <div className="lg:col-span-4 mb-10">
                <UpcomingDeadlines
                  demoApps={
                    DEMO_APPLICATIONS.filter((a) => a.valid_through) as any
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* INTERAKTIIVINEN STATS MODAL METRIIKOILLE */}
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
          className={`bg-white dark:bg-[#1e2230] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] cursor-default transition-all duration-300 ${
            activeStatFilter
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
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

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
            {getStatModalJobs().length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                Ei hakemuksia tässä kategoriassa.
              </div>
            ) : (
              getStatModalJobs().map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setActiveStatFilter(null);
                    setSelectedApplication(job);
                    setIsDemoClick(true);
                    setOpen(true);
                  }}
                  className="py-3 sm:py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 -mx-2 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <DemoCompanyLogo company={job.company} />

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                        {job.job_title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="truncate">
                          {job.company} • {job.location}
                        </span>
                        {job.created_at && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">
                              •
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              {formatDate(job.created_at)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${getStatusBadgeClass(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}