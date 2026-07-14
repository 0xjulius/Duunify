"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/applications/CompanyLogo";
import ApplicationHistory, {
  HistoryItem,
} from "@/components/applications/ApplicationHistory";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  FileText,
  X,
  Clock,
  Paperclip,
  Download,
  Trash2,
  Upload,
  Coins,
  Briefcase,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: any;
  isDemo?: boolean;
  onUpdate?: () => void;
};

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

// Yhtenäinen päivämäärän ja kellonajan muotoilu
const formatDateTime = (dateVal?: string | Date) => {
  if (!dateVal) return "";
  try {
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return "";

    const pvm = date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const klo = date.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${pvm} klo ${klo}`;
  } catch (e) {
    return "";
  }
};

function formatDialogSalary(
  min?: number | null,
  max?: number | null,
): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => n.toLocaleString("fi-FI") + " €";
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `alkaen ${fmt(min)}`;
  if (max) return `enintään ${fmt(max)}`;
  return null;
}

function DialogMetaChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
      {icon}
      {children}
    </span>
  );
}

export default function ApplicationDialog({
  open,
  onOpenChange,
  app,
  onUpdate,
  isDemo = false,
}: Props) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Tila dynaamiselle tilahistorialle
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- SWIPE TO CLOSE LOGIIKKA ---
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchCurrentX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.targetTouches[0].clientX;
    touchCurrentX.current = currentX;

    const diffX = currentX - touchStartX.current;
    if (diffX > 0) {
      setTranslateX(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const swipeDistance = touchCurrentX.current - touchStartX.current;
    if (swipeDistance > 80) {
      onOpenChange(false);
    }
    setTranslateX(0);
  };

  useEffect(() => {
    if (!open) {
      setTranslateX(0);
    }
  }, [open]);
  // -------------------------------

  useEffect(() => {
    if (open && app) {
      setCurrentCvUrl(app.cv_url || null);
    }
  }, [open, app]);

  // Haetaan historiatapahtumat tietokannasta, kun modal aukeaa
  useEffect(() => {
    async function fetchHistory() {
      if (!open || !app?.id || isDemo) return;
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("application_history")
          .select(
            "id, event_type, old_status, new_status, description, created_at",
          )
          .eq("application_id", app.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Muutetaan null-kuvaukset tyhjiksi merkkijonoiksi, jotta ne vastaavat HistoryItem-tyyppiä
        const mappedData: HistoryItem[] = (data || []).map((item) => ({
          ...item,
          description: item.description || "",
        }));

        setHistory(mappedData);
      } catch (err) {
        console.error("Virhe historian latauksessa:", err);
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchHistory();
  }, [open, app?.id, isDemo]);

  useEffect(() => {
    async function getSignedUrl() {
      if (!currentCvUrl) {
        setDownloadUrl(null);
        return;
      }

      try {
        const { data, error } = await supabase.storage
          .from("attachments")
          .createSignedUrl(currentCvUrl, 3600);

        if (error) {
          console.error("Virhe suojatun linkin luonnissa:", error);
          setDownloadUrl(null);
        } else if (data) {
          setDownloadUrl(data.signedUrl);
        }
      } catch (err) {
        console.error(err);
        setDownloadUrl(null);
      }
    }

    if (open) {
      if (currentCvUrl) {
        getSignedUrl();
      } else {
        setDownloadUrl(null);
      }
    }
  }, [currentCvUrl, open]);

  if (!app) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || uploading) return;

    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Et ole kirjautunut sisään.");

      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("attachments")
        .upload(fileName, selectedFile);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("applications")
        .update({ cv_url: storageData.path })
        .eq("id", app.id);

      if (dbError) throw dbError;

      toast.success("Liitetiedosto lisätty onnistuneesti!");
      setCurrentCvUrl(storageData.path);

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Lataus epäonnistui: " + (error.message || "Tuntematon virhe"),
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteAttachment() {
    if (!currentCvUrl || deleting) return;

    if (!confirm("Haluatko varmasti poistaa tämän liitetiedoston?")) return;

    setDeleting(true);
    try {
      const { error: storageError } = await supabase.storage
        .from("attachments")
        .remove([currentCvUrl]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("applications")
        .update({ cv_url: null })
        .eq("id", app.id);

      if (dbError) throw dbError;

      toast.success("Liitetiedosto poistettu");
      setCurrentCvUrl(null);
      setDownloadUrl(null);

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Poisto epäonnistui: " + (error.message || "Tuntematon virhe"),
      );
    } finally {
      setDeleting(false);
    }
  }

  const salary = formatDialogSalary(app.salary_min, app.salary_max);
  const employmentLabel = app.employment_type
    ? (EMPLOYMENT_TYPE_FI[app.employment_type] ?? app.employment_type)
    : null;

  // Haetaan hakuajankohta historiasta: etsitään ensimmäinen tapahtuma, jossa tila muuttui muotoon "Haettu"
  const appliedEvent = history.find((h) => h.new_status === "Haettu");
  const actualAppliedDate = appliedEvent
    ? appliedEvent.created_at
    : app.applied_date || app.created_at;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          left: translateX > 0 ? `calc(50% + ${translateX}px)` : "50%",
          transition: isSwiping
            ? "none"
            : "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="!max-w-3xl !w-[95vw] md:!w-[90vw] h-auto max-h-[85vh] md:max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl select-none"
      >
        {/* Sulkunappi */}
        <div className="absolute top-4 right-4 z-20">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <X size={18} />
            </Button>
          </DialogClose>
        </div>

        {/* Sisältöalue */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 flex flex-col text-left">
          {/* YLÄOSIO: Otsikot ja Tila-rivitys */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 shrink-0 flex items-center justify-center">
                  <CompanyLogo
                    logo={app.company_logo || app.logo}
                    company={app.company || "Yritys"}
                  />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 truncate">
                    {app.company}
                  </DialogTitle>
                  <h2 className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 mt-1 truncate">
                    {app.job_title}
                  </h2>
                </div>
              </div>

              {/* VÄRIKOODATTU STATUS JA LINKKI */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${
                    app.status === "Tallennettu"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                      : app.status === "Haettu"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30"
                        : app.status === "Haastattelu"
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30"
                          : app.status === "Hylätty"
                            ? "bg-slate-100 text-slate-700 border-slate-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
                            : app.status === "Tarjous"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                  }`}
                >
                  {app.status === "Tarjous"
                    ? "🎉 Työtarjous saatu"
                    : app.status || "Haettu"}
                </span>

                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
                  >
                    <LinkIcon size={14} /> Avaa ilmoitus
                  </a>
                )}
              </div>
            </div>

            {/* VAAKASUUNTAINEN METATIETORIVI (Harmaat sirut) */}
            <div className="flex flex-wrap gap-2 pt-1">
              {app.location && (
                <DialogMetaChip icon={<MapPin size={14} />}>
                  {app.location}
                </DialogMetaChip>
              )}

              {employmentLabel && (
                <DialogMetaChip icon={<Briefcase size={14} />}>
                  {employmentLabel}
                </DialogMetaChip>
              )}

              {salary && (
                <DialogMetaChip icon={<Coins size={14} />}>
                  {salary}
                </DialogMetaChip>
              )}

              {/* TÄSMÄÄVÄ AIKA: Haettu-ajankohta luetaan historiasta tai dynaamisesta tallenteesta */}
              {actualAppliedDate && (
                <DialogMetaChip icon={<Calendar size={14} />}>
                  Haettu {formatDateTime(actualAppliedDate)}
                </DialogMetaChip>
              )}

              {app.valid_through && (
                <DialogMetaChip icon={<Clock size={14} />}>
                  Päättyy {formatDateTime(app.valid_through)}
                </DialogMetaChip>
              )}
            </div>
          </div>

          {/* RINNAKKAIN DESKTOPILLA: Liitteet & Muistiinpanot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            {/* LIITETIEDOSTOT */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <Paperclip size={16} className="text-slate-400" />{" "}
                Liitetiedostot
              </h3>

              {currentCvUrl ? (
                downloadUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 w-full">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 truncate mr-4">
                      <FileText
                        size={16}
                        className="text-slate-400 flex-shrink-0"
                      />
                      <span className="truncate">
                        {currentCvUrl.split("/").pop()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
                      >
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={12} /> Avaa
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 p-0"
                        onClick={deleteAttachment}
                        disabled={deleting || isDemo}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 animate-pulse">
                    Luodaan suojattua linkkiä...
                  </p>
                )
              ) : isDemo ? (
                <div className="w-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                  <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">
                    tyohakemus_yritys.pdf{" "}
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      (225KB)
                    </span>
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-all">
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[180px]">
                        {uploading
                          ? "Ladataan..."
                          : "Klikkaa tästä lisätäksesi liite"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* MUISTIINPANOT */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <FileText size={16} className="text-slate-400" /> Muistiinpanot
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 text-sm h-24 overflow-y-auto">
                {app.notes || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Ei muistiinpanoja
                  </span>
                )}
              </div>
            </div>
          </div>

{/* VÄLILEHDET: TYÖPAIKKAKUVAUS & REKRYTOINNIN ETENEMINEN */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl mb-6 group-data-horizontal/tabs:h-auto py-1 items-center">
                <TabsTrigger 
                  value="description"
                  className="rounded-lg text-xs md:text-sm font-medium py-2 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                >
                  Työpaikkakuvaus
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="rounded-lg text-xs md:text-sm font-medium py-2 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                >
                  Rekrytoinnin eteneminen {!isDemo && history.length > 0 && `(${history.length})`}
                </TabsTrigger>
              </TabsList>

              {/* Sisältö: Työpaikkakuvaus (Ei erillistä rullausta, antaa dialogin rullata) */}
              <TabsContent
                value="description"
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-xs md:text-sm pt-1">
                  {app.job_description || "Ei kuvausta saatavilla."}
                </div>
              </TabsContent>

              {/* Sisältö: Rekrytoinnin eteneminen */}
              <TabsContent
                value="history"
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="pt-1">
                  {isDemo ? (
                    <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400 italic">
                      Demotilassa ei seurata tila-historiaa.
                    </div>
                  ) : loadingHistory ? (
                    <div className="text-center py-8 text-sm text-slate-400 animate-pulse">
                      Ladataan historiaa...
                    </div>
                  ) : (
                    <ApplicationHistory history={history} />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}