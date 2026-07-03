"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarView from "@/components/calendar/CalendarView";
import QuickEvents from "@/components/calendar/QuickEvents";
import AddEventModal from "@/components/calendar/AddEventModal";
import EventDetailModal from "@/components/calendar/EventDetailModal";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import {
  ApplicationLite,
  UnifiedEvent,
  buildUnifiedEvents,
  fetchCalendarEvents,
  deleteCalendarEvent,
  toggleCalendarEventCompleted,
} from "@/lib/calendar";
import { Calendar } from "lucide-react";

export default function CalendarClient({
  initialApplications,
}: {
  initialApplications: ApplicationLite[];
}) {
  const [applications] = useState<ApplicationLite[]>(initialApplications);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);
  const [focusDate, setFocusDate] = useState<Date | null>(null);

  async function loadEvents() {
    const custom = await fetchCalendarEvents();
    setEvents(buildUnifiedEvents(applications, custom));
  }

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    const { error } = await deleteCalendarEvent(id);
    if (error) {
      toast.error("Poisto epäonnistui.");
      return;
    }
    toast.success("Tapahtuma poistettu.");
    setSelectedEvent(null);
    loadEvents();
  }

  async function handleToggleCompleted(id: string, completed: boolean) {
    const { error } = await toggleCalendarEventCompleted(id, completed);
    if (error) {
      toast.error("Päivitys epäonnistui.");
      return;
    }
    toast.success(completed ? "Merkitty valmiiksi." : "Merkitty kesken.");
    loadEvents();

    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent({ ...selectedEvent, completed });
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Otsikkoalue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-200 to-violet-600 p-3.5 rounded-2xl shadow-md h-13 w-13">
            <Calendar className="h-6 w-6 text-white" />  
        </div>
          <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900">Kalenterinäkymä</h2>
          <p className="mt-1 text-slate-500 text-sm xl:text-md font-medium">
            Seuraa hakuprosessiesi tärkeitä päivämääriä.
          </p>
        </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors w-full sm:w-auto"
        >
          + Lisää tapahtuma
        </button>
      </div>

      {/* PÄÄASSETTELU */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* VASEN REUNA / YLÄOSA: Pääkalenteri */}
        <div className="w-full lg:flex-1 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <CalendarView
            events={events}
            onSelectEvent={(event: UnifiedEvent) => setSelectedEvent(event)}
            focusDate={focusDate}
          />
        </div>

        {/* OIKEA REUNA / ALAOSA: Tulevat tapahtumat & Apukalenterit */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Minikalenteri */}
          <div className="hidden lg:block bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <MiniCalendar
              events={events}
              onSelectDate={(date: Date) => setFocusDate(date)}
            />
          </div>

          {/* Tulevat tapahtumat -lista */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
            <QuickEvents
              events={events}
              onSelectEvent={(event: UnifiedEvent) => setSelectedEvent(event)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* MODALIKOMPONENTIT */}
      <AddEventModal
        open={showAdd}
        onOpenChange={setShowAdd}
        applications={applications}
        onSuccess={() => {
          loadEvents();
        }}
      />

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={!!selectedEvent}
          onOpenChange={(open: boolean) => !open && setSelectedEvent(null)}
          onDelete={handleDelete}
          onToggleCompleted={handleToggleCompleted}
        />
      )}
    </div>
  );
}
