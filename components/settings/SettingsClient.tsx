"use client";

import { useRef, useState } from "react";
import { User, Lock, Bell, Loader2, Check } from "lucide-react";
import AvatarUpload from "@/components/settings/AvatarUpload";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const menuItems = [
  { id: "profiili", name: "Profiili", icon: User },
  { id: "tili", name: "Tili ja kirjautuminen", icon: Lock },
  { id: "ilmoitukset", name: "Ilmoitukset", icon: Bell },
];

export default function SettingsClient({
  userId,
  fullName: initialFullName,
  email,
  avatarUrl,
  phone: initialPhone,
  location: initialLocation,
  isEmailConfirmed, // Vastaanotetaan tieto onko sähköposti vahvistettu
}: {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  location: string;
  isEmailConfirmed: boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState("profiili");
  
  // Kaikki profiilikentät samassa isäkomponentissa
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone || "");
  const [location, setLocation] = useState(initialLocation || "");
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function scrollTo(id: string) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Funktio vahvistussähköpostin uudelleenlähetykseen
  const handleResendVerification = async () => {
    setVerifying(true);
    setVerifyStatus(null);

    const { error } = await supabase.auth.updateUser(
      { email: email },
      { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` }
    );

    setVerifying(false);

    if (error) {
      setVerifyStatus({ type: "error", message: `Lähetys epäonnistui: ${error.message}` });
      return;
    }

    setVerifyStatus({ type: "success", message: "Vahvistuslinkki lähetetty sähköpostiisi!" });
  };

  // Yhteinen tallennusfunktio kaikille profiilitiedoille
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // 1. Päivitetään nimi ja muut tiedot Supabasen auth-metadataan
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: fullName.trim(),
        phone: phone.trim(),
        location: location.trim()
      },
    });

    if (error) {
      setStatus({ type: "error", message: `Virhe: ${error.message}` });
      setLoading(false);
      return;
    }

    setStatus({ type: "success", message: "Muutokset tallennettu onnistuneesti!" });
    setLoading(false);
    
    // Päivitetään palvelimen datat (kuten Sidebarin nimitieto)
    router.refresh();
  };

  // Tarkistetaan onko mikään kenttä muuttunut alkuperäisestä
  const isChanged = 
    fullName !== initialFullName || 
    phone !== (initialPhone || "") || 
    location !== (initialLocation || "");

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
                  <div className="flex-1">
                    {/* YHTEINEN LOMAKE KAIKILLE KENTILLE */}
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="settings-name" className="block text-xs text-slate-400 dark:text-slate-500 mb-1">
                            Nimi
                          </label>
                          <input
                            id="settings-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            maxLength={50}
                            disabled={loading}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              Sähköposti
                            </p>
                            {isEmailConfirmed ? (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Vahvistettu
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                Ei vahvistettu
                              </span>
                            )}
                          </div>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 cursor-not-allowed text-sm font-medium"
                          />

                          {/* Näytetään linkin uudelleenlähetys vain jos sähköpostia ei ole vahvistettu */}
                          {!isEmailConfirmed && (
                            <div className="mt-2">
                              <button
                                type="button"
                                disabled={verifying}
                                onClick={handleResendVerification}
                                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
                              >
                                {verifying ? (
                                  <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Lähetetään linkkiä...
                                  </>
                                ) : (
                                  "Lähetä vahvistuslinkki uudelleen"
                                )}
                              </button>

                              {verifyStatus && (
                                <p className={`text-[11px] mt-1 font-medium ${
                                  verifyStatus.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                }`}>
                                  {verifyStatus.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="settings-phone" className="block text-xs text-slate-400 dark:text-slate-500 mb-1">
                            Puhelinnumero
                          </label>
                          <input
                            id="settings-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                            placeholder="Ei puhelinnumeroa"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label htmlFor="settings-location" className="block text-xs text-slate-400 dark:text-slate-500 mb-1">
                            Sijainti
                          </label>
                          <input
                            id="settings-location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={loading}
                            placeholder="Ei sijaintia"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                      </div>

                      {status && (
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            status.type === "success"
                              ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {status.type === "success" && <Check size={14} />}
                          <span>{status.message}</span>
                        </div>
                      )}

                      {/* Tallenna-painike on aktiivinen vain, jos jotain on oikeasti muutettu */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading || !fullName.trim() || !isChanged}
                          className="px-5 py-2.5 rounded-xl text-white text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Tallennetaan...
                            </>
                          ) : (
                            "Tallenna muutokset"
                          )}
                        </button>
                      </div>
                    </form>
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