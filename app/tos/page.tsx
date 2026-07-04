"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import SimpleNavbar from "@/components/SimpleNav";

export default function TermsOfServicePage() {
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
            <Scale size={12} /> Käyttöehdot & Sopimus
          </div>
          <h1 className="duunify-display mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Käyttöehdot
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
                      <strong className="text-slate-900">Hyväksyntä.</strong>{" "}
                      Käyttämällä Duunify-palvelua sitoudut noudattamaan näitä
                      yhteisiä sääntöjä.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Oma vastuu.</strong>{" "}
                      Vastaat itse siitä, että palveluun tallentamasi materiaali
                      on asiallista.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Reilu käyttö.</strong>{" "}
                      Palvelun väärinkäyttö tai automaattinen ylikuormittaminen
                      on kielletty.
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
                  1. Palvelun kuvaus ja ehtojen voimassaolo
                </h2>
                <p className="mb-4">
                  Duunify tarjoaa verkkopohjaisen palvelun työhakemusten
                  organisointiin, seurantaan ja hallintaan. Luomalla
                  käyttäjätilin tai käyttämällä palvelua vahvistat, että olet
                  lukenut, ymmärtänyt ja hyväksynyt nämä käyttöehdot itseäsi
                  sitoviksi.
                </p>
                <p>
                  Palvelun ylläpitäjä pidättää oikeuden päivittää tai muuttaa näitä ehtoja
                  tarvittaessa. Olennaisista muutoksista ilmoitetaan käyttäjille
                  sovelluksen kautta tai sähköpostitse.
                </p>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  2. Käyttäjätili ja velvollisuudet
                </h2>
                <p className="mb-4">
                  Käyttäjä on vastuussa kaikesta toiminnasta, joka tapahtuu
                  hänen käyttäjätilinsä kautta. Palvelua on käytettävä hyvän
                  tavan ja Suomen lain mukaisesti.
                </p>
                <ul className="space-y-3 pl-1 text-sm">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">
                        Tietojen oikeellisuus:
                      </strong>{" "}
                      Sitoudut antamaan rekisteröitymisen yhteydessä oikeat ja
                      ajantasaiset tiedot.
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">Salassapito:</strong>{" "}
                      Vastaat kirjautumistunnustesi suojaamisesta. Älä jaa
                      tiliäsi kolmansille osapuolille.
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D67F2] mt-2 shrink-0" />
                    <p>
                      <strong className="text-slate-900">
                        Kielletty käyttö:
                      </strong>{" "}
                      Palvelun haitallinen kuormittaminen,
                      palvelunestohyökkäykset tai toisen käyttäjän tietojen
                      kalastelu johtaa tilin välittömään sulkemiseen.
                    </p>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  3. Oikeudet ja vastuunrajoitukset
                </h2>
                <p className="mb-6">
                  Palvelua kehitetään jatkuvasti käyttökokemuksen parantamiseksi.
                  Se tarjotaan kuitenkin 'sellaisena kuin se on', eikä sen
                  keskeytyksettömästä toimivuudesta voida antaa takuita kaikissa olosuhteissa.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
                      <UserCheck size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Omistajuus ja tekijänoikeudet
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Kaikki oikeudet Duunify-brändiin, lähdekoodiin ja
                      ulkoasuun kuuluvat palvelun ylläpitäjälle. Käyttäjän tallentama
                      data, ansioluettelot ja hakemukset pysyvät täysin käyttäjän
                      omana omaisuutena.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
                      <AlertTriangle size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Vastuunrajoitus
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Palvelun ylläpitäjä ei vastaa sovelluksen käytöstä mahdollisesti
                      aiheutuvista välillisistä vahingoista tai tietojen
                      menetyksestä. Vastuuta ei myöskään ole häiriöistä,
                      jotka johtuvat kolmansien osapuolten rajapintamuutoksista tai 
                      palveluntarjoajien katkoista.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}