"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: any;
  isDemo?: boolean;
  onUpdate?: () => void;
};

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

  useEffect(() => {
    if (open && app) {
      setCurrentCvUrl(app.cv_url || null);
    }
  }, [open, app]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl !w-[90vw] !max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        {/* Yläpalkki */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-slate-900">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 p-2">
            {app.company}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <X size={18} />
            </Button>
          </DialogClose>
        </div>

        {/* Scrollautuva sisältö */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                {app.job_title}
              </h2>
              <div className="flex flex-wrap gap-3 mt-4 text-slate-500 dark:text-slate-400 text-sm">
                <Badge variant="secondary" className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {app.status || "Haettu"}
                </Badge>

                {app.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {app.location}
                  </span>
                )}

                {app.applied_date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />{" "}
                    {new Date(app.applied_date).toLocaleDateString("fi-FI")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {app.job_url && (
                <a
                  href={app.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline w-fit"
                >
                  <LinkIcon size={16} /> Avaa työpaikkailmoitus
                </a>
              )}
              {app.valid_through && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock size={16} />
                  <span>
                    Päättyy:{" "}
                    {new Date(app.valid_through).toLocaleDateString("fi-FI")}
                  </span>
                </div>
              )}
            </div>

            {/* LIITETIEDOSTO-OSIO */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <Paperclip size={18} /> Liitetiedostot
              </h3>

              {currentCvUrl ? (
                downloadUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 max-w-md">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 truncate mr-4">
                      <FileText
                        size={16}
                        className="text-slate-400 dark:text-slate-500 flex-shrink-0"
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
                        className="gap-1.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={14} />
                          Avaa
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 h-9 w-9 p-0"
                        onClick={deleteAttachment}
                        disabled={deleting || isDemo}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">
                    Luodaan suojattua linkkiä...
                  </p>
                )
              ) : isDemo ? (
                <div className="max-w-md p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                  <p className="text-md text-indigo-500 dark:text-indigo-400 font-medium ">
                    tyohakemus_yritys.pdf <span className="text-slate-500 dark:text-slate-400 ml-1">(225KB)</span>
                  </p>
                </div>
              ) : (
                <div className="max-w-md">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={20} className="text-slate-400 dark:text-slate-500 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {uploading
                          ? "Ladataan..."
                          : "Klikkaa tästä lisätäksesi liite (esim. CV)"}
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

            {/* MUISTIINPANOT-OSIO */}
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <FileText size={18} /> Muistiinpanot
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {app.notes || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Ei muistiinpanoja
                  </span>
                )}
              </div>
            </div>

            {/* TYÖPAIKKAKUVAUS */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Työpaikkakuvaus</h3>
              <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm pt-2">
                {app.job_description || "Ei kuvausta saatavilla."}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}