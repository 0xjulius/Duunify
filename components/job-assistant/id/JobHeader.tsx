import Link from "next/link";
import { Building2, MapPin, Briefcase, ExternalLink, Sparkles, ArrowRight } from "lucide-react";

export type Application = {
  id: string;
  company: string;
  job_title: string;
  location?: string;
  employment_type?: string;
  notes?: string;
  job_description?: string;
  job_url?: string;
  company_logo?: string;
};

interface JobHeaderProps {
  job: Application;
  failedLogo: boolean;
  onLogoError: () => void;
}

export function JobHeader({ job, failedLogo, onLogoError }: JobHeaderProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company_logo && !failedLogo ? (
              <img
                src={job.company_logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain p-2"
                onError={onLogoError}
              />
            ) : (
              <Building2
                size={26}
                className="text-slate-500 dark:text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              Valittu työpaikka
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {job.job_title}
            </h1>

            <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {job.company}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {job.location}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Briefcase size={15} />
                {job.employment_type || "Kokoaikainen"}
              </span>

              {job.job_url && (
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
            href={`/job-assistant/${job.id}/result`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            <Sparkles size={18} />
            Räätälöi saatekirje
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}