"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { eachDayOfInterval, format, subDays, isAfter, startOfDay, parseISO } from "date-fns";

type ChartRow = { day: string; applications: number };
type Application = { applied_date: string };

function makeCustomTooltip(isDark: boolean) {
  return function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-xl shadow-xl text-xs border ${
            isDark
              ? "bg-slate-800 text-slate-100 border-slate-700"
              : "bg-slate-900 text-white border-slate-800"
          }`}
        >
          <p className={isDark ? "text-slate-400" : "text-slate-400"}>{label}</p>
          <p className="mt-0.5 font-bold text-sm text-indigo-400">
            {payload[0].value} hakemusta kasassa
          </p>
        </div>
      );
    }
    return null;
  };
}

// Apufunktio muuttamaan erilaiset pvm-formaatit vertailukelpoiseksi stringiksi (YYYY-MM-DD)
function normalizeDateStr(dateInput: string): string {
  try {
    const d = dateInput.includes("T") ? parseISO(dateInput) : new Date(dateInput);
    return format(d, "yyyy-MM-dd");
  } catch {
    return dateInput;
  }
}

function calculate(rows: Application[]) {
  const baseDate = new Date();
  const startOfCurrentPeriod = subDays(baseDate, 59); // Säädetty 60 päivän tarkastelujaksolle

  // Suodatetaan ja normitetaan hakemukset
  const normalizedRows = rows.map(r => ({
    ...r,
    normalized_date: normalizeDateStr(r.applied_date)
  }));

  const currentPeriodRows = normalizedRows.filter(
    (a) => !isAfter(startOfCurrentPeriod, startOfDay(new Date(a.applied_date)))
  );
  const previousPeriodRows = normalizedRows.filter((a) =>
    isAfter(startOfCurrentPeriod, startOfDay(new Date(a.applied_date)))
  );

  const currentTotal = currentPeriodRows.length;
  const previousTotal = previousPeriodRows.length;

  const percentageChange =
    previousTotal > 0
      ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
      : currentTotal > 0
        ? 100
        : 0;

  const days = eachDayOfInterval({ start: startOfCurrentPeriod, end: baseDate });

  let cumulativeSum = 0;
  const chartData: ChartRow[] = days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    // Verrataan normitettuja päivämääriä (ohittaa kellonajat)
    const daysCount = currentPeriodRows.filter((a) => a.normalized_date === dateStr).length;
    cumulativeSum += daysCount;
    return { day: format(day, "d.M."), applications: cumulativeSum };
  });

  return { chartData, currentTotal, percentageChange };
}

export default function ApplicationTrendChart({
  demoApplications,
}: {
  demoApplications?: Application[];
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const CustomTooltip = makeCustomTooltip(isDark);

  const initial = demoApplications ? calculate(demoApplications) : null;

  const [data, setData] = useState<ChartRow[]>(initial?.chartData || []);
  const [totalCount, setTotalCount] = useState(initial?.currentTotal || 0);
  const [percentageChange, setPercentageChange] = useState(initial?.percentageChange || 0);
  const [loading, setLoading] = useState(!demoApplications);

  useEffect(() => {
    if (demoApplications) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    setLoading(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Ei voimassa olevaa istuntoa trendikomponentissa.");
      setLoading(false);
      router.push("/login");
      return;
    }

    const baseDate = new Date();
    // Haetaan yhteensä 120 päivää, jotta saadaan vertailudata edelliselle 60 päivälle
    const startOfPreviousPeriod = subDays(baseDate, 119);
    const formattedStartDate = format(startOfPreviousPeriod, "yyyy-MM-dd");

    const { data: applications, error } = await supabase
      .from("applications")
      .select("applied_date")
      .eq("user_id", session.user.id)
      .gte("applied_date", formattedStartDate)
      .order("applied_date");

    if (error) {
      console.error("Virhe ladattaessa trendidataa:", error);
      setLoading(false);
      return;
    }

    const { chartData, currentTotal, percentageChange } = calculate(
      (applications as Application[]) || []
    );

    setData(chartData);
    setTotalCount(currentTotal);
    setPercentageChange(percentageChange);
    loading && setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Ladataan trendiä...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between h-[340px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Hakemuksia ajassa (60 pv)</h2>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg">
          {totalCount} yhteensä
        </span>
      </div>

      <div className="h-[180px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke={gridColor} />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval={Math.floor(data.length / 6)} // Välimatka X-akselin pvm-merkinnöille
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="applications"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold mt-2">
        {percentageChange >= 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            ↑ {percentageChange} % <span className="text-slate-500 dark:text-slate-400 font-medium">enemmän kuin edelliset 60 päivää</span>
          </span>
        ) : (
          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
            ↓ {Math.abs(percentageChange)} % <span className="text-slate-500 dark:text-slate-400 font-medium">vähemmän kuin edelliset 60 päivää</span>
          </span>
        )}
      </div>
    </div>
  );
}