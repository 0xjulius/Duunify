"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import Sidebar from "@/components/Sidebar";
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  Star,
  X,
} from "lucide-react";
import ApplicationTrendChart from "@/components/dashboard/ApplicationTrendChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ApplicationsChart from "@/components/dashboard/ApplicationChart";
import RecentApplications from "@/components/dashboard/RecentApplications";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import LocationsChart from "@/components/dashboard/LocationsChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import ImpactRatingCard from "@/components/dashboard/ImpactRatingCard";
import ConsistencyCard from "@/components/dashboard/ConsistencyCard";
import LoginModal from "@/components/LoginModal";
import {
  StatsSkeleton,
  ImpactRatingSkeleton,
  ChartSkeleton,
} from "@/components/ui/skeletons";

type DashboardApplication = {
  id: string;
  company: string;
  job_title: string;
  location: string;
  status: string;
  created_at?: string;
};

type StatFilterType = "total" | "pending" | "favorites" | "interviews" | "offers" | "rejected" | null;

export default function DashboardPage() {
  const router = useRouter();
  
  // Säilytetään alkuperäinen data suodattamista varten modalissa
  const [rawApplications, setRawApplications] = useState<DashboardApplication[]>([]);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    offers: 0,
    rejected: 0,
    interviews: 0,
    favorites: 0,
    consistency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Tila StatsCard-modalin hallintaan
  const [activeStatFilter, setActiveStatFilter] = useState<StatFilterType>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Virhe tilastojen haussa:", error);
      setLoading(false);
      return;
    }

    if (applications) {
      setRawApplications(applications as DashboardApplication[]);

      const statsData = applications.reduce(
        (acc, app) => {
          const s = app.status?.toLowerCase().trim() || "";
          if (["suosikki", "tallennettu"].includes(s)) acc.favorites++;
          else if (["haastattelu", "interview"].includes(s)) acc.interviews++;
          else if (["tarjous", "offer"].includes(s)) acc.offers++;
          else if (["hylätty", "hylätyt", "rejected"].includes(s)) acc.rejected++;
          else acc.pending++;
          return acc;
        },
        { favorites: 0, interviews: 0, offers: 0, rejected: 0, pending: 0 }
      );

      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      });

      const activeDaysCount = last7Days.filter((date) =>
        applications.some(
          (app) => app.created_at && app.created_at.split("T")[0] === date
        )
      ).length;

      const totalActive =
        statsData.pending +
        statsData.interviews +
        statsData.offers +
        statsData.rejected;

      setStats({
        total: totalActive,
        pending: statsData.pending,
        offers: statsData.offers,
        interviews: statsData.interviews,
        rejected: statsData.rejected,
        favorites: statsData.favorites,
        consistency: Math.round((activeDaysCount / 7) * 100),
      });
    }
    setLoading(false);
  }

  // Haetaan oikea lista stats-modalille valinnan perusteella
  const getStatModalJobs = () => {
    return rawApplications.filter((app) => {
      const s = app.status?.toLowerCase().trim() || "";
      switch (activeStatFilter) {
        case "total":
          return !["suosikki", "tallennettu"].includes(s);
        case "pending":
          return !["suosikki", "tallennettu", "haastattelu", "interview", "tarjous", "offer", "hylätty", "hylätyt", "rejected"].includes(s);
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
      case "total": return "Kaikki lähetetyt hakemukset";
      case "pending": return "Meneillään olevat haut";
      case "favorites": return "Tallennetut suosikit";
      case "interviews": return "Kutsutut haastattelut";
      case "offers": return "Saadut työtarjoukset";
      case "rejected": return "Päättyneet / Hylätyt hakemukset";
      default: return "";
    }
  };

  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    <div className="flex flex-row min-h-screen bg-slate-100 dark:bg-[#0f1117] overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 dark:from-[#141625] dark:via-[#151320] dark:to-[#101420]">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-10">
        <ApplicationDialog
          app={selectedApplication}
          open={open}
          onOpenChange={setOpen}
        />
        
          <DashboardHeader />

        <div className="flex flex-col gap-6">
          <section className="grid gap-6 grid-cols-1 md:grid-cols-12">
            {loading ? (
              <>
                <div className="md:col-span-6">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-6">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-3">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-3">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-3">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-3">
                  <StatsSkeleton />
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-6">
                  <StatsCard
                    title="Hakemukset"
                    value={stats.total}
                    subtitle={<span>hakemuksia jätetty</span>}
                    color="blue"
                    icon={<Briefcase className="h-6 w-6" />}
                    onClick={() => setActiveStatFilter("total")}
                  />
                </div>
                <div className="md:col-span-6">
                  <StatsCard
                    title="Meneillään"
                    value={stats.pending}
                    subtitle={
                      stats.pending > 0
                        ? "Vireillään olevat rekrytoinnit"
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
                      <span className="flex items-center gap-2">
                        <Link
                          href="/favorites"
                          className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Katso suosikit <ArrowRight className="h-3 w-3" />
                        </Link>
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
                    title="Päättyneet"
                    value={stats.rejected}
                    subtitle={
                      stats.rejected === 0
                        ? "Ei vielä hylkäyksiä!"
                        : "Ei valitut hakemukset"
                    }
                    color="red"
                    icon={<XCircle className="h-6 w-6" />}
                    onClick={() => setActiveStatFilter("rejected")}
                  />
                </div>
              </>
            )}
          </section>

          <section className="flex flex-col gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex flex-col gap-6">
                {loading ? (
                  <>
                    <ImpactRatingSkeleton />
                    <ImpactRatingSkeleton />
                  </>
                ) : (
                  <>
                    <ImpactRatingCard
                      pending={stats.pending || 0}
                      rejected={stats.rejected || 0}
                      favorites={stats.favorites || 0}
                    />
                    <ConsistencyCard percentage={stats.consistency || 0} />
                  </>
                )}
              </div>

              <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <>
                    <ChartSkeleton className="h-[300px]" />
                    <ChartSkeleton className="h-[300px]" />
                  </>
                ) : (
                  <>
                    <LocationsChart />
                    <ApplicationsChart />
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                {loading ? (
                  <ChartSkeleton className="h-[400px]" />
                ) : (
                  <ApplicationTrendChart />
                )}
              </div>
              <div className="lg:col-span-4">
                {loading ? (
                  <ChartSkeleton className="h-[400px]" />
                ) : (
                  <ActivityHeatmap />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
              <div className="lg:col-span-8">
                {loading ? (
                  <ChartSkeleton className="h-[500px]" />
                ) : (
                  <RecentApplications
                    onOpenApplication={(app) => {
                      setSelectedApplication(app);
                      setOpen(true);
                    }}
                  />
                )}
              </div>
              <div className="lg:col-span-4">
                {loading ? (
                  <ChartSkeleton className="h-[500px]" />
                ) : (
                  <UpcomingDeadlines />
                )}
              </div>
            </div>
          </section>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
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
                    setActiveStatFilter(null); // Suljetaan stats-modal heti
                    setSelectedApplication(job); // Asetetaan valittu työpaikka
                    setOpen(true); // Avataan tarkempi dialogi
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
                  
                  <div className="shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 capitalize">
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