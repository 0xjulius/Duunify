"use client";

import { useState } from "react";
import { X, Trash2, CheckCircle2, Circle, Building2, StickyNote, Calendar, Clock, Info } from "lucide-react";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

export default function EventDetailModal({
  event,
  open,
  onOpenChange,
  onDelete,
  onToggleCompleted,
}: {
  event: UnifiedEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleCompleted: (id: string, completed: boolean) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  if (!open || !event) return null;

  const typeKey = event.type as keyof typeof EVENT_COLORS;
  const colors = EVENT_COLORS[typeKey] || { bg: "#f1f5f9", text: "#334155" };

  const labelKey = event.type as keyof typeof EVENT_TYPE_LABELS;
  const label = EVENT_TYPE_LABELS[labelKey] || event.type;

  const handleClose = () => {
    onOpenChange(false);
  };

  async function handleDelete() {
    if (!event) return;
    setBusy(true);
    await onDelete(event.id);
    setBusy(false);
    handleClose();
  }

  async function handleToggle() {
    if (!event) return;
    setBusy(true);
    await onToggleCompleted(event.id, !event.completed);
    setBusy(false);
    handleClose();
  }
  
  const dateObj = event.date instanceof Date ? event.date : new Date(event.date);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yläpalkki: Tyyppi ja Sulkemispainike */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase dark:brightness-110"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {label}
          </span>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Otsikko */}
        <h2
          className={`font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight leading-snug ${
            event.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
          }`}
        >
          {event.title}
        </h2>

        {/* Alisetti: Yritys ja tehtävä */}
        {event.subtitle && (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100/50 dark:border-slate-800/50 transition-colors">
            <Building2 size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{event.subtitle}</span>
          </div>
        )}

        {/* Päivämäärä ja kellonaika siistinä listana */}
        <div className="mt-4 space-y-2.5 border-t border-b border-slate-100 dark:border-slate-800/60 py-3.5 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <Calendar size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="capitalize">
              {dateObj.toLocaleDateString("fi-FI", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          
          {event.time && (
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span>klo {event.time.slice(0, 5)}</span>
            </div>
          )}
        </div>

        {/* Muistiinpanot */}
        {event.notes && (
          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <StickyNote size={12} />
              Muistiinpanot
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{event.notes}</p>
            </div>
          </div>
        )}

        {/* Infolaatikko automaattisille järjestelmädeadlineille */}
        {!event.editable && (
          <div className="mt-5 p-3 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20 flex gap-2.5 items-start transition-colors">
            <Info size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900/80 dark:text-indigo-300/90 leading-relaxed">
              Tämä tapahtuma on luotu automaattisesti hakemuksesi perusteella. Voit muokata hakuajan päättymispäivää suoraan hakemuksen omalta sivulta.
            </p>
          </div>
        )}

        {/* Toimintapainikkeet muokattaville tapahtumille */}
        {event.editable && (
          <div className="flex gap-2.5 mt-6">
            <button
              onClick={handleToggle}
              disabled={busy}
              className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all font-semibold text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {event.completed ? (
                <>
                  <Circle size={16} className="text-slate-400 dark:text-slate-500" /> Merkitse kesken
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" /> Merkitse valmiiksi
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="h-11 px-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 border border-rose-100/50 dark:border-rose-500/20"
              title="Poista tapahtuma"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}