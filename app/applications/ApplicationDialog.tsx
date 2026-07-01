"use client";

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
} from "lucide-react";

// Määritellään Application-tyyppi, jotta "any" poistuu
type ApplicationData = {
  company: string;
  job_title: string;
  status: string;
  location?: string;
  applied_date?: string;
  job_url?: string;
  notes?: string;
  job_description?: string;
  salary?: string; // Lisätty suosikeista
  days_left?: number; // Lisätty suosikeista
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: any;
};

export default function ApplicationDialog({ open, onOpenChange, app }: Props) {
  if (!app) return null;

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
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <Clock size={16} />
                <span>
                  Päättyy:{" "}
                  {new Date(app.valid_through).toLocaleDateString("fi-FI")}
                </span>
              </div>
            )}

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
