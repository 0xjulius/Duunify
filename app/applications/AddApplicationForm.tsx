"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import LoginModal from "@/components/LoginModal";
import AddAttachment from "@/components/applications/AddAttachment";

const EMPLOYMENT_TYPE_FI: Record<string, string> = {
  FULL_TIME: "Kokoaikainen",
  PART_TIME: "Osa-aikainen",
  CONTRACTOR: "Toimeksiantaja",
  TEMPORARY: "Määräaikainen",
  INTERN: "Harjoittelija",
  VOLUNTEER: "Vapaaehtoinen",
  PER_DIEM: "Päivätyö",
  OTHER: "Muu",
};

export default function AddApplicationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Haettu");
  const [notes, setNotes] = useState("");
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  // New fields
  const [salaryMin, setSalaryMin] = useState<string>("");
  const [salaryMax, setSalaryMax] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<string>("");
  const [validThrough, setValidThrough] = useState<string>("");

  async function addHistory(
    userId: string,
    applicationId: string,
    event: string,
    oldValue?: string,
    newValue?: string,
  ) {
    await supabase.from("application_history").insert({
      user_id: userId,
      application_id: applicationId,
      event,
      old_value: oldValue ?? null,
      new_value: newValue ?? null,
    });
  }

  async function autofillFromUrl() {
    if (!user) {
      toast.error("Kirjaudu sisään", {
        description: "Kirjaudu sisään käyttääksesi automaattista hakua.",
      });
      setShowLoginModal(true);
      return;
    }
    if (loadingJob) return;

    if (!jobUrl) {
      toast.error("Anna työpaikkailmoituksen URL");
      return;
    }

    try {
      const parsed = new URL(jobUrl);

      const allowed = [
        "duunitori.fi",
        "www.duunitori.fi",
        "tyomarkkinatori.fi",
        "www.tyomarkkinatori.fi",
        "jobly.fi",
        "www.jobly.fi",
      ];

      if (!allowed.includes(parsed.hostname)) {
        toast.error("Tuettuja sivustoja ovat Duunitori ja Työmarkkinatori");
        return;
      }
    } catch {
      console.error(Error);
      toast.error(
        "Tietojen haku epäonnistui. Tarkista osoite, tai yritä uudelleen.",
      );
      return;
    }

    setLoadingJob(true);

    try {
      const response = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Kirjaudu sisään", {
            description:
              "Jatka kirjautumalla käyttääksesi automaattista hakua.",
          });
          setShowLoginModal(true);
          return;
        }

        toast.error("Virhe", {
          description: "Tapahtui odottamaton virhe. Yritä myöhemmin uudelleen.",
        });
        return;
      }

      if (data.company) setCompany(data.company);
      if (data.title) setJobTitle(data.title);
      if (data.location) setLocation(data.location);
      if (data.description) setJobDescription(data.description);
      if (data.salaryMin) setSalaryMin(String(data.salaryMin));
      if (data.salaryMax) setSalaryMax(String(data.salaryMax));
      if (data.employmentType) setEmploymentType(data.employmentType);
      if (data.validThrough) setValidThrough(data.validThrough.split("T")[0]);
    } catch (error) {
      console.log(error);
      toast.error("Tietojen haku epäonnistui");
    }

    setLoadingJob(false);
  }

  async function addApplication(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Et ole kirjautunut sisään.");
        setLoading(false);
        return;
      }

      // Kenttien pituusvalidioinnit
      if (company.length > 60)
        throw new Error("Yrityksen nimi liian pitkä, max 60 merkkiä");
      if (location.length > 60)
        throw new Error("Sijainti-kenttä liian pitkä, max 60 merkkiä");
      if (jobTitle.length > 150)
        throw new Error("Työtehtävä liian pitkä, max 150 merkkiä");
      if (notes.length > 5000)
        throw new Error("Liikaa muistiinpanoja, max 5000 merkkiä");
      if (jobDescription.length > 15000)
        throw new Error("Työpaikkakuvaus liian pitkä, max 15000 merkkiä");

      const minSalary = salaryMin ? Number(salaryMin) : null;
      const maxSalary = salaryMax ? Number(salaryMax) : null;

      if (minSalary && maxSalary && minSalary > maxSalary) {
        throw new Error("Minimipalkka ei voi olla suurempi kuin maksimipalkka");
      }
      if (salaryMin.length > 10 || salaryMax.length > 10) {
        throw new Error("Palkkakenttä liian pitkä, max 10 merkkiä");
      }

      let cvUrl = null;

      // 1. LIITETIEDOSTON LATAUS (Jos tiedosto on valittu)
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data: storageData, error: storageError } =
          await supabase.storage.from("attachments").upload(fileName, file);

        if (storageError) {
          throw new Error(
            `Tiedoston lataus epäonnistui: ${storageError.message}`,
          );
        }

        cvUrl = storageData.path;
      }

      // 2. HAKEMUKSEN TALLENNUS TIETOKANTAAN
      const { data, error: dbError } = await supabase
        .from("applications")
        .insert([
          {
            user_id: user.id,
            company,
            job_title: jobTitle,
            location,
            status,
            notes,
            applied_date: appliedDate,
            job_description: jobDescription,
            job_url: jobUrl,
            salary_min: minSalary,
            salary_max: maxSalary,
            employment_type: employmentType || null,
            valid_through: validThrough || null,
            cv_url: cvUrl,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. HISTORIAN TALLENNUS
      await addHistory(
        user.id,
        data.id,
        status === "Tallennettu"
          ? "Hakemus tallennettu luonnokseksi"
          : "Hakemus lähetetty",
        undefined,
        status,
      );

      toast.success("🎉 Hakemus tallennettu!", {
        description: `${company} • ${jobTitle}`,
      });

      // Lomakkeen resetointi
      setCompany("");
      setJobTitle("");
      setLocation("");
      setStatus("Haettu");
      setNotes("");
      setJobDescription("");
      setJobUrl("");
      setSalaryMin("");
      setSalaryMax("");
      setEmploymentType("");
      setValidThrough("");
      setFile(null);

      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Tapahtui virhe tallennuksessa.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
  const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

  return (
    <form
      onSubmit={addApplication}
      className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 w-full xl:w-4/5 xl:mx-auto"
    >
      <div className="flex">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Uusi mahdollisuus</h2>
          {/* Info-ikoni vihjetekstillä */}
        <div className="ml-2 group relative inline-block cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          {/* Pieni kupla joka ilmestyy päälle vietäessä */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-xl z-10 font-normal leading-relaxed pointer-events-none">
            <p className="font-semibold mb-1 text-slate-200">
              Automaattitäytön tuetut sivustot tällä hetkellä:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li>duunitori.fi</li>
              <li>jobly.fi</li>
            </ul>
            {/* Pieni nuoli kuplan alla */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Aloita liittämällä linkki automaattista täyttöä varten tai kirjaa tiedot itse.</p>
      </div>

      {/* URL AUTOFILL */}
      <div className="mb-6">
        <label className={labelStyle}>Hakuilmoituksen linkki</label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="https://duunitori.fi/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className={inputStyle}
          />
          <button
            type="button"
            onClick={autofillFromUrl}
            disabled={loadingJob || !jobUrl}
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:opacity-100 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2 shrink-0"
          >
            {loadingJob ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span>Täytetään...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Täytä tiedot automaattisesti</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Yritys *</label>
            <input
              type="text"
              placeholder="Esim. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Työtehtävä *</label>
            <input
              type="text"
              placeholder="Esim. Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Paikkakunta</label>
            <input
              type="text"
              placeholder="Helsinki / Etä"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Työsuhteen tyyppi</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="" className="dark:bg-slate-850">— Valitse —</option>
              {Object.entries(EMPLOYMENT_TYPE_FI).map(([val, label]) => (
                <option key={val} value={val} className="dark:bg-slate-850">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Hakupäivä</label>
            <input
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Hakemuksen tila</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${inputStyle} appearance-none cursor-pointer bg-pink-50/50 dark:bg-pink-950/20`}
            >
              <option className="dark:bg-slate-850">Tallennettu</option>
              <option className="dark:bg-slate-850">Haettu</option>
              <option className="dark:bg-slate-850">Haastattelu</option>
              <option className="dark:bg-slate-850">Hylätty</option>
              <option className="dark:bg-slate-850">Tarjous</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Haku päättyy</label>
            <input
              type="date"
              value={validThrough}
              onChange={(e) => setValidThrough(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Palkka (€ / kk)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                min={0}
                className={inputStyle}
              />
              <span className="text-slate-400 dark:text-slate-500 shrink-0">–</span>
              <input
                type="number"
                placeholder="Max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                min={0}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* NOTES — full width */}
        <div className="md:col-span-1">
          <label className={labelStyle}>Muistiinpanot, tai lisää liite:</label>
          <textarea
            placeholder="Palkkatoive, yhteyshenkilö..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputStyle} h-[150px] resize-none`}
          />
        </div>
        <div className="md:col-span-1">
          <AddAttachment
            notes={notes}
            setNotes={setNotes}
            file={file}
            setFile={setFile}
          />
        </div>

        {/* DESCRIPTION — full width */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Työpaikkakuvaus</label>
          <textarea
            placeholder="Kopioi tähän tärkeimmät asiat ilmoituksesta..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`${inputStyle} min-h-[150px]`}
          />
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);

            supabase.auth.getUser().then(({ data }) => {
              setUser(data.user);
            });
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Tallennetaan...
          </>
        ) : (
          "Tallenna hakemus"
        )}
      </button>
    </form>
  );
}