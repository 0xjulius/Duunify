import Link from "next/link";
import { SearchX, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-100 dark:bg-indigo-500/10">
          <SearchX className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>

        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
          Virhe 404
        </span>

        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Työpaikkaa ei löytynyt.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Näyttää siltä, että tämä sivu on ehtinyt vaihtaa työpaikkaa tai sitä
          ei ole koskaan ollutkaan.
        </p>

        <p className="mt-2 text-slate-500 dark:text-slate-500">
          Ei hätää – viedään sinut takaisin oikeaan paikkaan.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Etusivulle
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 font-semibold text-slate-700 dark:text-slate-200 transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <LayoutDashboard size={18} />
            Dashboardiin
          </Link>
        </div>
      </div>
    </main>
  );
}