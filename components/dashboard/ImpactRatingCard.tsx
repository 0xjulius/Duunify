"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  pending: number;
  rejected: number;
  favorites: number;
}

export function ImpactRatingSkeleton() {
  return (
    <div className="relative flex h-[166px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse">
      <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800 text-slate-800" />
      <div className="flex items-end gap-3">
        <div className="h-12 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function ImpactRatingCard({ pending, rejected }: Props) {
  const p = Number(pending ?? 0);
  const r = Number(rejected ?? 0);
  const [infoOpen, setInfoOpen] = useState(false);

  const hasActivity = p > 0 || r > 0;
  const finalRating = r > 0 ? p / r : p;
  const displayRating = hasActivity ? finalRating.toFixed(2) : "–";

  let colorClass = "text-amber-600 dark:text-amber-400";
  let statusText = "Tasapainossa";
  let emoji = "⚖️";

  if (!hasActivity) {
    colorClass = "text-slate-400 dark:text-slate-500 text-lg";
    statusText = "Lähetä ensimmäinen hakemuksesi.";
    emoji = "❓";
  } else if (finalRating >= 3.0) {
    colorClass = "text-violet-600 dark:text-violet-400";
    statusText = "Maailmanluokan suoritus";
    emoji = "🌍";
  } else if (finalRating >= 2.5) {
    colorClass = "text-purple-600 dark:text-purple-400";
    statusText = "Poikkeuksellisen erinomainen";
    emoji = "🏆";
  } else if (finalRating >= 2.0) {
    colorClass = "text-emerald-700 dark:text-emerald-400";
    statusText = "Huipputasoinen";
    emoji = "⭐";
  } else if (finalRating >= 1.5) {
    colorClass = "text-emerald-600 dark:text-emerald-400";
    statusText = "Erittäin korkea";
    emoji = "🔥";
  } else if (finalRating >= 1.1) {
    colorClass = "text-emerald-500 dark:text-emerald-400";
    statusText = "Korkeatasoinen";
    emoji = "📈";
  } else if (finalRating >= 0.9) {
    colorClass = "text-teal-500 dark:text-teal-400";
    statusText = "Hyvä taso";
    emoji = "✅";
  } else if (finalRating >= 0.7) {
    colorClass = "text-amber-500 dark:text-amber-400";
    statusText = "Tyydyttävä";
    emoji = "⚖️";
  } else if (finalRating >= 0.4) {
    colorClass = "text-orange-500 dark:text-orange-400";
    statusText = "Kehityskelpoinen";
    emoji = "🔧";
  } else if (finalRating >= 0.2) {
    colorClass = "text-red-400 dark:text-red-400";
    statusText = "Vaatii kehitystä";
    emoji = "⚠️";
  } else {
    colorClass = "text-red-500 dark:text-red-400";
    statusText = "Pystyt parempaan.";
    emoji = "❗";
  }

  return (
    <div className="relative flex h-41.5 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          aria-label="Tietoa työnhakuindeksistä"
        >
          <Info size={16} />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Työnhaku indeksi
      </h3>

      <div className="flex items-end gap-3">
        <span className={`text-5xl font-extrabold ${colorClass}`}>
          {displayRating}
        </span>
        <span className="text-4xl md:hidden xl:block">{emoji}</span>
      </div>

      <p className={`text-sm font-medium ${colorClass}`}>{statusText}</p>
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Työnhakuindeksi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Työnhakuindeksi kertoo, kuinka hyvin työnhakusi etenee vertaamalla
              aktiivisia hakemuksiasi hylättyihin hakemuksiin.
            </p>

            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Kaava
              </p>
              <p className="mt-1 font-semibold">
                Vireillä olevat hakemukset ÷ Hylätyt hakemukset
              </p>
            </div>

            <p className="text-sm">
              <strong>Suurempi arvo on parempi.</strong> Suosikkeja ei lasketa
              mukaan, koska ne eivät ole vielä lähetettyjä hakemuksia.
            </p>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <p className="font-semibold mb-2">Nopea tulkinta</p>

              <ul className="space-y-1">
                <li>
                  🌍 <strong>2.0+</strong> Erinomainen
                </li>
                <li>
                  📈 <strong>1.0–1.99</strong> Hyvä taso
                </li>
                <li>
                  ⚖️ <strong>0.5–0.99</strong> Kohtalainen
                </li>
                <li>
                  ⚠️ <strong>Alle 0.5</strong> Lisää aktiivisia hakemuksia.
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
