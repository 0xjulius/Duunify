import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { createLog } from "@/lib/logger";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    await createLog({
      action: "login_failed",
      details: "Google OAuth -callbackista puuttui authorization code.",
      category: "auth",
      status: "failure",
    }).catch(console.error);

    return NextResponse.redirect(
      new URL("/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("===== GOOGLE OAUTH CALLBACK =====");
  console.log("Error:", error);
  console.log("User:", data?.user?.email);
  console.log("Has session:", !!data?.session);
  console.log("===============================");

  if (error) {
    console.error("Google OAuth exchange failed:", error);

    await createLog({
      action: "login_failed",
      details: `Google OAuth -koodinvaihto epäonnistui: ${error.message}`,
      category: "auth",
      status: "failure",
    }).catch(console.error);

    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", requestUrl.origin)
    );
  }

  if (!data?.user) {
    console.error("Google OAuth succeeded but user was missing.");

    return NextResponse.redirect(
      new URL("/login?error=no_user", requestUrl.origin)
    );
  }

  await createLog({
    action: "login_success",
    details: `Käyttäjä ${data.user.email} kirjautui sisään (Google OAuth)`,
    category: "auth",
    status: "success",
    userId: data.user.id,
  }).catch(console.error);

  console.log("Redirecting to:", next);

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}