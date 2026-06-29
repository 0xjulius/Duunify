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

// Määritellään tilat, värit ja tunnistussanat (sekä suomeksi että englanniksi)
const STATUS_CONFIG = [
  { keys: ["haettu", "applied"], name: "Haettu", color: "#6366f1" },
  { keys: ["haastattelu", "interview"], name: "Haastattelu", color: "#f59e0b" },
  { keys: ["tarjous", "offer"], name: "Tarjous", color: "#22c55e" },
  { keys: ["hylätty", "hylätyt", "rejected"], name: "Hylätyt", color: "#ef4444" },
  { keys: ["ei vastausta", "no response", "no_response"], name: "Ei vastausta", color: "#cbd5e1" },
];

export default function ApplicationsChart() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsStatus();
  }, []);

  async function fetchApplicationsStatus() {
    setLoading(true);
    
    // Haetaan kaikkien hakemusten tilat Supabasesta
    const { data: applications, error } = await supabase
      .from("applications")
      .select("status");

    if (error) {
      console.error("Virhe haettaessa kaaviodataa:", error);
      setLoading(false);
      return;
    }

    const total = applications?.length || 0;
    setTotalApplications(total);

    // Lasketaan dynaamisesti rivit Rechartsia varten
    const calculatedData: ChartRow[] = STATUS_CONFIG.map((status) => {
      // Lasketaan kuinka monta hakemusta mätsää kyseiseen tilaan
      const count = applications?.filter((app) => {
        const appStatus = app.status?.toLowerCase().trim();
        return status.keys.includes(appStatus);
      }).length || 0;

      // Lasketaan prosenttiosuus pyöristettynä lähimpään kokonaislukuun
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

      return {
        name: status.name,
        value: count,
        percentage: percentage,
        color: status.color,
      };
    });

    setData(calculatedData);
    setLoading(false);
  }

  // Lataustila sovitettu yhteen trendikaavion tyylin kanssa (h-[320px])
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
      
      {/* Otsikkoalue */}
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Hakemukset tilan mukaan
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Nykyisten hakemustesi jakautuminen.
        </p>
      </div>

      {/* Sisältöalue */}
      <div className="flex flex-row items-center justify-center gap-6 lg:gap-10 flex-1 h-full mt-2">
        
        {/* Donitsikaavio ja sen keskusteksti */}
        <div className="relative w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}  
                outerRadius={75}
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
          
          {/* Keskusteksti dynaamisella kokonaismäärällä */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 leading-none">
              {totalApplications}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              yhteensä
            </span>
          </div>
        </div>

        {/* Oikean reunan selitelista (Legend) */}
        <div className="flex-1 max-w-[200px] flex flex-col gap-2.5">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
              
              {/* Väripallura ja tila */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium truncate">{item.name}</span>
              </div>
              
              {/* Dynaamiset määrät ja prosentit */}
              <div className="text-slate-900 font-semibold flex items-center gap-1 flex-shrink-0 pl-2">
                <span>{item.value}</span>
                <span className="text-slate-400 font-normal text-[11px]">
                  ({item.percentage}%)
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}