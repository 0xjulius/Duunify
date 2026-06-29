import StatsCard from "@/components/dashboard/StatsCard";
import Sidebar from "@/components/Sidebar";
import { Briefcase, Calendar, CheckCircle2, XCircle } from "lucide-react";

const greeting =
  new Date().getHours() < 12
    ? "Hyvää huomenta"
    : new Date().getHours() < 18
      ? "Hyvää iltapäivää"
      : "Hyvää iltaa";

export default function DashboardPage() {
  return (
    // Pääkääre, joka asettaa Sidebarin vasemmalle ja sisällön oikealle
    <div className="flex flex-row min-h-screen bg-slate-100 overflow-x-hidden">
            <Sidebar />
      {/* Varsinainen sisältöalue, joka täyttää loput tilasta (flex-1) */}
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto gap-10">
        
        {/* Yläosan tervehdys */}
        <header>
          <h1 className="text-4xl font-bold text-slate-900">{greeting} 👋</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Tässä näkymässä näet kaikki hakemuksesi ja niiden tilat. Pidä kirjaa
            työnhaustasi ja seuraa edistymistäsi helposti!
          </p>
        </header>

        {/* Koontinäytön sisältö */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Koontinäyttö
            </h2>
            <p className="mt-2 text-slate-500">Työnhakusi yhdellä silmäyksellä.</p>
          </div>

          {/* Tilastot (Stats) */}
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Hakemuksia"
              value={42}
              subtitle="Kaikki hakemukset"
              color="blue"
              icon={<Briefcase className="h-6 w-6" />}
            />
            <StatsCard
              title="Haastattelut"
              value={8}
              subtitle="19 % hakemuksista"
              color="amber"
              icon={<Calendar className="h-6 w-6" />}
            />
            <StatsCard
              title="Tarjoukset"
              value={2}
              subtitle="Loistavaa!"
              color="green"
              icon={<CheckCircle2 className="h-6 w-6" />}
            />
            <StatsCard
              title="Hylätyt"
              value={17}
              subtitle="Jatka hakemista 💪"
              color="red"
              icon={<XCircle className="h-6 w-6" />}
            />
          </section>

          {/* Alaosan kortit */}
          <section className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900">
                Viimeisimmät hakemukset
              </h2>
              <p className="mt-2 text-slate-500">
                Tämä osio tulee näyttämään 5 viimeisintä hakemustasi.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900">
                Tulevat määräajat
              </h2>
              <p className="mt-2 text-slate-500">
                Tänne listataan pian päättyvät työpaikkailmoitukset.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}