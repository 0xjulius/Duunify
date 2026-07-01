"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarView from "@/components/calendar/CalendarView";
import QuickEvents from "@/components/calendar/QuickEvents";
import AddEventModal from "@/components/calendar/AddEventModal";
import {
  ApplicationLite,
  UnifiedEvent,
  buildUnifiedEvents,
  fetchApplicationsLite,
  fetchCalendarEvents,
  deleteCalendarEvent,
} from "@/lib/calendar";

export default function CalendarClient({
  initialApplications,
}: {
  initialApplications: ApplicationLite[];
}) {
  const [applications] = useState<ApplicationLite[]>(initialApplications);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);

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

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="w-80 flex-shrink-0">
        <QuickEvents
          events={events}
          onAddClick={() => setShowAdd(true)}
          onDelete={handleDelete}
        />
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <CalendarView events={events} onSelectEvent={() => {}} />
      </div>

      <AddEventModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        applications={applications}
        onCreated={loadEvents}
      />
    </div>
  );
}