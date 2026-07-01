import Sidebar from "@/components/Sidebar";

// Mockup-data — rakenne vastaa application_history-taulua,
// joten oikeaan dataan siirtyminen on vain fetch-kutsun vaihto.
const MOCK_HISTORY = [
  {
    id: "1",
    event: "status_changed" as const,
    company: "Wolt",
    jobTitle: "Frontend Developer",
    oldStatus: "Haettu",
    newStatus: "Haastattelu",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    event: "event_added" as const,
    company: "Wolt",
    jobTitle: "Frontend Developer",
    oldStatus: null,
    newStatus: null,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "3",
    event: "created" as const,
    company: "Supercell",
    jobTitle: "Game Designer",
    oldStatus: null,
    newStatus: null,
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
  {
    id: "4",
    event: "note_added" as const,
    company: "Reaktor",
    jobTitle: "Software Engineer",
    oldStatus: null,
    newStatus: null,
    createdAt: new Date(Date.now() - 30 * 3600_000).toISOString(),
  },
  {
    id: "5",
    event: "status_changed" as const,
    company: "Nordea",
    jobTitle: "Data Analyst",
    oldStatus: "Haettu",
    newStatus: "Hylätty",
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
  {
    id: "6",
    event: "created" as const,
    company: "Nordea",
    jobTitle: "Data Analyst",
    oldStatus: null,
    newStatus: null,
    createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: "7",
    event: "deleted" as const,
    company: "Fiverr Local Oy",
    jobTitle: "Junior Consultant",
    oldStatus: null,
    newStatus: null,
    createdAt: new Date(Date.now() - 9 * 86400_000).toISOString(),
  },
];

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 ">
      <div className="flex-shrink-0 border-r border-slate-200 bg-white ">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-6 md:p-8 ">
          <HistoryClientImport items={MOCK_HISTORY} />
        </main>

        <footer className="p-8 border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-500">
            <div>
              <span className="font-bold text-slate-900">Duunify</span>
              <span className="ml-2">© 2026 Kaikki oikeudet pidätetään.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900">Tietosuoja</a>
              <a href="#" className="hover:text-slate-900">Käyttöehdot</a>
              <a href="#" className="hover:text-slate-900">Yhteystiedot</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Erotettu import-nimellä siltä varalta että haluat myöhemmin
// muuttaa tämän server-fetchiksi ilman nimiristiriitaa.
import HistoryClient from "@/components/history/HistoryClient";
const HistoryClientImport = HistoryClient;