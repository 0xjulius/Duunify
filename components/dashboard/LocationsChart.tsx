"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { MapPin, ArrowRight } from "lucide-react";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

const getCoords = (city: string): [number, number] => {
  const locations: Record<string, [number, number]> = {
    tampere: [61.4978, 23.761],
    helsinki: [60.1699, 24.9384],
    vantaa: [60.2934, 25.0378],
    espoo: [60.2054, 24.6559],
    turku: [60.4515, 22.2666],
    oulu: [65.0121, 25.465],
    vaasa: [63.095, 21.6166],
    jyväskylä: [62.2415, 25.7209],
    kuopio: [62.8924, 27.6777],
    lahti: [60.9827, 25.6612],
  };
  return locations[city.toLowerCase()] || [64.9121, 26.5912];
};

const LocationsSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col justify-between animate-pulse">
    <div className="h-6 w-1/3 bg-slate-200 rounded-lg mb-4" />
    <div className="flex items-start gap-4 flex-1 overflow-hidden">
      <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 mt-4" />
      <div className="flex-1 space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-full bg-slate-100 rounded" />
        ))}
      </div>
    </div>
    <div className="h-10 w-32 bg-slate-100 rounded-2xl mt-2" />
  </div>
);

type LocationStat = { name: string; count: number };

export default function LocationsCard({
  demoData,
}: {
  demoData?: LocationStat[];
}) {
  const [stats, setStats] = useState<LocationStat[]>(demoData || []);
  const [loading, setLoading] = useState(!demoData);
  const [showModal, setShowModal] = useState(false);

  async function fetchStats() {
    try {
      const { data } = await supabase.from("applications").select("location");
      if (data) {
        const counts: Record<string, number> = {};

        data.forEach((d) => {
          if (d.location) {
            // 1. Pilkotaan merkkijono pilkun kohdalta (esim. "Tampere, Helsinki" -> ["Tampere", " Helsinki"])
            // 2. .map(c => c.trim()) poistaa turhat välilyönnit ympäriltä
            const cities = d.location.split(",").map((c: string) => c.trim());

            // Lisätään jokainen kaupunki tilastoihin erikseen
            cities.forEach((city) => {
              if (city) {
                // Varmistetaan ettei ole tyhjä merkkijono
                counts[city] = (counts[city] || 0) + 1;
              }
            });
          }
        });

        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setStats(sorted);
      }
    } catch (error) {
      console.error("Virhe haettaessa tilastoja:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Demo-tilassa data tulee valmiina propsina — ei fetchia eikä realtime-tilausta.
    if (demoData) return;

    fetchStats();
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapMarkers = stats.map((s) => ({
    position: getCoords(s.name),
    name: s.name,
    count: s.count,
  }));

  if (loading) return <LocationsSkeleton />;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full h-[340px] flex flex-col justify-between">
      <h3 className="text-lg font-bold text-slate-900">Työmahdollisuudet</h3>
      <div className="flex items-start gap-4 flex-1 overflow-hidden">
        <div className="max-w-30 lg:max-w-40 shrink-0 mt-4">
          <img
            src="/fi.svg"
            alt="Suomen kartta"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex-1 overflow-y-auto h-full pr-2 py-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
          {stats.length > 0 ? (
            stats.map((loc, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin
                    size={14}
                    className="text-indigo-400 group-hover:text-indigo-600 transition-colors"
                  />
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

      <button
        onClick={() => setShowModal(true)}
        className="mt-2 py-2 px-4 max-w-40 border rounded-2xl border-slate-300 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
      >
        Näytä kartalla <ArrowRight size={14} />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-2 rounded-2xl w-full max-w-2xl h-[500px] relative shadow-2xl">
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
