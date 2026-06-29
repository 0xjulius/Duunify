"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { MapPin, ArrowRight } from "lucide-react";

// Ladataan kartta dynaamisesti SSR-yhteensopivuuden vuoksi
const Map = dynamic(() => import("./MapComponent"), { ssr: false });

// Apufunktio koordinaattien hakuun
const getCoords = (city: string): [number, number] => {
  const locations: Record<string, [number, number]> = {
    "tampere": [61.4978, 23.7610],
    "helsinki": [60.1699, 24.9384],
    "vantaa": [60.2934, 25.0378],
    "espoo": [60.2054, 24.6559],
    "turku": [60.4515, 22.2666],
    "oulu": [65.0121, 25.4650],
    "vaasa": [63.0950, 21.6166],
    "jyväskylä": [62.2415, 25.7209],
    "kuopio": [62.8924, 27.6777],
    "lahti": [60.9827, 25.6612],
  };
  return locations[city.toLowerCase()] || [64.9121, 26.5912]; // Suomen keskipiste oletuksena
};

export default function LocationsCard() {
  const [stats, setStats] = useState<{ name: string; count: number }[]>([]);
  const [showModal, setShowModal] = useState(false);

  async function fetchStats() {
    const { data } = await supabase.from("applications").select("location");
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((d) => {
        if (d.location) counts[d.location] = (counts[d.location] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setStats(sorted);
    }
  }

  useEffect(() => {
    fetchStats();

    // Reaaliaikainen päivitys
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        fetchStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Valmistellaan markkerit kartalle
  const mapMarkers = stats.map((s) => ({
    position: getCoords(s.name),
    name: s.name,
    count: s.count,
  }));

  return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col justify-between">
          <h3 className="text-lg font-bold text-slate-900">Sijainnit</h3>
          <div className="flex items-start gap-4 flex-1 overflow-hidden">
          <div className="max-w-30 lg:max-w-40 shrink-0 mt-4">
          <img 
            src="/fi.svg" 
            alt="Suomen kartta" 
            className="w-full h-auto object-contain"
          />
          </div>
          
      {/* Lista paikkakunnista */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {stats.length > 0 ? (
          stats.map((loc, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                <span className="truncate max-w-[140px]">{loc.name}</span>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {loc.count}
              </span>
              </div>
              
          ))
        ) : (
          <p className="text-sm text-slate-400 italic">Ei sijaintitietoja.</p>
        )}
      </div>
</div>
      {/* Nappi, joka ei muuta logiikkaa */}
      <button 
        onClick={() => setShowModal(true)}
        className="mt-2 py-2 px-4 max-w-40 border rounded-2xl border-grey-500 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
      >
        Näytä kartalla <ArrowRight size={14} />
      </button>

      {/* Modal-ikkuna kartalle */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-2 rounded-2xl w-full max-w-2xl h-150 relative shadow-2xl">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1.5 rounded-lg shadow text-xs font-bold hover:bg-slate-50 transition-all"
            >
              Sulje
            </button>
            <Map markers={mapMarkers} />
          </div>
        </div>
      )}
    </div>
  );
}