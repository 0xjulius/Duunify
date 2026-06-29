"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatsCard from "@/components/dashboard/StatsCard";
import Sidebar from "@/components/Sidebar";
import { Briefcase, Calendar, CheckCircle2, XCircle } from "lucide-react";
import ApplicationTrendChart from "@/components/dashboard/ApplicationTrendChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ApplicationsChart from "@/components/dashboard/ApplicationChart";
import RecentApplications from "@/components/dashboard/RecentApplications";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import LocationsChart from "@/components/dashboard/LocationsChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);

    // Haetaan kaikkien hakemusten tilat yhdellä kyselyllä
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

      // Suodatetaan ja lasketaan määrät (tunnistaa suomen ja englannin)
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

      setStats({ total, interviews, offers, rejected });
    }

    setLoading(false);
  }

  // Lasketaan dynaaminen haastatteluprosentti kokonaismäärästä
  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    // Pääkääre, joka asettaa Sidebarin vasemmalle ja sisällön oikealle
    <div
      className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden bg-gradient-to-br
from-violet-50
via-pink-50
to-sky-50 "
    >
      <Sidebar />
      {/* Varsinainen sisältöalue, joka täyttää loput tilasta (flex-1) */}
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-400 mx-auto gap-10 ">
        {/* Yläosan tervehdys */}
              <DashboardHeader />

        {/* Koontinäytön sisältö */}
        <div className="flex flex-col gap-6">
          {/* Tilastot (Stats) */}
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              // Näytetään siistit skeletonit latauksen ajaksi (korkeus h-[134px] mätsää StatsCardiin)
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[134px] rounded-2xl border border-slate-200 bg-white p-6 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                  <div className="h-8 bg-slate-200 rounded w-1/4 mt-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
              ))
            ) : (
              <>
                <StatsCard
                  title="Hakemuksia"
                  value={stats.total}
                  subtitle="Kaikki lähettämäsi hakemukset"
                  color="blue"
                  icon={<Briefcase className="h-6 w-6" />}
                />
                <StatsCard
                  title="Haastattelut"
                  value={stats.interviews}
                  subtitle={
                    stats.interviews > 0
                      ? `${interviewPercentage} % hakemuksista`
                      : "Ensimmäistä odotellessa"
                  }
                  color="amber"
                  icon={<Calendar className="h-6 w-6" />}
                />
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
                <StatsCard
                  title="Hylätyt"
                  value={stats.rejected}
                  subtitle={
                    stats.rejected === 0
                      ? "Ei vielä hylkäyksiä, rohkeasti eteenpäin!"
                      : stats.rejected < 3
                        ? "Jokainen vastaus on askel lähemmäs."
                        : "Olet lähempänä onnistumista"
                  }
                  color="red"
                  icon={<XCircle className="h-6 w-6" />}
                />
              </>
            )}
          </section>

          {/* Alaosan kortit */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Kaaviot vierekkäin työpöydällä, allekkain mobiilissa */}
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
