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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <div className="flex-shrink-0 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 transition-colors duration-200">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-6 md:p-8 mb-16">
          <HistoryClient items={items} />
        </main>
      </div>
    </div>
  );
}