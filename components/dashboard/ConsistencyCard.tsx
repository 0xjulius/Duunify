"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConsistencyCard({
  percentage,
}: {
  percentage: number;
}) {
  // Värit aktiivisuuden mukaan
  let strokeColor = "stroke-slate-200";

  if (percentage <= 30) {
    strokeColor = "stroke-red-500";
  } else if (percentage >= 70) {
    strokeColor = "stroke-emerald-500";
  } else if (percentage >= 50) {
    strokeColor = "stroke-amber-500";
  }

  let textColor = "text-slate-900";

  if (percentage <= 30) {
    strokeColor = "stroke-red-500";
    textColor = "text-red-500";
  } else if (percentage >= 70) {
    strokeColor = "stroke-emerald-500";
    textColor = "text-emerald-500";
  } else if (percentage >= 50) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-500";
  }

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-[150px] flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Tekstiosio */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold tracking-tight text-slate-500">
          Työnhaun aktiivisuus
        </h3>

        <span
          className={`mt-2 inline-flex w-fit rounded-xl px-3 py-1 text-3xl font-bold ${
            percentage <= 30
              ? "bg-red-100 text-red-700"
              : percentage >= 70
                ? "bg-emerald-100 text-emerald-700"
                : percentage >= 50
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
          }`}
        >
          {percentage}%
              </span>
              
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Viimeiset 7 päivää
        </p>
      </div>

      {/* Progress-rengas */}
      <div className="relative h-20 w-20 mr-8">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 52 52">
          {/* Tausta */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            className="stroke-slate-100"
            strokeWidth="6"
          />

          {/* Edistyminen */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            className={`transition-all duration-700 ease-out ${strokeColor}`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Info */}
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Tietoa työnhaun aktiivisuudesta"
              >
                <Info
                  size={16}
                  className="text-slate-400 transition-colors hover:text-indigo-600"
                />
              </button>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs p-3">
              <p className="text-xs leading-relaxed">
                <strong>Työnhaun aktiivisuus</strong> kertoo, kuinka
                säännöllisesti olet ollut aktiivinen työnhaussa viimeisen viikon
                aikana.
                <br />
                <br />
                Aktiivisuudeksi lasketaan esimerkiksi hakemuksen lähettäminen
                tai työpaikan tallentaminen suosikkeihin.
                <br />
                <br />
                <span className="font-medium text-slate-500">
                  Kaava: (Aktiiviset päivät / 7) × 100
                </span>
                <br />
                <br />
                Mitä korkeampi prosentti on, sitä tasaisempaa työnhakusi on.
                Säännöllinen aktiivisuus kasvattaa mahdollisuuksiasi löytää uusi
                työpaikka.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
``;
