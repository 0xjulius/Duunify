import { createClient } from '@/utils/supabase/server';
import { DataTable } from "@/components/ui/data-table"; // Shadcn DataTable
import { columns } from "./columns"; // Tänne määrittelet mitä sarakkeita näytetään

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  
  // Haetaan kaikki hakemukset (tämä on admin-työkalu, joten voit hakea kaiken)
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kaikki hakemukset</h1>
      <DataTable columns={columns} data={applications || []} />
    </div>
  );
}