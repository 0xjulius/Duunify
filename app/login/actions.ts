"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { createLog } from "@/lib/logger";
import { headers } from "next/headers"; // Tuo headers

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Haetaan pyynnön tiedot
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") || "Ei saatavilla";
  const userAgent = headersList.get("user-agent") || "Ei saatavilla";
  const referrer = headersList.get("referer") || "Suoraan sivustolle";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await createLog({
      action: "login_failed",
      details: `Epäonnistunut kirjautuminen: ${email} | IP: ${ipAddress} | UA: ${userAgent}`,
      category: "auth",
      status: "failure",
    });
    
    return { error: error.message };
  }

  // Lokitetaan onnistuminen lisätiedoilla
  await createLog({
    action: "login_success",
    details: `Käyttäjä kirjautui: ${email} | IP: ${ipAddress} | Referrer: ${referrer}`,
    category: "auth",
    status: "success",
  });

  redirect("/dashboard");
}