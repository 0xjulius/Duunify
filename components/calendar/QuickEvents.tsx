"use client";

import { useMemo, useState } from "react";
import { Calendar, Plus, Search, Trash2 } from "lucide-react";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

export default function QuickEvents({
  events,
  onAddClick,
  onDelete,
}: {
  events: UnifiedEvent[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((e) => e.date >= today)
      .filter((e) =>
        query
          ? (e.title + e.subtitle).toLowerCase().includes(query.toLowerCase())
          : true
      )
      .slice(0, 10);
  }, [events, query]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-500" />
          Tulevat
        </h2>
        <button
          onClick={onAddClick}
          className="bg-slate-900 text-white p-1.5 rounded-lg hover:bg-slate-800"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Etsi tapahtumia..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {upcoming.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-8">
            Ei tulevia tapahtumia.
          </p>
        )}

        {upcoming.map((e) => {
          const colors = EVENT_COLORS[e.type];
          return (
            <div
              key={e.id}
              className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors.dot }}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {EVENT_TYPE_LABELS[e.type]}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {e.type === "deadline" ? e.subtitle : e.title}
                </p>
                {e.subtitle && e.type !== "deadline" && (
                  <p className="text-xs text-slate-500 truncate">{e.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md border border-slate-200">
                  {e.date.toLocaleDateString("fi-FI", { day: "numeric", month: "short" })}
                </span>
                {e.editable && (
                  <button
                    onClick={() => onDelete(e.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}