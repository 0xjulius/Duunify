"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { createLog } from "@/lib/logger";
import { ratelimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
  // 1. IP-pohjainen suojamuuri (Upstash) bottihyökkäyksiä vastaan
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") ?? "127.0.0.1";

  // Rajoitetaan yritykset IP-osoitteen mukaan
  const { success } = await ratelimit.limit(`login_limit_${ip}`);

  if (!success) {
    // Palautetaan virhe suoraan, jotta botit eivät kuormita Supabasea tai lokitietokantaa
    return { error: "Liikaa kirjautumisyrityksiä. Yritä hetken päästä uudelleen." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Kirjataan epäonnistunut yritys lokiin
    await createLog({
      action: "login_failed",
      details: `Epäonnistunut kirjautuminen: ${email} (Syy: ${error.message})`,
      category: "auth",
      status: "failure",
    });

    // Tarkistetaan, onko kyseessä porttikielto (bännit)
    const errorMsg = error.message.toLowerCase();
    const isBanned = 
      errorMsg.includes("banned") || 
      errorMsg.includes("disabled") || 
      error.status === 403;

    if (isBanned) {
      redirect("/banned");
    }

    // Palautetaan normaali virheviesti käyttöliittymään (esim. väärä salasana)
    return { error: error.message };
  }

  // Kirjataan onnistunut kirjautuminen lokiin
  await createLog({
    action: "login_success",
    details: `Käyttäjä kirjautui: ${email}`,
    category: "auth",
    status: "success",
    userId: data.user.id,
  });

  redirect("/dashboard");
}