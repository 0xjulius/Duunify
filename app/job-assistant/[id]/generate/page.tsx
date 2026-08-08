"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Building2,
  Check,
  Copy,
  FileText,
  Loader2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  User,
  CheckCircle2,
  Sliders,
} from "lucide-react";

type Application = {
  id: string;
  job_title: string;
  company: string;
  location?: string;
  job_description?: string;
  notes?: string;
};

type UserProfile = {
  cv_filename?: string;
  letter_filename?: string;
};

export default function GenerateCoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<Application | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // 1. Haetaan työpaikka
        const { data: jobData, error: jobError } = await supabase
          .from("applications")
          .select("*")
          .eq("id", jobId)
          .single();

        if (jobError || !jobData) {
          console.error("Virhe työpaikan haussa:", jobError);
          setError("Työpaikkaa ei löytynyt tietokannasta.");
          setLoading(false);
          return;
        }

        setJob(jobData);

        // 2. Haetaan käyttäjän tallennetut tiedostot profiilista
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("cv_filename, letter_filename")
            .eq("id", user.id)
            .maybeSingle();

          if (profileData) {
            setProfile(profileData);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Latausvirhe:", err);
        setError("Tietojen lataaminen epäonnistui.");
        setLoading(false);
      }
    }

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const handleGenerate = async () => {
    if (!job) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.job_title,
          company: job.company,
          jobDescription: job.job_description || job.notes || "",
          customInstructions: customInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error("Generointi epäonnistui.");
      }

      const data = await response.json();
      setGeneratedLetter(data.letter || data.text || "");
    } catch (err: any) {
      console.error("Generointivirhe:", err);
      setError("Saatekirjeen luominen epäonnistui. Yritä uudelleen.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Valmistellaan yhteenvetoa...</p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h1 className="text-xl font-bold mb-2">Jokin meni pieleen</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/job-assistant"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* BACK */}
        <Link
          href={`/job-assistant/${jobId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-8"
        >
          <ArrowLeft size={17} />
          Takaisin vaiheeseen 2
        </Link>

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Saatekirjeen generointi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tarkista yhteenveto alle kootuista lähtötiedoista ennen tekstin luomista.
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Generoinnin yhteenveto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TARGET JOB */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Kohde</span>
              </div>
              <p className="font-bold text-base">{job?.job_title}</p>
              <p className="text-sm text-slate-500">{job?.company} {job?.location ? `• ${job.location}` : ""}</p>
            </div>

            {/* SOURCE DOCUMENTS */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Käytettävät asiakirjat</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="truncate">{profile?.cv_filename || "Profiilin CV"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="truncate">{profile?.letter_filename || "Profiilin saatekirjepohja"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADDITIONAL INSTRUCTIONS */}
          {!generatedLetter && (
            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Sliders size={15} className="text-indigo-600" />
                Haluatko antaa tekoälylle lisäohjeita? (Valinnainen)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Esim. Painota erityisesti projektinhallintakokemustani tai kirjoita rennommalla äänensävyllä..."
                className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none h-20"
              />
            </div>
          )}
        </div>

        {/* GENERATION / RESULTS AREA */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm">
          {!generatedLetter && !generating && (
            <div className="text-center py-6">
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base transition shadow-xl shadow-indigo-600/25"
              >
                <Sparkles size={20} />
                Generoi saatekirje Geminillä
              </button>
            </div>
          )}

          {generating && (
            <div className="text-center py-12">
              <Loader2 size={40} className="animate-spin text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-1">Räätälöidään saatekirjettä...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Gemini analysoi työn vaatimuksia ja yhdistää ne profiiliisi.
              </p>
            </div>
          )}

          {generatedLetter && !generating && (
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-[#1F2937]">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Sparkles size={18} className="text-indigo-600" />
                  Valmis valmis saatekirje
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <RefreshCw size={14} />
                    Generoi uudelleen
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-md"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Kopioitu!" : "Kopioi teksti"}
                  </button>
                </div>
              </div>

              <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                {generatedLetter}
              </div>
            </div>
          )}

          {error && generatedLetter && (
            <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
          )}
        </div>

      </div>
    </main>
  );
}