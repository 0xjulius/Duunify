"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

type DayCell = {
  dateString: string;
  count: number;
  monthLabel: string | null;
};

const FINNISH_MONTHS = [
  "Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä",
  "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"
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

export default function ActivityHeatmap() {
  const [cells, setCells] = useState<DayCell[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uniqueMonths, setUniqueMonths] = useState<{ label: string; index: number }[]>([]);

  useEffect(() => {
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

      const dateCounts: Record<string, number> = {};
      let total = 0;

      applications?.forEach((app) => {
        if (!app.created_at) return;
        const dateKey = app.created_at.split("T")[0];
        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
        total++;
      });

      setTotalActivities(total);

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

        generatedCells.push({
          dateString,
          count,
          monthLabel
        });

        tempDate.setDate(tempDate.getDate() + 1);
      }

      const extractedMonths = Object.entries(monthsTracker).map(([label, index]) => ({
        label,
        index
      })).sort((a, b) => a.index - b.index);

      setUniqueMonths(extractedMonths);
      setCells(generatedCells);
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
          <h3 className="font-bold text-sm text-red-950">Aktiivisuutta ei voitu ladata</h3>
          <p className="text-xs text-red-700 max-w-[240px] break-words font-mono bg-white p-2 rounded border border-red-200">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col justify-between select-none">
      
      {/* Otsikko */}
      <h3 className="text-lg font-bold text-slate-900">
        Aktiivisuus
      </h3>

      {/* Kalenterialue (Keskittää sisällön täydellisesti) */}
      <div className="flex flex-col items-center justify-center w-full flex-1 my-auto">
        
        {/* KORJAUS: Tämä w-fit pakottaa kuvaajan, kuukaudet ja legendan samaan nippuun keskelle */}
        <div className="w-fit flex flex-col">
          
          {/* Kuukausien otsikkorivi */}
          <div className="relative w-full h-5 flex flex-row text-xs font-semibold text-slate-400 pl-8 mb-1">
            {uniqueMonths.map((m, idx) => (
              <span 
                key={idx} 
                className="absolute transition-all"
                style={{ left: `${2 + m.index * 17.5}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Viikonpäivät + Grid rinnakkain */}
          <div className="flex flex-row items-start gap-2">
            
            {/* Päiväindikaattorit vasemmassa reunassa (Ma, Ke, Pe) */}
            <div className="flex flex-col justify-between text-[11px] font-bold text-slate-400 h-[116px] pr-1 pt-[2px]">
              <span>Ma</span>
              <span>Ke</span>
              <span>Pe</span>
            </div>

            {/* GitHub-tyylinen Grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] h-[116px]">
              {cells.map((cell, idx) => (
                <div
                  key={idx}
                  title={`${cell.dateString}: ${cell.count} hakemusta`}
                  className={`w-3.5 h-3.5 rounded-[3px] transition-colors duration-200 cursor-pointer ${getColorClass(cell.count)}`}
                />
              ))}
            </div>

          </div>

          {/* Alareunan legenda (Vähemmän -> Enemmän) */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 pl-8 mt-4 self-start">
            <span>Vähemmän</span>
            <div className="flex gap-[3px]">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-50/30 border border-slate-100/50" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-100/70" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-200" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-300" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-400" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-500" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-600" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-700" />
            </div>
            <span>Enemmän</span>
          </div>

        </div>
      </div>

      {/* Alatunniste kokonaismäärällä */}
      <p className="text-sm font-medium text-slate-500">
        Yhteensä <span className="font-bold text-slate-800">{totalActivities}</span> aktiviteettia
      </p>

    </div>
  );
}