import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  User,
  Lock,
  Bell,
  Palette,
  Shield,
  Download,
  Star,
  HelpCircle,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const menuItems = [
    { name: "Profiili", icon: User },
    { name: "Tili ja kirjautuminen", icon: Lock },
    { name: "Ilmoitukset", icon: Bell },
    { name: "Ulkoasu", icon: Palette },
    { name: "Tietosuoja", icon: Shield },
    { name: "Vie data", icon: Download },
    { name: "Pro versio", icon: Star },
    { name: "Tuki ja palaute", icon: HelpCircle },
  ];

  return (
    // overflow-hidden estää sidebarin animoinnista johtuvat reunaviivat
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar-kääre ilman kiinteää w-64 leveyttä */}
      <div className="flex-shrink-0 border-r border-slate-200 bg-white">
        <Sidebar />
      </div>

      {/* Pääsisältöalue h-screen ja overflow-y-auto varmistavat oikean scrollauksen */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl font-bold">Asetukset</h1>
              <p className="text-slate-500">
                Hallitse tiliäsi ja muokkaa asetuksiasi.
              </p>
            </header>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Navigaatio */}
              <aside className="w-full md:w-64 flex-shrink-0 space-y-1">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${i === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    <item.icon size={18} /> {item.name}
                  </button>
                ))}
              </aside>

              {/* Asetuskortit */}
              <div className="flex-1 w-full space-y-6">
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="font-bold text-lg mb-1">Profiilitiedot</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    Muokkaa julkisia tietokasi ja profiilikuvaasi.
                  </p>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 rounded-full bg-slate-200" />
                      <button className="text-xs border px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                        <Upload size={14} /> Vaihda kuva
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Nimi"
                        className="border rounded-lg p-2 text-sm"
                      />
                      <input
                        placeholder="Sähköposti"
                        className="border rounded-lg p-2 text-sm"
                      />
                      <input
                        placeholder="Puhelinnumero"
                        className="border rounded-lg p-2 text-sm"
                      />
                      <input
                        placeholder="Sijainti"
                        className="border rounded-lg p-2 text-sm"
                      />
                    </div>
                  </div>
                  <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold">
                    Tallenna muutokset
                  </button>
                </section>

                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="font-bold text-lg mb-1">
                    Tili ja kirjautuminen
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">
                    Hallitse salasanaasi ja kirjautumisasetuksiasi.
                  </p>
                  <div className="flex items-center justify-between border-b pb-6 mb-6">
                    <input
                      type="password"
                      value="............"
                      className="text-sm border-none bg-slate-50 p-2 rounded w-48"
                      readOnly
                    />
                    <button className="text-sm border px-3 py-1.5 rounded-lg font-medium">
                      Vaihda salasana
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        Kaksivaiheinen tunnistautuminen
                      </p>
                      <p className="text-xs text-slate-500">
                        Lisää ylimääräinen suoja tilillesi.
                      </p>
                    </div>
                    <div className="w-11 h-6 bg-slate-300 rounded-full" />
                  </div>
                </section>

                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="font-bold text-lg mb-6">Ilmoitukset</h2>
                  <div className="space-y-4">
                    {[
                      "Sähköposti-ilmoitukset",
                      "Määräaikojen muistutukset",
                      "Viikoittainen yhteenveto",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2"
                      >
                        <p className="text-sm">{item}</p>
                        <div
                          className={`w-11 h-6 rounded-full ${i < 2 ? "bg-indigo-600" : "bg-slate-300"}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>
                <div className="justify-items-center mx-auto">
                  <p className="text-slate-300">
                    Duunify.com | version 1.0 | made with love
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-8 border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-500">
            <div>
              <span className="font-bold text-slate-900">Duunify</span>
              <span className="ml-2">© 2026 Kaikki oikeudet pidätetään.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900">
                Tietosuoja
              </a>
              <a href="#" className="hover:text-slate-900">
                Käyttöehdot
              </a>
              <a href="#" className="hover:text-slate-900">
                Yhteystiedot
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
