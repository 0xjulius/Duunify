"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatsCard from "@/components/dashboard/StatsCard";
import Sidebar from "@/components/Sidebar";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import ApplicationTrendChart from "@/components/dashboard/ApplicationTrendChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ApplicationsChart from "@/components/dashboard/ApplicationChart";
import RecentApplications from "@/components/dashboard/RecentApplications";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import LocationsChart from "@/components/dashboard/LocationsChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    offers: 0,
    rejected: 0,
    interviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);

    const { data: applications, error } = await supabase
      .from("applications")
      .select("status");

    if (error) {
      console.error("Virhe tilastojen haussa:", error);
      setLoading(false);
      return;
    }

    if (applications) {
      const total = applications.length;
      const interviews = applications.filter((app) =>
        ["haastattelu", "interview"].includes(app.status?.toLowerCase().trim()),
      ).length;
      const offers = applications.filter((app) =>
        ["tarjous", "offer"].includes(app.status?.toLowerCase().trim()),
      ).length;
      const rejected = applications.filter((app) =>
        ["hylätty", "hylätyt", "rejected"].includes(
          app.status?.toLowerCase().trim(),
        ),
      ).length;

      const pending = total - rejected;

      setStats({ total, pending, offers, interviews, rejected });
    }
    setLoading(false);
  }

  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    <div className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-10">
        <DashboardHeader />

        <div className="flex flex-col gap-6">
          {/* Grid-asettelu: 6 saraketta */}
          <section className="grid gap-6 grid-cols-1 md:grid-cols-6">
            {loading ? (
              <>
                {/* Skeletonit kahdelle isolle kortille */}
                <div className="md:col-span-3 h-[134px] rounded-2xl border border-slate-200 bg-white p-6 animate-pulse flex flex-col gap-3">
                  <div className="h-4 w-1/4 bg-slate-200 rounded" />
                  <div className="h-8 w-1/3 bg-slate-200 rounded" />
                </div>
                <div className="md:col-span-3 h-[134px] rounded-2xl border border-slate-200 bg-white p-6 animate-pulse flex flex-col gap-3">
                  <div className="h-4 w-1/4 bg-slate-200 rounded" />
                  <div className="h-8 w-1/3 bg-slate-200 rounded" />
                </div>

                {/* Skeletonit kolmelle pienemmälle kortille */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="md:col-span-2 h-[134px] rounded-2xl border border-slate-200 bg-white p-6 animate-pulse flex flex-col gap-3"
                  >
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-8 w-1/4 bg-slate-200 rounded" />
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Kaksi ylintä korttia (3 sarakkeen leveys = 50%) */}
                <div className="md:col-span-3">
                  <StatsCard
                    title="Hakemuksia"
                    value={stats.total}
                    subtitle="Yhteensä lähetetty"
                    color="blue"
                    icon={<Briefcase className="h-6 w-6" />}
                    action={
                      <a
                        href="/applications"
                        className="py-2 px-4 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 flex items-center gap-1 self-start group transition-colors"
                      >
                        Näytä hakemukset{" "}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </a>
                    }
                  />
                </div>
                <div className="md:col-span-3">
                  <StatsCard
                    title="Vireillä"
                    value={stats.pending}
                    subtitle={
                      stats.pending > 0
                        ? `${stats.pending} prosessia aktiivisena`
                        : "Ei aktiivisia hakuja"
                    }
                    color="amber"
                    icon={<Clock className="h-6 w-6" />}
                  />
                </div>

                {/* Kolme alinta korttia (2 sarakkeen leveys = 33.3%) */}
                <div className="md:col-span-2">
                  <StatsCard
                    title="Haastattelut"
                    value={stats.interviews}
                    subtitle={
                      stats.interviews > 0
                        ? `${interviewPercentage} % hakemuksista`
                        : "Ensimmäistä odotellessa"
                    }
                    color="violet"
                    icon={<Calendar className="h-6 w-6" />}
                  />
                </div>
                <div className="md:col-span-2">
                  <StatsCard
                    title="Tarjoukset"
                    value={stats.offers}
                    subtitle={
                      stats.offers > 0
                        ? "Upea saavutus! 🎉"
                        : "Työpaikkoja etsitään.."
                    }
                    color="green"
                    icon={<CheckCircle2 className="h-6 w-6" />}
                  />
                </div>
                <div className="md:col-span-2">
                  <StatsCard
                    title="Hylätyt"
                    value={stats.rejected}
                    subtitle={
                      stats.rejected === 0
                        ? "Ei vielä hylkäyksiä!"
                        : "Jokainen vastaus on askel lähemmäs."
                    }
                    color="red"
                    icon={<XCircle className="h-6 w-6" />}
                  />
                </div>
              </>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:col-span-2 mb-4 items-stretch">
              <ApplicationsChart />
              <ApplicationTrendChart />
              <RecentApplications />
              <ActivityHeatmap />
              <LocationsChart />
              <UpcomingDeadlines />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
