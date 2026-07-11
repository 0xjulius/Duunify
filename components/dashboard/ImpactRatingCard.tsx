"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  pending: number;
  rejected: number;
  favorites: number;
}

export function ImpactRatingSkeleton() {
  return (
    <div className="relative flex h-[166px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
      <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-slate-100" />
      <div className="h-4 w-32 rounded bg-slate-100 text-slate-800" />
      <div className="flex items-end gap-3">
        <div className="h-12 w-24 rounded-lg bg-slate-100" />
        <div className="h-10 w-10 rounded-full bg-slate-100" />
      </div>
      <div className="h-4 w-40 rounded bg-slate-100" />
    </div>
  );
}

export default function ImpactRatingCard({ pending, rejected }: Props) {
  const p = Number(pending ?? 0);
  const r = Number(rejected ?? 0);

  // Uusi käyttäjä: ei vielä lähetettyjä hakemuksia eikä hylkäyksiä.
  // Tämä pitää käsitellä omana tilanaan — kyse ei ole huonosta
  // tuloksesta, vaan siitä ettei työnhaku ole vielä alkanut.
  const hasActivity = p > 0 || r > 0;

  // Lasketaan suoraan vireillä olevat (suosikkeja ei huomioida)
  const finalRating = r > 0 ? p / r : p;

  const displayRating = hasActivity ? finalRating.toFixed(2) : "–";

  let colorClass = "text-amber-600";
  let statusText = "Tasapainossa";
  let emoji = "⚖️";

  if (!hasActivity) {
    colorClass = "text-slate-400";
    statusText = "Aloita lähettämällä ensimmäinen hakemuksesi";
    emoji = "🚀";
  } else if (finalRating >= 3.0) {
    colorClass = "text-violet-600";
    statusText = "Maailmanluokan suoritus";
    emoji = "🌍";
  } else if (finalRating >= 2.5) {
    colorClass = "text-purple-600";
    statusText = "Poikkeuksellisen erinomainen";
    emoji = "🏆";
  } else if (finalRating >= 2.0) {
    colorClass = "text-emerald-700";
    statusText = "Huipputasoinen";
    emoji = "⭐";
  } else if (finalRating >= 1.5) {
    colorClass = "text-emerald-600";
    statusText = "Erittäin korkea";
    emoji = "🔥";
  } else if (finalRating >= 1.1) {
    colorClass = "text-emerald-500";
    statusText = "Korkeatasoinen";
    emoji = "📈";
  } else if (finalRating >= 0.9) {
    colorClass = "text-teal-500";
    statusText = "Hyvä taso";
    emoji = "✅";
  } else if (finalRating >= 0.7) {
    colorClass = "text-amber-500";
    statusText = "Tyydyttävä";
    emoji = "⚖️";
  } else if (finalRating >= 0.4) {
    colorClass = "text-orange-500";
    statusText = "Kehityskelpoinen";
    emoji = "🔧";
  } else if (finalRating >= 0.2) {
    colorClass = "text-red-400";
    statusText = "Vaatii kehitystä";
    emoji = "⚠️";
  } else {
    colorClass = "text-red-500";
    statusText = "Pystyt parempaan.";
    emoji = "❗";
  }

  return (
    <div className="relative flex h-41.5 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute right-4 top-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label="Tietoa vaikutuskykymittarista">
                <Info
                  size={16}
                  className="text-slate-400 transition-colors hover:text-indigo-600"
                />
              </button>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs p-3">
              <p className="text-xs leading-relaxed">
                <strong>Vaikutuskyky</strong> kertoo, kuinka hyvin työnhakusi
                etenee vertaamalla aktiivisia hakemuksiasi saamiisi hylkäyksiin.
                <br />
                <br />
                <span className="font-medium text-slate-500">
                  Kaava: Vireillä olevat / Hylätyt
                </span>
                <br />
                Suosikkeja ei lasketa mukaan, koska ne ovat vasta talteen
                tallennettuja työpaikkoja eivätkä vielä lähetettyjä hakemuksia.
                <br />
                <br />
                <strong>Tulkinta:</strong>
                <br />
                🔥 <strong>+1.0</strong> – Korkea konversio. Hakemuksia on
                vähintään yhtä paljon kuin hylkäyksiä.
                <br />
                ⚖️ <strong>0.5–0.99</strong> – Työnhakusi on tasapainossa.
                <br />
                ⚠️ <strong>Alle 0.5</strong> – Lisää aktiivisia hakemuksia
                parantaaksesi mahdollisuuksiasi työllistyä.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h3 className="text-sm font-semibold text-slate-500">Työnhaku indeksi</h3>

      <div className="flex items-end gap-3">
        <span className={`text-5xl font-extrabold ${colorClass}`}>
          {displayRating}
        </span>
        <span className="text-4xl md:hidden xl:block">{emoji}</span>
      </div>

      <p className={`text-sm font-medium ${colorClass}`}>{statusText}</p>
    </div>
  );
}