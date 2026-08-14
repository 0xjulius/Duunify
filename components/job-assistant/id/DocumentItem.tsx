import {
  Loader2,
  FileText,
  Eye,
  Upload,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export type UserDocument = {
  name: string;
  updated: string;
};

interface DocumentItemProps {
  type: "cv" | "letter";
  title: string;
  doc: UserDocument | null;
  isUploading: boolean;
  isDeleting: boolean;
  isOpening: boolean;
  onOpen: (type: "cv" | "letter") => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "letter",
  ) => void;
  onDelete: (type: "cv" | "letter") => void;
}

export function DocumentItem({
  type,
  title,
  doc,
  isUploading,
  isDeleting,
  isOpening,
  onOpen,
  onUpload,
  onDelete,
}: DocumentItemProps) {
  const isBusy = isUploading || isDeleting || isOpening;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2937]">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
          {isBusy ? (
            <Loader2 size={18} className="animate-spin text-indigo-600" />
          ) : (
            <FileText size={18} className="text-slate-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate break-all">
            {doc?.name || `Ei ladattua ${title.toLowerCase()}`}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {doc?.updated || `Lataa ${title.toLowerCase()} (maks. 500 KB)`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          {doc && (
            <button
              type="button"
              onClick={() => onOpen(type)}
              disabled={isOpening}
              title={`Avaa ${title}`}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition cursor-pointer"
            >
              <Eye size={14} />
            </button>
          )}

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
            <Upload size={13} />
            <span>{doc ? "Vaihda" : "Lataa"}</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => onUpload(e, type)}
              disabled={isUploading || isDeleting}
            />
          </label>

          {doc && (
            <button
              type="button"
              onClick={() => onDelete(type)}
              disabled={isDeleting}
              title={`Poista ${title}`}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {doc && (
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 ml-1" />
        )}
      </div>
    </div>
  );
}
