import { supabase } from "@/lib/supabase";

export async function deleteApplicationWithLog(application: {
  id: string;
  company: string;
  job_title: string;
  status: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Ei kirjautunutta käyttäjää") };
  }

  // 1. Kirjoita lokimerkintä ENNEN poistoa — erillinen taulu, ei cascade-riskiä
  const { error: logError } = await supabase
    .from("deleted_applications_log")
    .insert({
      user_id: user.id,
      company: application.company,
      job_title: application.job_title,
      last_status: application.status,
    });

  if (logError) {
    console.error("Poistolokin kirjoitus epäonnistui:", logError);
    // Jatketaan silti poistoon — loki ei saa estää itse toimintoa
  }

  // 2. Poista hakemus (cascade poistaa myös application_history- ja
  // calendar_events-rivit, mutta EI deleted_applications_log-riviä)
  const { error: deleteError } = await supabase
    .from("applications")
    .delete()
    .eq("id", application.id);

  return { error: deleteError };
}