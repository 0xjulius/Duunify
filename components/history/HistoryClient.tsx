"use client";

import { useMemo, useState } from "react";
import {
  Search,
  FilePlus2,
  RefreshCw,
  Trash2,
  CalendarPlus,
  Activity,
  CalendarRange,
  Bookmark,
} from "lucide-react";

type EventType =
  | "created"
  | "status_changed"
  | "note_added"
  | "event_added"
  | "deleted";

interface HistoryItem {
  id: string;
  event: EventType;
  company: string;
  jobTitle: string;
  oldStatus: string | null;
  newStatus: string | null;
  createdAt: string; // ISO
}

interface EventMeta {
  label: string;
  icon: any;
  bg: string;
  text: string;
  dot: string;
}

const EVENT_META: Record<EventType, EventMeta> = {
  created: {
    label: "Hakemus luotu",
    icon: FilePlus2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "#10B981",
  },
  status_changed: {
    label: "Tila päivitetty",
    icon: RefreshCw,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "#6D67F2",
  },
  note_added: {
    label: "Muistiinpano lisätty",
    icon: Activity,
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "#F59E0B",
  },
  event_added: {
    label: "Kalenteritapahtuma",
    icon: CalendarPlus,
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "#0EA5E9",
  },
  deleted: {
    label: "Hakemus poistettu",
    icon: Trash2,
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "#F43F5E",
  },
};

const FILTERS: { key: EventType | "all"; label: string }[] = [
  { key: "all", label: "Kaikki" },
  { key: "created", label: "Luodut" },
  { key: "status_changed", label: "Tilamuutokset" },
  { key: "event_added", label: "Kalenteri" },
  { key: "note_added", label: "Muistiinpanot" },
  { key: "deleted", label: "Poistetut" },
];

type DateRangeKey =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "custom";

const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "all", label: "Kaikki" },
  { key: "today", label: "Tänään" },
  { key: "yesterday", label: "Eilen" },
  { key: "last7", label: "Viim. 7 pv" },
  { key: "last30", label: "Viim. 30 pv" },
  { key: "thisMonth", label: "Tässä kuussa" },
  { key: "custom", label: "Mukautettu" },
];

function getRangeBounds(key: DateRangeKey, customFrom: string, customTo: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  switch (key) {
    case "today": {
      const end = new Date(startOfToday);
      end.setHours(23, 59, 59, 999);
      return { from: startOfToday, to: end };
    }
    case "yesterday": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 1);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };
    }
    case "last7": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 6);
      return { from: start, to: null };
    }
    case "last30": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 29);
      return { from: start, to: null };
    }
    case "thisMonth": {
      const start = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
      return { from: start, to: null };
    }
    case "custom": {
      const from = customFrom ? new Date(customFrom) : null;
      const to = customTo ? new Date(`${customTo}T23:59:59`) : null;
      return { from, to };
    }
    default:
      return { from: null, to: null };
  }
}

function groupByDay(items: HistoryItem[]) {
  const groups: Record<string, HistoryItem[]> = {};

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = date.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return Object.entries(groups).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

function formatDayLabel(dateKey: string) {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Tänään";
  if (date.toDateString() === yesterday.toDateString()) return "Eilen";

  return date.toLocaleDateString("fi-FI", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function HistoryClient({ items }: { items: HistoryItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EventType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filtered = useMemo(() => {
    const { from, to } = getRangeBounds(dateRange, customFrom, customTo);

    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.event === filter;

      const haystack = `${item.company} ${item.jobTitle}`.toLowerCase();
      const matchesQuery = query
        ? haystack.includes(query.toLowerCase())
        : true;

      const itemDate = new Date(item.createdAt);
      const matchesFrom = from ? itemDate >= from : true;
      const matchesTo = to ? itemDate <= to : true;

      return matchesFilter && matchesQuery && matchesFrom && matchesTo;
    });
  }, [items, query, filter, dateRange, customFrom, customTo]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const stats = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: items.length,
      thisWeek: items.filter((i) => new Date(i.createdAt) >= weekAgo).length,
      statusChanges: items.filter((i) => i.event === "status_changed").length,
    };
  }, [items]);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Toimintaloki</h1>
        
        <p className="text-slate-500 mt-1">
          Kaikki hakemuksiisi liittyvät tapahtumat yhdessä paikassa.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Tapahtumaa yhteensä</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{stats.thisWeek}</p>
          <p className="text-xs text-slate-500 mt-1">Viimeisen 7 päivän aikana</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">
            {stats.statusChanges}
          </p>
          <p className="text-xs text-slate-500 mt-1">Tilamuutosta</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Etsi yrityksen tai tehtävän mukaan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Tapahtumatyyppi */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                filter === f.key
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Ajanjakso */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2.5">
            <CalendarRange size={13} />
            Ajanjakso
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  dateRange === r.key
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
              />
              <span className="text-slate-400 text-xs">–</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Ei tapahtumia valitulla ajanjaksolla tai haulla.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([dayKey, dayItems]) => (
            <div key={dayKey}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3 capitalize">
                {formatDayLabel(dayKey)}
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {dayItems.map((item) => {
                  const meta = EVENT_META[item.event];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 hover:bg-slate-50/60 transition"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.text}`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {item.company} · {item.jobTitle}
                          </p>
                          <span className="text-xs text-slate-400 shrink-0">
                            {new Date(item.createdAt).toLocaleTimeString(
                              "fi-FI",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {meta.label}
                          {item.event === "status_changed" &&
                            item.oldStatus &&
                            item.newStatus && (
                              <>
                                {" "}
                                <span className="text-slate-400">
                                  {item.oldStatus}
                                </span>{" "}
                                →{" "}
                                <span className="font-medium text-slate-700">
                                  {item.newStatus}
                                </span>
                              </>
                            )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}