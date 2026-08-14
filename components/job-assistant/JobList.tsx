import Link from "next/link";
import { Loader2, BookmarkX } from "lucide-react";
import { JobCard, SavedJob } from "./JobCard";

interface JobListProps {
  loading: boolean;
  jobs: SavedJob[];
  searchQuery: string;
  failedLogos: Record<string, boolean>;
  onImageError: (id: string) => void;
}

export function JobList({
  loading,
  jobs,
  searchQuery,
  failedLogos,
  onImageError,
}: JobListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium">
          Haetaan tallennettuja työpaikkoja...
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <BookmarkX size={24} />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
          Ei tallennettuja työpaikkoja
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          {searchQuery
            ? "Hakuehdoillasi ei löytynyt yhtään työpaikkaa."
            : "Sinulla ei ole vielä tallennettuja työpaikkoja. Tallenna työpaikkoja suosikkeihin aloittaaksesi."}
        </p>
        <Link
          href="/favorites"
          className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          Siirry tallennettuihin
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          hasLogoFailed={!!failedLogos[job.id]}
          onImageError={onImageError}
        />
      ))}
    </div>
  );
}
