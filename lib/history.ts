import { createClient } from "@/lib/supabase-server";

export type EventType =
  | "created"
  | "status_changed"
  | "note_added"
  | "event_added"
  | "deleted";

export interface HistoryItem {
  id: string;
  event: EventType;
  company: string;
  jobTitle: string;
  oldStatus: string | null;
  newStatus: string | null;
  createdAt: string;
}

function mapEventType(row: any): EventType {
  const e = String(row.event_type || "").toLowerCase();
  
  if (e === "created" || e.includes("luotu")) return "created";
  if (e.includes("poistet") || e.includes("deleted")) return "deleted";
  if (e.includes("muistiinpano") || e.includes("note")) return "note_added";
  
  return "status_changed";
}

export async function fetchHistoryItems(): Promise<HistoryItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const items: HistoryItem[] = [];

  // 1. Haetaan kaikki tapahtumat application_history-taulusta
  const { data: historyRows, error: historyError } = await supabase
    .from("application_history")
    .select(
      "id, event_type, old_status, new_status, created_at, application_id, applications!inner(company, job_title, user_id)"
    )
    .eq("applications.user_id", user.id)
    .order("created_at", { ascending: false });

  if (historyError) {
    console.error("Virhe haettaessa hakemushistoriaa:", historyError);
  }

  // Seurataan mitkä hakemukset ovat jo luoneet historiapaikan
  const appsWithCreatedEvent = new Set<string>();

  (historyRows || []).forEach((row: any) => {
    const event = mapEventType(row);
    if (event === "created" && row.application_id) {
      appsWithCreatedEvent.add(row.application_id);
    }

    items.push({
      id: `hist-${row.id}`,
      event,
      company: row.applications?.company || "Tuntematon yritys",
      jobTitle: row.applications?.job_title || "Ei tehtävänimikettä",
      oldStatus: row.old_status,
      newStatus: row.new_status,
      createdAt: row.created_at,
    });
  });

  // 2. Varajärjestelmä VANHOILLE hakemuksille, joille ei ole luontihetkellä 
  // ehditty kirjoittaa application_history-riviä tietokantaan:
  const { data: appRows } = await supabase
    .from("applications")
    .select("id, company, job_title, status, created_at")
    .eq("user_id", user.id);

  (appRows || []).forEach((app: any) => {
    // Jos hakemuksella ei ole lainkaan "created"-tapahtumaa historiassa, luodaan se varalle
    if (!appsWithCreatedEvent.has(app.id)) {
      items.push({
        id: `fallback-created-${app.id}`,
        event: "created",
        company: app.company,
        jobTitle: app.job_title,
        oldStatus: null,
        newStatus: app.status,
        createdAt: app.created_at,
      });
    }
  });

  // 3. Kalenteritapahtumat
  const { data: eventRows } = await supabase
    .from("calendar_events")
    .select("id, title, created_at, applications(company, job_title)")
    .eq("user_id", user.id);

  (eventRows || []).forEach((row: any) => {
    items.push({
      id: `evt-${row.id}`,
      event: "event_added",
      company: row.applications?.company || "",
      jobTitle: row.applications?.job_title || row.title,
      oldStatus: null,
      newStatus: null,
      createdAt: row.created_at,
    });
  });

  // 4. Poistetut hakemukset
  const { data: deletedRows } = await supabase
    .from("deleted_applications_log")
    .select("id, company, job_title, last_status, deleted_at")
    .eq("user_id", user.id);

  (deletedRows || []).forEach((row: any) => {
    items.push({
      id: `del-${row.id}`,
      event: "deleted",
      company: row.company,
      jobTitle: row.job_title,
      oldStatus: row.last_status,
      newStatus: null,
      createdAt: row.deleted_at,
    });
  });

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}