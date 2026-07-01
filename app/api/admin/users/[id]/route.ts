// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  req: NextRequest,
  props: RouteParams
) {
  // Puretaan params asynkronisesti Next.js 15 -tyylillä
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Käytetään purettua id-muuttujaa params.id sijaan
  if (user.id === id) {
    return NextResponse.json(
      { error: "Et voi poistaa omaa tunnustasi." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}