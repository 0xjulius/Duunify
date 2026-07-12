"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UnifiedEvent, EVENT_COLORS } from "@/lib/calendar";

const WEEKDAY_LABELS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // maanantai = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "4px",
};

export default function MiniCalendar({
  events,
  onSelectDate,
}: {
  events: UnifiedEvent[];
  onSelectDate: (date: Date) => void;
}) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, UnifiedEvent[]> = {};
    events.forEach((e) => {
      const key = e.date.toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const today = new Date();

  function isSameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm capitalize">
          {cursor.toLocaleDateString("fi-FI", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div style={gridStyle} className="mb-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} style={{ aspectRatio: "1 / 1" }} />;

          const dayEvents = eventsByDay[date.toDateString()] || [];
          const isToday = isSameDay(date, today);
          const isSelected = selected && isSameDay(date, selected);

          return (
            <button
              key={i}
              onClick={() => {
                setSelected(date);
                onSelectDate(date);
              }}
              style={{ aspectRatio: "1 / 1" }}
              className={`w-full rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-0.5 transition-all
                ${
                  isSelected 
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white font-bold" 
                    : isToday 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              {date.getDate()}
              {dayEvents.length > 0 && (
                <span className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, idx) => (
                    <span
                      key={idx}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? "white"
                          : EVENT_COLORS[e.type].dot,
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}