"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// 1. Suomenkielinen lokalisaatio
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'fi': fi },
});

export default function CalendarView({ applications = [] }) {
  // 2. Muunnetaan sovelluksen data kalenterin event-muotoon
  const events = applications.map((app) => ({
    title: `${app.company} | ${app.job_title}`,
    start: new Date(app.created_at), // Varmista että tämä on oikea päivämääräkenttä
    end: new Date(app.created_at),
  }));

  return (
    <div className="h-[600px] w-full">
      <Calendar
        localizer={localizer}
        events={events}
        culture="fi"
        // 3. Suomennokset napeille ja näkymille
        messages={{
          today: "Tänään",
          previous: "Edellinen",
          next: "Seuraava",
          month: "Kuukausi",
          week: "Viikko",
          day: "Päivä",
          agenda: "Agenda",
        }}
        // 4. Custom toolbarin tyyli (matchaa tiedostoon image_cd85bd.png)
        className="text-sm"
      />
    </div>
  );
}