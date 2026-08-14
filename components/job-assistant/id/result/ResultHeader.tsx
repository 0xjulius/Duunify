"use client";

import Link from "next/link";
import { Building2, MapPin, Briefcase, ExternalLink } from "lucide-react";

export type JobDetail = {
  id: string;
  job_title: string;
  company: string;
  location?: string;
  employment_type?: string;
  job_url?: string;
  job_description?: string;
  cover_letter?: string;
  full_name?: string;
  city?: string;
  phone?: string;
  email?: string;
  company_logo?: string;
};

interface ResultHeaderProps {
  job: JobDetail;
  hasLogoFailed?: boolean;
  onImageError?: (id: string) => void;
}

export function ResultHeader({
  job,
  hasLogoFailed = false,
  onImageError,
}: ResultHeaderProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-sm mb-6 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-5 min-w-0">
          {/* COMPANY ICON / LOGO */}
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company_logo && !hasLogoFailed ? (
              <img
                src={job.company_logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain p-1.5"
                onError={() => onImageError && onImageError(job.id)}
              />
            ) : (
              <Building2
                size={26}
                className="text-slate-500 dark:text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Valittu työpaikka
            </p>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {job.job_title}
            </h2>

            <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {job.company}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
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
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Link
            href={`/job-assistant/${job.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition"
          >
            Avaa työpaikan tiedot
          </Link>

          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold transition"
            >
              Alkuperäinen ilmoitus
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}