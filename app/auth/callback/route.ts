import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { createLog } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      try {
        await createLog({
          action: "login_success",
          details: `Käyttäjä ${data.user.email} kirjautui sisään (Google OAuth)`,
          category: "auth",
          status: "success",
        });
      } catch (logError) {
        console.error("Lokituksen tallennus epäonnistui:", logError);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    if (error) {
      try {
        await createLog({
          action: "login_failed",
          details: `Google OAuth -koodinvaihto epäonnistui: ${error.message}`,
          category: "auth",
          status: "failure",
        });
      } catch (logError) {
        console.error("Virhelokituksen tallennus epäonnistui:", logError);
      }
    }
  } else {
    try {
      await createLog({
        action: "login_failed",
        details: "Google OAuth -kirjautuminen epäonnistui: callback-koodi puuttuu",
        category: "auth",
        status: "failure",
      });
    } catch (logError) {
      console.error(logError);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}