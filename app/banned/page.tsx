"use client";

import { supabase } from "@/lib/supabase";
import { ShieldAlert, LogOut } from "lucide-react";

export default function BannedPage() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "https://duunify.com";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-100 dark:bg-rose-500/10">
          <ShieldAlert className="h-12 w-12 text-rose-600 dark:text-rose-400" />
        </div>

        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600 dark:text-rose-400">
          Pääsy estetty
        </span>

        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Tili asetettu porttikieltoon.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Pääsysi palveluun on estetty sääntörikkomuksen vuoksi.
        </p>

        <p className="mt-2 text-slate-500 dark:text-slate-500">
          Jos uskot tämän olevan virhe, ota yhteyttä järjestelmän ylläpitoon.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
          >
            <LogOut size={18} />
            Kirjaudu ulos ja palaa etusivulle
          </button>
        </div>
      </div>
    </main>
  );
}