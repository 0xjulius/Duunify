"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Plus, Search } from "lucide-react";

export default function QuickEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Haetaan hakemukset, joissa on status "Haastattelu" tai vastaava
    async function fetchUpcoming() {
      const { data } = await supabase
        .from("applications")
        .select("company, job_title, created_at")
        .limit(5);
      if (data) setEvents(data);
    }
    fetchUpcoming();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-500" />
          Tulevat
        </h2>
        <button className="bg-slate-900 text-white p-1.5 rounded-lg hover:bg-slate-800">
          <Plus size={16} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        <input 
          placeholder="Etsi tapahtumia..." 
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-900">{e.company}</p>
              <p className="text-xs text-slate-500">{e.job_title}</p>
            </div>
            <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md border border-slate-200">
              {new Date(e.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}