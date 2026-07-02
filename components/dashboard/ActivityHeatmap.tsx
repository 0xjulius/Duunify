"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

type DayCell = { dateString: string; count: number; monthLabel: string | null; isFuture: boolean };
type Application = { created_at: string };

const FINNISH_MONTHS = [
  "Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä",
  "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"
];

const getColorClass = (count: number) => {
  if (count === 0) return "bg-[#EEF2FF]";
  if (count === 1) return "bg-[#C7D2FE]";
  if (count === 2) return "bg-[#818CF8]";
  if (count === 3) return "bg-[#4F46E5]";
  return "bg-[#3730A3]";
};

function calculate(applications: Application[]) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  
  const currentDay = now.getDay();
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);

  // MUUTOS: Palataan 12 viikkoa taaksepäin + kuluva viikko = 13 viikkoa
  const startDate = new Date(startOfWeek);
  startDate.setDate(startOfWeek.getDate() - 12 * 7);
  startDate.setHours(0, 0, 0, 0);

  const dateCounts: Record<string, number> = {};
  let total = 0;

  applications.forEach((app) => {
    if (!app.created_at) return;
    const dateKey = app.created_at.split("T")[0];
    dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    total++;
  });

  const generatedCells: DayCell[] = [];
  const tempDate = new Date(startDate);
  const monthsTracker: Record<string, number> = {};

  // MUUTOS: Silmukka pyörii nyt 13 viikon edestä
  for (let i = 0; i < 13 * 7; i++) {
    const dateString = tempDate.toISOString().split("T")[0];
    const count = dateCounts[dateString] || 0;
    const monthName = FINNISH_MONTHS[tempDate.getMonth()];

    let monthLabel = null;
    const weekIndex = Math.floor(i / 7);

    if (monthsTracker[monthName] === undefined) {
      monthsTracker[monthName] = weekIndex;
      monthLabel = monthName;
    }

    const isFuture = dateString > todayStr;

    generatedCells.push({ dateString, count, monthLabel, isFuture });
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const extractedMonths = Object.entries(monthsTracker)
    .map(([label, index]) => ({ label, index }))
    .sort((a, b) => a.index - b.index);

  return { cells: generatedCells, months: extractedMonths, total };
}

export default function ActivityHeatmap({
  demoApplications,
}: {
  demoApplications?: Application[];
}) {
  const initial = demoApplications ? calculate(demoApplications) : null;

  const [cells, setCells] = useState<DayCell[]>(initial?.cells || []);
  const [totalActivities, setTotalActivities] = useState(initial?.total || 0);
  const [loading, setLoading] = useState(!demoApplications);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uniqueMonths, setUniqueMonths] = useState<{ label: string; index: number }[]>(initial?.months || []);

  useEffect(() => {
    if (demoApplications) return;
    fetchActivityData();
  }, []);

  async function fetchActivityData() {
    try {
      setLoading(true);
      setErrorMsg(null);

      const now = new Date();
      const currentDay = now.getDay();
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - daysSinceMonday);

      // MUUTOS: Supabase-haun rajaus myös 13 viikon ajalle
      const startDate = new Date(startOfWeek);
      startDate.setDate(startOfWeek.getDate() - 12 * 7);
      startDate.setHours(0, 0, 0, 0);

      const { data: applications, error } = await supabase
        .from("applications")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      if (error) {
        console.error("Virhe ladattaessa aktiviteettidataa:", error);
        setErrorMsg(error.message);
        return;
      }

      const { cells, months, total } = calculate(applications || []);
      setCells(cells);
      setUniqueMonths(months);
      setTotalActivities(total);
    } catch (err) {
      console.error("Yllättävä virhe kalenterissa:", err);
      setErrorMsg("Yhteysvirhe kalenteridataa haettaessa.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-[320px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
        <div className="h-28 bg-slate-100 rounded-xl w-full" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/30 p-6 shadow-sm flex flex-col h-[320px] justify-center text-red-800">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <AlertCircle className="text-red-500" size={28} />
          <h3 className="font-bold text-sm text-red-950">Aktiivisuutta ei voitu ladata</h3>
          <p className="text-xs text-red-600 font-mono bg-white px-2 py-1 rounded border border-red-100">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm w-full flex flex-col justify-between gap-6">
      
      {/* YLÄOSA */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">
          Aktiivisuus 13 viikon ajalta
        </h3>
      </div>

      {/* RUUDUKKOALUE */}
      <div className="flex flex-col gap-2 overflow-x-auto py-2 min-w-0">
        
        {/* Kuukaudet (Päivitetty pituudeksi 13) */}
        <div className="flex pl-10 flex-nowrap">
          <div className="flex flex-nowrap gap-1.5">
            {Array.from({ length: 13 }).map((_, week) => {
              const month = uniqueMonths.find((m) => m.index === week);
              return (
                <div key={week} className="text-[11px] font-bold text-slate-400 h-5 w-5 shrink-0 whitespace-nowrap overflow-visible">
                  {month?.label || ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Päivät + Itse Heatmap */}
        <div className="flex gap-4 flex-nowrap items-start">
          
          {/* Viikonpäivien nimet */}
          <div className="grid grid-rows-7 h-[174px] items-center text-[11px] font-bold text-slate-400 w-6 shrink-0">
            <div></div>
            <div>Ma</div>
            <div></div>
            <div>Ke</div>
            <div></div>
            <div>Pe</div>
            <div></div>
          </div>

          {/* 7-rivinen heatmap-ruudukko */}
          <div className="grid grid-flow-col grid-rows-7 auto-cols-max gap-1.5 shrink-0">
            {cells.map((cell, idx) => {
              if (cell.isFuture) {
                return (
                  <div
                    key={idx}
                    className="w-5 h-5 bg-transparent border border-transparent pointer-events-none shrink-0"
                  />
                );
              }

              return (
                <div
                  key={idx}
                  title={`${cell.dateString}: ${cell.count} aktiviteettia`}
                  className={`w-5 h-5 rounded-[6px] transition-colors shrink-0 ${getColorClass(cell.count)}`}
                />
              );
            })}
          </div>

        </div>
      </div>

      {/* ALARIVI */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
        
        <p className="text-slate-500 font-medium lg:hidden xl:block">
          <span className="font-bold text-slate-900">{totalActivities}</span> aktiviteettia 
        </p>

        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <span className="text-xs lg:hidden 2xl:block">Vähemmän</span>
          <span className="hidden text-xs lg:block 2xl:hidden">-</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-md bg-[#EEF2FF]" />
            <div className="w-4 h-4 rounded-md bg-[#C7D2FE]" />
            <div className="w-4 h-4 rounded-md bg-[#818CF8]" />
            <div className="w-4 h-4 rounded-md bg-[#4F46E5]" />
            <div className="w-4 h-4 rounded-md bg-[#3730A3]" />
          </div>
          <span className="text-xs lg:hidden 2xl:block">Enemmän</span>
          <span className="hidden text-xs lg:block 2xl:hidden">+</span>
        </div>

      </div>

    </div>
  );
}