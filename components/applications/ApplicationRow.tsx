import { MapPin, Calendar, ExternalLink, Trash2 } from "lucide-react";
import ApplicationSheet from "@/app/applications/ApplicationDialog";
import { CompanyLogo } from "@/components/applications/CompanyLogo";
import { DemoCompanyLogo } from "@/components/demo/DemoCompanyLogo";
import { useState } from "react";

// Shadcn UI komponentit poistomodaalia varten
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Application = {
  id: string;
  company: string;
  job_title: string;
  location: string;
  status: string;
  notes: string;
  applied_date: string;
  job_description: string;
  job_url?: string;
  company_logo?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  employment_type?: string | null;
  valid_through?: string | null;
};

interface ApplicationRowProps {
  app: Application;
  onDelete: (id: string) => void;
  onClick?: () => void;
  onChange: () => void;
  isDemo?: boolean;
}

export default function ApplicationRow({
  app,
  onDelete,
  onChange,
  isDemo = false,
}: ApplicationRowProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const s = (status || "Tallennettu").toLowerCase().trim();

    switch (s) {
      case "tallennettu":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
      case "haettu":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20";
      case "haastattelu":
        return "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20";
      case "tarjous":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      case "hylätty":
        return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const openApplication = () => {
    setOpen(true);
  };

  const statusBadge = getStatusBadge(app.status);

  return (
    <>
      {/* =========================================================
          DESKTOP
          ========================================================= */}
      <tr
        onClick={openApplication}
        className="hidden xl:table-row cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group"
      >
        {/* Tehtävä & yritys */}
        <td className="p-4 pl-6 w-[35%]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0">
              {isDemo ? (
                <DemoCompanyLogo logo={app.company_logo} company={app.company} />
              ) : (
                <CompanyLogo logo={app.company_logo} company={app.company} />
              )}
            </div>

            <div className="min-w-0">
              <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {app.job_title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {app.company}
              </div>
            </div>
          </div>
        </td>

        {/* Tila */}
        <td className="p-4 w-[14%] whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge}`}>
            {app.status || "Tallennettu"}
          </span>
        </td>

        {/* Sijainti */}
        <td className="p-4 w-[25%] text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate max-w-[220px]">
              {app.location || "Ei määritelty"}
            </span>
          </div>
        </td>

        {/* Päivämäärä */}
        <td className="p-4 w-[14%] text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">
              {app.applied_date || "Ei päivämäärää"}
            </span>
          </div>
        </td>

        {/* Toiminnot */}
        <td
          className="p-4 pr-6 w-[12%] whitespace-nowrap text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end gap-2">
            {app.job_url && (
              <a
                href={app.job_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition"
                title="Avaa ilmoitus"
                aria-label="Avaa työpaikkailmoitus"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={15} />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition"
              title="Poista hakemus"
              aria-label="Poista hakemus"
            >
              ✕
            </button>
          </div>
        </td>
      </tr>

      {/* =========================================================
          MOBIILI / TABLETTI
          ========================================================= */}
      <tr
        onClick={openApplication}
        className="xl:hidden cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
      >
        <td colSpan={5} className="p-0 border-b border-slate-200 dark:border-slate-800">
          <div className="w-full px-4 py-4 flex flex-col">
            {/* Yläosa */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0">
                {isDemo ? (
                  <DemoCompanyLogo logo={app.company_logo} company={app.company} />
                ) : (
                  <CompanyLogo logo={app.company_logo} company={app.company} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm leading-5 text-slate-900 dark:text-slate-100 line-clamp-2">
                  {app.job_title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {app.company}
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <MapPin size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">
                  {app.location || "Ei määritelty"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 max-w-[40%]">
                <Calendar size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">
                  {app.applied_date || "Ei päivämäärää"}
                </span>
              </div>
            </div>

            {/* Alaosa */}
            <div className="flex items-center justify-between gap-3 mt-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${statusBadge}`}>
                {app.status || "Tallennettu"}
              </span>

              {/* Toiminnot mobiilissa */}
              <div
                className="flex items-center gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition"
                    title="Avaa ilmoitus"
                    aria-label="Avaa työpaikkailmoitus"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={15} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition"
                  title="Poista hakemus"
                  aria-label="Poista hakemus"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>

      {/* =========================================================
          SHADCN DIALOG - VAHVISTUSMODAL POISTOLLE (PÄIVITETTY TYYLI)
          ========================================================= */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="space-y-4 text-left">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Trash2 size={22} />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Poistetaanko hakemus?
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Haluatko varmasti poistaa hakemuksen kohteelle <strong className="text-slate-800 dark:text-slate-200">{app.company}</strong> ({app.job_title})? Tätä toimintoa ei voi peruuttaa.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-3 pt-4 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-full rounded-2xl h-11 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Peruuta
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete(app.id);
                setShowDeleteModal(false);
              }}
              className="w-full rounded-2xl h-11 bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
            >
              Poista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hakemuksen detail-dialog */}
      <ApplicationSheet open={open} onOpenChange={setOpen} app={app} />
    </>
  );
}