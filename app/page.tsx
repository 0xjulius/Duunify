"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Zap,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  BarChart3,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import WaitlistSignup from "@/components/WaitlistSignup";
import { LandingIndexCard } from "@/components/LandingIndexCard";
import NavBarWait from "@/components/NavBarWait";

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* NAV */}
      <NavBarWait />

      {/* HERO */}
      <section className="duunify-modal relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,27,75,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,27,75,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D67F2]" />
            Nyt Duunitori ja Jobly -sivustojen tuki
          </div>

          <h1 className="duunify-display mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Työnhaku, joka näyttää{" "}
            <span className="text-[#6D67F2]">missä oikeasti menet</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
            Lopeta hakemusten seuraaminen Excelissä. Duunify tallentaa,
            aikatauluttaa ja visualisoi koko hakuprosessisi — automaattisella
            tietojen haulla suoraan työpaikkailmoituksesta.
          </p>
          {/* HIDDEN FOR NOW
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Aloita ilmaiseksi
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto font-semibold text-slate-700 px-7 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Kirjaudu sisään
            </button>
          </div>*/}

<Link
  href="/demo"
  className="group inline-flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 border-violet-300 text-slate-700 font-semibold px-8 py-4 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-violet-600/10 animate-none hover:animate-none relative overflow-hidden active:scale-[0.98]"
>
  <PlayCircle
    size={24}
    className="text-violet-600 group-hover:scale-110 group-hover:rotate-[360deg] transition-transform duration-500 ease-out"
  />
  <span className="relative z-10">Katso demo-versiota!</span>
          </Link>
          
          <p className="mt-3 text-sm text-slate-400 mb-12">
            Ei luottokorttia. Ei sitoutumista.
          </p>
          <div className="text-center">
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              Haluatko ensimmäisten joukossa kokeilemaan?
            </h3>
            <p className="mt-2 text-slate-600">
              Liity odotuslistalle ja saat kutsun heti, kun avaamme palvelun
              uusille käyttäjille.
            </p>
          </div>
          <WaitlistSignup />
        </div>
      </section>

       {/* DASHBOARD SHOWCASE */}
      <section
        id="dashboard"
        className="duunify-modal py-20 md:py-28 bg-slate-50 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full mb-5">
              <BarChart3 size={13} />
              Yleiskatsaus
            </div>
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Koko hakuprosessisi,{" "}
              <span className="text-[#6D67F2]">yhdellä silmäyksellä</span>
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Excel-taulukko kertoo mitä olet tehnyt. Duunifyn dashboard kertoo
              mihin suuntaan olet menossa — ja mitä kannattaisi tehdä
              seuraavaksi.
            </p>
          </div>

          {/* Kaksi korostettua mittaria: Työnhaku-indeksi ja Aktiivisuus */}
          <div className="mb-8">
            <LandingIndexCard />
          </div>

          {/* Iso visuaalinen esikatselu, dataton mutta uskottava */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-slate-900 text-sm">
                  Hakemukset tilan mukaan
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Esimerkki
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-24 h-24 rounded-full shrink-0"
                  style={{
                    background:
                      "conic-gradient(#6D67F2 0% 35%, #F59E0B 35% 55%, #22C55E 55% 70%, #EF4444 70% 85%, #E2E8F0 85% 100%)",
                  }}
                />
                <div className="flex-1 space-y-2">
                  <LegendRow color="#6D67F2" label="Haettu" value="35%" />
                  <LegendRow color="#F59E0B" label="Haastattelu" value="20%" />
                  <LegendRow color="#22C55E" label="Tarjous" value="15%" />
                  <LegendRow color="#EF4444" label="Hylätty" value="15%" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                  <p className="text-xs text-slate-400">hakemusta yhteensä</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                  <CheckCircle size={13} />↑ 18% edelliseen kuukauteen
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-slate-900 text-sm">
                  Aktiivisuus 9 viikon ajalta
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Esimerkki
                </span>
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {Array.from({ length: 63 }).map((_, i) => {
                  const intensity = Math.random();
                  const color =
                    intensity > 0.85
                      ? "#3D3699"
                      : intensity > 0.65
                        ? "#6D67F2"
                        : intensity > 0.45
                          ? "#B3ADF7"
                          : intensity > 0.25
                            ? "#D9D6FB"
                            : "#F1F0FE";
                  return (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-[4px]"
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-slate-800">48</span>{" "}
                  aktiviteettia yhteensä
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span>Vähemmän</span>
                  <div className="flex gap-[3px]">
                    {[
                      "#F1F0FE",
                      "#D9D6FB",
                      "#B3ADF7",
                      "#6D67F2",
                      "#3D3699",
                    ].map((c) => (
                      <div
                        key={c}
                        className="w-2.5 h-2.5 rounded-[3px]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>Enemmän</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 font-semibold text-[#6D67F2] hover:text-[#5750E0] transition"
            >
              Kokeile koko dashboardia demossa
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="ominaisuudet" className="duunify-modal py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900">
              Kaikki mitä tarvitset hakuprosessiin
            </h2>
            <p className="mt-4 text-slate-500">
              Suunniteltu suomalaista työnhakua varten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap size={20} />}
              title="Automaattinen täyttö"
              description="Liitä linkki Duunitorista tai Työmarkkinatorista, ja tiedot täyttyvät puolestasi."
            />
            <FeatureCard
              icon={<Briefcase size={20} />}
              title="Hakemusten seuranta"
              description="Näe yhdellä silmäyksellä missä vaiheessa jokainen hakemuksesi on."
            />
            <FeatureCard
              icon={<Calendar size={20} />}
              title="Älykäs kalenteri"
              description="Haastattelut, hakuaikojen päättymiset ja omat muistutukset samassa näkymässä — merkitse suoritetuksi yhdellä klikkauksella."
            />
            <FeatureCard
              icon={<BarChart3 size={20} />}
              title="Visuaalinen yleiskatsaus"
              description="Hakemusten status, trendi ja aktiivisuus kuukausien ajalta — näet heti missä kohtaa hakuprosessiasi olet."
            />
            <FeatureCard
              icon={<History size={20} />}
              title="Toimintaloki"
              description="Jokainen tilamuutos, muistiinpano ja tapahtuma tallentuu automaattisesti aikajanalle, jota voi suodattaa ja hakea."
            />
            <FeatureCard
              icon={<Star size={20} />}
              title="Suosikit"
              description="Merkitse kiinnostavimmat mahdollisuudet ja palaa niihin myöhemmin."
            />
          </div>
        </div>
      </section>

     {/* WHY NOT EXCEL */}
      <section className="duunify-modal py-20 md:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900">
              Miksi ei vain Excel?
            </h2>
            <p className="mt-4 text-slate-500">
              Taulukko tallentaa rivejä. Duunify ymmärtää hakuprosessisi.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <ComparisonRow
              label="Automaattinen tietojen täyttö ilmoituksesta"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              label="Haastattelut ja hakuajat samassa kalenterissa"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              label="Visuaalinen yleiskatsaus ja trendit"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              label="Automaattinen toimintaloki"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              label="Muistutukset ennen määräaikaa"
              excel={false}
              duunify={true}
              isLast
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="miten-toimii" className="duunify-modal py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900">
              Kolme askelta
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Liitä linkki"
              description="Kopioi työpaikkailmoituksen URL Duunitorista tai Työmarkkinatorista."
            />
            <StepCard
              number="02"
              title="Tarkista tiedot"
              description="Yritys, tehtävä, palkka ja kuvaus täyttyvät automaattisesti — muokkaa tarpeen mukaan."
            />
            <StepCard
              number="03"
              title="Seuraa etenemistä"
              description="Päivitä tilaa hakemuksen edetessä, saa muistutukset ajoissa ja katso kehitystäsi dashboardilta."
            />
          </div>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="duunify-modal py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900">
            Valmis järjestämään työnhakusi?
          </h2>
          <p className="mt-4 text-slate-500">
            Liity käyttäjien joukkoon jotka ovat jo ottaneet hakuprosessinsa
            haltuun.
          </p>
          {/* HIDDEN FOR NOW
          <button
            onClick={() => setShowLoginModal(true)}
            className="mt-8 inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
          >
            Aloita ilmaiseksi
            <ArrowRight size={18} />
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Ilmainen käyttää
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Ei mainoksia
            </span>
          </div>
          */}
          <WaitlistSignup />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition">
      <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100">
      <span className="duunify-mono text-2xl font-bold text-[#6D67F2]/30">
        {number}
      </span>
      <h3 className="font-bold text-slate-900 mt-3 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-slate-600 font-medium">{label}</span>
      </div>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function ComparisonRow({
  label,
  excel,
  duunify,
  isLast,
}: {
  label: string;
  excel: boolean;
  duunify: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 ${!isLast ? "border-b border-slate-100" : ""}`}
    >
      <p className="text-sm font-medium text-slate-700 flex-1 pr-4">{label}</p>
      <div className="flex items-center gap-8 shrink-0">
        <div className="w-16 flex justify-center">
          {excel ? (
            <CheckCircle size={18} className="text-emerald-500" />
          ) : (
            <XCircle size={18} className="text-slate-300" />
          )}
        </div>
        <div className="w-16 flex justify-center">
          {duunify ? (
            <CheckCircle size={18} className="text-[#6D67F2]" />
          ) : (
            <XCircle size={18} className="text-slate-300" />
          )}
        </div>
      </div>
    </div>
  );
}
