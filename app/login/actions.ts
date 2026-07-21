"use server";

import { createClient } from "@/lib/supabase-server";
import { createLog } from "@/lib/logger";
import { ratelimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

// Helper function to reliably extract the client IP address
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const rawIp =
    headerList.get("cf-connecting-ip") ?? // Cloudflare IP if used
    headerList.get("x-real-ip") ??
    headerList.get("x-forwarded-for");

  return rawIp ? rawIp.split(",")[0].trim() : "127.0.0.1";
}

export async function loginAction(formData: FormData) {
  const ip = await getClientIp();

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Sähköposti ja salasana vaaditaan." };
  }

  // 1. Check IP rate limit (Protects against single-IP bot attacks)
  const { success: ipSuccess } = await ratelimit.limit(`login_ip_${ip}`);
  if (!ipSuccess) {
    return { error: "Liikaa kirjautumisyrityksiä. Yritä hetken päästä uudelleen." };
  }

  // 2. Check Email rate limit (Protects accounts from distributed/Tor brute-force)
  const { success: emailSuccess } = await ratelimit.limit(`login_email_${email}`);
  if (!emailSuccess) {
    return { error: "Liikaa epäonnistuneita yrityksiä tälle tilille. Yritä hetken päästä." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await createLog({
      action: "login_failed",
      details: `Epäonnistunut kirjautuminen: ${email} (Syy: ${error.message})`,
      category: "auth",
      status: "failure",
    });

    const errorMsg = error.message.toLowerCase();
    const isBanned =
      errorMsg.includes("banned") ||
      errorMsg.includes("disabled") ||
      error.status === 403;

    if (isBanned) {
      return { isBanned: true, error: "Tili on estetty." };
    }

    return { error: error.message };
  }

  await createLog({
    action: "login_success",
    details: `Käyttäjä kirjautui: ${email}`,
    category: "auth",
    status: "success",
    userId: data.user.id,
  });

  return { success: true, user: data.user };
}

export async function registerAction(formData: FormData) {
  const ip = await getClientIp();

  // 1. Upstash Rate Limit for Signups (Protects against account creation spam)
  const { success: ipSuccess } = await ratelimit.limit(`register_ip_${ip}`);
  if (!ipSuccess) {
    return { error: "Liikaa rekisteröitymisiä tästä IP-osoitteesta. Yritä myöhemmin uudelleen." };
  }

  // 2. Server-side Honeypot Check (Catches automated scripts bypassing client forms)
  const honeypot = formData.get("company_website") as string;
  if (honeypot) {
    await createLog({
      action: "bot_blocked",
      details: `Botti estetty honeypot-ansalla (IP: ${ip})`,
      category: "auth",
      status: "failure",
    });
    // Return fake success to confuse and silence the bot script
    return { success: true, fake: true };
  }

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim();

  if (!email || !password || !fullName) {
    return { error: "Kaikki kentät ovat pakollisia." };
  }

  // 3. Name Validation (Blocks gibberish names like "cppquIAkmymlSVIgQjEiIQel")
  const isGibberishName =
    fullName.length > 35 ||
    /^[a-zA-Z0-9]{15,}$/.test(fullName) || // Unbroken alphanumeric string with no spaces
    (fullName.match(/[A-Z]/g) || []).length > 8; // Excessive uppercase letters

  if (isGibberishName) {
    await createLog({
      action: "bot_blocked",
      details: `Botti estetty epäilyttävän nimen vuoksi: "${fullName}" (IP: ${ip})`,
      category: "auth",
      status: "failure",
    });
    return { error: "Virheellinen nimi. Tarkista syöttämäsi tiedot." };
  }

  const supabase = await createClient();

  // 4. Create User on Server Side
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        ip_address: ip,
      },
    },
  });

  if (error) {
    await createLog({
      action: "register_failed",
      details: `Rekisteröinti epäonnistui: ${email} (Syy: ${error.message})`,
      category: "auth",
      status: "failure",
    });
    return { error: error.message };
  }

  await createLog({
    action: "register_success",
    details: `Uusi käyttäjä rekisteröityi: ${email}`,
    category: "auth",
    status: "success",
    userId: data.user?.id,
  });

  return { success: true, data };
}