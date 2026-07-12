import Sidebar from "@/components/Sidebar";
import CalendarClient from "@/components/calendar/CalendarClient";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

// Palvelinkomponenteissa dynaamisuus pakotetaan näin:
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // KORJAUS: Lisätty 'cv_url' hakuun, jotta kalenterista avautuva dialogi näkee liitteen
  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, company, job_title, valid_through, status, cv_url") // <-- cv_url lisätty tänne
    .eq("user_id", user.id);

  if (error) {
    console.error("Virhe haettaessa hakemuksia:", error);
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex-shrink-0 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 transition-colors duration-200">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-400">
        <main className="flex-1 p-6 mb-6">
          <CalendarClient initialApplications={applications || []} />
        </main>
      </div>
    </div>
  );
}