import Link from "next/link";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock3,
  ChevronRight,
} from "lucide-react";

export type SavedJob = {
  id: string;
  job_title: string;
  company: string;
  location: string;
  employment_type?: string;
  created_at?: string;
  description?: string;
  tags?: string[];
  status?: string;
  company_logo?: string;
};

interface JobCardProps {
  job: SavedJob;
  hasLogoFailed: boolean;
  onImageError: (id: string) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "Äskettäin";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "Äskettäin";
  }
};

export function JobCard({ job, hasLogoFailed, onImageError }: JobCardProps) {
  return (
    <Link href={`/job-assistant/${job.id}`} className="group block">
      <div className="relative rounded-2xl border border-slate-200 dark:border-[#1F2937] p-5 sm:p-6 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/[0.03] transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* COMPANY ICON / LOGO */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden">
              {job.company_logo && !hasLogoFailed ? (
                <img
                  src={job.company_logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-1.5"
                  onError={() => onImageError(job.id)}
                />
              ) : (
                <Building2
                  size={22}
                  className="text-slate-500 dark:text-slate-400"
                />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {job.job_title}
              </h3>

              <p className="font-medium text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {job.company}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {job.location || "Ei sijaintia"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} />
                  {job.employment_type || "Kokoaikainen"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} />
                  Tallennettu {formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* TAGS */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 lg:max-w-xs">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ACTION BUTTON */}
          <div className="flex items-center justify-end lg:justify-center shrink-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Valitse
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {job.description && (
          <div className="mt-4 lg:ml-16">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {job.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
