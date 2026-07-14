import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/calendar",
  "/favorites",
  "/settings",
  "/history",
  "/logout"
];

const ADMIN_PREFIX = "/admin";

export async function proxy(request: NextRequest) {
  // POISTETTU: Kehitysympäristön ohitus tietoturvan vuoksi

  const { response: sessionResponse, user, supabase } = await updateSession(request);

  let profile = null;

  // 1. Jos käyttäjä on kirjautunut, haetaan rooli ja bännitiedot YHDELLÄ kyselyllä
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("is_banned, role")
      .eq("id", user.id)
      .single();
    
    profile = data;

    // 2. Jos käyttäjä on bännätty, ohjataan suoraan porttikieltosivulle
    if (profile?.is_banned && request.nextUrl.pathname !== "/banned") {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith(ADMIN_PREFIX);

  // 3. Suojatut sivut vaativat kirjautumisen
  if ((isProtected || isAdminRoute) && !user) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    sessionResponse.cookies.getAll().forEach((cookie) => {
      const { name, value, ...options } = cookie;
      redirectResponse.cookies.set(name, value, options);
    });

    return redirectResponse;
  }

  // 4. Admin-reittien suojaus (käytetään jo aiemmin haettua profiilia)
  if (isAdminRoute && user) {
    if (profile?.role !== "admin") {
      const dashboardRedirect = NextResponse.redirect(
        new URL("/dashboard", request.url)
      );

      sessionResponse.cookies.getAll().forEach((cookie) => {
        const { name, value, ...options } = cookie;
        dashboardRedirect.cookies.set(name, value, options);
      });

      return dashboardRedirect;
    }
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};