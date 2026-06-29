"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  eachDayOfInterval,
  format,
  subDays,
  isAfter,
} from "date-fns";

type ChartRow = {
  day: string;
  applications: number;
};

type Application = {
  applied_date: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 font-bold text-sm text-indigo-400">
          {payload[0].value} hakemusta kasassa
        </p>
      </div>
    );
  }
  return null;
};

export default function ApplicationTrendChart() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Haetaan 60 päivää, jotta voidaan verrata nykyistä 30 päivää sitä edeltävään 30 päivään
    const baseDate = new Date();
    const startOfCurrentPeriod = subDays(baseDate, 29);
    const startOfPreviousPeriod = subDays(baseDate, 59);

    const { data: applications, error } = await supabase
      .from("applications")
      .select("applied_date")
      .gte("applied_date", format(startOfPreviousPeriod, "yyyy-MM-dd"))
      .order("applied_date");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const rows = applications as Application[];

    // Jaetaan hakemukset kahteen jaksoon vertailua varten
    const currentPeriodRows = rows.filter(a => 
      !isAfter(startOfCurrentPeriod, new Date(a.applied_date))
    );
    const previousPeriodRows = rows.filter(a => 
      isAfter(startOfCurrentPeriod, new Date(a.applied_date))
    );

    // Lasketaan prosentuaalinen muutos alalaitaa varten
    const currentTotal = currentPeriodRows.length;
    const previousTotal = previousPeriodRows.length;
    
    setTotalCount(currentTotal);

    if (previousTotal > 0) {
      const change = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
      setPercentageChange(change);
    } else {
      setPercentageChange(currentTotal > 0 ? 100 : 0);
    }

    // Luodaan x-akselin päivät (viimeiset 30 päivää)
    const days = eachDayOfInterval({
      start: startOfCurrentPeriod,
      end: baseDate,
    });

    // Tehdään datasta kumulatiivinen (nouseva käyrä, kuten kuvassa image_bd947d.png)
    let cumulativeSum = 0;
    const chartData: ChartRow[] = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const daysCount = currentPeriodRows.filter(a => a.applied_date === dateStr).length;
      
      cumulativeSum += daysCount; // Lisätään päivän hakemukset edelliseen summaan

      return {
        day: format(day, "d.M."), // Suomalainen päivämuoto (esim. 21.4.)
        applications: cumulativeSum,
      };
    });

    setData(chartData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Ladataan trendiä...</p>
        </div>
      </div>
    );
  }

  return (
    // Korkeus h-[320px] täsmää nyt täydellisesti uuden ympyräkaavion kanssa
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between h-[340px]">
      
      {/* Yläosa: Otsikko ja "X yhteensä" samalla rivillä */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Hakemuksia ajassa
        </h2>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
          {totalCount} yhteensä
        </span>
      </div>

      {/* Kaavioalue */}
      <div className="h-[180px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {/* Vaihdettu AreaChartiksi */}
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: -25,
              bottom: 0,
            }}
          >
            {/* Liukuvärin (Gradient) määrittely viivan alle */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Kuvassa näkyy haaleat ruudukkoviivat sekä pystyyn että vaakaan */}
            <CartesianGrid
              strokeDasharray="0"
              stroke="#f1f5f9" 
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              dy={10}
              // Poimii sopivin väliajoin päivät (esim 7 päivän välein kuten kuvassa), jotta akseli on siisti
              interval={Math.floor(data.length / 5)} 
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Itse täytetty alue ja nouseva pääviiva */}
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#6366f1" // Indigo-500
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)" // Kytketään yllä luotu gradientti täytteeksi
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alaosa: Trendivertailu */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold mt-2">
        {percentageChange >= 0 ? (
          <span className="text-emerald-600 flex items-center gap-1">
            ↑ {percentageChange} % <span className="text-slate-500 font-medium">enemmän kuin edelliset 30 päivää</span>
          </span>
        ) : (
          <span className="text-amber-600 flex items-center gap-1">
            ↓ {Math.abs(percentageChange)} % <span className="text-slate-500 font-medium">vähemmän kuin edelliset 30 päivää</span>
          </span>
        )}
      </div>

    </div>
  );
}