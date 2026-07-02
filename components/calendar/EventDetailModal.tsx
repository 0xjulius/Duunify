"use client";

import { useState } from "react";
import { X, Trash2, CheckCircle2, Circle, Building2, StickyNote } from "lucide-react";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

export default function EventDetailModal({
  event,
  onClose,
  onDelete,
  onToggleCompleted,
}: {
  event: UnifiedEvent | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onToggleCompleted: (id: string, completed: boolean) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  if (!event) return null;

  const colors = EVENT_COLORS[event.type];

async function handleDelete() {
    if (!event) return; // Turvacheck
    setBusy(true);
    await onDelete(event.id); // Käytetään suoraan event-objektia
    setBusy(false);
    onClose();
  }

  async function handleToggle() {
    if (!event) return; // Turvacheck
    setBusy(true);
    await onToggleCompleted(event.id, !event.completed); // Nyt tämä toimii!
    setBusy(false);
    onClose();
    }
    
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,11,38,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          className={`font-bold text-lg text-slate-900 ${
            event.completed ? "line-through text-slate-400" : ""
          }`}
        >
          {event.type === "deadline" ? "Hakuaika päättyy" : event.title}
        </h2>

        {event.subtitle && (
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5">
            <Building2 size={14} />
            {event.subtitle}
          </div>
        )}

        <p className="text-sm text-slate-500 mt-3">
          {event.date.toLocaleDateString("fi-FI", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {event.time && ` klo ${event.time.slice(0, 5)}`}
        </p>

        {event.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl flex gap-2">
            <StickyNote size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{event.notes}</p>
          </div>
        )}

        {!event.editable && (
          <p className="text-xs text-slate-400 mt-4">
            Tämä tapahtuma on johdettu hakemuksen tiedoista. Muokkaa hakuajan
            päättymispäivää hakemuksen sivulta.
          </p>
        )}

        {event.editable && (
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleToggle}
              disabled={busy}
              className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 transition font-semibold text-sm text-slate-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {event.completed ? (
                <>
                  <Circle size={16} /> Merkitse kesken
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="text-emerald-500" /> Merkitse valmiiksi
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="h-11 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition disabled:opacity-50"
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