import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/calendar/CalendarView";
import QuickEvents from "@/components/calendar/QuickEvents";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase"; // Varmista, että polku on oikein

export default async function CalendarPage() {
  // 1. Haetaan hakemukset tietokannasta
  const { data: applications, error } = await supabase
    .from("applications")
    .select("company, job_title, created_at");

  if (error) {
    console.error("Virhe haettaessa hakemuksia:", error);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sivupalkki */}
      <div className="flex-shrink-0 border-slate-200 bg-white">
        <Sidebar />
      </div>

      {/* Pääsisältöalue */}
      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-400">
        <main className="flex-1 p-6">
          <div className="flex gap-6 h-[calc(100vh-140px)]">
             {/* QuickEvents - voit lähettää datan myös tänne, jos haluat näyttää listan */}
             <div className="w-80 flex-shrink-0">
               <QuickEvents applications={applications || []} />
             </div>
             
             {/* Kalenteri: Lähetetään sovellukset propseina */}
             <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
               <CalendarView applications={applications || []} />
             </div>
          </div>
        </main>
        
         {/* Korjattu Footer */}
        <footer className="p-8 border-t border-slate-200 bg-slate-50">
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