"use client";

import { useState } from "react";
import {
  User,
  FileText,
  Lock,
  Bell,
  Upload,
  Eye,
  Trash2,
  CheckCircle2,
  Settings,
} from "lucide-react";

import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoHeader from "@/components/demo/DemoHeader";
import DemoBanner from "@/components/demo/DemoBanner";
import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Kiinteä esimerkkidata (read-only)
  const profile = {
    name: "Maija Meikäläinen",
    email: "maija.meikalainen@duunify.com",
    phone: "+358 40 123 4567",
    location: "Helsinki, Suomi",
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Sivupalkki */}
      <DemoSidebar />

      {/* Pääsisältöalue */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Yläpalkki sijoitettuna sisältöalueen yläosaan reunasta reunaan */}
        <DemoHeader
          userName="Maija Meikäläinen"
          userEmail="maija.meikalainen@duunify.com"
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1200px] mx-auto gap-6 pb-24 lg:pb-10 text-slate-900 dark:text-slate-50">
          <DemoBanner />

          {/* HEADER PAGEHEADER-KOMPONENTILLA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <PageHeader
              title="Asetukset"
              description="Katselutila: Asetusten muokkaaminen on poistettu käytöstä tässä demossa."
              icon={Settings}
              isDemo={true}
            />
          </div>

          {/* Pääsisältö (Sivunavigaatio + Kortit) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sisäinen navigaatio: Mobiilissa 2x2-ruudukko, työpöydällä pystyssä & sticky */}
            <nav className="md:col-span-3 grid grid-cols-2 md:flex md:flex-col gap-2 md:sticky md:top-6">
              <button
                onClick={() => scrollToSection("profile")}
                className={`flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <User size={16} className="shrink-0" />
                <span className="truncate">Profiili</span>
              </button>

              <button
                onClick={() => scrollToSection("documents")}
                className={`flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                  activeTab === "documents"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <FileText size={16} className="shrink-0" />
                <span className="truncate">Omat asiakirjat</span>
              </button>

              <button
                onClick={() => scrollToSection("security")}
                className={`flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                  activeTab === "security"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <Lock size={16} className="shrink-0" />
                <span className="truncate">Tili ja kirjautuminen</span>
              </button>

              <button
                onClick={() => scrollToSection("notifications")}
                className={`flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                  activeTab === "notifications"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <Bell size={16} className="shrink-0" />
                <span className="truncate">Ilmoitukset</span>
              </button>
            </nav>

            {/* Kortit */}
            <div className="md:col-span-9 space-y-6">
              {/* 1. Profiilitiedot */}
              <section
                id="profile"
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm scroll-mt-6"
              >
                <h2 className="text-lg font-bold">Profiilitiedot</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-6">
                  Yhteystiedot ja profiilikuva.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700 opacity-60 shrink-0">
                      <User size={36} className="text-slate-400" />
                    </div>
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"
                    >
                      <Upload size={14} />
                      Vaihda kuva
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Nimi
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.name}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Sähköposti
                        </label>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Vahvistettu
                        </span>
                      </div>
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Puhelinnumero
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.phone}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Sijainti
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.location}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 text-xs font-bold cursor-not-allowed"
                    >
                      Tallenna muutokset
                    </button>
                  </div>
                </div>
              </section>

              {/* 2. Omat asiakirjat */}
              <section
                id="documents"
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm scroll-mt-6"
              >
                <h2 className="text-lg font-bold">Omat asiakirjat</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-6">
                  Ansioluettelo (CV) ja yleinen saatekirjepohja tekoälyavustajaa varten. Maks. koko 250 KB / tiedosto.
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          Ansioluettelo_2026.pdf
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Päivitetty 11.8.2026
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        title="Katsele"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed"
                      >
                        <Upload size={13} />
                        Vaihda
                      </button>
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        title="Poista"
                      >
                        <Trash2 size={16} />
                      </button>
                      <CheckCircle2 size={18} className="text-emerald-500/70 ml-1" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          saatekirje_yleinen.pdf
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Päivitetty 11.8.2026
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        title="Katsele"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed"
                      >
                        <Upload size={13} />
                        Vaihda
                      </button>
                      <button
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        title="Poista"
                      >
                        <Trash2 size={16} />
                      </button>
                      <CheckCircle2 size={18} className="text-emerald-500/70 ml-1" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Tili ja kirjautuminen */}
              <section
                id="security"
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm scroll-mt-6"
              >
                <h2 className="text-lg font-bold">Tili ja kirjautuminen</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-6">
                  Salasanan vaihtaminen on poistettu käytöstä.
                </p>

                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Uusi salasana
                    </label>
                    <input
                      type="password"
                      disabled
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Vahvista uusi salasana
                    </label>
                    <input
                      type="password"
                      disabled
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 text-xs font-bold cursor-not-allowed"
                    >
                      Päivitä salasana
                    </button>
                  </div>
                </div>
              </section>

              {/* 4. Ilmoitukset */}
              <section
                id="notifications"
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm scroll-mt-6"
              >
                <h2 className="text-lg font-bold">Ilmoitukset</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-6">
                  Ilmoitusasetukset.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sovelluksen sisäiset ilmoitukset
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Näytä ilmoitukset yläpalkin kellossa (esim. haastattelukutsut ja tekoälytehtävät).
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed opacity-50 rounded-full bg-violet-600 focus:outline-none"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 translate-x-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sähköposti-ilmoitukset
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Lähetä tärkeitä päivityksistä ja muistutuksista viesti sähköpostiin.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed opacity-50 rounded-full bg-violet-600 focus:outline-none"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 translate-x-5" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}