"use client";

import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
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
  Sparkles,
  Target,
  SearchCheck,
  TrendingUp,
  ShieldCheck,
  Ban,
  ChevronDown,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import { LandingIndexCard } from "@/components/LandingIndexCard";
import NavBar from "@/components/NavBar";

// Korvataan Math.random() kiinteällä esimerkkidatalla (63 arvoa väliltä 0.0 - 1.0)
const MOCK_INTENSITIES = [
  0.78, 0.47, 0.44, 0.58, 0.25, 0.51, 0.81, 0.11, 0.84, 0.72,
  0.93, 0.63, 0.07, 0.00, 0.35, 0.41, 0.59, 0.54, 0.86, 0.44,
  0.87, 0.31, 0.71, 0.15, 0.43, 0.55, 0.02, 0.96, 0.04, 0.44,
  0.87, 0.13, 0.93, 0.37, 0.95, 0.29, 0.99, 0.98, 0.61, 0.62,
  0.58, 0.42, 0.70, 0.68, 0.26, 0.19, 0.27, 0.48, 0.36, 0.82,
  0.48, 0.12, 0.65, 0.88, 0.21, 0.05, 0.74, 0.33, 0.52, 0.91,
  0.18, 0.40, 0.77
];

// Yhteiset scroll-reveal -asetukset osioiden otsikoille (tyypitetty Variants-tyypillä)
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* NAV */}
      <NavBar />

      {/* HERO */}
      <section className="duunify-modal relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.22) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full border border-[#6D67F2]/10">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#6D67F2]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Nyt Duunitori ja Jobly -sivustojen tuki
            </span>
            <a
              href="#ai-avustaja"
              className="inline-flex items-center gap-1.5 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full border border-[#6D67F2]/10 hover:bg-[#6D67F2]/12 transition"
            >
              <PulsingSparkle size={11} />
              Uutta: tekoälyavustaja
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="duunify-display mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto"
          >
            Työnhaku, joka näyttää{" "}
            <span className="text-[#6D67F2]">
              missä oikeasti menet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8"
          >
            Lopeta hakemusten seuraaminen Excelissä. Duunify tallentaa,
            aikatauluttaa ja visualisoi koko hakuprosessisi — automaattisella
            tietojen haulla suoraan työpaikkailmoituksesta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Aloita ilmaiseksi
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto font-semibold text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition bg-slate-50 dark:bg-slate-900/50"
            >
              Kirjaudu sisään
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/demo"
              className="group inline-flex items-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-violet-600/5 relative overflow-hidden active:scale-[0.98] mt-8"
            >
              <PlayCircle
                size={24}
                className="text-violet-600 group-hover:scale-110 group-hover:rotate-[360deg] transition-transform duration-500 ease-out"
              />
              <span className="relative z-10">Katso demo-versiota!</span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-3 text-sm text-slate-400"
          >
            Ei luottokorttia. Ei sitoutumista.
          </motion.p>
        </div>
      </section>

      {/* DASHBOARD SHOWCASE */}
      <section
        id="dashboard"
        className="duunify-modal py-20 md:py-28 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full mb-5 border border-[#6D67F2]/10">
              <BarChart3 size={13} />
              Yleiskatsaus
            </div>
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Koko hakuprosessisi,{" "}
              <span className="text-[#6D67F2]">
                <br />
                yhdellä silmäyksellä
              </span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Excel-taulukko kertoo mitä olet tehnyt. Duunifyn dashboard kertoo
              mihin suuntaan olet menossa — ja mitä kannattaisi tehdä
              seuraavaksi.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-8"
          >
            <LandingIndexCard />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Hakemukset tilan mukaan
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Esimerkki
                </span>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className="w-24 h-24 rounded-full shrink-0"
                  style={{
                    background:
                      "conic-gradient(#6D67F2 0% 35%, #F59E0B 35% 55%, #22C55E 55% 70%, #EF4444 70% 85%, #E2E8F0 85% 100%)",
                  }}
                  initial={{ opacity: 0, scale: 0.7, rotate: -60 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <div className="flex-1 space-y-2">
                  <LegendRow color="#6D67F2" label="Haettu" value="35%" />
                  <LegendRow color="#F59E0B" label="Haastattelu" value="20%" />
                  <LegendRow color="#22C55E" label="Tarjous" value="15%" />
                  <LegendRow color="#EF4444" label="Hylätty" value="15%" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
                  <p className="text-xs text-slate-400">hakemusta yhteensä</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-2.5 py-1.5 rounded-lg">
                  <CheckCircle size={13} />↑ 18% edelliseen kuukauteen
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Aktiivisuus 9 viikon ajalta
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Esimerkki
                </span>
              </div>

              {/* TÄSSÄ KÄYTETÄÄN NYT STABIILIA MOCK-DATASTA GENERoitua LISTAA */}
              <div className="flex gap-1 justify-center flex-wrap">
                {MOCK_INTENSITIES.map((intensity, i) => (
                  <ActivitySquare key={i} intensity={intensity} index={i} />
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">48</span>{" "}
                  aktiviteettia yhteensä
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span>Vähemmän</span>
                  <div className="flex gap-[3px]">
                    <div className="w-2.5 h-2.5 rounded-[3px] bg-slate-100 dark:bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-[3px] bg-indigo-100 dark:bg-indigo-950" />
                    <div className="w-2.5 h-2.5 rounded-[3px] bg-indigo-300 dark:bg-indigo-700" />
                    <div className="w-2.5 h-2.5 rounded-[3px] bg-indigo-500 dark:bg-indigo-500" />
                    <div className="w-2.5 h-2.5 rounded-[3px] bg-indigo-600 dark:bg-indigo-400" />
                  </div>
                  <span>Enemmän</span>
                </div>
              </div>
            </motion.div>
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Kaikki mitä tarvitset hakuprosessiin
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Suunniteltu suomalaista työnhakua varten.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              index={0}
              icon={<Sparkles size={20} />}
              title="Tekoälyavustaja saatekirjeisiin"
              description="Anna pohjasaatekirjeesi tai taustatietosi — avustaja kohdentaa sen valitsemasi työpaikan vaatimuksiin."
            />
            <FeatureCard
              index={1}
              icon={<Zap size={20} />}
              title="Automaattinen täyttö"
              description="Liitä linkki Duunitori tai Jobbly -sivustoilta, ja tiedot täyttyvät puolestasi."
            />
            <FeatureCard
              index={2}
              icon={<Briefcase size={20} />}
              title="Hakemusten seuranta"
              description="Näe yhdellä silmäyksellä missä vaiheessa jokainen hakemuksesi on."
            />
            <FeatureCard
              index={3}
              icon={<Calendar size={20} />}
              title="Älykäs kalenteri"
              description="Haastattelut, hakuaikojen päättymiset ja omat muistutukset samassa näkymässä — merkitse suoritetuksi yhdellä klikkauksella."
            />
            <FeatureCard
              index={4}
              icon={<BarChart3 size={20} />}
              title="Visuaalinen yleiskatsaus"
              description="Hakemusten status, trendi ja aktiivisuus kuukausien ajalta — näet heti missä kohtaa hakuprosessiasi olet."
            />
            <FeatureCard
              index={5}
              icon={<History size={20} />}
              title="Toimintaloki"
              description="Jokainen tilamuutos, muistiinpano ja tapahtuma tallentuu automaattisesti aikajanalle, jota voi suodattaa ja hakea."
            />
            <FeatureCard
              index={6}
              icon={<Star size={20} />}
              title="Suosikit"
              description="Merkitse kiinnostavimmat mahdollisuudet ja palaa niihin myöhemmin."
            />
          </div>
        </div>
      </section>

      {/* AI COVER LETTER ASSISTANT */}
      <section
        id="ai-avustaja"
        className="duunify-modal py-20 md:py-28 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full mb-5 border border-[#6D67F2]/10">
              <PulsingSparkle size={13} />
              Uusi ominaisuus
            </div>
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Yksi pohja.<br/>{" "}
              <span className="text-[#6D67F2]">Jokainen saatekirje kohdillaan.</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Valitse tallentamasi työpaikka ja anna avustajalle oma
              pohjasaatekirjeesi tai taustatietosi. Duunify lukee ilmoituksen,
              vertaa sitä taustaasi ja kohdentaa saatekirjeen — ilman että
              jokainen hakemus pitää kirjoittaa alusta.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* SHOWCASE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-7"
            >
              {/* step 1: valittu työpaikka */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center shrink-0">
                    <Briefcase size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Valittu työpaikka
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      Full Stack -kehittäjä · Nordcode Oy
                    </p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-300 dark:text-slate-600 shrink-0" />
              </div>

              {/* step 2: pohja */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold text-[#6D67F2] bg-[#6D67F2]/8 border border-[#6D67F2]/10 px-3 py-1.5 rounded-lg">
                  Pohjasaatekirjeeni
                </span>
                <span className="text-xs font-medium text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
                  Taustatietoni
                </span>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 mb-5" />

              {/* step 3: vaatimusten ja taustan täsmäytys */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">
                Ilmoitus vs. taustasi
              </p>
              <div className="space-y-2.5 mb-5">
                <MatchRow index={0} requirement="3+ vuotta kokemusta" match="4 vuotta full-stack-työtä" />
                <MatchRow index={1} requirement="React & Node.js" match="React/Node.js viimeisimmässä roolissa" />
                <MatchRow index={2} requirement="Asiakasprojektit" match="2v freelance-asiakastyötä" />
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 mb-5" />

              {/* step 4: tuloksena syntyvä katkelma */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Kohdennettu saatekirje
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;...Edellisessä roolissani rakensin React- ja
                  Node.js-pohjaisia ratkaisuja suoraan asiakkaille, mikä
                  vastaa hyvin hakemaanne Full Stack -kehittäjän
                  profiiliin...&rdquo;
                </p>
              </motion.div>
              <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                <PulsingSparkle size={12} className="text-[#6D67F2]" />
                Muodostettu automaattisesti — vapaasti muokattavissa
              </p>
            </motion.div>

            {/* WHAT AI DOES */}
            <div className="lg:col-span-2 space-y-3.5">
              <AiPointRow
                index={0}
                icon={<Target size={16} />}
                title="Tunnistaa vaatimukset"
                description="Poimii ilmoituksesta työnantajalle tärkeimmät osaamis- ja kokemusvaatimukset."
              />
              <AiPointRow
                index={1}
                icon={<SearchCheck size={16} />}
                title="Etsii vastaavuudet"
                description="Löytää pohjastasi tai taustatiedoistasi vaatimuksiin liittyvän osaamisen."
              />
              <AiPointRow
                index={2}
                icon={<TrendingUp size={16} />}
                title="Korostaa vahvuutesi"
                description="Nostaa esiin juuri tälle työnantajalle relevanteimmat asiat, ei kaikkea kerralla."
              />
              <AiPointRow
                index={3}
                icon={<ShieldCheck size={16} />}
                title="Pysyy totuudessa"
                description="Säilyttää todellisen kokemuksesi ja taustasi sellaisenaan."
              />
              <AiPointRow
                index={4}
                icon={<Ban size={16} />}
                title="Ei keksi mitään"
                description="Ei koskaan lisää kokemusta tai osaamista, jota sinulla ei oikeasti ole."
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY NOT EXCEL */}
      <section className="duunify-modal py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center max-w-xl mx-auto mb-14"
          >
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Miksi ei vain Excel?
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Taulukko tallentaa rivejä. Duunify ymmärtää hakuprosessisi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <ComparisonRow
              index={0}
              label="Tekoälyn kohdentama saatekirje ilmoituksen perusteella"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              index={1}
              label="Automaattinen tietojen täyttö ilmoituksesta"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              index={2}
              label="Haastattelut ja hakuajat samassa kalenterissa"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              index={3}
              label="Visuaalinen yleiskatsaus ja trendit"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              index={4}
              label="Automaattinen toimintaloki"
              excel={false}
              duunify={true}
            />
            <ComparisonRow
              index={5}
              label="Muistutukset ennen määräaikaa"
              excel={false}
              duunify={true}
              isLast
            />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="miten-toimii"
        className="duunify-modal py-20 md:py-28 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Löydä. Tallenna. Seuraa.<br/>{" "}
              <span className="text-[#6D67F2]">Analysoi. Valmistele. Hae.</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Duunify ei ole enää pelkkä seurantatyökalu — se auttaa myös itse
              hakemisessa, aina ilmoituksen analysoinnista valmiiseen
              hakemukseen asti.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <StepCard
              index={0}
              number="01"
              title="Löydä"
              description="Selaa avoimia työpaikkoja tai liitä ilmoituksen linkki suoraan Duunitorista tai Työmarkkinatorista."
            />
            <StepCard
              index={1}
              number="02"
              title="Tallenna"
              description="Yritys, tehtävä, palkka ja kuvaus täyttyvät automaattisesti talteen omaan hakuprosesseihisi."
            />
            <StepCard
              index={2}
              number="03"
              title="Seuraa"
              description="Päivitä tilaa hakemuksen edetessä, saa muistutukset ajoissa ja katso kehitystäsi dashboardilta."
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 my-8"
          >
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="inline-flex items-center gap-1.5 duunify-mono text-[11px] tracking-[0.14em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full border border-[#6D67F2]/10 shrink-0">
              <PulsingSparkle size={12} />
              Uutta — Duunify hoitaa myös tämän
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <StepCard
              index={3}
              number="04"
              title="Analysoi"
              description="Tekoäly käy ilmoituksen läpi ja tunnistaa, mitkä vaatimukset ja osaamiset ratkaisevat juuri tässä haussa."
            />
            <StepCard
              index={4}
              number="05"
              title="Valmistele"
              description="Anna pohjasaatekirjeesi tai taustatietosi — avustaja kohdentaa saatekirjeen tähän ilmoitukseen."
            />
            <StepCard
              index={5}
              number="06"
              title="Hae"
              description="Viimeistele ja lähetä hakemus tietäen, että saatekirje puhuu suoraan työnantajan tarpeisiin."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="duunify-modal py-20 md:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="duunify-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Valmis järjestämään työnhakusi?
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Liity käyttäjien joukkoon jotka ovat jo ottaneet hakuprosessinsa
            haltuun.
          </p>

          <div className="relative inline-block mt-8">
            <motion.div
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none"
              style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
            >
              Aloita ilmaiseksi
              <ArrowRight size={18} />
            </motion.button>
          </div>

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
        </motion.div>
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

function PulsingSparkle({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-flex ${className}`}
      animate={{ scale: [1, 1.2, 1], rotate: [0, 12, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles size={size} />
    </motion.span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -3 }}
      className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-sm transition-colors duration-200"
    >
      <div className="w-10 h-10 rounded-xl bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  description,
  index = 0,
}: {
  number: string;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors"
    >
      <span className="duunify-mono text-2xl font-bold text-[#6D67F2]/30">
        {number}
      </span>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function MatchRow({
  requirement,
  match,
  index = 0,
}: {
  requirement: string;
  match: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.15 }}
      className="flex items-center gap-2.5"
    >
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
        {requirement}
      </span>
      <ArrowRight size={12} className="text-[#6D67F2] shrink-0" />
      <span className="text-[11px] font-semibold text-[#6D67F2] bg-[#6D67F2]/8 border border-[#6D67F2]/10 px-2.5 py-1.5 rounded-lg truncate">
        {match}
      </span>
    </motion.div>
  );
}

function AiPointRow({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ x: -2 }}
      className="flex items-start gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
    >
      <div className="w-8 h-8 rounded-lg bg-[#6D67F2]/10 text-[#6D67F2] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </motion.div>
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
        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
      </div>
      <span className="font-bold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

function ComparisonRow({
  label,
  excel,
  duunify,
  isLast,
  index = 0,
}: {
  label: string;
  excel: boolean;
  duunify: boolean;
  isLast?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`flex items-center justify-between px-6 py-4 ${!isLast ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
    >
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 pr-4">
        {label}
      </p>
      <div className="flex items-center gap-8 shrink-0">
        <div className="w-16 flex justify-center">
          {excel ? (
            <CheckCircle size={18} className="text-emerald-500" />
          ) : (
            <XCircle size={18} className="text-slate-300 dark:text-slate-700" />
          )}
        </div>
        <div className="w-16 flex justify-center">
          {duunify ? (
            <CheckCircle size={18} className="text-[#6D67F2]" />
          ) : (
            <XCircle size={18} className="text-slate-300 dark:text-slate-700" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Logissa olleet väriavainten rajat täsmäävät nyt suoraan annettuihin arvoihin
function ActivitySquare({ intensity, index = 0 }: { intensity: number; index?: number }) {
  let baseColor = "bg-slate-150 dark:bg-slate-800"; // < 0.25 (Pohjaväri)

  if (intensity > 0.85) {
    baseColor = "bg-indigo-900 dark:bg-indigo-400";
  } else if (intensity > 0.65) {
    baseColor = "bg-indigo-600 dark:bg-indigo-500";
  } else if (intensity > 0.45) {
    baseColor = "bg-indigo-400 dark:bg-indigo-600";
  } else if (intensity > 0.25) {
    baseColor = "bg-indigo-200 dark:bg-indigo-850";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.006, 0.5) }}
      className={`w-3.5 h-3.5 rounded-[4px] ${baseColor} transition-colors duration-200`}
    />
  );
}