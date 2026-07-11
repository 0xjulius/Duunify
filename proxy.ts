import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";
import { createServerClient } from "@supabase/ssr";

// Reitit, jotka vaativat tavallisen kirjautumisen
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/calendar",
  "/favorites",
  "/settings",
  "/history",
];

// Reitit, jotka vaativat admin-roolin
const ADMIN_PREFIX = "/admin";

// KORJAUS: Funktion nimi on nyt "proxy" (aiemmin "middleware")
export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }
  const { response: sessionResponse, user } = await updateSession(request);

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith(ADMIN_PREFIX);

  // 1. Suojatut sivut tai admin-sivut, kun käyttäjä EI ole kirjautunut lainkaan
  // vaihdetaan redirectUrl /login, kun sivusto on julkaisukelpoinen
  if ((isProtected || isAdminRoute) && !user) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);

    const redirectResponse = NextResponse.redirect(redirectUrl);

    sessionResponse.cookies.getAll().forEach((cookie) => {
      // Pura nimi, arvo ja kaikki muut asetukset (kuten path, httpOnly, sameSite jne.)
      const { name, value, ...options } = cookie;

      // Aseta eväste uudelleen purkamillasi asetuksilla
      redirectResponse.cookies.set(name, value, options);
    });

    return redirectResponse;
  }

  // Admin-reitin tarkistus silloin, kun käyttäjä on kirjautunut sisään
  if (isAdminRoute && user) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: () => {},
          remove: () => {},
        },
      },
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // 2. Jos käyttäjä ei ole admin, ohjataan takaisin dashboardille evästeet säilyttäen
    if (profile?.role !== "admin") {
      const dashboardRedirect = NextResponse.redirect(
        new URL("/dashboard", request.url),
      );

      sessionResponse.cookies.getAll().forEach((cookie) => {
        // Pura nimi, arvo ja kaikki muut asetukset (kuten path, httpOnly, sameSite jne.)
        const { name, value, ...options } = cookie;

        // Aseta eväste uudelleen purkamillasi asetuksilla
        dashboardRedirect.cookies.set(name, value, options);
      });

      return dashboardRedirect;
    }
  }

  // 3. Palautetaan tuoreet evästeet
  return sessionResponse;
}

// Matcher pysyy samana
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
