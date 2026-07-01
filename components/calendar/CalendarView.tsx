"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UnifiedEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";

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
}: {
  events: UnifiedEvent[];
  onSelectEvent: (event: UnifiedEvent) => void;
}) {
  const calendarEvents = events.map((e) => ({
    ...e,
    start: e.date,
    end: e.date,
  }));

  return (
    <div className="h-[600px] w-full">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        culture="fi"
        messages={{
          today: "Tänään",
          previous: "Edellinen",
          next: "Seuraava",
          month: "Kuukausi",
          week: "Viikko",
          day: "Päivä",
          agenda: "Agenda",
          noEventsInRange: "Ei tapahtumia tällä aikavälillä.",
        }}
        onSelectEvent={(e: any) => onSelectEvent(e)}
        eventPropGetter={(event: any) => {
          const colors = EVENT_COLORS[event.type as keyof typeof EVENT_COLORS];
          return {
            style: {
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.dot}33`,
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
            },
          };
        }}
        titleAccessor={(e: any) =>
          e.type === "deadline" ? `⏰ ${e.subtitle}` : `${e.title}`
        }
        className="text-sm"
      />

      <div className="flex gap-4 mt-4 flex-wrap">
        {Object.entries(EVENT_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.dot }}
            />
            {EVENT_TYPE_LABELS[type as keyof typeof EVENT_TYPE_LABELS]}
          </div>
        ))}
      </div>
    </div>
  );
}