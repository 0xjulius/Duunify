"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Link as LinkIcon, FileText, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: any;
};

export default function ApplicationDialog({ open, onOpenChange, app }: Props) {
  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Käytetään !-etuliitettä ylikirjoittamaan komponentin oletusasetukset */}
      <DialogContent className="!max-w-4xl !w-[90vw] !max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Yläpalkki, jossa on otsikko ja X-nappi */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <DialogTitle className="text-xl font-bold">{app.company}</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                // Lisätään varotoimenpide: estetään eventin leviäminen
                e.stopPropagation();
              }}
            >
              <X size={18} />
            </Button>
          </DialogClose>
        </div>

        {/* Scrollautuva sisältöalue */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-8">
            {/* Otsikko ja tiedot */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {app.job_title}
              </h2>
              <div className="flex flex-wrap gap-3 mt-4 text-slate-500 text-sm">
                <Badge variant="secondary" className="capitalize">
                  {app.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {app.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />{" "}
                  {new Date(app.applied_date).toLocaleDateString("fi-FI")}
                </span>
              </div>
            </div>

            {/* Linkki */}
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

            {/* Muistiinpanot */}
            <div className="space-y-4">
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

            {/* Työpaikkakuvaus */}
            <div className="space-y-2">
              <h3 className="font-semibold">Työpaikkakuvaus</h3>
              <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm border-t pt-4">
                {app.job_description || "Ei kuvausta saatavilla."}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
