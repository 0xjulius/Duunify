// app/api/webhooks/new-user/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// Alustetaan Resend ja Supabase-pääkäyttäjä (Service Role, ohittaa RLS-säännöt)
const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Supabasen webhook tuo uuden käyttäjän tiedot body.record-objektissa
    const newUser = body.record; 
    if (!newUser) return NextResponse.json({ error: "No record found" }, { status: 400 });

    const { data: admins } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("role", "admin")
      .eq("notify_new_users", true);

    if (!admins || admins.length === 0) {
      return NextResponse.json({ message: "No admins subscribed to notifications" });
    }

    const adminEmails = admins.map((a) => a.email);

    // Parsitaan selainmerkkijonosta (User Agent) yksinkertainen laitetunnistus
    const ua = newUser.user_agent || "Tuntematon selain";
    const isMobile = /Mobile|Android|iPod|iPhone/i.test(ua) ? "Mobiililaite" : "Tietokone / Työpöytäversio";

    // Lähetetään sähköposti Resendillä kaikille tilanneille admineille
    await resend.emails.send({
      from: "Duunify <onboarding@resend.dev>", // Voit myöhemmin käyttää omaa domainiasi
      to: adminEmails,
      subject: "🚀 Uusi käyttäjä rekisteröityi Duunifyhin!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; bg: #ffffff;">
          <h2 style="color: #6D67F2; margin-top: 0; margin-bottom: 20px;">Uusi käyttäjä on liittynyt! 🎉</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
            <tbody>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; border-b: 1px solid #f1f5f9;">Nimi:</td>
                <td style="padding: 8px 0; color: #0f172a; border-b: 1px solid #f1f5f9;">${newUser.full_name || "Ei nimeä"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; border-b: 1px solid #f1f5f9;">Sähköposti:</td>
                <td style="padding: 8px 0; color: #0f172a; border-b: 1px solid #f1f5f9;">${newUser.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; border-b: 1px solid #f1f5f9;">Tulolähde (Referrer):</td>
                <td style="padding: 8px 0; color: #2563eb; border-b: 1px solid #f1f5f9; word-break: break-all;">${newUser.referrer || "Suora haku / Kirjanmerkki"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; border-b: 1px solid #f1f5f9;">Laite & Selain:</td>
                <td style="padding: 8px 0; color: #0f172a; border-b: 1px solid #f1f5f9;"><strong>${isMobile}</strong><br/><span style="font-size: 12px; color: #64748b;">${ua}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; border-b: 1px solid #f1f5f9;">IP-osoite:</td>
                <td style="padding: 8px 0; font-family: monospace; color: #475569; border-b: 1px solid #f1f5f9;">${newUser.ip_address || "Ei saatavilla"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569;">Ajankohta:</td>
                <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })}</td>
              </tr>
            </tbody>
          </table>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          
          <div style="text-align: right;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #6D67F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">Avaa Admin-paneeli</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}