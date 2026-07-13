"use client";

import Link from "next/link";
import { TriangleAlert, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-500/10">
          <TriangleAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600 dark:text-red-400">
          Virhe 500
        </span>

        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Jotain meni pieleen.
        </h1>

        <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
          Palvelussa tapahtui odottamaton virhe. Tilanne ei todennäköisesti johdu
          sinusta.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <RotateCcw size={18} />
            Yritä uudelleen
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 font-semibold text-slate-700 dark:text-slate-200 transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Home size={18} />
            Etusivulle
          </Link>
        </div>
      </div>
    </main>
  );
}