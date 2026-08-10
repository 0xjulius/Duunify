"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  Sparkles,
  Target,
  WandSparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Upload,
  Trash2,
} from "lucide-react";

type Application = {
  id: string;
  company: string;
  job_title: string;
  location?: string;
  employment_type?: string;
  notes?: string;
  job_description?: string;
  job_url?: string;
};

type UserDocument = {
  name: string;
  updated: string;
};

// Apufunktio tiedostonimen siivoamiseen (estää Supabasen "Invalid key" -virheet)
function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Poistaa skandit (ä -> a, ö -> o)
    .replace(/\s+/g, "_") // Korvaa välilyönnit alaviivoilla
    .replace(/[^a-zA-Z0-9._-]/g, ""); // Poistaa muut erikoismerkit
}

export default function JobAssistantJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<Application | null>(null);
  const [cvDoc, setCvDoc] = useState<UserDocument | null>(null);
  const [coverLetterDoc, setCoverLetterDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lataustilat tiedostojen uppaukselle ja poistolle
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingLetter, setUploadingLetter] = useState(false);
  const [deletingType, setDeletingType] = useState<"cv" | "letter" | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Haetaan hakemus applications-taulusta
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

        setJob(jobData);

        // Haetaan asiakirjat käyttäjän profiilista (vain olemassa olevat sarakkeet)
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("cv_filename, cv_updated_at, letter_filename, letter_updated_at")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.cv_filename) {
            setCvDoc({
              name: profile.cv_filename,
              updated: profile.cv_updated_at
                ? `Päivitetty ${new Date(profile.cv_updated_at).toLocaleDateString("fi-FI")}`
                : "Aktiivinen",
            });
          }

          if (profile?.letter_filename) {
            setCoverLetterDoc({
              name: profile.letter_filename,
              updated: profile.letter_updated_at
                ? `Päivitetty ${new Date(profile.letter_updated_at).toLocaleDateString("fi-FI")}`
                : "Aktiivinen",
            });
          }
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Alustusvirhe:", err);
        setError("Tietojen lataaminen epäonnistui.");
        setLoading(false);
      }
    }

    if (jobId) {
      loadData();
    }
  }, [jobId]);

  // Tiedoston latausfunktio (rajoitus: max 250 KB)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "letter"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 250 * 1024; // 250 KB

    if (file.size > MAX_FILE_SIZE) {
      alert(`Tiedosto on liian suuri (${(file.size / 1024).toFixed(0)} KB). Tiedoston maksimikoko on 250 KB.`);
      e.target.value = "";
      return;
    }

    if (type === "cv") setUploadingCv(true);
    else setUploadingLetter(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Käyttäjä ei ole kirjautunut sisään.");

      // Puhdistetaan tiedostonimi (esim. "letter_Matti Meikäläinen.pdf" -> "letter_Matti_Meikalainen.pdf")
      const safeName = sanitizeFileName(file.name);
      const storagePath = `${user.id}/${type}_${safeName}`;

      // 1. Ladataan puhdistettu tiedosto Supabase Storageen ('documents'-bucket)
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        console.warn("Storage-lataus epäonnistui:", uploadError);
      }

      const now = new Date().toISOString();

      // 2. Päivitetään profiilitiedot tietokantaan puhdistetulla nimellä
      const updates =
        type === "cv"
          ? { cv_filename: safeName, cv_updated_at: now }
          : { letter_filename: safeName, letter_updated_at: now };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 3. Päivitetään näkymä
      const updatedDoc = {
        name: safeName,
        updated: `Päivitetty ${new Date().toLocaleDateString("fi-FI")}`,
      };

      if (type === "cv") setCvDoc(updatedDoc);
      else setCoverLetterDoc(updatedDoc);
    } catch (err: any) {
      console.error(`Virhe tiedoston (${type}) latauksessa:`, err);
      alert("Tiedoston lataus epäonnistui. Yritä uudelleen.");
    } finally {
      if (type === "cv") setUploadingCv(false);
      else setUploadingLetter(false);
      e.target.value = "";
    }
  };

  // Tiedoston poistofunktio
  const handleFileDelete = async (type: "cv" | "letter") => {
    const docToDelete = type === "cv" ? cvDoc : coverLetterDoc;
    if (!docToDelete) return;

    if (!confirm(`Haluatko varmasti poistaa tiedoston "${docToDelete.name}"?`)) {
      return;
    }

    setDeletingType(type);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Käyttäjä ei ole kirjautunut sisään.");

      // 1. Poistetaan tiedosto Storagesta puhdistetulla nimellä
      const storagePath = `${user.id}/${type}_${docToDelete.name}`;
      await supabase.storage.from("documents").remove([storagePath]);

      // 2. Tyhjennetään profiilimerkinnät tietokannasta
      const updates =
        type === "cv"
          ? { cv_filename: null, cv_updated_at: null }
          : { letter_filename: null, letter_updated_at: null };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 3. Nollataan tila
      if (type === "cv") setCvDoc(null);
      else setCoverLetterDoc(null);
    } catch (err: any) {
      console.error(`Virhe tiedoston (${type}) poistossa:`, err);
      alert("Poisto epäonnistui. Yritä uudelleen.");
    } finally {
      setDeletingType(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Ladataan työpaikan tietoja...</p>
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
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* BACK */}
          <Link
            href="/job-assistant"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-6"
          >
            <ArrowLeft size={17} />
            Takaisin työpaikkoihin
          </Link>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-3 mb-8">
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

            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              Tarkista asiakirjat
            </div>

            <ChevronRight
              size={16}
              className="text-slate-300 dark:text-slate-700"
            />

            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 text-sm">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                3
              </div>
              Luo saatekirje
            </div>
          </div>

          {/* JOB HEADER & CTA */}
          <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Building2
                    size={26}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                    Valittu työpaikka
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {job?.job_title}
                  </h1>

                  <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    {job?.company}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
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

                    {job?.job_url && (
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
                  href={`/job-assistant/${job?.id}/result`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
                >
                  <Sparkles size={18} />
                  Räätälöi saatekirje
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </section>

          {/* TWO COLUMN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6">
            
            {/* JOB DESCRIPTION */}
            <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 sm:px-8 py-5 border-b border-slate-200 dark:border-[#1F2937]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Briefcase size={18} className="text-slate-500" />
                  </div>

                  <div>
                    <h2 className="font-bold">Työpaikkailmoitus</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tätä ilmoitusta käytetään räätälöinnin pohjana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {job?.notes && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {job.notes}
                  </p>
                )}

                <div className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 max-h-[500px] overflow-y-auto pr-2">
                  {job?.job_description || "Ei tarkempaa kuvausta saatavilla."}
                </div>
              </div>
            </section>

            {/* DOCUMENTS */}
            <div className="space-y-6">
              <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                      <FileText
                        size={18}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold">Omat asiakirjat</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Maks. koko 250 KB / tiedosto
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {/* CV UPLOAD & DISPLAY */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {uploadingCv || deletingType === "cv" ? (
                        <Loader2 size={18} className="animate-spin text-indigo-600" />
                      ) : (
                        <FileText size={18} className="text-slate-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {cvDoc?.name || "Ei ladattua CV:tä"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cvDoc?.updated || "Lataa CV (maks. 250 KB)"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                        <Upload size={13} />
                        <span>{cvDoc ? "Vaihda" : "Lataa"}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "cv")}
                          disabled={uploadingCv || deletingType === "cv"}
                        />
                      </label>

                      {cvDoc && (
                        <button
                          type="button"
                          onClick={() => handleFileDelete("cv")}
                          disabled={deletingType === "cv"}
                          title="Poista CV"
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {cvDoc && (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
                    )}
                  </div>

                  {/* COVER LETTER UPLOAD & DISPLAY */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {uploadingLetter || deletingType === "letter" ? (
                        <Loader2 size={18} className="animate-spin text-indigo-600" />
                      ) : (
                        <FileText size={18} className="text-slate-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {coverLetterDoc?.name || "Ei ladattua pohjaa"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {coverLetterDoc?.updated || "Lataa pohja (maks. 250 KB)"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                        <Upload size={13} />
                        <span>{coverLetterDoc ? "Vaihda" : "Lataa"}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "letter")}
                          disabled={uploadingLetter || deletingType === "letter"}
                        />
                      </label>

                      {coverLetterDoc && (
                        <button
                          type="button"
                          onClick={() => handleFileDelete("letter")}
                          disabled={deletingType === "letter"}
                          title="Poista pohja"
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {coverLetterDoc && (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* AI PREVIEW */}
              <section className="rounded-3xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/[0.06] p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-indigo-900 dark:text-indigo-300">
                      Mitä Duunify tekee?
                    </h2>

                    <p className="text-sm text-indigo-800/70 dark:text-indigo-200/70 mt-2 leading-relaxed">
                      Duunify analysoi työpaikkailmoituksen ja vertaa sitä CV:si
                      sekä nykyisen saatekirjeesi sisältöön.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex gap-3 text-sm">
                    <Target
                      size={17}
                      className="text-indigo-500 mt-0.5 shrink-0"
                    />
                    <span className="text-indigo-900/80 dark:text-indigo-200/80">
                      Tunnistaa työpaikan tärkeimmät vaatimukset.
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <WandSparkles
                      size={17}
                      className="text-indigo-500 mt-0.5 shrink-0"
                    />
                    <span className="text-indigo-900/80 dark:text-indigo-200/80">
                      Korostaa kokemustasi, joka sopii juuri tähän tehtävään.
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <FileText
                      size={17}
                      className="text-indigo-500 mt-0.5 shrink-0"
                    />
                    <span className="text-indigo-900/80 dark:text-indigo-200/80">
                      Säilyttää saatekirjeesi persoonallisen tyylin.
                    </span>
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