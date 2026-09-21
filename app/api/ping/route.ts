import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  // Varmistetaan, että pyyntö tulee Vercel Cronilta (turvallisuus)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Tehdään mahdollisimman kevyt kysely tietokantaan (haetaan vain 1 rivi)
  const { data, error } = await supabase
    .from("applications")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}