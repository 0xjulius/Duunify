import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = [
  "/dashboard", "/applications", "/calendar", "/favorites", "/settings",
];
const ADMIN_PREFIX = "/admin";

export async function middleware(request: NextRequest) {
  // 1. Päivitetään istunto ja otetaan talteen pohja-response evästeineen
  const { response: sessionResponse, user } = await updateSession(request);

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith(ADMIN_PREFIX);

  // KORJAUS 1: Suojatut sivut, kun käyttäjä EI ole kirjautunut
  if ((isProtected || isAdminRoute) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    
    // Luodaan redirect-vastaus
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // Kopioidaan Supabasen päivittämät evästeet redirectiin, jotta istunto ei korruptoidu
    sessionResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    
    return redirectResponse;
  }

  // Admin-reitin tarkistus
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
      }
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // KORJAUS 2: Jos ei ole admin, ohjataan dashboardille evästeet säilyttäen
    if (profile?.role !== "admin") {
      const dashboardRedirect = NextResponse.redirect(new URL("/dashboard", request.url));
      
      sessionResponse.cookies.getAll().forEach((cookie) => {
        dashboardRedirect.cookies.set(cookie.name, cookie.value, cookie.options);
      });
      
      return dashboardRedirect;
    }
  }

  // KORJAUS 3: Palautetaan updateSessionista saatu response, jossa on tuoreimmat evästeet mukana
  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};