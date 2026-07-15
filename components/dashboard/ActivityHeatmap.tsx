"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { subDays } from "date-fns";

type DayCell = {
  dateString: string;
  count: number;
  monthLabel: string | null;
  isFuture: boolean;
};
type Application = { created_at: string };

const FINNISH_MONTHS = [
  "Tam",
  "Hel",
  "Maa",
  "Huh",
  "Tou",
  "Kes",
  "Hei",
  "Elo",
  "Syy",
  "Lok",
  "Mar",
  "Jou",
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

function generateRichDemoData(): Application[] {
  const demoApps: Application[] = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const targetDate = subDays(today, i);

    if (Math.random() < 0.6) {
      const dailyCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < dailyCount; j++) {
        demoApps.push({
          created_at: targetDate.toISOString(),
        });
      }
    }
  }
  return demoApps;
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

  // ALUSTUS: Asetetaan tilat tyhjiksi, jotta SSR ja initial render mätsäävät aina täysin tyhjinä.
  const [cells, setCells] = useState<DayCell[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uniqueMonths, setUniqueMonths] = useState<
    { label: string; index: number }[]
  >([]);

  useEffect(() => {
    // Jos kyseessä on demo-tila, generoidaan rikas data vasta täällä (suoritetaan vain selaimessa)
    if (demoApplications) {
      const activeDemoData = generateRichDemoData();
      const { cells, months, total } = calculate(activeDemoData);
      setCells(cells);
      setUniqueMonths(months);
      setTotalActivities(total);
      setLoading(false);
    } else {
      fetchActivityData();
    }
  }, [demoApplications]);

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
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm h-[290px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-3xl border border-red-100 dark:border-red-500/30 bg-red-50/30 dark:bg-red-500/5 p-6 shadow-sm flex flex-col h-[290px] justify-center text-red-800 dark:text-red-300">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <AlertCircle className="text-red-500 dark:text-red-400" size={28} />
          <h3 className="font-bold text-sm text-red-950 dark:text-red-200">
            Aktiivisuutta ei voitu ladata
          </h3>
          <p className="text-xs text-red-600 dark:text-red-300 font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-red-100 dark:border-red-500/30">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm w-full flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
          Aktiivisuus 13 viikon ajalta {demoApplications && "(esimerkki)"}
        </h3>
      </div>

      <div className="grid grid-cols-[24px_1fr] gap-x-3 overflow-x-auto pb-1 select-none">
        <div />

        <div className="relative h-6 flex gap-[6px]">
          {uniqueMonths.map((month) => (
            <div
              key={month.index}
              className="absolute text-[11px] font-semibold text-slate-400 dark:text-slate-500"
              style={{
                left: `${month.index * (20 + 6)}px`,
              }}
            >
              {month.label}
            </div>
          ))}
        </div>

        <div className="grid grid-rows-7 h-[176px] text-[11px] font-semibold text-slate-400 dark:text-slate-500 items-center">
          <div></div>
          <div>Ma</div>
          <div></div>
          <div>Ke</div>
          <div></div>
          <div>Pe</div>
          <div></div>
        </div>

        <div className="grid grid-flow-col grid-rows-7 auto-cols-max gap-[6px] h-[176px] items-center">
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
                className="w-5 h-5 rounded-[5px] transition-all hover:scale-105 cursor-pointer shrink-0"
                style={{
                  backgroundColor: getColorForCount(cell.count, palette),
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 text-sm">
        <p className="text-slate-500 dark:text-slate-400 font-semibold">
          <span className="font-bold text-slate-900 dark:text-slate-50">
            {totalActivities}
          </span>{" "}
          aktiviteettia
        </p>

        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-medium text-xs">
          <span>Vähemmän</span>
          <div className="flex gap-[4px]">
            {palette.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-[4px]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>Enemmän</span>
        </div>
      </div>
    </div>
  );
}
