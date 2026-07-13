import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Luodaan palvelin-asiakas palvelun hallinta-avaimella (service_role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Päivitetään käyttäjän tili vahvistetuksi
  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}