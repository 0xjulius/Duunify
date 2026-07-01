import Sidebar from "@/components/Sidebar";
import CalendarClient from "@/components/calendar/CalendarClient";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, company, job_title, valid_through, status");

  if (error) {
    console.error("Virhe haettaessa hakemuksia:", error);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-shrink-0 border-slate-200 bg-white">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-400">
        <main className="flex-1 p-6">
          <CalendarClient initialApplications={applications || []} />
        </main>

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