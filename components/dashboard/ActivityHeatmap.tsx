"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

type DayCell = { dateString: string; count: number; monthLabel: string | null; isFuture: boolean };
type Application = { created_at: string };

const FINNISH_MONTHS = [
  "Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä",
  "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"
];

const LIGHT_COLORS = ["#EEF2FF", "#C7D2FE", "#818CF8", "#4F46E5", "#3730A3"];
const DARK_COLORS = ["#1e2133", "#312e81", "#4338ca", "#6366f1", "#a5b4fc"];

function getColorForCount(count: number, palette: string[]) {
  if (count === 0) return palette[0];
  if (count === 1) return palette[1];
  if (count === 2) return palette[2];
  if (count === 3) return palette[3];
  return palette[4];
}

function calculate(applications: Application[]) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const currentDay = now.getDay();
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const palette = isDark ? DARK_COLORS : LIGHT_COLORS;

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
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm h-[320px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-3xl border border-red-100 dark:border-red-500/30 bg-red-50/30 dark:bg-red-500/5 p-6 shadow-sm flex flex-col h-[320px] justify-center text-red-800 dark:text-red-300">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <AlertCircle className="text-red-500 dark:text-red-400" size={28} />
          <h3 className="font-bold text-sm text-red-950 dark:text-red-200">Aktiivisuutta ei voitu ladata</h3>
          <p className="text-xs text-red-600 dark:text-red-300 font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-red-100 dark:border-red-500/30">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm w-full flex flex-col justify-between gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
          Aktiivisuus 13 viikon ajalta
        </h3>
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto py-2 min-w-0">
        <div className="flex pl-10 flex-nowrap">
          <div className="flex flex-nowrap gap-1.5">
            {Array.from({ length: 13 }).map((_, week) => {
              const month = uniqueMonths.find((m) => m.index === week);
              return (
                <div key={week} className="text-[11px] font-bold text-slate-400 dark:text-slate-500 h-5 w-5 shrink-0 whitespace-nowrap overflow-visible">
                  {month?.label || ""}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 flex-nowrap items-start">
          <div className="grid grid-rows-7 h-[174px] items-center text-[11px] font-bold text-slate-400 dark:text-slate-500 w-6 shrink-0">
            <div></div>
            <div>Ma</div>
            <div></div>
            <div>Ke</div>
            <div></div>
            <div>Pe</div>
            <div></div>
          </div>

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
                  className="w-5 h-5 rounded-[6px] transition-colors shrink-0"
                  style={{ backgroundColor: getColorForCount(cell.count, palette) }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
        <p className="text-slate-500 dark:text-slate-400 font-medium lg:hidden xl:block">
          <span className="font-bold text-slate-900 dark:text-slate-50">{totalActivities}</span> aktiviteettia
        </p>

        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-medium">
          <span className="text-xs lg:hidden 2xl:block">Vähemmän</span>
          <span className="hidden text-xs lg:block 2xl:hidden">-</span>
          <div className="flex gap-1">
            {palette.map((color, i) => (
              <div key={i} className="w-4 h-4 rounded-md" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span className="text-xs lg:hidden 2xl:block">Enemmän</span>
          <span className="hidden text-xs lg:block 2xl:hidden">+</span>
        </div>
      </div>
    </div>
  );
}