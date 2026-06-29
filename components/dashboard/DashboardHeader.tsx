const greeting =
  new Date().getHours() < 12
    ? "Hyvää huomenta"
    : new Date().getHours() < 18
      ? "Hyvää iltapäivää"
      : "Hyvää iltaa";

export default function DashboardHeader() {
  return (
      <div>
                  <header>
              <h1 className="text-4xl font-bold text-slate-900">{greeting} 👋</h1>
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900">Koontinäyttö</h2>
                          <p className="mt-2 text-slate-500">
                            Työnhakusi yhdellä silmäyksellä.
                          </p>
                        </div>
        </header>
    </div>
  )
}