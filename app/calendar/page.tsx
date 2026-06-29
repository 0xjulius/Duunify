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
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white">
        <Sidebar />
      </div>

      {/* Pääsisältöalue */}
      <div className="flex-1 flex flex-col min-w-0">
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
        
        <Footer />
      </div>
    </div>
  );
}