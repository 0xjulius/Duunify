"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

type DayCell = { dateString: string; count: number; monthLabel: string | null };
type Application = { created_at: string };

const FINNISH_MONTHS = [
  "Tammi",
  "Helmi",
  "Maalis",
  "Huhti",
  "Touko",
  "Kesä",
  "Heinä",
  "Elo",
  "Syys",
  "Loka",
  "Marras",
  "Joulu",
];

const getColorClass = (count: number) => {
  if (count === 0) return "bg-indigo-50/30 border border-slate-100/50";
  if (count === 1) return "bg-indigo-100/70";
  if (count === 2) return "bg-indigo-200";
  if (count === 3) return "bg-indigo-300";
  if (count === 4) return "bg-indigo-400";
  if (count === 5) return "bg-indigo-500";
  if (count === 6) return "bg-indigo-600";
  return "bg-indigo-700";
};

function calculate(applications: Application[]) {
  const now = new Date();
  const currentDay = now.getDay();
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);

  // MUUTOS: Palataan 12 viikkoa taaksepäin + kuluva viikko = 13 viikkoa (91 päivää)
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

    if (!monthsTracker[monthName]) {
      monthsTracker[monthName] = weekIndex;
      monthLabel = monthName;
    }

    generatedCells.push({ dateString, count, monthLabel });
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
  const [uniqueMonths, setUniqueMonths] = useState<
    { label: string; index: number }[]
  >(initial?.months || []);

  useEffect(() => {
    if (demoApplications) return;
    fetchActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // MUUTOS: Supabase-haku rajataan myös 12 viikon taakse (yhteensä 13  viikkoa)
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[340px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
        <div className="h-32 bg-slate-100 rounded-xl w-full" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm flex flex-col h-[340px] justify-between text-red-800">
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
          <AlertCircle className="text-red-500" size={32} />
          <h3 className="font-bold text-sm text-red-950">
            Aktiivisuutta ei voitu ladata
          </h3>
          <p className="text-xs text-red-700 max-w-[240px] break-words font-mono bg-white p-2 rounded border border-red-200">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Aktiivisuus
      </h3>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col gap-4">

          {/* Kuukaudet */}
          <div className="flex">
            <div className="w-10" />

            <div className="grid grid-flow-col auto-cols-[22px] gap-1">
              {Array.from({ length: 13 }).map((_, week) => {
                const month = uniqueMonths.find((m) => m.index === week);

                return (
                  <div
                    key={week}
                    className="text-sm font-semibold text-slate-400 h-5"
                  >
                    {month?.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Viikonpäivät + heatmap */}
          <div className="flex gap-3">

            {/* Päivät */}
            <div className="grid grid-rows-7 h-fit items-center text-sm font-bold text-slate-400">
              <div/>
              <div>Ma </div>
              <div/>
              <div>Ke</div>
              <div/>
              <div>Pe</div>
              <div />
            </div>

            {/* Heatmap */}
            <div className="grid grid-flow-col grid-rows-7 auto-cols-max gap-1">
              {cells.map((cell, idx) => (
                <div
                  key={idx}
                  title={`${cell.dateString}: ${cell.count} hakemusta`}
                  className={`w-5 h-5 rounded-md transition-colors ${getColorClass(
                    cell.count
                  )}`}
                />
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex justify-end items-center gap-3 text-sm font-medium text-slate-400">

            <span>Vähemmän</span>

            <div className="flex gap-1">
              <div className="w-5 h-5 rounded-md bg-indigo-50/30 border border-slate-100/50" />
              <div className="w-5 h-5 rounded-md bg-indigo-100/70" />
              <div className="w-5 h-5 rounded-md bg-indigo-200" />
              <div className="w-5 h-5 rounded-md bg-indigo-300" />
              <div className="w-5 h-5 rounded-md bg-indigo-400" />
              <div className="w-5 h-5 rounded-md bg-indigo-500" />
              <div className="w-5 h-5 rounded-md bg-indigo-600" />
              <div className="w-5 h-5 rounded-md bg-indigo-700" />
            </div>

            <span>Enemmän</span>

          </div>

        </div>
      </div>
    </div>
  );
}