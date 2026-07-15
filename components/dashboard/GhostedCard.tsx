"use client";

import { Ghost, Eye } from "lucide-react";

type GhostedCardProps = {
  value: number;
  percentage: number;
  onClick?: () => void;
};

export default function GhostedCard({ value, percentage, onClick }: GhostedCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`w-full relative group rounded-2xl border border-slate-200/80 dark:border-slate-700/70
      bg-white/90 dark:bg-slate-900/80
      backdrop-blur-xl
      p-6
      shadow-md dark:shadow-black/30
      transition-all duration-300
      text-left
      ${
        onClick
          ? `
            cursor-pointer
            hover:-translate-y-0.5
            hover:shadow-xl
            active:scale-[0.98]
            active:brightness-105
            hover:border-slate-500 dark:hover:border-slate-400
          `
          : `
            hover:shadow-lg
            hover:border-slate-300
            dark:hover:border-slate-600
          `
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold md:text-xs xl:text-sm text-slate-700 dark:text-slate-400">
            Ghosted
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-200 dark:drop-shadow-[0_0_10px_rgba(255,255,255,.08)]">
            {value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
          <Ghost className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-400 dark:text-slate-400">
            {percentage} % ei vastausta
          </p>
        </div>

        {onClick && (
          <Eye
            size={14}
            className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 text-slate-600 dark:text-slate-400"
          />
        )}
      </div>
    </Component>
  );
}