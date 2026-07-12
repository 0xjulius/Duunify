"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";
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
  Moon,
  Sun,
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
  ListSkeleton,
} from "@/components/ui/skeletons";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#1e2230] dark:text-slate-300 dark:hover:bg-[#252a3d]"
      aria-label="Vaihda teemaa"
    >
      {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
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
      .select("status, created_at")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Virhe tilastojen haussa:", error);
      setLoading(false);
      return;
    }

    if (applications) {
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
        
        {/* Yläpalkki, jossa otsikko ja teemakytkin rinnakkain */}
        <div className="flex items-center justify-between w-full">
          <DashboardHeader />
          <ThemeToggle />
        </div>

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
                        >
                          Katso suosikit <ArrowRight className="h-3 w-3" />
                        </Link>
                      </span>
                    }
                    color="amber"
                    icon={<Star className="h-6 w-6" />}
                  />
                </div>
                <div className="md:col-span-3">
                  <StatsCard
                    title="Haastattelut"
                    value={stats.interviews}
                    subtitle={`${interviewPercentage} % hakemuksista`}
                    color="violet"
                    icon={<Calendar className="h-6 w-6" />}
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
    </div>
  );
}