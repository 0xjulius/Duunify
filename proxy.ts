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
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const { response: sessionResponse, user, supabase } = await updateSession(request);

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_banned, role") // Haetaan myös rooli, jos tarvitset sitä myöhemmin
      .eq("id", user.id)
      .single();

    // Jos käyttäjä on bännätty eikä ole jo valmiiksi banned-sivulla, ohjaa hänet sinne
    if (profile?.is_banned && request.nextUrl.pathname !== "/banned") {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith(ADMIN_PREFIX);

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

  if (isAdminRoute && user) {
    // Käytetään samaa clientia kuin yllä — ei enää toista,
    // omalla (rikkinäisellä) eväste-adapterillaan luotua clientia.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

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