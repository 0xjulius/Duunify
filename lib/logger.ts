"use server";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function createLog({
  userId = null,
  action,
  details,
  category = 'general',
  status = 'success',
  targetId = null
}: any) {
  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "Tuntematon selain";
  const referrer = headerList.get("referer") || "Suoraan sivustolle";

  const { error } = await supabase.from("admin_logs").insert({
    user_id: userId,
    action: action,
    details: details,
    category: category,
    status: status,
    target_id: targetId,
    ip_address: ipAddress,
    user_agent: userAgent,
    referrer: referrer,
  });

  if (error) {
    console.error("LOKITUSVIRHE tietokannassa:", error);
  }
}