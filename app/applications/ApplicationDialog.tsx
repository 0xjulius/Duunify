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
  onUpdate?: () => void; // Kutsuu päänäkymän päivitystä muutosten jälkeen
};

export default function ApplicationDialog({
  open,
  onOpenChange,
  app,
  onUpdate,
}: Props) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Alustetaan paikallinen cv_url-tila aina kun hakemus vaihtuu tai dialogi avautuu
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

  // FUNKTIO UUDEN LIITTEEN LATAAMISEKSI JÄLKIKÄTEEN
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || uploading) return;

    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Et ole kirjautunut sisään.");

      // Luodaan uniikki polku tiedostolle
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 1. Ladataan tiedosto Supabase Storageen
      const { data: storageData, error: storageError } = await supabase.storage
        .from("attachments")
        .upload(fileName, selectedFile);

      if (storageError) throw storageError;

      // 2. Päivitetään tietokantaan uusi cv_url
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

  // FUNKTIO LIITTEEN POISTAMISEEN
  async function deleteAttachment() {
    if (!currentCvUrl || deleting) return;

    if (!confirm("Haluatko varmasti poistaa tämän liitetiedoston?")) return;

    setDeleting(true);
    try {
      // 1. Poistetaan tiedosto Supabase Storagesta
      const { error: storageError } = await supabase.storage
        .from("attachments")
        .remove([currentCvUrl]);

      if (storageError) throw storageError;

      // 2. Päivitetään tietokantarivi asettamalla cv_url nulliksi
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
      <DialogContent className="!max-w-4xl !w-[90vw] !max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Yläpalkki */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 p-2">
            {app.company}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {app.job_title}
              </h2>
              <div className="flex flex-wrap gap-3 mt-4 text-slate-500 text-sm">
                <Badge variant="secondary" className="capitalize">
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
                  className="flex items-center gap-2 text-indigo-600 font-medium hover:underline w-fit"
                >
                  <LinkIcon size={16} /> Avaa työpaikkailmoitus
                </a>
              )}
              {app.valid_through && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={16} />
                  <span>
                    Päättyy:{" "}
                    {new Date(app.valid_through).toLocaleDateString("fi-FI")}
                  </span>
                </div>
              )}
            </div>

            {/* LIITETIEDOSTO-OSIO */}
            <div className="space-y-3 border-t pt-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Paperclip size={18} /> Liitetiedostot
              </h3>

              {currentCvUrl ? (
                downloadUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 border-slate-100 max-w-md">
                    <div className="flex items-center gap-2 text-sm text-slate-600 truncate mr-4">
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
                        className="gap-1.5 bg-white"
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                        onClick={deleteAttachment}
                        disabled={deleting}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 animate-pulse">
                    Luodaan suojattua linkkiä...
                  </p>
                )
              ) : (
                // Jos liitettä ei ole (tai se poistettiin), näytetään heti lisäyspainike
                <div className="max-w-md">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={20} className="text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500 font-medium">
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
                      onClick={(e) => e.stopPropagation()} // Estää dialogia sulkeutumasta joissain tapauksissa
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText size={18} /> Muistiinpanot
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                {app.notes || (
                  <span className="italic text-slate-400">
                    Ei muistiinpanoja
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 border-t pt-6">
              <h3 className="font-semibold">Työpaikkakuvaus</h3>
              <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm pt-2">
                {app.job_description || "Ei kuvausta saatavilla."}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
