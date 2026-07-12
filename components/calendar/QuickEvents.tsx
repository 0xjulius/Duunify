"use client";

import { useMemo, useState } from "react";
import { Calendar, Search, Trash2, CheckCircle2 } from "lucide-react";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

export default function QuickEvents({
  events,
  onDelete,
  onSelectEvent,
}: {
  events: UnifiedEvent[];
  onDelete?: (id: string) => void;
  onSelectEvent: (event: UnifiedEvent) => void;
}) {
  const [query, setQuery] = useState("");

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((e) => {
        const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
        return eventDate >= today;
      })
      .filter((e) => {
        if (!query) return true;
        const searchString = `${e.title || ""} ${e.subtitle || ""}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
      });
  }, [events, query]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 h-full min-h-0 flex flex-col transition-colors duration-200">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500 dark:text-indigo-400" />
          Tulevat tapahtumat
        </h2>
      </div>

      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={14} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Etsi tapahtumia..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 max-h-[350px]">
        {upcoming.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
            Ei tulevia tapahtumia.
          </p>
        )}

        {upcoming.map((e) => {
          const typeKey = e.type as keyof typeof EVENT_COLORS;
          const colors = EVENT_COLORS[typeKey] || { dot: "#94a3b8" };
          
          const labelKey = e.type as keyof typeof EVENT_TYPE_LABELS;
          const label = EVENT_TYPE_LABELS[labelKey] || e.type;

          const dateObj = e.date instanceof Date ? e.date : new Date(e.date);

          return (
            <div
              key={e.id}
              onClick={() => onSelectEvent(e)}
              className={`flex justify-between items-center p-2.5 rounded-xl border border-slate-50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer ${
                e.completed ? "opacity-55" : ""
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors.dot }}
                  />
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {label}
                  </p>
                  {e.completed && (
                    <CheckCircle2 size={10} className="text-emerald-500 dark:text-emerald-400" />
                  )}
                </div>
                
                <p
                  className={`text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5 ${
                    e.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
                  }`}
                >
                  {e.title}
                </p>
                
                {e.subtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{e.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  {dateObj.toLocaleDateString("fi-FI", { day: "numeric", month: "short" })}
                </span>
                {e.editable && onDelete && (
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete(e.id);
                    }}
                    className="md:opacity-0 group-hover:opacity-100 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition p-0.5"
                  >
                    <Trash2 size={12} />
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