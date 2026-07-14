import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;
  
  const cookieStore = await cookies();

  // 1. Alustetaan tavallinen Supabase-asiakas evästeillä
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

  // 2. Varmistetaan, että tekijä on kirjautunut sisään
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Luvaton" }, { status: 401 });
  }

  // 3. Varmistetaan, että tekijä on oikeasti admin-roolissa
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Evätty (Vaatii admin-oikeudet)" }, { status: 403 });
  }

  // 4. Estetään itsensä bännääminen
  if (user.id === targetUserId) {
    return NextResponse.json({ error: "Et voi estää itseäsi" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const shouldBan = body.ban === true;
    const duration = shouldBan ? (body.duration || "24h") : "none";

    // 5. Alustetaan palvelutason Admin-asiakas (Service Role Key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Kutsutaan Supabasen sisäänrakennettua ylläpitotoimintoa auth.users-tauluun
    const { data: authData, error: banError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { ban_duration: duration }
    );

    if (banError) {
      console.error("Virhe Supabase Auth -eston päivityksessä:", banError);
      return NextResponse.json({ error: banError.message }, { status: 500 });
    }

    // Saadaan Supabasen laskema tarkka päättymisaika suoraan vastauksesta
    const bannedUntil = authData.user?.banned_until || null;

    // Päivitetään myös public.profiles-taulu
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        is_banned: shouldBan,
        banned_until: bannedUntil
      })
      .eq("id", targetUserId);

    if (profileUpdateError) {
      console.error("Virhe profiilin bännitietojen päivityksessä:", profileUpdateError);
      return NextResponse.json({ error: profileUpdateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      is_banned: shouldBan, 
      banned_until: bannedUntil 
    });
  } catch (error) {
    console.error("Reitin käsittelyvirhe:", error);
    return NextResponse.json({ error: "Sisäinen palvelinvirhe" }, { status: 500 });
  }
}