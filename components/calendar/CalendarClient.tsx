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
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="w-80 flex-shrink-0 min-h-0">
        <QuickEvents
          events={events}
          onAddClick={() => setShowAdd(true)}
          onDelete={handleDelete}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm min-w-0">
        <CalendarView
          events={events}
          onSelectEvent={setSelectedEvent}
          focusDate={focusDate}
        />
      </div>

      <div className="w-72 flex-shrink-0">
        <MiniCalendar events={events} onSelectDate={setFocusDate} />
      </div>

      <AddEventModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        applications={applications}
        onCreated={loadEvents}
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDelete}
        onToggleCompleted={handleToggleCompleted}
      />
    </div>
  );
}