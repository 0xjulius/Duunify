"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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

export default function DashboardPage() {
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);

    const { data: applications, error } = await supabase
      .from("applications")
      .select("status, created_at"); // Varmista, että haet myös created_at

    if (error) {
      console.error("Virhe tilastojen haussa:", error);
      setLoading(false);
      return;
    }

    if (applications) {
      const isFavorite = (status: string) =>
        ["suosikki", "tallennettu"].includes(status?.toLowerCase().trim());

      // 1. Lasketaan kategoriat reduce-metodilla (ammattimaisempi tapa)
      const statsData = applications.reduce(
        (acc, app) => {
          const s = app.status?.toLowerCase().trim() || "";
          if (isFavorite(s)) acc.favorites++;
          else if (["haastattelu", "interview"].includes(s)) acc.interviews++;
          else if (["tarjous", "offer"].includes(s)) acc.offers++;
          else if (["hylätty", "hylätyt", "rejected"].includes(s))
            acc.rejected++;
          else acc.pending++;
          return acc;
        },
        { favorites: 0, interviews: 0, offers: 0, rejected: 0, pending: 0 },
      );

      // 2. Lasketaan consistency (prosentteina)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      });

      const activeDaysCount = last7Days.filter((date) =>
        applications.some(
          (app) => app.created_at && app.created_at.split("T")[0] === date,
        ),
      ).length;

      const consistency = Math.round((activeDaysCount / 7) * 100);

      // 3. Päivitetään state (lisätty consistency)
      setStats({
        ...statsData,
        total: applications.length, // total on kaikkien määrä
        consistency: consistency,
      });
    }
    setLoading(false);
  }

  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    <div className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-10">
        <ApplicationDialog
          app={selectedApplication}
          open={open}
          onOpenChange={setOpen}
        />
        <DashboardHeader />

        <div className="flex flex-col gap-6">
          <section className="grid gap-6 grid-cols-1 md:grid-cols-6">
            {loading ? (
              <div className="col-span-6 h-32 bg-slate-200 rounded-2xl animate-pulse" />
            ) : (
              <>
                <div className="md:col-span-3">
                  <StatsCard
                    title="Hakemukset"
                    value={stats.total}
                    subtitle={
                      <span className="">
                        hakemuksia yhteensä{" "}
                        <span className="text-slate-500 "></span>
                      </span>
                    }
                    color="blue"
                    icon={<Briefcase className="h-6 w-6" />}
                  />
                </div>
                <div className="md:col-span-3">
                  <StatsCard
                    title="Vireillä"
                    value={stats.pending}
                    subtitle={
                      stats.pending > 0
                        ? `joista suosikkeja ${stats.favorites}  `
                        : "Ei aktiivisia hakuja"
                    }
                    color="amber"
                    icon={<Clock className="h-6 w-6" />}
                  />
                </div>
                <div className="md:col-span-2">
                  <StatsCard
                    title="Haastattelut"
                    value={stats.interviews}
                    subtitle={`${interviewPercentage} % hakemuksista`}
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

          <section className="flex flex-col gap-6 mt-4">
            {/* Ylätaso: Pienet mittarit vasemmalla pinossa, iso graafi oikealla */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pinottu sarake: Vaikutuskyky ja Jatkuvuus */}
              <div className="flex flex-col gap-6">
                <ImpactRatingCard
                  pending={stats.pending || 0}
                  rejected={stats.rejected || 0}
                  favorites={stats.favorites || 0}
                />
                <ConsistencyCard percentage={stats.consistency} />
              </div>

              {/* Oikea puoli: Tilannekuva-graafi (md:col-span-2 tekee tästä leveän) */}
              <div className="md:col-span-2">
                <ApplicationsChart />
              </div>
            </div>

            {/* Keskitaso: Trendit ja aktiivisuus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ApplicationTrendChart />
              </div>
              <ActivityHeatmap />
            </div>

            {/* Alataso: Toimenpiteet ja listaustiedot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentApplications
                  onOpenApplication={(app) => {
                    setSelectedApplication(app);
                    setOpen(true);
                  }}
                />
              </div>
              <div className="flex flex-col gap-6">
                <UpcomingDeadlines />
                <LocationsChart />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
