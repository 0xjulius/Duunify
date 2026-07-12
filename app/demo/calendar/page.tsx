"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DemoSidebar from "@/components/demo/DemoSidebar";
import CalendarView from "@/components/calendar/CalendarView";
import QuickEvents from "@/components/calendar/QuickEvents";
import EventDetailModal from "@/components/calendar/EventDetailModal";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { Calendar, X, Briefcase, Calendar as CalendarIcon, Clock, AlignLeft, Tag } from "lucide-react";

// Tuodaan valmis demodata projektin omasta tiedostosta[cite: 6]
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import { UnifiedEvent, buildUnifiedEvents } from "@/lib/calendar";

export default function DemoCalendarPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);
  const [focusDate, setFocusDate] = useState<Date | null>(null);

  // Demotila lomakkeen avaamiseen
  const [showDemoAdd, setShowDemoAdd] = useState(false);

  // Lomakkeen paikalliset kentät (visuaalista syöttöä varten)
  const [formData, setFormData] = useState({
    title: "",
    applicationId: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    type: "interview",
    notes: ""
  });

  // Ladataan demodata näkymään[cite: 7]
  useEffect(() => {
    const validApps = DEMO_APPLICATIONS.filter(
      (app) => !["suosikki", "tallennettu"].includes(app.status?.toLowerCase().trim() || "")
    ).map(app => ({
      id: app.id,
      company: app.company,
      job_title: app.job_title,
      valid_through: app.applied_date, 
      status: app.status
    }));

    setApplications(validApps);

    const mockCustomEvents = [
      {
        id: "custom-demo-1",
        title: "Tekninen haastattelu Wolt",
        date: "2026-07-15",
        time: "14:00:00",
        type: "interview",
        notes: "Kerrataan Next.js-arkkitehtuuria ja CSS-ratkaisuja.",
        completed: false,
        editable: true,
      }
    ];
    setCustomEvents(mockCustomEvents);
  }, []);

  // Yhdistetään hakemukset ja kustomoidut tapahtumat kalenterinäkymään[cite: 7]
  useEffect(() => {
    setEvents(buildUnifiedEvents(applications as any, customEvents));
  }, [applications, customEvents]);

  // Simuloitu poisto livenä demossa[cite: 7]
  const handleDelete = async (id: string) => {
    setCustomEvents(customEvents.filter((e) => e.id !== id));
    toast.success("Tapahtuma poistettu (Demo).");
    setSelectedEvent(null);
  };

  // Simuloitu valmiiksi merkitseminen livenä demossa[cite: 7]
  const handleToggleCompleted = async (id: string, completed: boolean) => {
    setCustomEvents(
      customEvents.map((e) => (e.id === id ? { ...e, completed } : e))
    );
    toast.success(completed ? "Merkitty valmiiksi." : "Merkitty kesken.");

    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent({ ...selectedEvent, completed });
    }
  };

  // Lomakkeen lähetysyritys -> toast-ilmoitus tulee vasta tässä vaiheessa!
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Tapahtumien tallentaminen ei ole käytössä demoversiossa.");
    setShowDemoAdd(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex-shrink-0 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 transition-colors duration-200">
        <DemoSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-400">
        <main className="flex-1 p-6 mb-6">
          <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-50 transition-colors duration-200">
            
            {/* Otsikkoalue */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-indigo-200 to-violet-600 p-3.5 rounded-2xl shadow-md h-13 w-13 shrink-0">
                  <Calendar className="h-6 w-6 text-white" />  
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Kalenterinäkymä <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md ml-2 font-normal">Demo</span>
                  </h2>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm xl:text-md font-medium">
                    Seuraa hakuprosessiesi tärkeitä päivämääriä.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowDemoAdd(true)}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors w-full sm:w-auto cursor-pointer"
              >
                + Lisää tapahtuma
              </button>
            </div>

            {/* PÄÄASSETTELU */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Vasen reuna: Kalenteri */}
              <div className="w-full lg:flex-1 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors">
                <CalendarView
                  events={events}
                  onSelectEvent={(event: UnifiedEvent) => setSelectedEvent(event)}
                  focusDate={focusDate}
                />
              </div>

              {/* Oikea reuna: Tulevat tapahtumat & Apukalenterit */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="hidden lg:block bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm transition-colors">
                  <MiniCalendar
                    events={events}
                    onSelectDate={(date: Date) => setFocusDate(date)}
                  />
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm w-full transition-colors">
                  <QuickEvents
                    events={events}
                    onSelectEvent={(event: UnifiedEvent) => setSelectedEvent(event)}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>

            {/* DETALJIMODAALI */}
            {selectedEvent && (
              <EventDetailModal
                event={selectedEvent}
                open={!!selectedEvent}
                onOpenChange={(open: boolean) => !open && setSelectedEvent(null)}
                onDelete={handleDelete}
                onToggleCompleted={handleToggleCompleted}
              />
            )}

            {/* DEMO-TASON LISÄYSLOMAKE (VISUAALINEN INTERCEPTOINTI) */}
            {showDemoAdd && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowDemoAdd(false)}>
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Lisää uusi tapahtuma</h3>
                    <button onClick={() => setShowDemoAdd(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X size={18} /></button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                    {/* Tapahtuman otsikko */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Otsikko</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Esim. Haastattelu, Tehtävän deadline..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" required />
                      </div>
                    </div>

                    {/* Liitä hakemukseen */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Liitä hakemukseen (Valinnainen)</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <select value={formData.applicationId} onChange={e => setFormData({...formData, applicationId: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 appearance-none">
                          <option value="">-- Valitse hakemus --</option>
                          {applications.map(app => (
                            <option key={app.id} value={app.id}>{app.company} - {app.job_title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Päiväys ja kellonaika */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Päivämäärä</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kellonaika</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" />
                        </div>
                      </div>
                    </div>

                    {/* Tyyppi */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tyyppi</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["interview", "deadline", "task"].map(t => (
                          <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${formData.type === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"}`}>
                            {t === "interview" ? "Haastattelu" : t === "deadline" ? "Määräaika" : "Tehtävä"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Muistiinpanot */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Muistiinpanot</label>
                      <div className="relative">
                        <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Lisää lisätietoja tästä tapahtumasta..." rows={3} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl resize-none" />
                      </div>
                    </div>

                    {/* Napit */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowDemoAdd(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl font-medium">Peruuta</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold">Tallenna</button>
                    </div>
                  </form>

                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}