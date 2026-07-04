"use client";

import { useState } from "react";
import { Shield, CheckCircle2, FileText, Lock } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import SimpleNavbar from "@/components/SimpleNav";

export default function PrivacyPolicyPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* TAUSTAPATTERNI */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,27,75,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,27,75,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <SimpleNavbar />

      {/* PÄÄSISÄLTÖ */}
      <main className="duunify-modal max-w-6xl mx-auto px-6 pt-16 pb-24 relative z-10">
        {/* HITUSET JA OTSAKKEET */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full">
            <Shield size={12} /> Tietosuoja & Turvallisuus
          </div>
          <h1 className="duunify-display mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Tietosuojaseloste
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Päivitetty viimeksi: 4. heinäkuuta 2026
          </p>
        </div>

        {/* VALKOINEN BOKSI */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* VASEN OSATARKASTELU */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="duunify-mono text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-4">
                  Pähkinänkuoressa
                </h3>

                <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Data on sinun.</strong>{" "}
                      Hakemustietojasi ei myydä tai luovuteta kolmansille
                      osapuolille kaupallisiin tarkoituksiin.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Avoimuus.</strong>{" "}
                      Palveluun tallentuu vain ne tiedot, jotka itse syötät tai
                      haet linkkien kautta.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Poistotakuu.</strong>{" "}
                      Voit poistaa kaikki tietosi ja käyttäjätilisi milloin
                      tahansa sovelluksen asetuksista.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* LAKITEKSTIT */}
            <div className="lg:col-span-8 space-y-10 text-slate-600 text-[15px] leading-relaxed">
              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  1. Yleistä ja rekisterinpitäjä
                </h2>
                <p className="mb-4">
                  Duunify-palvelussa kunnioitetaan yksityisyyttäsi. Tässä
                  tietosuojaselosteessa kerrotaan, miten palveluun tallennettuja
                  tietoja kerätään, käsitellään ja säilytetään, kun käytät
                  sovellusta työhakemustesi hallinnointiin.
                </p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm space-y-1">
                  <strong className="text-slate-900 block mb-1">
                    Yhteystiedot tietosuoja-asioissa:
                  </strong>
                  <p>Duunify-palvelun ylläpito</p>
                  <p>Yhteydenotot: Verkkosivuston tukilomakkeen kautta</p>
                  <a
                    className="text-indigo-500 hover:underline text-sm font-semibold"
                    href="/contact"
                  >
                    Tukilomake
                  </a>
                </div>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  2. Mitä tietoja sovellus kerää?
                </h2>
                <p className="mb-4">
                  Palveluun kerätään vain tietoja, jotka ovat välttämättömiä
                  sovelluksen tarjoamiseksi ja hakuprosessisi helpottamiseksi:
                </p>
                <ul className="space-y-3 pl-1 text-sm">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">
                        Käyttäjätilin tiedot:
                      </strong>{" "}
                      Sähköpostiosoite ja nimi, joita käytetään palveluun
                      tunnistautumisessa ja tilin ylläpidossa.
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">
                        Työhakemustiedot:
                      </strong>{" "}
                      Käyttäjän syöttämät työpaikkailmoituksen URL-osoitteet,
                      yritysten nimet, tehtävänikkeet, hakuajat, omat
                      muistiinpanot sekä hakemusten vaiheet.
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">
                        Tekniset lokitiedot:
                      </strong>{" "}
                      Anonyymit virhelokit, joita käytetään yksinomaan teknisten
                      ongelmien selvittämiseen ja sovelluksen vakauden
                      parantamiseen.
                    </p>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  3. Tietojen käsittelyn tarkoitus
                </h2>
                <p className="mb-6">
                  Tietojasi käsitellään ainoastaan palvelun
                  ydintoiminnallisuuksien mahdollistamiseksi:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Palvelun tarjoaminen
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Hakemustesi turvalliseen tallentamiseen, automaattiseen
                      tietojen hakemiseen ja tilastojen visualisointiin.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
                      <Lock size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Tietoturva & Suojaus
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Käyttöoikeuksien todentamiseen, istuntojen hallintaan ja
                      luvattoman datan käsittelyn estämiseen.
                    </p>
                  </div>
                </div>
                <section>
                  <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                    <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                    4. Evästeet ja kävijäseuranta
                  </h2>
                  <p className="mb-4">
                    Palvelu käyttää välttämättömiä teknisiä menetelmiä sivuston
                    toiminnan varmistamiseen ja kehittämiseen:
                  </p>
                  <ul className="space-y-3 pl-1 text-sm">
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                      <p>
                        <strong className="text-slate-900">
                          Istunnon hallinta:
                        </strong>{" "}
                        Selaimen paikallista tallennustilaa (LocalStorage) tai
                        istuntoevästeitä käytetään pitämään sinut kirjautuneena
                        sisään palveluun. Nämä ovat palvelun toiminnan kannalta
                        välttämättömiä.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                      <p>
                        <strong className="text-slate-900">
                          Kävijätilastot:
                        </strong>{" "}
                        Sivustolla käytetään Vercel Analytics -palvelua
                        kävijämäärän ja sivuston suorituskyvyn seuraamiseen.
                        Työkalu on yksityisyyttä kunnioittava: se ei käytä
                        seurantatunnisteita tai evästeitä, eikä se kerää tai
                        tallenna henkilötietoja tai IP-osoitteita.
                      </p>
                    </li>
                  </ul>
                </section>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
