import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/calendar",
  "/favorites",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};