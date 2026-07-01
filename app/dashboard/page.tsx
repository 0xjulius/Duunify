"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // LISÄTTY: Tuonti searchParamsia varten
import { toast } from "sonner"; // LISÄTTY: Toast-tuonti (vaihda 'react-hot-toast' jos käytössä)
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

// ==========================================
// ERILLINEN KOMPONENTTI TERVETULOVIESITILLE
// ==========================================
function WelcomeToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Tarkistetaan onko kyseessä sähköpostivahvistuksen jälkeinen ohjaus.
    const isSignupConfirmation =
      searchParams?.get("type") === "signup" ||
      window.location.hash.includes("type=signup");

    if (isSignupConfirmation) {
      // Näytetään tervetuloviesti
      toast.success("Tervetuloa uusi käyttäjä! 👋", {
        description: "Sähköpostisi on vahvistettu onnistuneesti.",
        duration: 5000,
      });

      // Siivotaan URL-osoite, jotta toast ei laukea uudelleen sivun päivityksessä
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      // 2. Vaihtoehtoinen tapa: Tarkistetaan suoraan istunnon luontiaika
      const checkNewUserBySession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const createdAt = new Date(session.user.created_at).getTime();
          const now = new Date().getTime();

          // Jos tili on luotu alle 2 minuuttia sitten ja tästä ei ole vielä merkintää
          if (now - createdAt < 120000 && !sessionStorage.getItem("welcomed")) {
            toast.success("Tervetuloa uusi käyttäjä! 👋", {
              description: "Tili luotu ja sähköposti vahvistettu.",
            });
            sessionStorage.setItem("welcomed", "true");
          }
        }
      };

      checkNewUserBySession();
    }
  }, [searchParams]);

  return null;
}

// ==========================================
// PÄÄSIVU-KOMPONENTTI
// ==========================================
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);

    const { data: applications, error } = await supabase
      .from("applications")
      .select("status, created_at");

    if (error) {
      console.error("Virhe tilastojen haussa:", error);
      setLoading(false);
      return;
    }

    if (applications) {
      // 1. Lasketaan kategoriat reduce-metodilla
      const statsData = applications.reduce(
        (acc, app) => {
          const s = app.status?.toLowerCase().trim() || "";
          if (["suosikki", "tallennettu"].includes(s)) acc.favorites++;
          else if (["haastattelu", "interview"].includes(s)) acc.interviews++;
          else if (["tarjous", "offer"].includes(s)) acc.offers++;
          else if (["hylätty", "hylätyt", "rejected"].includes(s))
            acc.rejected++;
          else acc.pending++;
          return acc;
        },
        { favorites: 0, interviews: 0, offers: 0, rejected: 0, pending: 0 },
      );

      // 2. Lasketaan consistency
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

      // 3. Päivitetään active total (ilman suosikkeja)
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
    <div className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50">
      <Suspense fallback={null}>
        <WelcomeToastHandler />
      </Suspense>

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
                {/* Skeletonit ylätasolle (2 x 6-saraketta) */}
                <div className="md:col-span-6">
                  <StatsSkeleton />
                </div>
                <div className="md:col-span-6">
                  <StatsSkeleton />
                </div>

                {/* Skeletonit alatasolle (4 x 3-saraketta) */}
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
                {/* Ylätaso: 2 korttia */}
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

                {/* Alataso: 4 korttia */}
                <div className="md:col-span-3">
                  <StatsCard
                    title="Tallennetut"
                    value={stats.favorites}
                    subtitle={
                      <span className="flex items-center gap-2">
                        {stats.pending > 0 ? `` : ""}
                        <Link
                          href="/favorites"
                          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:underline font-medium"
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
            {/* YLÄTASO: Grid-12 antaa täyden kontrollin */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Vasen pino: 3 saraketta leveä */}
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

              {/* Oikeat graafit: kumpikin vie 4.5 saraketta (yht. 9) */}
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

            {/* KESKITASO */}
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

            {/* ALATASO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <div className="lg:col-span-4 mb-10">
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
        />
      </main>
    </div>
  );
}
