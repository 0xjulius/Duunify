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
  if (row.old_status && row.new_status) return "status_changed";

  const e = String(row.event_type || "").toLowerCase();
  if (e.includes("poistet")) return "deleted";
  if (e.includes("muistiinpano")) return "note_added";
  return "created";
}

export async function fetchHistoryItems(): Promise<HistoryItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const items: HistoryItem[] = [];

  // 1. Tilamuutokset ja luonnit application_history-taulusta
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

  (historyRows || []).forEach((row: any) => {
    items.push({
      id: `hist-${row.id}`,
      event: mapEventType(row),
      company: row.applications?.company || "Tuntematon yritys",
      jobTitle: row.applications?.job_title || "Ei tehtävänimikettä",
      oldStatus: row.old_status,
      newStatus: row.new_status,
      createdAt: row.created_at,
    });
  });

  // 2. Käyttäjän itse lisäämät kalenteritapahtumat
  const { data: eventRows, error: eventError } = await supabase
    .from("calendar_events")
    .select(
      "id, title, event_date, created_at, application_id, applications(company, job_title)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (eventError) {
    console.error("Virhe haettaessa kalenteritapahtumia:", eventError);
  }

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

  // 3. Varmistetaan että jokaisella hakemuksella on "luotu"-merkintä,
  // vaikka application_history-rivi puuttuisi (esim. koska addHistory
  // epäonnistui aiemmin skeemavirheen takia).
  const { data: appRows, error: appError } = await supabase
    .from("applications")
    .select("id, company, job_title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (appError) {
    console.error("Virhe haettaessa hakemuksia:", appError);
  }

  const hasCreatedEntry = new Set(
    (historyRows || [])
      .filter((r: any) => mapEventType(r) === "created")
      .map((r: any) => r.application_id)
  );

  (appRows || []).forEach((app: any) => {
    if (!hasCreatedEntry.has(app.id)) {
      items.push({
        id: `app-created-${app.id}`,
        event: "created",
        company: app.company,
        jobTitle: app.job_title,
        oldStatus: null,
        newStatus: null,
        createdAt: app.created_at,
      });
    }
  });

  // 4. UUSI: Poistetut hakemukset erillisestä lokitaulusta
  // (ei cascade-riskiä, koska ei foreign keytä applications-tauluun)
  const { data: deletedRows, error: deletedError } = await supabase
    .from("deleted_applications_log")
    .select("id, company, job_title, last_status, deleted_at")
    .eq("user_id", user.id)
    .order("deleted_at", { ascending: false });

  if (deletedError) {
    console.error("Virhe haettaessa poistolokia:", deletedError);
  }

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

  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return items;
}