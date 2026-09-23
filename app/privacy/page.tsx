"use client";

import { useState } from "react";
import { Shield, CheckCircle2, FileText, Lock, EyeOff, Code2, Server, FileCode, Globe } from "lucide-react";
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
                      <strong className="text-slate-900">EU-palvelimet.</strong>{" "}
                      Kaikki tietokantadatan ja tiedostojen tallennus sijaitsee EU:n alueella Irlannissa.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Pakollinen PII-maskaus.</strong>{" "}
                      Ladatuista dokumenteista siivotaan aina suorat henkilötiedot pois ennen tekoälylle lähettämistä.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="text-emerald-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <p>
                      <strong className="text-slate-900">Poistotakuu.</strong>{" "}
                      Voit poistaa kaikki tietosi ja tallennetut dokumenttisi milloin
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
                        Työhakemustiedot ja dokumentit:
                      </strong>{" "}
                      Käyttäjän lataamat tai syöttämät työpaikkailmoitukset, muistiinpanot sekä tallennetut CV- ja saatekirjetiedostot.
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
                  3. Tietojen käsittelyn tarkoitus ja säilytysalue
                </h2>
                <p className="mb-6">
                  Tietojasi käsitellään ainoastaan palvelun ydintoiminnallisuuksien mahdollistamiseksi ja ne tallennetaan turvallisesti EU-alueelle:
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
                      Hakemustesi ja dokumenttejesi turvalliseen tallentamiseen, automaattiseen
                      tietojen hakemiseen ja tilastojen visualisointiin.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
                      <Globe size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Säilytys EU-alueella
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Kaikki palveluun tallennettava data ja dokumentit sijaitsevat suojatulla ensisijaisella tietokannalla Euroopan unionin alueella (AWS West EU).
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  4. Dokumenttien tallennus, PDF-parsinta ja PII-maskaus
                </h2>
                <p className="mb-4">
                  Kun lataat sovellukseen CV:n tai saatekirjeen, se tallennetaan EU-pohjaiseen tietokantaamme käyttäjätilillesi hallinnointia varten. Kun hyödynnät tekoälyavustettuja työkaluja, tallennettuja asiakirjoja käsitellään seuraavan teknisen putken läpi ennen tekoälyrajapinnalle lähettämistä:
                </p>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm space-y-5 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <FileCode className="text-[#6D67F2] mt-0.5 shrink-0" size={18} />
                    <div>
                      <strong className="text-slate-900 block mb-1">
                        1. PDF-asiakirjojen tekstin parsinta
                      </strong>
                      <p className="text-slate-600">
                        Kun lataat PDF-tiedoston, järjestelmä muuntaa tiedoston binääripuskuriksi (<code className="bg-slate-200/80 px-1 py-0.5 rounded text-xs duunify-mono text-slate-800">Buffer</code>) palvelimella ja lukee sen tekstisisällön parsintakirjaston (kuten <code className="bg-slate-200/80 px-1 py-0.5 rounded text-xs duunify-mono text-slate-800">pdf-parse</code>) avulla tekstimuotoon.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
                    <Code2 className="text-[#6D67F2] mt-0.5 shrink-0" size={18} />
                    <div>
                      <strong className="text-slate-900 block mb-1">
                        2. Automaattinen PII-sanitointi (<code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-xs duunify-mono text-slate-800">anonymize.ts</code>)
                      </strong>
                      <p className="text-slate-600">
                        Saatu raakateksti ajetaan taustajärjestelmässä erillisen sanitointimoduulin läpi. Moduuli analysoi tekstin säännöllisillä lausekkeilla (RegEx) ja rakenne-etsinnällä tunnistaakseen ja korvatakseen suorat tunnistetiedot paikkamerkeillä ennen tekoälylle lähettämistä:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500 text-xs">
                        <li><strong>Sähköpostiosoitteet</strong> &rarr; <code className="duunify-mono text-[#6D67F2]">[EMAIL_REMOVED]</code></li>
                        <li><strong>Puhelinnumerot</strong> &rarr; <code className="duunify-mono text-[#6D67F2]">[PHONE_REMOVED]</code></li>
                        <li><strong>Henkilötunnukset (HETU)</strong> &rarr; <code className="duunify-mono text-[#6D67F2]">[SSN_REMOVED]</code></li>
                        <li><strong>Nimet ja yhteystietolohkot</strong> &rarr; <code className="duunify-mono text-[#6D67F2]">[NAME_REMOVED]</code></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
                    <Server className="text-[#6D67F2] mt-0.5 shrink-0" size={18} />
                    <div>
                      <strong className="text-slate-900 block mb-1">
                        3. API-siirto ja tekniset rajoitukset
                      </strong>
                      <p className="text-slate-600">
                        Sanitoitu teksti lähetetään tekoälyrajapinnalle salatun HTTPS-yhteyden yli. On kuitenkin hyvä huomioida, että vapaamuotoisesta leipätekstistä (kuten työkokemuskuvauksista) automaattinen algoritmi ei välttämättä tunnista kaikkia epäsuoria tunnistetietoja (esim. harvinaisia yritystietoja tai erikoisia nimen taivutusmuotoja). Suosittelemme poistamaan kaikkein kriittisimmät yksityiskohdat itse ennen tekstillisen tiedoston lataamista.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
                    <Shield className="text-[#6D67F2] mt-0.5 shrink-0" size={18} />
                    <div>
                      <strong className="text-slate-900 block mb-1">
                        4. Tekoälyntarjoajan ehdot ja mallien koulutus
                      </strong>
                      <p className="text-slate-600">
                        Sovellus hyödyntää ulkopuolisia tekoälyrajapintoja (kuten Google Gemini API). Ilmaisten tai kehittäjätasoisien rajapintojen käyttöehtojen mukaisesti tekoälypalvelun tarjoaja saattaa säilyttää ja käyttää rajapinnalle lähetettyä dataa tuotteidensa ja tekoälymalliensa jatkokouluttamiseen. Tämän vuoksi Duunify anonymisoi ja suodattaa kaikki suorat henkilötiedot (PII-maskaus) tekstistä aina ennen kuin pyyntö lähetetään tekoälylle, jotta voit käyttää tekoälytyökaluja täysin huolettomasti. Automaattinen suodatus varmistaa, että henkilökohtaiset yhteystietosi pysyvät aina vain omassa tiedossasi.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="duunify-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 mt-6">
                  <span className="w-1 h-6 bg-[#6D67F2] rounded-full" />
                  5. Evästeet ja kävijäseuranta
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