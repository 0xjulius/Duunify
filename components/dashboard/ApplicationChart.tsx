"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";

type ChartRow = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

const STATUS_CONFIG = [
  { keys: ["tallennettu", "saved"], name: "Tallennetut", color: "#FFE135" },
  { keys: ["haettu", "applied"], name: "Haettu", color: "#6366f1" },
  { keys: ["haastattelu", "interview"], name: "Haastattelu", color: "#f59e0b" },
  { keys: ["tarjous", "offer"], name: "Tarjous", color: "#22c55e" },
  { keys: ["hylätty", "hylätyt", "rejected"], name: "Hylätyt", color: "#ef4444" },
  { keys: ["ei vastausta", "no response", "no_response"], name: "Ei vastausta", color: "#cbd5e1" },
];

function calculate(applications: { status: string }[]): { data: ChartRow[]; total: number } {
  const total = applications.length;

  const data = STATUS_CONFIG.map((status) => {
    const count = applications.filter((app) => {
      const appStatus = app.status?.toLowerCase().trim();
      return status.keys.includes(appStatus);
    }).length;

    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return { name: status.name, value: count, percentage, color: status.color };
  });

  return { data, total };
}

export default function ApplicationsChart({
  demoApplications,
}: {
  demoApplications?: { status: string }[];
}) {
  const initial = demoApplications ? calculate(demoApplications) : null;

  const [data, setData] = useState<ChartRow[]>(initial?.data || []);
  const [totalApplications, setTotalApplications] = useState(initial?.total || 0);
  const [loading, setLoading] = useState(!demoApplications);

  useEffect(() => {
    if (demoApplications) return;
    fetchApplicationsStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchApplicationsStatus() {
    setLoading(true);

    const { data: applications, error } = await supabase
      .from("applications")
      .select("status");

    if (error) {
      console.error("Virhe haettaessa kaaviodataa:", error);
      setLoading(false);
      return;
    }

    const { data: calculatedData, total } = calculate(applications || []);
    setTotalApplications(total);
    setData(calculatedData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Ladataan tilastoja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Työnhaku tilan mukaan</h3>
        <p className="text-xs text-slate-500 mt-0.5">Tallennetut ja aktiiviset prosessit.</p>
      </div>

      <div className="flex flex-row items-center justify-center gap-4 flex-1 h-full mt-2 overflow-hidden">
        <div className="relative w-[140px] h-[140px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900">{totalApplications}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">kpl</span>
          </div>
        </div>

        <div className="flex-1 max-h-[220px] overflow-y-auto flex flex-col gap-1.5 pr-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium truncate">{item.name}</span>
              </div>
              <div className="text-slate-900 font-semibold flex items-center gap-1 flex-shrink-0">
                <span>{item.value}</span>
                <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}