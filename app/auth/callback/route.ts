// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase-server"; // ei "@/lib/supabase/server" // palvelinpuolen client
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Onnistui — ohjataan next-parametrin osoittamaan paikkaan
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Koodi puuttui tai vaihto epäonnistui — takaisin kirjautumiseen virheellä
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}