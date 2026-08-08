"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

type JobDetail = {
  id: string;
  job_title: string;
  company: string;
  location?: string;
  description?: string;
  full_description?: string;
  cover_letter?: string;
  generated_letter?: string;
  full_name?: string;
  city?: string;
  phone?: string;
  email?: string;
};

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDataAndGenerate() {
      setLoading(true);
      setError(null);

      try {
        // 1. Haetaan kirjautunut käyttäjä
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // 2. Haetaan käyttäjän profiili
        let profileData = null;
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, location, phone_number, email")
            .eq("id", user.id)
            .maybeSingle();

          if (profileError) console.error("Virhe profiilin haussa:", profileError);
          else profileData = profile;
        }

        // 3. Haetaan työpaikan tiedot `applications`-taulusta
        const { data: jobData, error: jobError } = await supabase
          .from("applications")
          .select("*")
          .eq("id", jobId)
          .single();

        if (jobError || !jobData) {
          console.error("Virhe työpaikan haussa:", jobError);
          setError("Työpaikan tietoja ei löytynyt tietokannasta.");
          setLoading(false);
          return;
        }

        const combinedData: JobDetail = {
          ...jobData,
          full_name: profileData?.full_name || "Etunimi Sukunimi",
          city: profileData?.location || jobData.location || "Paikkakunta",
          phone: profileData?.phone_number || "Puhelinnumero",
          email: profileData?.email || user?.email || "Sähköposti",
        };

        setJob(combinedData);
        setLoading(false);

        // 4. Tarkistetaan onko saatekirje jo olemassa. Jos ei, generoidaan automaattisesti!
        const existingLetter = jobData.cover_letter || jobData.generated_letter;
        if (existingLetter) {
          setGeneratedLetter(existingLetter);
        } else {
          await generateLetterWithGemini(combinedData);
        }
      } catch (err: any) {
        console.error("Alustusvirhe:", err);
        setError("Tietojen lataaminen epäonnistui.");
        setLoading(false);
      }
    }

    if (jobId) {
      loadDataAndGenerate();
    }
  }, [jobId]);

  // Geminin kutsu (voidaan ajaa automaattisesti tai manuaalisesti "Luo uudelleen" -napista)
  async function generateLetterWithGemini(currentJob: JobDetail) {
    setGenerating(true);
    setError(null);

    const mockUserBaseCoverLetter = `Olen kokenut ja kehityshaluinen järjestelmä- ja IT-asiantuntija, jolla on vahva tausta nykyaikaisista verkkoteknologioista, pilvipalveluista sekä järjestelmäarkkitehtuureista. Nautin monimutkaisten teknisten haasteiden ratkomisesta, prosessien automatisoinnista ja laadukkaasta dokumentoinnista. Minulla on erinomaiset yhteistyö- ja asiakaspalvelutaidot.`;

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: currentJob.job_title,
          company: currentJob.company,
          jobDescription:
            currentJob.full_description || currentJob.description || "",
          userBaseCoverLetter: mockUserBaseCoverLetter,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generointi epäonnistui.");
      }

      const letterResult = data.coverLetter || data.letter || data.text;

      if (letterResult) {
        setGeneratedLetter(letterResult);

        // Tallennetaan uusi kirje myös tietokantaan
        await supabase
          .from("applications")
          .update({ cover_letter: letterResult })
          .eq("id", currentJob.id);
      } else {
        throw new Error("API ei palauttanut tekstiä.");
      }
    } catch (e: any) {
      console.error("Generointivirhe:", e);
      setError(e.message || "Saatekirjeen luominen epäonnistui.");
    } finally {
      setGenerating(false);
    }
  }

  async function copyLetter() {
    if (!generatedLetter) return;
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Ladataan tietoja...</p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h1 className="text-xl font-bold">Jokin meni pieleen</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error || "Tietoja ei saatu ladattua."}
          </p>
          <Link
            href="/job-assistant"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
          >
            <ArrowLeft size={16} />
            Palaa työnhakuavustajaan
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          article,
          article * {
            visibility: visible;
          }
          article {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/job-assistant"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Takaisin työnhakuavustajaan
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <Sparkles size={16} className="text-indigo-500" />
            Duunify AI
          </div>
        </div>

        <section className="mb-8 print:hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={26} />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Saatekirje
              </p>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hakemuksesi saatekirje
              </h1>
            </div>
          </div>
        </section>

        {/* Job card */}
        <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-5 sm:p-6 mb-6 shadow-sm print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold">
                {job?.company?.charAt(0)}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Työpaikka
                </p>

                <h2 className="font-bold text-lg">{job?.job_title}</h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {job?.company} {job?.location ? `· ${job.location}` : ""}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 print:block">
          <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none print:bg-transparent">
            <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-5 border-b border-slate-200 dark:border-[#1F2937] print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="font-bold">Saatekirje</h2>
                </div>
              </div>

              <button
                onClick={copyLetter}
                disabled={generating || !generatedLetter}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1F2937] hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={16} />
                    Kopioitu
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="hidden sm:inline">Kopioi</span>
                  </>
                )}
              </button>
            </div>

            {/* Asiakirjan tulostettava osio */}
            <article className="px-6 sm:px-10 py-8 sm:py-10 print:p-0 print:m-0 print:text-black">
              {/* Standardin mukainen Ylätunniste */}
              <header className="grid grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 print:border-b-0 print:pb-6 print:mb-6 text-sm text-slate-700 dark:text-slate-300 print:text-black print:text-[10pt]">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white print:text-black">
                    {job?.full_name || "Etunimi Sukunimi"}
                  </p>
                  <p>{job?.city || "Paikkakunta"}</p>
                  <p>{job?.phone || "Puhelinnumero"}</p>
                  <p>{job?.email || "Sähköposti"}</p>
                </div>

                <div className="flex flex-col justify-between pl-[120px]">
                  <p className="font-bold text-slate-900 dark:text-white print:text-black">
                    Saatekirje
                  </p>
                  <p className="mt-auto">
                    {new Date().toLocaleDateString("fi-FI")}
                  </p>
                </div>

                <div className="text-right font-bold">
                  <p>1 (2)</p>
                </div>
              </header>

              {generating ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-indigo-600" />
                  <p className="text-sm font-medium">Generoidaan saatekirjettä Geminillä...</p>
                </div>
              ) : generatedLetter ? (
                <div className="max-w-2xl mx-auto space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300 print:text-black print:text-[11pt] print:leading-[1.4] print:font-sans [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:print:text-black [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:print:text-black [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:print:text-black [&_h3]:mt-4 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_strong]:print:text-black [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4">
                  <ReactMarkdown>{generatedLetter}</ReactMarkdown>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">Ei saatekirjettä saatavilla.</p>
                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                  <button
                    onClick={() => job && generateLetterWithGemini(job)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                  >
                    <Sparkles size={16} />
                    Yritä uudelleen AI:lla
                  </button>
                </div>
              )}
            </article>

            {/* Actions */}
            <div className="border-t border-slate-200 dark:border-[#1F2937] px-5 sm:px-7 py-5 flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                onClick={copyLetter}
                disabled={generating || !generatedLetter}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
              >
                <Copy size={18} />
                {copied ? "Kopioitu!" : "Kopioi saatekirje"}
              </button>

              <button
                onClick={() => window.print()}
                disabled={generating || !generatedLetter}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-[#1F2937] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition disabled:opacity-50"
              >
                <Download size={18} />
                Tulosta / Lataa PDF
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6 print:hidden">
            <button
              onClick={() => job && generateLetterWithGemini(job)}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={generating ? "animate-spin" : ""}
              />
              {generating ? "Luodaan..." : "Luo uusi versio Geminillä"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}