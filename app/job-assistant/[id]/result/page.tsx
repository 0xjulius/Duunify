"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  Pencil,
  Trash2,
  MapPin,
  ExternalLink,
} from "lucide-react";

type JobDetail = {
  id: string;
  job_title: string;
  company: string;
  location?: string;
  employment_type?: string;
  job_url?: string;
  job_description?: string;
  cover_letter?: string;
  full_name?: string;
  city?: string;
  phone?: string;
  email?: string;
};

function CoverLetterSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
      </div>

      <div className="space-y-2.5 pt-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[92%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[96%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[85%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/5"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[88%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[94%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[75%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/5"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mt-2 shrink-0"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[90%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Estetään tuplakutsut Strict Moden aiheuttamasta tupla-useEffectistä
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    async function loadDataAndGenerate() {
      // Jos pyyntö on jo tehty tai käynnissä, ei tehdä sitä uudestaan
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let profileData = null;
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select(
              "full_name, location, phone_number, email, letter_filename, cv_filename"
            )
            .eq("id", user.id)
            .maybeSingle();

          if (profileError)
            console.error("Virhe profiilin haussa:", profileError);
          else profileData = profile;
        }

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

        const fullName = profileData?.full_name || "Etunimi Sukunimi";
        const city = profileData?.location || "Paikkakunta";
        const phone = profileData?.phone_number || "Puhelinnumero";
        const email = profileData?.email || user?.email || "Sähköposti";

        const combinedData: JobDetail = {
          ...jobData,
          full_name: fullName,
          city,
          phone,
          email,
        };

        setJob(combinedData);
        setEditFullName(fullName);
        setEditCity(city);
        setEditPhone(phone);
        setEditEmail(email);
        setLoading(false);

        const existingLetter = jobData.cover_letter;
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

  async function generateLetterWithGemini(currentJob: JobDetail) {
    setGenerating(true);
    setError(null);
    setGeneratedLetter("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let letterFilename = null;
    let cvFilename = null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("letter_filename, cv_filename")
        .eq("id", user.id)
        .maybeSingle();

      letterFilename = profile?.letter_filename;
      cvFilename = profile?.cv_filename;
    }

    const { error: clearError } = await supabase
      .from("applications")
      .update({ cover_letter: null })
      .eq("id", currentJob.id);

    if (clearError) {
      console.error(
        "Vanhan kirjeen poisto epäonnistui tietokannasta:",
        clearError
      );
    }

    try {
      const jobLocation =
        currentJob.location || currentJob.city || "Paikkakunta";

      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: currentJob.job_title,
          company: currentJob.company,
          location: jobLocation,
          jobDescription: currentJob.job_description || "",
          userId: user?.id,
          cvFilename: cvFilename,
          letterFilename: letterFilename,
          userName: currentJob.full_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generointi epäonnistui.");
      }

      const letterResult = data.coverLetter || data.letter || data.text;

      if (letterResult) {
        setGeneratedLetter(letterResult);

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

  async function deleteCoverLetter() {
    if (!job) return;

    const confirmDelete = window.confirm(
      "Haluatko varmasti poistaa tämän saatekirjeen tietokannasta?"
    );
    if (!confirmDelete) return;

    setGenerating(true);
    setError(null);

    try {
      setGeneratedLetter("");

      const { error: deleteError } = await supabase
        .from("applications")
        .update({ cover_letter: null })
        .eq("id", job.id);

      if (deleteError) {
        throw deleteError;
      }
    } catch (err: any) {
      console.error("Poistovirhe:", err);
      setError("Saatekirjeen poistaminen tietokannasta epäonnistui.");
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
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Ladataan tietoja...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-xl mx-auto text-center">
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
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          article,
          article * {
            visibility: visible;
            color: black !important;
          }
          article {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
          article h1,
          article h2,
          article h3 {
            break-inside: avoid;
          }
        }
      `}</style>

      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 print:p-0">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Link
              href={`/job-assistant/${job?.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              <ArrowLeft size={18} />
              Takaisin asiakirjojen tarkistukseen
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <Sparkles size={16} className="text-indigo-500" />
              Duunify AI
            </div>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-3 mb-8 print:hidden">
            <Link
              href="/job-assistant"
              className="flex items-center gap-2 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                1
              </div>
              Valitse työpaikka
            </Link>

            <ChevronRight
              size={16}
              className="text-slate-300 dark:text-slate-700"
            />

            <Link
              href={`/job-assistant/${job?.id}`}
              className="flex items-center gap-2 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                2
              </div>
              Tarkista asiakirjat
            </Link>

            <ChevronRight
              size={16}
              className="text-slate-300 dark:text-slate-700"
            />

            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              Luo saatekirje
            </div>
          </div>

          {/* HAKEMUKSESI SAATEKIRJE - LOHKO */}
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

          {/* JOB HEADER */}
          <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-6 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Building2
                    size={26}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Valittu työpaikka
                  </p>

                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {job?.job_title}
                  </h2>

                  <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    {job?.company}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {job?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} />
                        {job.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <Briefcase size={15} />
                      {job?.employment_type || "Kokoaikainen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* LINKKI TYÖPAIKKAAN */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <Link
                  href={`/job-assistant/${job?.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition"
                >
                  Avaa työpaikan tiedot
                </Link>

                {job?.job_url && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold transition"
                  >
                    Alkuperäinen ilmoitus
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6 print:block">
            {/* DOKUMENTTIKORTTI */}
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
              </div>

              <article className="px-6 sm:px-10 py-8 sm:py-10 print:p-0 print:m-0 print:text-black font-[Helvetica,Arial,sans-serif]">
                <header className="grid grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 print:border-b-0 print:pb-6 print:mb-6 text-sm text-slate-700 dark:text-slate-300 print:text-black print:text-[12pt]">
                  <div className="space-y-0.5">
                    {isEditingHeader ? (
                      <div className="space-y-2 print:hidden">
                        <input
                          type="text"
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          placeholder="Etunimi Sukunimi"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="Paikkakunta"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Puhelinnumero"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="Sähköposti"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    ) : null}
                    <div
                      className={
                        isEditingHeader ? "print:block hidden" : "block"
                      }
                    >
                      <p className="font-bold text-slate-900 dark:text-white print:text-black">
                        {editFullName || "Etunimi Sukunimi"}
                      </p>
                      <p>{editCity || "Paikkakunta"}</p>
                      <p>{editPhone || "Puhelinnumero"}</p>
                      <p>{editEmail || "Sähköposti"}</p>
                    </div>
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
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-8 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 py-2 px-4 rounded-full w-fit mx-auto animate-pulse">
                      <Sparkles size={14} className="animate-spin" />
                      <span>Tekoäly laatii saatekirjettä...</span>
                    </div>

                    <CoverLetterSkeleton />
                  </div>
                ) : generatedLetter ? (
                  <div className="max-w-2xl mx-auto space-y-6 text-base leading-relaxed text-slate-700 dark:text-slate-300 print:text-black print:text-[12pt] print:leading-[1.5] print:font-[Helvetica,Arial,sans-serif] [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:print:text-black [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:print:text-black [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:print:text-black [&_h3]:mt-4 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_strong]:print:text-black [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, children, ...props }) => {
                          const text = String(children);
                          const isTarget = text
                            .toLowerCase()
                            .includes("miksi koen");
                          return (
                            <h2
                              {...props}
                              style={
                                isTarget
                                  ? {
                                      breakBefore: "page",
                                      pageBreakBefore: "always",
                                    }
                                  : undefined
                              }
                            >
                              {children}
                            </h2>
                          );
                        },
                        h3: ({ node, children, ...props }) => {
                          const text = String(children);
                          const isTarget = text
                            .toLowerCase()
                            .includes("miksi koen");
                          return (
                            <h3
                              {...props}
                              style={
                                isTarget
                                  ? {
                                      breakBefore: "page",
                                      pageBreakBefore: "always",
                                    }
                                  : undefined
                              }
                            >
                              {children}
                            </h3>
                          );
                        },
                      }}
                    >
                      {generatedLetter}
                    </ReactMarkdown>

                    <div className="pt-2 mt-4">
                      <p className="m-0 p-0 leading-tight text-slate-700 dark:text-slate-300 print:text-black">
                        Ystävällisin terveisin,
                        <br />
                        <strong className="font-semibold text-slate-900 dark:text-white print:text-black">
                          {editFullName || "Etunimi Sukunimi"},{" "}
                          {editCity || "Paikkakunta"}
                        </strong>
                        <br />
                        {editPhone || "Puhelinnumero"}
                        <br />
                        {editEmail || "Sähköposti"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">Ei saatekirjettä saatavilla.</p>
                    {error && (
                      <p className="text-xs text-red-500 mt-2">{error}</p>
                    )}
                    <button
                      onClick={() => job && generateLetterWithGemini(job)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
                    >
                      <Sparkles size={16} />
                      Yritä uudelleen AI:lla
                    </button>
                  </div>
                )}
              </article>
            </section>

            {/* SIVUPANEELI */}
            <aside className="space-y-3 pb-12 sm:pb-0 print:hidden">
              <button
                onClick={copyLetter}
                disabled={generating || !generatedLetter}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 shadow-sm"
              >
                <Copy size={17} />
                {copied ? "Kopioitu!" : "Kopioi saatekirje"}
              </button>

              <button
                onClick={() => window.print()}
                disabled={generating || !generatedLetter}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition disabled:opacity-50 shadow-sm"
              >
                <Download size={17} />
                Tulosta / Lataa PDF
              </button>

              <button
                onClick={() => job && generateLetterWithGemini(job)}
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition disabled:opacity-50 shadow-sm"
              >
                <RefreshCw
                  size={17}
                  className={generating ? "animate-spin" : ""}
                />
                {generating ? "Luodaan..." : "Luo uusi versio Geminillä"}
              </button>

              <button
                onClick={() => setIsEditingHeader(!isEditingHeader)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition shadow-sm"
              >
                <Pencil size={17} />
                {isEditingHeader ? "Sulje muokkaus" : "Muokkaa ylätunnistetta"}
              </button>

              <button
                onClick={deleteCoverLetter}
                disabled={generating || !generatedLetter}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <Trash2 size={17} />
                Poista saatekirje
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}