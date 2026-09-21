// app/api/cron/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // 1. Tietoturvatarkistus: Varmistetaan että pyyntö tulee Vercel Cronilta (tai kehitysympäristöstä)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Luodaan admin-oikeuksin varustettu Supabase-asiakas taustatehtävää varten
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 3. Haetaan kaikki tallennetut hakemukset ilman RLS-rajoituksia
  const { data: apps, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .ilike("status", "tallennettu"); // ilike ei välitä isojen/pienten kirjainten erosta

  if (error) {
    console.error("Virhe hakemuksia haettaessa:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!apps || apps.length === 0) {
    return NextResponse.json({
      message: "Ei löytynyt 'Tallennettu'-tilassa olevia työpaikkoja.",
    });
  }

  // 4. Lasketaan umpeutuvat hakemukset (0–7 päivän sisällä)
  const expiringApps = apps.filter((app) => {
    if (!app.valid_through) return false;

    const deadlineDate = new Date(app.valid_through);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return daysLeft >= 0 && daysLeft <= 7;
  });

  if (expiringApps.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Ei umpeutuvia työpaikkoja seuraavan 7 päivän sisällä.",
    });
  }

  // 5. Luodaan ilmoitukset
  const newNotifications = [];

  for (const app of expiringApps) {
    const deadlineDate = new Date(app.valid_through);
    deadlineDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Korvataan viestin luonti cron-reitissä tällä muotoilulla:
    const messageText = `Työpaikan "${app.company} – ${app.job_title}" hakuaika päättyy ${
      daysLeft === 0 ? "tänään" : `${daysLeft} päivän kuluttua`
    }.`;

    // Tarkistetaan duplikaatit
    const { data: existing } = await supabaseAdmin
      .from("notifications")
      .select("id")
      .eq("user_id", app.user_id)
      .eq("message", messageText)
      .limit(1);

    if (!existing || existing.length === 0) {
      newNotifications.push({
        user_id: app.user_id,
        title: "⚠️ Hakuaika päättymässä!",
        message: messageText,
        type: "warning",
        read: false,
      });
    }
  }

  if (newNotifications.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from("notifications")
      .insert(newNotifications);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: `Käsittely valmis. Luotiin ${newNotifications.length} uutta ilmoitusta.`,
  });
}
