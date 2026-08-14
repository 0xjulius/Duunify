"use client";

import { use, useState } from "react";
import Link from "next/link";
import DemoSidebar from "@/components/demo/DemoSidebar";
import {
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileText,
  Upload,
  ShieldCheck,
  Zap,
  ChevronRight,
  Eye,
  Trash2,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

// ==========================================
// 1. TYYPIT JA MOCK-DATA
// ==========================================
export type Application = {
  id: string;
  company: string;
  job_title: string;
  location?: string;
  employment_type?: string;
  notes?: string;
  job_description?: string;
  job_url?: string;
  company_logo?: string;
};

const DEMO_JOBS: Record<string, Application> = {
  "demo-1": {
    id: "demo-1",
    job_title: "Senior Full Stack Developer",
    company: "RELEX Solutions",
    location: "Helsinki (Hybrid)",
    employment_type: "Kokoaikainen",
    company_logo: "/demo-logos/relex.webp",
    job_url: "https://example.com/careers/senior-developer",
    job_description: `Etsimme kokenutta ja innostunutta Senior Full Stack -kehittäjää vahvistamaan kasvavaa ohjelmistokehitystiimiämme Helsinkiin. Tehtävässä pääset suunnittelemaan ja toteuttamaan skaalautuvia verkkopalveluita sekä asiakkaillemme että omiin tuotteisiimme.

Keskeiset vastuualueet:
• Modernien Next.js- ja React-pohjaisten käyttöliittymien kehitys
• Taustajärjestelmien ja REST/GraphQL-rajapintojen rakentaminen (Node.js, TypeScript)
• Tietokantojen suunnittelu ja optimointi (PostgreSQL, Supabase, Redis)
• Pilvi-infrastruktuurin ylläpito ja CI/CD-putkien kehittäminen (AWS/Vercel)
• Mentorointi ja koodikatselmoinnit tiimin nuoremmille kehittäjille

Odotamme sinulta:
• Vähintään 4–5 vuoden kokemusta tavoitteellisesta ohjelmistokehityksestä
• Vahvaa osaamista TypeScriptistä, Reactista ja Node.js-ekosysteemistä
• Ymmärrystä nykyaikaisista tietoturvakäytännöistä ja suorituskyvyn optimoinnista
• Hyviä tiimityötaitoja sekä kykyä kommunikoida sujuvasti suomeksi ja englanniksi

Tarjoamme sinulle:
• Kilpailukykyisen palkkauksen ja kattavan etupaketin (lounas, liikunta, hammashoito)
• Joustavat hybridityömahdollisuudet ja ergonomisen etätyövarustelun
• Jatkuvan oppimisen budjetin (sertifikaatit, konferenssit, koulutukset)
• Innostavan ja matalahierarkkisen työyhteisön`,
  },
  "demo-2": {
    id: "demo-2",
    job_title: "AI Specialist & Automation Architect",
    company: "Futurice",
    location: "Etätyö / Tampere",
    employment_type: "Kokoaikainen",
    company_logo: "/demo-logos/futurice.webp",
    job_url: "https://example.com/careers/ai-architect",
    job_description: `Haetaan tekoäly- ja automaatioarkkitehtia suunnittelemaan, rakentamaan ja integroimaan moderneja tekoälypohjaisia liiketoimintaprosesseja asiakkaillemme.

Tehtävänkuva:
• Liiketoimintaprosessien kartoitus ja automaatiomahdollisuuksien tunnistaminen
• Kompleksien työnkulkujen rakentaminen n8n- ja Zapier-alustoilla
• Suurten kielimallien (LLM), RAG-arkkitehtuurien ja AI-agenttien integrointi osaksi asiakkaiden IT-ekosysteemiä
• Rajapintojen (REST, Webhooks) kehittäminen eri tietojärjestelmien välille
• Tekninen konsultointi ja ratkaisukonseptien esittely sidosryhmille

Toivotut taidot ja kokemus:
• Kokemusta n8n-automaatioista ja Python/TypeScript-skriptauksesta
• Käytännön kokemusta OpenAI API-, Claude- tai Hugging Face -rajapinnoista
• Ymmärrystä vektoritietokannoista (esim. Pinecone, Qdrant) ja prompt engineering -tekniikoista
• Omaehtoinen ote työhön ja halu ratkaista monimutkaisia liiketoiminta-haasteita

Tarjoamme:
• Täyden etätyövapauden ja modernit työkalut
• Pääsyn tekoälykehityksen eturintamaan
• Kilpailukykyisen palkkauksen sekä tulosbonuksen`,
  },
  "demo-3": {
    id: "demo-3",
    job_title: "Frontend Developer (React & Next.js)",
    company: "KONE",
    location: "Espoo",
    employment_type: "Kokoaikainen",
    company_logo: "/demo-logos/kone.png",
    job_url: "https://example.com/careers/frontend",
    job_description: `Etsimme pikselitarkkaa ja UI/UX-henkistä Frontend-kehittäjää luomaan visually stunning -verkkosovelluksia asiakkaidemme digitaalisiin tuotteisiin.

Tärkeimmät tehtäväsi:
• Responsiivisten ja saavutettavien käyttöliittymien kehittäminen Next.js App Routerilla
• Animaatioiden ja sulavien UI-siirtymien toteuttaminen (Framer Motion, Tailwind CSS)
• Yhteistyö UI/UX-suunnittelijoiden kanssa Figma-komponenttien kääntämiseksi laadukkaaksi koodiksi
• Verkkosivustojen latausopeuksien ja hakukoneoptimoinnin (SEO) hienosäätö

Etsimällämme henkilöllä on:
• Vankka kokemus modernista HTML5/CSS3/JavaScript/TypeScript-kehityksestä
• Erinomainen Tailwind CSS -osaaminen sekä silmää estetiikalle ja yksityiskohdille
• Kokemusta headless CMS -järjestelmistä (esim. Sanity, Strapi)
• Intohimoa käyttäjäystävällisten ja nopeiden verkkopalveluiden rakentamiseen

Edut:
• Erinomaiset kehitysmahdollisuudet ja tiimin tuki
• Joustavat työajat ja mahdollisuus osittaiseen etätyöhön
• Laadukkaat työvälineet valintasi mukaan (Mac/PC)`,
  },
};

// ==========================================
// 2. SISÄINEN JOB HEADER -KOMPONENTTI
// ==========================================
interface JobHeaderProps {
  job: Application;
  failedLogo: boolean;
  onLogoError: () => void;
}

function JobHeader({ job, failedLogo, onLogoError }: JobHeaderProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company_logo && !failedLogo ? (
              <img
                src={job.company_logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain p-2"
                onError={onLogoError}
              />
            ) : (
              <Building2
                size={26}
                className="text-slate-500 dark:text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              Valittu työpaikka
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {job.job_title}
            </h1>

            <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {job.company}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {job.location}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Briefcase size={15} />
                {job.employment_type || "Kokoaikainen"}
              </span>

              {job.job_url && (
                <a
                  href={job.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Avaa ilmoitus <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          <Link
            href={`/demo/job-assistant/${job.id}/result`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            <Sparkles size={18} />
            Räätälöi saatekirje
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. PÄÄSIVU (DEMO)
// ==========================================
export default function DemoJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = DEMO_JOBS[id] || DEMO_JOBS["demo-1"];

  const [failedLogo, setFailedLogo] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const showDemoNotice = () => {
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <DemoSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* DEMO NOTICE POPUP */}
          {demoNotice && (
            <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 animate-bounce text-xs">
              <span>
                ⚠️ Tämä on demoversio – tiedostojen muokkaus on poissa käytöstä.
              </span>
            </div>
          )}

          {/* TIETOSUOJA-INFO MODAALI */}
          {isPrivacyModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    <ShieldCheck size={22} />
                    <span>Miten tietosuoja toimii?</span>
                  </div>
                  <button
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>1. Yksityisyys ensin:</strong> Hakutietojasi
                    käsitellään turvallisesti ja vain siihen tarkoitukseen, jota
                    varten käytät työnhakuavustajaa. Haluamme, että voit
                    hyödyntää tekoälyä ilman, että sinun tarvitsee jakaa sille
                    turhia henkilötietojasi.
                  </p>

                  <p>
                    <strong>
                      2. Henkilötiedot poistetaan ennen käsittelyä:
                    </strong>{" "}
                    Duunify käy tekstisi automaattisesti läpi ennen sen
                    lähettämistä tekoälypalveluun. Järjestelmä tunnistaa ja
                    poistaa esimerkiksi nimen, sähköpostiosoitteen,
                    puhelinnumeron, osoitetiedot ja henkilötunnuksen. Näin
                    tekoäly voi keskistyä olennaiseen – osaamiseesi,
                    kokemukseesi ja hakemaasi työtehtävään – ilman tarpeettomia
                    henkilötietoja.
                  </p>

                  <p>
                    <strong>3. Sinä päätät, mitä käytät:</strong>{" "}
                    Työnhakuavustaja käyttää antamiasi tietoja ainoastaan
                    hakemuksen räätälöimiseen. Voit tarkistaa syntyneen
                    hakemuksen aina itse ennen sen käyttämistä.
                  </p>

                  <p>
                    <strong>4. Rakennettu yksityisyyttä ajatellen:</strong>{" "}
                    Henkilötietojen poistaminen tapahtuu Duunifyn omassa
                    käsittelyvaiheessa ennen kuin teksti siirtyy tekoälyn
                    käsiteltäväksi. Tämä on yksi tärkeimmistä tavoista, joilla
                    Duunify pyrkii suojaamaan käyttäjiensä yksityisyyttä.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition"
                  >
                    Selvä, sulje ikkuna
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DEMO BANNER */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">
                  Interaktiivinen Demoversio (Vaihe 2/3)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tarkastele valitun työpaikan tietoja ja siirry generointiin.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shrink-0"
            >
              Rekisteröidy tästä ➔
            </Link>
          </div>

          {/* STEP INDICATOR (VAIHE 2 AKTIIVISENA) */}
          <div className="mb-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm font-semibold">
              <Link
                href="/demo/job-assistant"
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span>1. Valitse työpaikka</span>
              </Link>

              <ChevronRight size={16} className="text-slate-400" />

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>2. Tarkista tiedot</span>
              </div>

              <ChevronRight size={16} className="text-slate-400" />

              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>3. Valmis hakemus</span>
              </div>
            </div>
          </div>

          {/* OMA SISÄINEN JOB HEADER */}
          <JobHeader
            job={job}
            failedLogo={failedLogo}
            onLogoError={() => setFailedLogo(true)}
          />

          {/* GRID: CONTENT + SIDEBAR INFO */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* VASEN OSUMA: LAAJA, SCROLLATTAVA KUVAUS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  Työpaikkailmoituksen kuvaus
                </h3>

                {/* Kiinteä korkeus max-h-80 & pystyscrollaus */}
                <div className="max-h-116 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.job_description}
                  </p>
                </div>
              </div>
            </div>

            {/* OIKEA OSUMA: HAKIJAPROFIILI & INFO SIDEBAR */}
            <div className="lg:col-span-5 space-y-6">
              {/* SIIRRETTY HAKIJAPROFIILI JA NÄYTETÄÄN KAIKKI OIKET IKONIT */}
              <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">
                      Käytettävä hakijaprofiili
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tekoäly käyttää näitä tietoja pohjana.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* CV OSUMA IKONEILLA */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937] flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          CV
                        </span>
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        CV_Matti_Meikalainen_2026.pdf
                      </p>
                    </div>

                    {/* OIKEAN VERSION TOIMINTO-IKONIT */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={showDemoNotice}
                        title="Katsele tiedostoa"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={showDemoNotice}
                        title="Vaihda tiedosto"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Upload size={15} />
                      </button>
                      <button
                        onClick={showDemoNotice}
                        title="Poista"
                        className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* HAKEMUSPOHJA OSUMA IKONEILLA */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937] flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Hakemuspohja
                        </span>
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        Saatekirjepohja_2026.pdf
                      </p>
                    </div>

                    {/* OIKEAN VERSION TOIMINTO-IKONIT */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={showDemoNotice}
                        title="Katsele tiedostoa"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={showDemoNotice}
                        title="Vaihda tiedosto"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Upload size={15} />
                      </button>
                      <button
                        onClick={showDemoNotice}
                        title="Poista"
                        className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEURAAVAKSI TAPAHTUU -LAATIKKO */}
              <section className="rounded-3xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/[0.06] p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-indigo-900 dark:text-indigo-300">
                      Mitä seuraavaksi tapahtuu?
                    </h2>
                    <p className="text-sm text-indigo-800/70 dark:text-indigo-200/70 mt-2 leading-relaxed">
                      Painamalla "Räätälöi saatekirje" Duunify AI yhdistää CV:si
                      sekä ilmoituksen vaatimukset räätälöidyksi kirjeeksi.
                    </p>
                  </div>
                </div>
              </section>

              {/* TIETOSUOJA-LAATIKKO (LISÄTTY INFO-IKONI OIKEAAN YLÄKULMAAN) */}
              <section className="relative rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06] p-6">
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  title="Tietosuojan lisätiedot"
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-200/50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-300/60 dark:hover:bg-emerald-500/40 transition cursor-pointer"
                >
                  <Info size={16} />
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-emerald-900 dark:text-emerald-300">
                      Tietosuoja taattu
                    </h2>
                    <p className="text-sm text-emerald-800/70 dark:text-emerald-200/70 mt-2 leading-relaxed">
                      Henkilötiedot anonymisoidaan automaattisesti ennen
                      tekoälylle lähettämistä.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}