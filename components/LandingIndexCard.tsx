"use client";

import { Info, Trophy, Activity } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LandingIndexCard() {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const percentage = 71;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {/* Työnhaku-indeksi */}
      <div className="relative flex h-[166px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute right-4 top-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="Tietoa työnhaku-indeksistä">
                  <Info size={16} className="text-slate-400 hover:text-indigo-600 transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p className="text-xs leading-relaxed">
                  <strong>Työnhaku-indeksi</strong> on kuin oma "rating" hakuprosessillesi —
                  se vertaa vireillä olevia hakemuksiasi hylkäyksiin. Mitä korkeampi indeksi,
                  sitä todennäköisemmin strategiasi toimii ja johtaa työpaikkaan.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h3 className="text-sm font-semibold text-slate-500">Työnhaku-indeksi</h3>

        <div className="flex items-end gap-3">
          <span className="text-5xl font-extrabold text-purple-600">2.50</span>
          <span className="text-5xl">🏆</span>
        </div>

        <p className="text-sm font-medium text-purple-600">Poikkeuksellisen erinomainen</p>
      </div>

      {/* Työnhaun aktiivisuus */}
      <div className="relative flex h-[166px] flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute top-4 right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="Tietoa aktiivisuudesta">
                  <Info size={16} className="text-slate-400 hover:text-emerald-600 transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p className="text-xs leading-relaxed">
                  <strong>Aktiivisuus</strong> mittaa kuinka tasaisesti — ei vain kuinka paljon —
                  olet hakenut viimeisen viikon aikana. Vakaa aktiivisuus on yhteydessä
                  lyhyempään työttömyysjaksoon kuin satunnaiset piikit.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500">Työnhaun aktiivisuus</h3>
          <span className="mt-2 inline-flex w-fit rounded-xl px-3 py-1 text-3xl font-bold bg-emerald-100 text-emerald-700">
            {percentage}%
          </span>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Viimeiset 7 päivää
          </p>
        </div>

        <div className="relative h-20 w-20 mr-2">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r={radius} fill="none" className="stroke-slate-100" strokeWidth="6" />
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              className="stroke-emerald-500"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}