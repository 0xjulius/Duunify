"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase-admin";

export async function createLog({
  userId = null,
  action,
  details,
  category = "general",
  status = "success",
  targetId = null,
}: {
  userId?: string | null;
  action: string;
  details: string;
  category?: string;
  status?: string;
  targetId?: string | null;
}) {
  const headerList = await headers();

  const ipAddress =
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-real-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ??
    "Tuntematon";

  const userAgent =
    headerList.get("user-agent") ?? "Tuntematon";

  const referrer =
    headerList.get("referer") ?? "Suoraan sivustolle";

  const admin = createAdminClient();

  const { error } = await admin.from("admin_logs").insert({
    user_id: userId,
    action,
    details,
    category,
    status,
    target_id: targetId,
    ip_address: ipAddress,
    user_agent: userAgent,
    referrer,
  });

  if (error) {
    console.error("LOKITUSVIRHE:", error);
  }
}