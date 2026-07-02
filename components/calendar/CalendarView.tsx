"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

// Määritetään kalenteritapahtuman tyyppi, joka sisältää react-big-calendarin vaatimat start ja end -päivät
interface CalendarEvent extends UnifiedEvent {
  start: Date;
  end: Date;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { fi },
});

export default function CalendarView({
  events,
  onSelectEvent,
  focusDate,
}: {
  events: UnifiedEvent[];
  onSelectEvent: (event: UnifiedEvent) => void;
  focusDate?: Date | null;
}) {
  const [date, setDate] = useState<Date>(focusDate || new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // Synkronoidaan focusDate, jos se muuttuu ulkoisesti (esim. minikalenterista)
  useEffect(() => {
    if (focusDate) {
      setDate(focusDate);
    }
  }, [focusDate]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setView(Views.AGENDA);
    }
  }, []);

  const displayDate = focusDate || date;

  // Muutetaan UnifiedEvent-muoto react-big-calendarille sopivaksi CalendarEventiksi
  const calendarEvents: CalendarEvent[] = events.map((e) => ({
    ...e,
    start: new Date(e.date),
    end: new Date(e.date),
  }));

  return (
    <div className="h-[600px] w-full flex flex-col">
      {/* Korvattu vanha style jsx helpommin ylläpidettävällä globaalilla tyylillä tai inline-CSS:llä */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .rbc-toolbar {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: stretch !important;
          }
          .rbc-toolbar-label {
            text-align: center !important;
            font-weight: bold !important;
            margin: 4px 0 !important;
          }
          .rbc-btn-group {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
          }
          .rbc-btn-group button {
            flex: 1 !important;
            padding: 6px 4px !important;
            font-size: 12px !important;
          }
          .rbc-toolbar .rbc-btn-group:last-child button:nth-child(2),
          .rbc-toolbar .rbc-btn-group:last-child button:nth-child(3) {
            display: none !important;
          }
        }
      `}} />

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        culture="fi"
        date={displayDate}
        view={view}
        onNavigate={(newDate: Date) => setDate(newDate)}
        onView={(newView: View) => setView(newView)}
        messages={{
          today: "Tänään",
          previous: "Edellinen",
          next: "Seuraava",
          month: "Kuukausi",
          week: "Viikko",
          day: "Päivä",
          agenda: "Lista",
          noEventsInRange: "Ei tapahtumia tällä aikavälillä.",
        }}
        onSelectEvent={(e) => onSelectEvent(e as CalendarEvent)}
        eventPropGetter={(event: CalendarEvent) => {
          // Varmistetaan turvallinen fallback-väri, jos tyyppiä ei löydy
          const typeKey = event.type as keyof typeof EVENT_COLORS;
          const colors = EVENT_COLORS[typeKey] || { bg: "#f1f5f9", text: "#334155", dot: "#94a3b8" };
          
          return {
            style: {
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.dot}33`,
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 4px",
              opacity: event.completed ? 0.5 : 1,
              textDecoration: event.completed ? "line-through" : "none",
              cursor: "pointer",
            },
          };
        }}
        titleAccessor={(e) => {
          const ev = e as CalendarEvent;
          return ev.type === "deadline" ? `⏰ ${ev.subtitle || ev.title}` : `${ev.title}`;
        }}
        className="text-sm flex-1"
      />

      {/* Selitteet */}
      <div className="flex gap-4 mt-4 flex-wrap border-t pt-4">
        {Object.entries(EVENT_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.dot }}
            />
            {EVENT_TYPE_LABELS[type as keyof typeof EVENT_TYPE_LABELS] || type}
          </div>
        ))}
      </div>
    </div>
  );
}