"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import DemoSidebar from "@/components/demo/DemoSidebar";
import LoginModal from "@/components/LoginModal";
import {
  Building2,
  Sparkles,
  Copy,
  Check,
  Download,
  ArrowLeft,
  Zap,
  ChevronRight,
  RefreshCw,
  FileText,
  User,
  ShieldAlert,
  Edit3,
} from "lucide-react";

// ==========================================
// 1. TYYPIT JA MOCK-DATA
// ==========================================
export type Application = {
  id: string;
  company: string;
  logo: string;
  job_title: string;
  location: string;
  applicant_name: string;
  generated_cover_letter: string;
};

const DEMO_JOBS: Record<string, Application> = {
  "demo-1": {
    id: "demo-1",
    job_title: "Senior Full Stack Developer",
    company: "RELEX Solutions",
    logo: "/demo-logos/relex.webp",
    location: "Helsinki",
    applicant_name: "Matti Meikäläinen",
    generated_cover_letter: `**Senior Full Stack Developer**

RELEX Solutions, Helsinki

Senior Full Stack Developerin tehtävässä yhdistyvät vahva tekninen suorituskyky ja liiketoimintalähtöinen ohjelmistokehitys. Tuon tiimiinne yli kahden vuosikymmenen aktiivisen tietoteknisen kokemuksen sekä kattavan ammattiosaamisen modernista web-kehityksestä, järjestelmäarkkitehtuureista ja rajapintaratkaisuista. Minulla on valmius ottaa välitön vastuu vaativien kokonaisuuksien rakentamisesta ja kehittää toimivia ratkaisuja työnantajan tavoitteiden mukaisesti.

## Koulutus
Tietojenkäsittelyn ja liiketoiminnan korkeakoulututkintoni tarjoaa vankan pohjan teknisten järjestelmien ja liiketoimintatarpeiden yhdistämiselle. Koulutukseni on kehittänyt kykyäni hahmottaa laajamittaisia järjestelmäarkkitehtuureja sekä optimoida ohjelmistoprosesseja työnantajan hyödyksi. Lisäksi olen syventänyt osaamistani jatkuvasti suorittamalla alaan liittyviä täydennyskoulutuksia sekä tekoälyyn, pilvipalveluihin ja ohjelmistokehitykseen keskittyviä teemaopintoja.

## Työkokemus ja käytännön osaaminen
Aiempi kokemukseni luovassa tuotantoympäristössä sekä järjestelmäasennusten ja laitteisto-ongelmien parissa on kartuttanut vahvan käytännön näkemyksen virheettömästä laadunvarmistuksesta ja järjestelmien toimintavarmuudesta. Olen vastannut tiedostojärjestelmien hallinnasta, dokumentoinnista ja teknisestä vianmäärityksestä, mikä takaa sen, että pystyn ehkäisemään suorituskykyongelmia jo kehitysvaiheessa. Kokemukseni ansiosta pystyn rakentamaan selkeitä, helppohoitoisia ja skaalautuvia web-sovelluksia sekä integraatioita.

## Miksi koen olevani sopiva tähän tehtävään?

- **Kattava Full Stack -osaaminen:** Hallitsen nykyaikaiset kehysrakenteet ja tietokantaratkaisut, minkä ansiosta pystyn toteuttamaan saumattomasti toimivia kokonaisuuksia käyttöliittymästä tietokantaan.

- **Syvällinen tekninen ymmärrys:** Yli kahden vuosikymmenen käytännön tietotekninen tausta takaa nopean kyvyn omaksua uusia teknologioita ja ratkaista monimutkaisia teknisiä haasteita.

- **Laadunvarmistus ja järjestelmällisyys:** Työhistoriani laadunvarmistuksen ja teknisen vianmäärityksen parissa varmistaa, että tuotettu koodi on toimintavarmaa, hyvin dokumentoitua ja ylläpidettävää.

- **Liiketoiminnan ja tekniikan synenergia:** IT- ja liiketoimintaosaamisen yhdistelmä auttaa minua ymmärtämään sovellusten vaikutuksen liiketoimintaan ja asiakaskokemukseen.

- **Jatkuva osaamisen kehittäminen:** Aktiivinen tekoälyyn ja pilvipalveluihin liittyvien teemaopintojen suorittaminen pitää teknisen tietämykseni aina alan tuoreimpien standardien tasolla.

- **Vahva ongelmanratkaisukyky:** Kokemukseni laitteisto- ja ohjelmisto-ongelmien ratkaisemisesta antaa valmiudet toimia tehokkaasti myös kriittisissä vikatilanteissa.

Sovellun tehtävään erinomaisesti, sillä yhdistän pitkän linjan teknisen harrastuneisuuden, kaupallisen koulutuksen sekä käytännön näytöt järjestelmätyöstä. Olen valmis tuomaan osaamiseni ja energiani heti osaksi tiiminne arkea. Tulen mielelläni haastatteluun keskustelemaan tarkemmin siitä, miten voin tukea projektienne menestystä.`,
  },
  "demo-2": {
    id: "demo-2",
    job_title: "AI Specialist & Automation Architect",
    company: "Futurice",
    logo: "/demo-logos/futurice.webp",
    location: "Tampere",
    applicant_name: "Matti Meikäläinen",
    generated_cover_letter: `**AI Specialist & Automation Architect**

Futurice, Tampere

AI Specialist & Automation Architectin rooli vaatii syvällistä ymmärrystä nykyaikaisista tekoälyratkaisuista ja prosessien automaatiosta. Tuon mukanani vahvan kokemuksen laajoista kielimalleista, työnkulkujen automatisoinnista sekä järjestelmien välisistä integraatioista. Pystyn suunnittelemaan ja toteuttamaan työnantajalle sekä tämän asiakkaille suorituskykyisiä ratkaisuja, jotka säästävät aikaa ja tehostavat toimintaa.

## Koulutus
Korkeakoulututkintoni tietojenkäsittelyn ja liiketoiminnan alalta tarjoaa erinomaisen pohjan digitaalisten prosessien kehittämiselle. Koulutus on vahvistanut kykyäni analysoida organisaatioiden prosesseja ja tunnistaa kohteita, joissa automaatiolla saavutetaan suurin liiketoiminnallinen hyöty. Tätä kokonaisuutta tukevat alaan liittyvät sertifikaatit sekä tekoälyyn ja pilvi-infrastruktuuriin keskittyvät teemaopinnot.

## Työkokemus ja käytännön osaaminen
Aiempi työkokemukseni IT-järjestelmien, laadunvarmistuksen ja teknisen vianmäärityksen parissa antaa vankan pohjan luotettavien automaatioputkien rakentamiselle. Olen työskennellyt luovassa ympäristössä halliten monimutkaisia tiedostojärjestelmiä ja prosessien dokumentointia. Tämä kokemus takaa sen, että rakentamani automaatiot ja kielimallien integraatiot ovat virheettömiä, tietoturvallisia ja helposti ylläpidettäviä.

## Miksi koen olevani sopiva tähän tehtävään?

- **Automaatio- ja tekoälyosaaminen:** Hallitsen nykyaikaiset automaatioalustat ja kielimallien soveltamisen, mikä mahdollistaa manuaalisten työvaiheiden tehokkaan eliminoinnin.

- **Vahva IT-infrastruktuurin hallinta:** Pitkäaikainen kokemus tietotekniikasta ja konttiteknologioista takaa kyvyn rakentaa vakaita ja tietoturvallisia automaatioratkaisuja.

- **Prosessien optimointitaito:** Kykyni analysoida ja dokumentoida työnkulkuja auttaa tunnistamaan pullonkaulat ja muuttamaan ne suheviksi automaatioiksi.

- **Kaupallinen ja tekninen ymmärrys:** Yhdistän teknisen toteutuskyvyn liiketoimintatavoitteisiin, mikä varmistaa automaatioprojektien korkean takaisinmaksuasteen.

- **Laadunvarmistus ja virheensieto:** Kokemus järjestelmätestauksesta ja vianmäärityksestä takaa, että luodut työnkulut toimivat luotettavasti myös poikkeustilanteissa.

- **Jatkuva teknologinen kehitys:** Ylläpidän osaamistani aktiivisesti tekoälyalan uusimpien teemaopintojen ja käytännön kokeilujen kautta.

Osaamiseni ja käytännön kokemukseni muodostavat vahvan kokonaisuuden, jolla pystyn tuottamaan välitöntä arvoa Futuricen automaatiohankkeissa. Olen erittäin motivoitunut tuomaan asiantuntemukseni tiiminne käyttöön. Olen käytettävissänne haastattelussa sovittavana ajankohtana.`,
  },
  "demo-3": {
    id: "demo-3",
    job_title: "Frontend Developer (React & Next.js)",
    company: "KONE",
    logo: "/demo-logos/kone.webp",
    location: "Espoo",
    applicant_name: "Matti Meikäläinen",
    generated_cover_letter: `**Frontend Developer (React & Next.js)**

KONE, Espoo

Frontend Developerin tehtävässä korostuvat tarkka visuaalinen silmä, nykyaikaisten verkkoteknologioiden hallinta ja erinomainen käyttäjäkokemuksen ymmärrys. Tuon mukanani vahvan osaamisen moderneista frontend-kehyksistä, pikselintarkasta tyylittelystä ja saavutettavien käyttöliittymien rakentamisesta. Pystyn muuttamaan suunnitelmat nopeiksi, toimiviksi ja helppokäyttöisiksi verkkosovelluksiksi.

## Koulutus
Visuaalisen muotoilun sekä tietojenkäsittelyn opintoni muodostavat ihanteellisen yhdistelmän käyttöliittymäkehitykseen. Tutkintotaustani kautta hallitsen sekä visuaalisen suunnittelun periaatteet että ohjelmistokehityksen vaatiman teknisen logiikan. Osaamistani täydentävät alan uusimpiin kehitysmenetelmiin ja verkkoteknologioihin syventyvät teemaopinnot.

## Työkokemus ja käytännön osaaminen
Kokemukseni luovasta tuotantoympäristöstä ja laadunvarmistuksesta on kehittänyt minusta erittäin tarkkuusorientoituneen kehittäjän. Olen tottunut huolehtimaan siitä, että sovellusten visuaalinen ilme ja toiminnallisuus vastaavat täsmällisesti määrittelyjä. Lisäksi vankka taustani laitteisto- ja ohjelmisto-ongelmien ratkaisemisesta takaa sen, että pystyn optimoimaan frontend-suorituskyvyn ja korjaamaan mahdolliset virhetilanteet tehokkaasti.

## Miksi koen olevani sopiva tähän tehtävään?

- **Vahva kehys- ja tyyliosaaaminen:** Hallitsen nykyaikaiset verkkokehitystyökalut, mikä mahdollistaa nopean ja laadukkaan käyttöliittymien toteutuksen.

- **Visuaalinen ja tekninen synenergia:** Muotoilutaustan ja koodausosaamisen yhdistelmä takaa sen, että toteutettavat käyttöliittymät ovat sekä visuaalisesti hiottuja että teknisesti kestäviä.

- **Pikselintarkka laadunvarmistus:** Kokemukseni laadunvalvonnasta varmistaa, että sovellusten ulkoasu ja animaatiot toimivat moitteettomasti kaikilla päätelaitteilla.

- **Suorituskykyoptiointi:** Ymmärrykseni web-standardeista ja vianmäärityksestä auttaa rakentamaan hakukoneystävällisiä ja nopeasti latautuvia sivustoja.

- **Järjestelmällinen työskentelyote:** Dokumentointi- ja tiedostojärjestelmäosaamiseni takaa, että komponenttikirjastot ja koodikanta pysyvät siisteinä ja reaktioherkkinä.

- **Aktiivinen uuden oppiminen:** Ylläpidän jatkuvasti tietämystäni alan parhaista käytännöistä ja työkaluista riippumattomien teemaopintojen avulla.

Sovellun tehtävään erinomaisesti, sillä yhdistän visuaalisen näkemyksen, teknisen toteutuskyvyn ja laadukkaan työn jäljen. Odotan innolla mahdollisuutta päästä näyttämään osaamiseni käytännössä. Tulen mielelläni haastatteluun esittelemään tarkemmin taustaani ja aiemmassa työssä saavutettuja tuloksia.`,
  },
};

// ==========================================
// 2. DOCUMENT HEADER -KOMPONENTTI
// ==========================================
interface DocumentHeaderProps {
  isEditing: boolean;
  fullName: string;
  city: string;
  phone: string;
  email: string;
  onFullNameChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onEmailChange: (val: string) => void;
}

export function DocumentHeader({
  isEditing,
  fullName,
  city,
  phone,
  email,
  onFullNameChange,
  onCityChange,
  onPhoneChange,
  onEmailChange,
}: DocumentHeaderProps) {
  return (
    <header className="grid grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 print:border-b-0 print:pb-6 print:mb-6 text-sm text-slate-700 dark:text-slate-300 print:text-black print:text-[12pt]">
      <div className="space-y-0.5">
        {isEditing ? (
          <div className="space-y-2 print:hidden">
            <input
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Etunimi Sukunimi"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Paikkakunta"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="Puhelinnumero"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Sähköposti"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        ) : null}

        <div className={isEditing ? "print:block hidden" : "block"}>
          <p className="font-bold text-slate-900 dark:text-white print:text-black">
            {fullName || "Etunimi Sukunimi"}
          </p>
          <p>{city || "Paikkakunta"}</p>
          <p>{phone || "Puhelinnumero"}</p>
          <p>{email || "Sähköposti"}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between pl-[120px]">
        <p className="font-bold text-slate-900 dark:text-white print:text-black">
          Saatekirje
        </p>
        <p className="mt-auto">{new Date().toLocaleDateString("fi-FI")}</p>
      </div>

      <div className="text-right font-bold">
        <p>1 (2)</p>
      </div>
    </header>
  );
}

// ==========================================
// 3. PÄÄSIVUKOMPONENTTI
// ==========================================
export default function DemoJobResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = DEMO_JOBS[id] || DEMO_JOBS["demo-1"];

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [demoNotice, setDemoNotice] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Yhteystiedot
  const [fullName] = useState(job.applicant_name);
  const [city] = useState("Helsinki");
  const [phone] = useState("+358 40 123 4567");
  const [email] = useState("matti.meikalainen@example.com");

  // Simuloidaan tekoälyn generointia
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(job.generated_cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showDemoNotice = () => {
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <DemoSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* YLÄTUNNISTE (HEADER) */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#1F2937] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Duunify AI – Hakemuseditori</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Räätälöity työhakemus</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <User size={14} className="text-indigo-500" />
              <span>Hakija: {fullName}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
            >
              Tallenna tilille
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* DEMO NOTICE POPUP */}
          {demoNotice && (
            <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 animate-bounce text-xs">
              <ShieldAlert size={16} />
              <span>Tämä on demoversio – PDF-lataus edellyttää kirjautumista.</span>
            </div>
          )}

          {/* DEMO BANNER */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Interaktiivinen Demoversio (Vaihe 3/3)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tekoäly on analysoinut ilmoituksen ja luonut täsmällisen, sääntöjen mukaisen hakemuksen.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shrink-0 cursor-pointer"
            >
              Luo tili ja aloita käyttö ➔
            </button>
          </div>

          {/* STEP INDICATOR */}
          <div className="mb-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm font-semibold">
              <Link
                href="/demo/job-assistant"
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className="hidden sm:inline">1. Valitse työpaikka</span>
                <span className="sm:hidden">1. Valitse</span>
              </Link>

              <ChevronRight size={16} className="text-slate-400" />

              <Link
                href={`/demo/job-assistant/${job.id}`}
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className="hidden sm:inline">2. Tarkista tiedot</span>
                <span className="sm:hidden">2. Tarkista</span>
              </Link>

              <ChevronRight size={16} className="text-slate-400" />

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span className="hidden sm:inline">3. Valmis hakemus</span>
                <span className="sm:hidden">3. Valmis</span>
              </div>
            </div>
          </div>

          {/* TAKAISIN LINKKI */}
          <div className="mb-6">
            <Link
              href={`/demo/job-assistant/${job.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
            >
              <ArrowLeft size={16} />
              Takaisin työpaikan tietoihin
            </Link>
          </div>

          {/* MAIN CARD / TULOSKORTTI */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl shadow-sm overflow-hidden">
            
            {/* CARD HEADER WITH DEMO LOGO */}
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#1F2937] bg-slate-50/50 dark:bg-[#0B0F19]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 shrink-0 shadow-sm overflow-hidden">
                  {!logoError ? (
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-full h-full object-contain rounded-lg"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Building2 size={24} className="text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{job.job_title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <Building2 size={14} />
                    {job.company} • Generoitu työhakemus
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {!isGenerating && (
                <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  <button
                    disabled
                    title="Ylätunnisteen muokkaus ei ole käytössä tässä näkymässä"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 text-xs font-semibold cursor-not-allowed opacity-75"
                  >
                    <Edit3 size={14} />
                    <span>Muokkaa ylätunnistetta</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-emerald-500" />
                        <span>Kopioitu!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Kopioi</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={showDemoNotice}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Lataa PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* SISÄLTÖ: GENERATIO LATAA TAI VALMIS TEKSTI */}
            <div className="p-6 sm:p-10">
              {isGenerating ? (
                <div className="py-16 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 animate-spin mb-2">
                    <RefreshCw size={28} />
                  </div>
                  <h3 className="text-lg font-bold">Generoidaan hakemusta sääntöjen mukaisesti...</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Asetetaan otsikoita, tarkistetaan kieliasua ja muotoillaan vaadittu 6 kohdan soveltuvuuslista.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="flex items-center gap-1.5">
                      <FileText size={15} className="text-indigo-600" />
                      Rakenne: Ylätunniste, Aloitus, Johdanto, Koulutus, Työkokemus, Soveltuvuus (6x listalla), Lopetus
                    </span>
                    <span>Täyttää laatuvaatimukset ✓</span>
                  </div>

                  {/* ASIAKIRJA-ALUE (DOCUMENT PREVIEW) */}
                  <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-[#1F2937] rounded-2xl p-6 sm:p-10 font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200 shadow-inner">
                    
                    {/* DOKUMENTIN YLÄTUNNISTE (EI-MUOKATTAVA TILA) */}
                    <DocumentHeader
                      isEditing={false}
                      fullName={fullName}
                      city={city}
                      phone={phone}
                      email={email}
                      onFullNameChange={() => {}}
                      onCityChange={() => {}}
                      onPhoneChange={() => {}}
                      onEmailChange={() => {}}
                    />

                    {/* DOKUMENTIN SISÄLTÖ (MARKDOWN RENDERÖINTI) */}
                    <ReactMarkdown
                      components={{
                        h2: ({ ...props }) => (
                          <h2
                            className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 border-b border-slate-200 dark:border-slate-800 pb-1"
                            {...props}
                          />
                        ),
                        p: ({ ...props }) => (
                          <p className="mb-4 leading-relaxed" {...props} />
                        ),
                        ul: ({ ...props }) => (
                          <ul className="space-y-2 my-4 list-disc pl-5" {...props} />
                        ),
                        li: ({ ...props }) => (
                          <li className="leading-relaxed" {...props} />
                        ),
                        strong: ({ ...props }) => (
                          <strong
                            className="font-bold text-slate-900 dark:text-slate-100"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {job.generated_cover_letter}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="p-6 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Haluatko luoda rajattomasti uusia työpaikkakohtaisia hakemuksia?
              </p>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer"
              >
                Rekisteröidy ja ota käyttöön ➔
              </button>
            </div>

            {/* LOGIN / REGISTER MODAL */}
            {isLoginOpen && (
              <LoginModal
                key={isLoginOpen ? "open" : "closed"}
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}