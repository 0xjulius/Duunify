"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { createLog } from "@/lib/logger";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await createLog({
      action: "login_failed",
      details: `Epäonnistunut kirjautuminen: ${email}`,
      category: "auth",
      status: "failure",
      // Ei userId:tä — kirjautuminen epäonnistui, käyttäjää ei voida vahvistaa.
    });

    return { error: error.message };
  }

  await createLog({
    action: "login_success",
    details: `Käyttäjä kirjautui: ${email}`,
    category: "auth",
    status: "success",
    userId: data.user.id, // ← tämä oli ainoa oikeasti puuttunut asia
  });

  redirect("/dashboard");
}

export async function loginWithGoogleAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data?.url) {
    await createLog({
      action: "login_failed",
      details: `Google OAuth -aloitus epäonnistui: ${error?.message || "URL puuttui"}`,
      category: "auth",
      status: "failure",
    });

    return { error: error?.message || "Google-kirjautumisen aloitus epäonnistui." };
  }

  redirect(data.url);
}