"use client";

import { useRef, useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Loader2,
  Check,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Eye,
} from "lucide-react";
import AvatarUpload from "@/components/settings/AvatarUpload";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const menuItems = [
  { id: "profiili", name: "Profiili", icon: User },
  { id: "asiakirjat", name: "Omat asiakirjat", icon: FileText },
  { id: "tili", name: "Tili ja kirjautuminen", icon: Lock },
  { id: "ilmoitukset", name: "Ilmoitukset", icon: Bell },
];

type UserDocument = {
  name: string;
  updated: string;
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

export default function SettingsClient({
  userId,
  fullName: initialFullName,
  email,
  avatarUrl,
  phone: initialPhone,
  location: initialLocation,
  isEmailConfirmed,
}: {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  location: string;
  isEmailConfirmed: boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState("profiili");

  // Profiilikentät
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone || "");
  const [location, setLocation] = useState(initialLocation || "");

  // Asiakirjojen tilat
  const [cvDoc, setCvDoc] = useState<UserDocument | null>(null);
  const [coverLetterDoc, setCoverLetterDoc] = useState<UserDocument | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingLetter, setUploadingLetter] = useState(false);
  const [deletingType, setDeletingType] = useState<"cv" | "letter" | null>(null);
  const [viewingType, setViewingType] = useState<"cv" | "letter" | null>(null);

  // Ilmoitusasetusten tilat
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Yleiset tilat
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Haetaan asiakirjat ja ilmoitusasetukset profiilista sivun latautuessa
  useEffect(() => {
    async function loadProfileData() {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "cv_filename, cv_updated_at, letter_filename, letter_updated_at, notifications_enabled, email_notifications"
        )
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        if (
          profile.notifications_enabled !== undefined &&
          profile.notifications_enabled !== null
        ) {
          setNotificationsEnabled(profile.notifications_enabled);
        }
        if (
          profile.email_notifications !== undefined &&
          profile.email_notifications !== null
        ) {
          setEmailNotifications(profile.email_notifications);
        }

        if (profile.cv_filename) {
          setCvDoc({
            name: profile.cv_filename,
            updated: profile.cv_updated_at
              ? `Päivitetty ${new Date(profile.cv_updated_at).toLocaleDateString("fi-FI")}`
              : "Aktiivinen",
          });
        }

        if (profile.letter_filename) {
          setCoverLetterDoc({
            name: profile.letter_filename,
            updated: profile.letter_updated_at
              ? `Päivitetty ${new Date(profile.letter_updated_at).toLocaleDateString("fi-FI")}`
              : "Aktiivinen",
          });
        }
      }
    }

    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  function scrollTo(id: string) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Ilmoitusasetusten päivitys tietokantaan
  const handleToggleNotification = async (
    key: "notifications_enabled" | "email_notifications",
    newValue: boolean
  ) => {
    if (key === "notifications_enabled") setNotificationsEnabled(newValue);
    if (key === "email_notifications") setEmailNotifications(newValue);

    setSavingNotifs(true);
    await supabase
      .from("profiles")
      .update({ [key]: newValue })
      .eq("id", userId);
    setSavingNotifs(false);
  };

  const handleFileView = async (type: "cv" | "letter") => {
    const doc = type === "cv" ? cvDoc : coverLetterDoc;
    if (!doc) return;

    setViewingType(type);
    try {
      const storagePath = `${userId}/${type}_${doc.name}`;
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 60);

      if (error || !data?.signedUrl) {
        throw error || new Error("Linkin luonti epäonnistui");
      }

      window.open(data.signedUrl, "_blank");
    } catch (err: any) {
      console.error(`Virhe tiedoston (${type}) avaamisessa:`, err);
      alert("Tiedoston avaaminen epäonnistui. Yritä uudelleen.");
    } finally {
      setViewingType(null);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "letter"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 250 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      alert(
        `Tiedosto on liian suuri (${(file.size / 1024).toFixed(0)} KB). Tiedoston maksimikoko on 250 KB.`
      );
      e.target.value = "";
      return;
    }

    if (type === "cv") setUploadingCv(true);
    else setUploadingLetter(true);

    try {
      const safeName = sanitizeFileName(file.name);
      const storagePath = `${userId}/${type}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        console.warn("Storage-lataus epäonnistui:", uploadError);
      }

      const now = new Date().toISOString();

      const updates =
        type === "cv"
          ? { cv_filename: safeName, cv_updated_at: now }
          : { letter_filename: safeName, letter_updated_at: now };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (profileError) throw profileError;

      const updatedDoc = {
        name: safeName,
        updated: `Päivitetty ${new Date().toLocaleDateString("fi-FI")}`,
      };

      if (type === "cv") setCvDoc(updatedDoc);
      else setCoverLetterDoc(updatedDoc);

      router.refresh();
    } catch (err: any) {
      console.error(`Virhe tiedoston (${type}) latauksessa:`, err);
      alert("Tiedoston lataus epäonnistui. Yritä uudelleen.");
    } finally {
      if (type === "cv") setUploadingCv(false);
      else setUploadingLetter(false);
      e.target.value = "";
    }
  };

  const handleFileDelete = async (type: "cv" | "letter") => {
    const docToDelete = type === "cv" ? cvDoc : coverLetterDoc;
    if (!docToDelete) return;

    if (
      !confirm(`Haluatko varmasti poistaa tiedoston "${docToDelete.name}"?`)
    ) {
      return;
    }

    setDeletingType(type);

    try {
      const storagePath = `${userId}/${type}_${docToDelete.name}`;
      await supabase.storage.from("documents").remove([storagePath]);

      const updates =
        type === "cv"
          ? { cv_filename: null, cv_updated_at: null }
          : { letter_filename: null, letter_updated_at: null };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (profileError) throw profileError;

      if (type === "cv") setCvDoc(null);
      else setCoverLetterDoc(null);

      router.refresh();
    } catch (err: any) {
      console.error(`Virhe tiedoston (${type}) poistossa:`, err);
      alert("Poisto epäonnistui. Yritä uudelleen.");
    } finally {
      setDeletingType(null);
    }
  };

  const handleResendVerification = async () => {
    setVerifying(true);
    setVerifyStatus(null);

    const { error } = await supabase.auth.updateUser(
      { email: email },
      {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      }
    );

    setVerifying(false);

    if (error) {
      setVerifyStatus({
        type: "error",
        message: `Lähetys epäonnistui: ${error.message}`,
      });
      return;
    }

    setVerifyStatus({
      type: "success",
      message: "Vahvistuslinkki lähetetty sähköpostiisi!",
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const trimmedFullName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedLocation = location.trim();

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: trimmedFullName,
        phone: trimmedPhone,
        location: trimmedLocation,
      },
    });

    if (authError) {
      setStatus({
        type: "error",
        message: `Virhe Auth-tiedoissa: ${authError.message}`,
      });
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: trimmedFullName,
        phone_number: trimmedPhone,
        location: trimmedLocation,
      })
      .eq("id", userId);

    if (profileError) {
      setStatus({
        type: "error",
        message: `Virhe profiilin tallennuksessa: ${profileError.message}`,
      });
      setLoading(false);
      return;
    }

    // Tunnistetaan mitä kenttiä muutettiin
    const changedFields: string[] = [];
    if (trimmedFullName !== initialFullName) changedFields.push("nimi");
    if (trimmedPhone !== (initialPhone || "")) changedFields.push("puhelinnumero");
    if (trimmedLocation !== (initialLocation || "")) changedFields.push("sijainti");

    // Rakennetaan viesti sen mukaan, mitä muutettiin
    const messageText =
      changedFields.length > 0
        ? `Päivitetyt tiedot: ${changedFields.join(", ")}.`
        : "Profiilitietosi tallennettiin onnistuneesti.";

    // Luodaan reaaliaikainen ilmoitus tietokantaan
    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Profiili päivitetty",
      message: messageText,
      type: "success",
    });

    setStatus({
      type: "success",
      message: "Muutokset tallennettu onnistuneesti!",
    });
    setLoading(false);
    router.refresh();
  };

  const isChanged =
    fullName !== initialFullName ||
    phone !== (initialPhone || "") ||
    location !== (initialLocation || "");

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Asetukset
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Hallitse tiliäsi ja muokkaa asetuksiasi.
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* SIVUPALKIN VALINTANAPIT */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-1 md:sticky md:top-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active === item.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <item.icon size={18} /> {item.name}
                </button>
              ))}
            </aside>

            <div className="flex-1 w-full space-y-6">
              {/* PROFIILI */}
              <section
                id="profiili"
                ref={(el) => {
                  sectionRefs.current["profiili"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-slate-100">
                  Profiilitiedot
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Muokkaa yhteystietojasi ja profiilikuvaasi.
                </p>
                <div className="flex flex-col md:flex-row gap-8">
                  <AvatarUpload
                    userId={userId}
                    initialUrl={avatarUrl}
                    onUploaded={() => {}}
                  />
                  <div className="flex-1">
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="settings-name"
                            className="block text-xs text-slate-400 dark:text-slate-500 mb-1"
                          >
                            Nimi
                          </label>
                          <input
                            id="settings-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            maxLength={50}
                            disabled={loading}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              Sähköposti
                            </p>
                            {isEmailConfirmed ? (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Vahvistettu
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                Ei vahvistettu
                              </span>
                            )}
                          </div>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 cursor-not-allowed text-sm font-medium"
                          />

                          {!isEmailConfirmed && (
                            <div className="mt-2">
                              <button
                                type="button"
                                disabled={verifying}
                                onClick={handleResendVerification}
                                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
                              >
                                {verifying ? (
                                  <>
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                    Lähetetään linkkiä...
                                  </>
                                ) : (
                                  "Lähetä vahvistuslinkki uudelleen"
                                )}
                              </button>

                              {verifyStatus && (
                                <p
                                  className={`text-[11px] mt-1 font-medium ${
                                    verifyStatus.type === "success"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {verifyStatus.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="settings-phone"
                            className="block text-xs text-slate-400 dark:text-slate-500 mb-1"
                          >
                            Puhelinnumero
                          </label>
                          <input
                            id="settings-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                            placeholder="Ei puhelinnumeroa"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="settings-location"
                            className="block text-xs text-slate-400 dark:text-slate-500 mb-1"
                          >
                            Sijainti
                          </label>
                          <input
                            id="settings-location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={loading}
                            placeholder="Ei sijaintia"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-50 text-sm font-medium"
                          />
                        </div>
                      </div>

                      {status && (
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            status.type === "success"
                              ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {status.type === "success" && <Check size={14} />}
                          <span>{status.message}</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading || !fullName.trim() || !isChanged}
                          className="px-5 py-2.5 rounded-xl text-white text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Tallennetaan...
                            </>
                          ) : (
                            "Tallenna muutokset"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>

              {/* ASIAKIRJAT */}
              <section
                id="asiakirjat"
                ref={(el) => {
                  sectionRefs.current["asiakirjat"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-slate-100">
                  Omat asiakirjat
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Lataa ansioluettelosi (CV) ja yleinen saatekirjepohjasi
                  tekoälyavustajaa varten. Maks. koko 250 KB / tiedosto.
                </p>

                <div className="space-y-4">
                  {/* CV LATAUS JA NÄYTTÖ */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        {uploadingCv || deletingType === "cv" ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-indigo-600"
                          />
                        ) : (
                          <FileText size={18} className="text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                          {cvDoc?.name || "Ei ladattua CV:tä"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {cvDoc?.updated ||
                            "Lataa CV (.pdf, .doc, .docx, .txt)"}
                        </p>
                      </div>

                      {cvDoc && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-500 shrink-0 sm:hidden"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        {cvDoc && (
                          <button
                            type="button"
                            onClick={() => handleFileView("cv")}
                            disabled={viewingType === "cv"}
                            title="Katso tiedosto"
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            {viewingType === "cv" ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        )}

                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
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
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {cvDoc && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-500 shrink-0 hidden sm:block ml-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* SAATEKIRJE LATAUS JA NÄYTTÖ */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        {uploadingLetter || deletingType === "letter" ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-indigo-600"
                          />
                        ) : (
                          <FileText size={18} className="text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                          {coverLetterDoc?.name || "Ei ladattua pohjaa"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {coverLetterDoc?.updated ||
                            "Lataa saatekirjepohja (.pdf, .doc, .docx, .txt)"}
                        </p>
                      </div>

                      {coverLetterDoc && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-500 shrink-0 sm:hidden"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        {coverLetterDoc && (
                          <button
                            type="button"
                            onClick={() => handleFileView("letter")}
                            disabled={viewingType === "letter"}
                            title="Katso tiedosto"
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            {viewingType === "letter" ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        )}

                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                          <Upload size={13} />
                          <span>{coverLetterDoc ? "Vaihda" : "Lataa"}</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "letter")}
                            disabled={
                              uploadingLetter || deletingType === "letter"
                            }
                          />
                        </label>

                        {coverLetterDoc && (
                          <button
                            type="button"
                            onClick={() => handleFileDelete("letter")}
                            disabled={deletingType === "letter"}
                            title="Poista pohja"
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {coverLetterDoc && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-500 shrink-0 hidden sm:block ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* TILI */}
              <section
                id="tili"
                ref={(el) => {
                  sectionRefs.current["tili"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <h2 className="font-bold text-lg mb-1 text-slate-900 dark:text-slate-100">
                  Tili ja kirjautuminen
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Vaihda salasanasi tarvittaessa.
                </p>
                <PasswordChangeForm />
              </section>

              {/* ILMOITUKSET */}
              <section
                id="ilmoitukset"
                ref={(el) => {
                  sectionRefs.current["ilmoitukset"] = el;
                }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-8 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    Ilmoitukset
                  </h2>
                  {savingNotifs && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" />{" "}
                      Tallennetaan...
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Valitse, mitä ilmoituksia haluat vastaanottaa sovelluksessa ja
                  sähköpostitse.
                </p>

                <div className="space-y-4">
                  {/* Sovelluksen sisäiset ilmoitukset */}
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Sovelluksen sisäiset ilmoitukset
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Näytä ilmoitukset yläpalkin kellossa (esim.
                        haastattelukutsut ja tekoälytehtävät).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleNotification(
                          "notifications_enabled",
                          !notificationsEnabled
                        )
                      }
                      className={`w-11 h-6 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${
                        notificationsEnabled
                          ? "bg-indigo-600 dark:bg-indigo-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white dark:bg-slate-100 rounded-full shadow-sm transition-transform duration-200 ${
                          notificationsEnabled
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Sähköposti-ilmoitukset */}
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Sähköposti-ilmoitukset
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Lähetä tärkeistä päivityksistä ja muistutuksista viesti
                        sähköpostiin.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleNotification(
                          "email_notifications",
                          !emailNotifications
                        )
                      }
                      className={`w-11 h-6 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${
                        emailNotifications
                          ? "bg-indigo-600 dark:bg-indigo-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white dark:bg-slate-100 rounded-full shadow-sm transition-transform duration-200 ${
                          emailNotifications ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
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