import { supabase } from "@/lib/supabase";

export type CalendarEventType = "deadline" | "interview" | "reminder" | "other";

export interface UnifiedEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  subtitle: string;
  date: Date;
  time: string | null;
  applicationId: string | null;
  editable: boolean; // false = johdettu hakemuksen valid_through-kentästä
}

export interface ApplicationLite {
  id: string;
  company: string;
  job_title: string;
  valid_through: string | null;
  status: string;
}

export async function fetchApplicationsLite(): Promise<ApplicationLite[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("id, company, job_title, valid_through, status");

  if (error) {
    console.error("Virhe haettaessa hakemuksia:", error);
    return [];
  }
  return data || [];
}

export async function fetchCalendarEvents() {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("id, type, title, event_date, event_time, notes, application_id");

  if (error) {
    console.error("Virhe haettaessa tapahtumia:", error);
    return [];
  }
  return data || [];
}

export function buildUnifiedEvents(
  applications: ApplicationLite[],
  customEvents: Awaited<ReturnType<typeof fetchCalendarEvents>>,
): UnifiedEvent[] {
  const deadlineEvents: UnifiedEvent[] = applications
    .filter((a) => a.valid_through && a.status !== "Hylätty")
    .map((a) => ({
      id: `deadline-${a.id}`,
      type: "deadline",
      title: `Hakuaika päättyy`,
      subtitle: `${a.company} · ${a.job_title}`,
      date: new Date(a.valid_through as string),
      time: null,
      applicationId: a.id,
      editable: false,
    }));

  const custom: UnifiedEvent[] = customEvents.map((e) => {
    const app = applications.find((a) => a.id === e.application_id);
    return {
      id: e.id,
      type: e.type as CalendarEventType,
      title: e.title,
      subtitle: app ? `${app.company} · ${app.job_title}` : "",
      date: new Date(`${e.event_date}T${e.event_time || "00:00"}`),
      time: e.event_time,
      applicationId: e.application_id,
      editable: true,
    };
  });

  return [...deadlineEvents, ...custom].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

export async function createCalendarEvent(input: {
  userId: string;
  type: CalendarEventType;
  title: string;
  applicationId: string | null;
  eventDate: string;
  eventTime: string | null;
  notes: string | null;
}) {
  return supabase.from("calendar_events").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    application_id: input.applicationId,
    event_date: input.eventDate,
    event_time: input.eventTime,
    notes: input.notes,
  });
}

export async function deleteCalendarEvent(id: string) {
  return supabase.from("calendar_events").delete().eq("id", id);
}

export const EVENT_COLORS: Record<
  CalendarEventType,
  { bg: string; text: string; dot: string }
> = {
  deadline: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  interview: { bg: "#EEF2FF", text: "#3730A3", dot: "#6D67F2" },
  reminder: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  other: { bg: "#F1F5F9", text: "#334155", dot: "#64748B" },
};

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  deadline: "Hakuaika päättyy",
  interview: "Haastattelu",
  reminder: "Muistutus",
  other: "Muu",
};
