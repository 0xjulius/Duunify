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

export default function ImpactRatingCard({
  pending,
  rejected,
  favorites,
}: Props) {
  const p = Number(pending ?? 0);
  const r = Number(rejected ?? 0);
  const f = Number(favorites ?? 0);

  // Aktiiviset hakemukset = vireillä olevat - suosikit
  const effectivePending = Math.max(0, p - f);

  // Vaikutuskyky = aktiiviset hakemukset / hylkäykset
  const finalRating = r > 0 ? effectivePending / r : effectivePending;

  const displayRating = finalRating.toFixed(2);

  let colorClass = "text-amber-600";
  let statusText = "Tasapainossa";
  let emoji = "⚖️";

  if (finalRating >= 1.0) {
    colorClass = "text-emerald-500";
    statusText = "Korkea konversio";
    emoji = "🔥";
  } else if (finalRating >= 0.5) {
    colorClass = "text-amber-600";
    statusText = "Tasapainossa";
    emoji = "⚖️";
  }

  if (finalRating <= 0.2) {
    colorClass = "text-red-400";
    statusText = "Kehitettävää.";
    emoji = "⚠️";
  }

  return (
    <div className="relative flex h-41.5 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute right-4 top-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Tietoa vaikutuskykymittarista"
              >
                <Info
                  size={16}
                  className="text-slate-400 transition-colors hover:text-indigo-600"
                />
              </button>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs p-3">
              <p className="text-xs leading-relaxed">
                <strong>Vaikutuskyky</strong> kertoo, kuinka hyvin työnhakusi
                etenee vertaamalla aktiivisia hakemuksiasi saamiisi
                hylkäyksiin.
                <br />
                <br />
                <span className="font-medium text-slate-500">
                  Kaava: (Vireillä olevat − Suosikit) / Hylätyt
                </span>
                <br />
                Suosikkeja ei lasketa mukaan, koska ne ovat vasta
                talteen tallennettuja työpaikkoja eivätkä vielä lähetettyjä
                hakemuksia.
                <br />
                <br />
                <strong>Tulkinta:</strong>
                <br />🔥 <strong>+1.0</strong> – Korkea konversio. Hakemuksia on
                vähintään yhtä paljon kuin hylkäyksiä.
                <br />⚖️ <strong>0.5–0.99</strong> – Työnhakusi on
                tasapainossa.
                <br />⚠️ <strong>Alle 0.5</strong> – Lisää aktiivisia
                hakemuksia parantaaksesi mahdollisuuksiasi työllistyä.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h3 className="text-sm font-semibold text-slate-500">
        Työnhaku indeksi
      </h3>

      <div className="flex items-end gap-3">
        <span className={`text-5xl font-extrabold ${colorClass}`}>
          {displayRating}
        </span>
        <span className="text-5xl">{emoji}</span>
      </div>

      <p className={`text-sm font-medium ${colorClass}`}>
        {statusText}
      </p>
    </div>
  );
}