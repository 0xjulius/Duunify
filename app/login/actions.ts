"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Kutsutaan sinun omaa createClient-funktiotasi
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Next.js:n palvelinpuolen ohjaus dashboardille
  redirect("/dashboard");
}