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
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";

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
      <header className="duunify-modal sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D67F2] to-[#5750E0]" />
            <span className="duunify-display font-bold text-slate-900">
              Duunify
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#ominaisuudet" className="hover:text-slate-900">
              Ominaisuudet
            </a>
            <a href="#miten-toimii" className="hover:text-slate-900">
              Miten toimii
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              Kirjaudu sisään
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Aloita ilmaiseksi
            </button>
          </div>
        </div>
      </header>

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
            Nyt Duunitori ja Työmarkkinatori -tuki
          </div>

          <h1 className="duunify-display mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Pidä kaikki työhakemuksesi{" "}
            <span className="text-[#6D67F2]">yhdessä paikassa</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Lopeta hakemusten seuraaminen Excelissä. Tallenna, järjestä ja
            muistuta itseäsi jokaisesta hakemuksesta — automaattisella tietojen
            haulla suoraan työpaikkailmoituksesta.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Aloita ilmaiseksi
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto font-semibold text-slate-700 px-7 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Kirjaudu sisään
            </button>
          </div>

          <p className="mt-5 text-md text-slate-400 mb-8">
            Ei luottokorttia. Ei sitoutumista.
          </p>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-3xl transition-all duration-300 hover:shadow-md"
          >
            <PlayCircle
              size={24}
              className="text-violet-600 group-hover:scale-110 transition-transform"
            />
            Katso demo-versiota!
          </Link>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              title="Määräajat ja muistutukset"
              description="Älä koskaan missaa hakuajan päättymistä tai haastattelua."
            />
            <FeatureCard
              icon={<Star size={20} />}
              title="Suosikit"
              description="Merkitse kiinnostavimmat mahdollisuudet ja palaa niihin myöhemmin."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="miten-toimii"
        className="duunify-modal py-20 md:py-28 bg-slate-50"
      >
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
              description="Päivitä tilaa hakemuksen edetessä ja saa muistutukset ajoissa."
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
          <button
            onClick={() => setShowLogin(true)}
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
