"use client";

import { useRef, useState } from "react";
import { User, Lock, Bell } from "lucide-react";
import AvatarUpload from "@/components/settings/AvatarUpload";
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";

const menuItems = [
  { id: "profiili", name: "Profiili", icon: User },
  { id: "tili", name: "Tili ja kirjautuminen", icon: Lock },
  { id: "ilmoitukset", name: "Ilmoitukset", icon: Bell },
];

export default function SettingsClient({
  userId,
  fullName,
  email,
  avatarUrl,
  phone,
  location,
}: {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  location: string;
}) {
  const [active, setActive] = useState("profiili");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function scrollTo(id: string) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asetukset</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Hallitse tiliäsi ja muokkaa asetuksiasi.
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* SIVUPALKIN VALINTANAPIT (TOGGLE) */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-1 md:sticky md:top-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active === item.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <item.icon size={18} /> {item.name}
                </button>
              ))}
            </aside>

            <div className="flex-1 w-full space-y-6">
              {/* PROFIILI */}
              <section
                id="profiili"
                ref={(el) => {
                  sectionRefs.current["profiili"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-slate-100">Profiilitiedot</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Muokkaa yhteystietojasi ja profiilikuvaasi.
                </p>
                <div className="flex flex-col md:flex-row gap-8">
                  <AvatarUpload
                    userId={userId}
                    initialUrl={avatarUrl}
                    onUploaded={() => {}}
                  />
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Nimi</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {fullName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                          Sähköposti
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {email}
                        </p>
                      </div>
                    </div>
                    <ProfileDetailsForm
                      initialPhone={phone}
                      initialLocation={location}
                    />
                  </div>
                </div>
              </section>

              {/* TILI */}
              <section
                id="tili"
                ref={(el) => {
                  sectionRefs.current["tili"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-slate-100">
                  Tili ja kirjautuminen
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Vaihda salasanasi tarvittaessa.
                </p>
                <PasswordChangeForm />
              </section>

              {/* ILMOITUKSET */}
              <section
                id="ilmoitukset"
                ref={(el) => {
                  sectionRefs.current["ilmoitukset"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Ilmoitukset</h2>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full">
                    Tulossa pian
                  </span>
                </div>
                <div className="space-y-4 opacity-50 pointer-events-none">
                  {[
                    "Sähköposti-ilmoitukset",
                    "Määräaikojen muistutukset",
                    "Viikoittainen yhteenveto",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2"
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                      
                      {/* KYTKIN/TOGGLENAPPI KORJATTU */}
                      <div
                        className={`w-11 h-6 rounded-full relative p-0.5 transition-colors duration-200 ${
                          i < 2 
                            ? "bg-indigo-600 dark:bg-indigo-500" 
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white dark:bg-slate-100 rounded-full shadow-sm transition-transform duration-200 ${
                            i < 2 ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* ALATUNNISTE */}
      <footer className="p-8 border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100">Duunify</span>
            <span className="ml-2">© 2026 Kaikki oikeudet pidätetään.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Tietosuoja</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Käyttöehdot</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Yhteystiedot</a>
          </div>
        </div>
      </footer>
    </div>
  );
}