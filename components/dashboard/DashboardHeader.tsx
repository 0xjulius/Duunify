import { LayoutDashboard } from "lucide-react";

const greeting =
  new Date().getHours() < 12
    ? "Hyvää huomenta"
    : new Date().getHours() < 18
      ? "Hyvää iltapäivää"
      : "Hyvää iltaa";

export default function DashboardHeader() {
  return (
    <header className="mb-2">
      {/* Tervehdys */}
      <h1 className="text-4xl font-bold text-slate-900 mb-6">{greeting} 👋</h1>

      {/* Otsikko ja ikoni */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-2xl">
          <LayoutDashboard className="h-8 w-8 text-indigo-600" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">Koontinäyttö</h2>
          <p className="mt-1 text-slate-500">
            Työnhakusi yhdellä silmäyksellä.
          </p>
        </div>
      </div>
    </header>
  );
}
