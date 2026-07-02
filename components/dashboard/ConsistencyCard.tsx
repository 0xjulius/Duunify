"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  // Esimerkkidataa – voit korvata tämän dynaamisella datalla
  const data = [
    { day: "Ma", count: 1 },
    { day: "Ti", count: 0 },
    { day: "Ke", count: 2 },
    { day: "To", count: 1 },
    { day: "Pe", count: 3 },
    { day: "La", count: 0 },
    { day: "Su", count: 1 },
  ];

  // Väri-logiikka
  let strokeColor = "stroke-slate-400";
  let badgeColor = "bg-slate-100 text-slate-700";

  if (percentage <= 20) {
    strokeColor = "stroke-red-700";
    badgeColor = "bg-red-100 text-red-700";
  } else if (percentage <= 39) {
    strokeColor = "stroke-red-500";
    badgeColor = "bg-red-100 text-red-700";
  } else if (percentage <= 54) {
    strokeColor = "stroke-amber-500";
    badgeColor = "bg-amber-100 text-amber-700";
  } else if (percentage <= 69) {
    strokeColor = "stroke-orange-500";
    badgeColor = "bg-orange-100 text-orange-700";
  } else if (percentage <= 84) {
    strokeColor = "stroke-emerald-500";
    badgeColor = "bg-emerald-100 text-emerald-700";
  } else {
    strokeColor = "stroke-emerald-600";
    badgeColor = "bg-emerald-100 text-emerald-700";
  }

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex h-[150px] flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-slate-300">
          {/* Ikonin sijoitus oikeaan yläkulmaan */}
          <div className="absolute top-4 right-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3">
                  <p className="text-xs leading-relaxed">
                    <strong>Työnhaun aktiivisuus</strong> kertoo, kuinka
                    säännöllisesti olet ollut aktiivinen työnhaussa viimeisen
                    viikon aikana.
                    <br />
                    <br />
                    Aktiivisuudeksi lasketaan esimerkiksi hakemuksen
                    lähettäminen tai työpaikan tallentaminen suosikkeihin.
                    <br />
                    <br />
                    <span className="font-medium text-slate-500">
                      Kaava: (Aktiiviset päivät / 7) × 100
                    </span>
                    <br />
                    <br />
                    Mitä korkeampi prosentti on, sitä tasaisempaa työnhakusi on.
                    Säännöllinen aktiivisuus kasvattaa mahdollisuuksiasi löytää
                    uusi työpaikka.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-tight text-slate-500 flex items-center gap-2">
              Työnhaun aktiivisuus
            </h3>

            <span
              className={`mt-2 inline-flex w-fit rounded-xl px-3 py-1 text-3xl font-bold ${badgeColor}`}
            >
              {percentage}%
            </span>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Viimeiset 7 päivää
            </p>
          </div>

          {/* Progress-rengas */}
          <div className="relative h-20 w-20  mr-8 md:hidden xl:block xl:mr-2 2xl:mr-8">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                className="stroke-slate-100"
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
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aktiivisuushistoria</DialogTitle>
        </DialogHeader>
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-6 text-center">
            Olet ollut aktiivinen <strong>{percentage}%</strong> ajasta
            viimeisen viikon aikana.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
