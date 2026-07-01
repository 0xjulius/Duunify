import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Luodaan pohja-response vain kerran
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // Päivitetään pyyntö (jotta seuraavat koodit näkevät evästeen)
          request.cookies.set({ name, value, ...options });
          // KORJAUS: Päivitetään suoraan olemassa oleva response luomatta uutta oliota
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          // KORJAUS: Päivitetään suoraan olemassa oleva response luomatta uutta oliota
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // getUser() on täydellinen ja turvallinen valinta tässä!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}