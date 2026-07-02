"use client";

import { useState } from "react";
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
import ApplicationDialog from "@/app/applications/ApplicationDialog";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Star,
  LayoutDashboard,
} from "lucide-react";
import {
  DEMO_APPLICATIONS,
  computeDemoStats,
  computeDemoLocationStats,
} from "@/lib/demo-data";

export default function DemoDashboardPage() {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [open, setOpen] = useState(false);


  const stats = computeDemoStats();
  const locationStats = computeDemoLocationStats();
  const interviewPercentage =
    stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return "Hyvää huomenta,";
    if (hour < 12) return "Hyvää aamupäivää,";
    if (hour < 14) return "Hyvää päivää,";
    if (hour < 18) return "Hyvää iltapäivää,";
    if (hour < 22) return "Hyvää iltaa,";
    return "Hyvää myöhäisiltaa,";
    };
    const greeting = getGreeting();
    const now = new Date();

  return (
    <div className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50">
      <DemoSidebar />

      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-6">
        <ApplicationDialog
          app={selectedApplication}
          open={open}
          onOpenChange={setOpen}
        />

        <DemoBanner />
        <header className="mb-8">
          <h1 className="text-xl md:text-3xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
            {greeting}<span>Demokäyttäjä 👋</span>
          </h1>

          {/* Päivämäärä */}
          <p className="text-slate-500 text-sm md:text-xl mb-6">
            {now.toLocaleDateString("fi-FI", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            • Klo {now.getHours()}:
            {now.getMinutes().toString().padStart(2, "0")}
          </p>

          {/* Otsikko ja ikoni */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3.5 rounded-2xl shadow-md">
              <LayoutDashboard className="h-10 w-10 text-white" />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                Yleiskatsaus
              </h2>
              <p className="mt-1 text-slate-500 text-sm md:text-lg">
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
              />
            </div>

            <div className="md:col-span-3">
              <StatsCard
                title="Tallennetut"
                value={stats.favorites}
                subtitle={
                  <span className="text-amber-600 font-medium">
                    Katso suosikit
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
                title="Hylätyt"
                value={stats.rejected}
                subtitle={
                  stats.rejected === 0
                    ? "Ei vielä hylkäyksiä!"
                    : "Olet tavoitetta lähempänä."
                }
                color="red"
                icon={<XCircle className="h-6 w-6" />}
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
                  onOpenApplication={(app) => {
                    setSelectedApplication(app);
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
    </div>
  );
}
