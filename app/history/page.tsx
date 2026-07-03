import Sidebar from "@/components/Sidebar";
import { fetchHistoryItems } from "@/lib/history";
import HistoryClient from "@/components/history/HistoryClient";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const items = await fetchHistoryItems();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-shrink-0 border-r border-slate-200 bg-white">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-6 md:p-8">
          <HistoryClient items={items} />
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