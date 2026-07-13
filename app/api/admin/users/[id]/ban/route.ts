import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Päivitetty tyyppi Promiseksi
) {
  // 1. Puretaan params asynkronisesti ennen käyttöä
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;
  
  const cookieStore = await cookies();

  // 2. Alustetaan tavallinen Supabase-asiakas evästeillä tarkistaaksemme kuka pyynnön tekee
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 3. Varmistetaan, että pyynnön tekijä on kirjautunut sisään
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Luvaton" }, { status: 401 });
  }

  // 4. Varmistetaan, että pyynnön tekijä on oikeasti admin-roolissa
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Evätty (Vaatii admin-oikeudet)" }, { status: 403 });
  }

  // 5. Estetään itsensä bännääminen varmuuden vuoksi
  if (user.id === targetUserId) {
    return NextResponse.json({ error: "Et voi estää itseäsi" }, { status: 400 });
  }

  // 6. Luetaan pyynnön runko (body)
  try {
    const body = await request.json();
    const shouldBan = body.ban === true;

    // 7. Alustetaan palvelutason Admin-asiakas (Service Role Key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Kutsutaan Supabasen sisäänrakennettua ylläpitotoimintoa oikealla UUID:lla
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { ban_duration: shouldBan ? "87600h" : "none" }
    );

    if (banError) {
      console.error("Virhe Supabase Auth -eston päivityksessä:", banError);
      return NextResponse.json({ error: banError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, banned: shouldBan });
  } catch (error) {
    console.error("Reitin käsittelyvirhe:", error);
    return NextResponse.json({ error: "Sisäinen palvelinvirhe" }, { status: 500 });
  }
}