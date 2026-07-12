"use client";

import { useTheme } from "next-themes";
import { Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

export default function ConsistencyCard({
  percentage,
}: {
  percentage: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const axisColor = isDark ? "#64748b" : "#94a3b8";

  const data = [
    { day: "Ma", count: 1 },
    { day: "Ti", count: 0 },
    { day: "Ke", count: 2 },
    { day: "To", count: 1 },
    { day: "Pe", count: 3 },
    { day: "La", count: 0 },
    { day: "Su", count: 1 },
  ];

  const [historyOpen, setHistoryOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // Swipe-tilat molemmille dialogeille erikseen
  const [touchStart, setTouchStart] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    if (diff > 0) {
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = (onClose: () => void) => {
    setIsSwiping(false);
    if (translateX > 100) {
      onClose();
    }
    setTranslateX(0);
  };

  let strokeColor = "stroke-slate-400 dark:stroke-slate-500";
  let badgeColor =
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";

  if (percentage <= 20) {
    strokeColor = "stroke-red-700 dark:stroke-red-400";
    badgeColor = "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300";
  } else if (percentage <= 39) {
    strokeColor = "stroke-red-500 dark:stroke-red-400";
    badgeColor = "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300";
  } else if (percentage <= 54) {
    strokeColor = "stroke-amber-500 dark:stroke-amber-400";
    badgeColor =
      "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300";
  } else if (percentage <= 69) {
    strokeColor = "stroke-orange-500 dark:stroke-orange-400";
    badgeColor =
      "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300";
  } else if (percentage <= 84) {
    strokeColor = "stroke-emerald-500 dark:stroke-emerald-400";
    badgeColor =
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  } else {
    strokeColor = "stroke-emerald-600 dark:stroke-emerald-400";
    badgeColor =
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <>
      {/* Päänäkymän klikattava kortti */}
      <div 
        onClick={() => setHistoryOpen(true)}
        className="relative flex h-[150px] flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setInfoOpen(true);
            }}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tietoa aktiivisuudesta"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold tracking-tight text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Työnhaun aktiivisuus
          </h3>

          <span
            className={`mt-2 inline-flex w-fit rounded-xl px-3 py-1 text-3xl font-bold ${badgeColor}`}
          >
            {percentage}%
          </span>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Viimeiset 7 päivää
          </p>
        </div>

        <div className="relative h-20 w-20 mr-8 md:hidden xl:block xl:mr-2 2xl:mr-8">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 52 52">
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
            />
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
      </div>

      {/* DIALOGI 1: Aktiivisuushistoria */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd(() => setHistoryOpen(false))}
          style={{
            left: historyOpen && translateX > 0 ? `calc(50% + ${translateX}px)` : "50%",
            transition: isSwiping ? "none" : "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="!max-w-md !w-[95vw] h-auto max-h-[85vh] p-6 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl select-none"
        >
          <DialogHeader>
            <DialogTitle>Aktiivisuushistoria</DialogTitle>
          </DialogHeader>
          <div className="h-64 w-full mt-4 flex flex-col justify-between">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="day" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <ChartTooltip
                    contentStyle={
                      isDark
                        ? {
                            background: "#1e293b",
                            border: "1px solid #334155",
                            color: "#e2e8f0",
                          }
                        : undefined
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-2">
              Olet ollut aktiivinen <strong>{percentage}%</strong> ajasta viimeisen viikon aikana.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOGI 2: Infolaatikko */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd(() => setInfoOpen(false))}
          style={{
            left: infoOpen && translateX > 0 ? `calc(50% + ${translateX}px)` : "50%",
            transition: isSwiping ? "none" : "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="!max-w-md !w-[95vw] h-auto max-h-[85vh] p-6 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl select-none"
        >
          <DialogHeader>
            <DialogTitle>Työnhaun aktiivisuus</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300 mt-4 text-left">
            <p>
              Työnhaun aktiivisuus kertoo, kuinka säännöllisesti olet ollut
              aktiivinen työnhaussa viimeisen viikon aikana.
            </p>

            <p>
              Aktiivisuudeksi lasketaan esimerkiksi hakemuksen lähettäminen tai
              työpaikan tallentaminen suosikkeihin.
            </p>

            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 font-medium text-center">
              Kaava: (Aktiiviset päivät / 7) × 100
            </div>

            <p>
              Mitä korkeampi prosentti on, sitä tasaisempaa työnhakusi on.
              Säännöllinen aktiivisuus kasvattaa mahdollisuuksiasi löytää uuden
              työpaikan.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}