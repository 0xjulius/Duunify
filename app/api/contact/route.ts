import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase-admin";
import { ratelimit } from "@/lib/ratelimit";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, website } = body;
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "Tuntematon";

    if (website) {
      // Tallenna lokiin tiedot, jotta näet kuka yritti ja milloin
      console.warn("Botti havaittu (honeypot):", {
        ip: ip, // Voit napata IP:n tässä
        userAgent: req.headers.get("user-agent"),
        websiteValue: website,
      });

      // Palautamme onnistumisen, jotta botti luulee onnistuneensa
      return NextResponse.json({ success: true });
    }

    const { success } = await ratelimit.limit(`contact_${ip}`);

    if (!success) {
      return NextResponse.json(
        { error: "Liikaa yrityksiä. Yritä myöhemmin uudelleen." },
        { status: 429 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const admin = createAdminClient();

    const userAgent = req.headers.get("user-agent") ?? "Tuntematon";
    const referer = req.headers.get("referer") ?? "Ei refereriä";
    const language = req.headers.get("accept-language") ?? "Tuntematon";

    const country = req.headers.get("x-vercel-ip-country") ?? "Tuntematon";
    const region =
      req.headers.get("x-vercel-ip-country-region") ?? "Tuntematon";
    const city = req.headers.get("x-vercel-ip-city") ?? "Tuntematon";

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Virheelliset tiedot." },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json(
        { error: "Kaikki kentät ovat pakollisia." },
        { status: 400 },
      );
    }

    if (trimmedName.length > 100) {
      return NextResponse.json({ error: "Nimi liian pitkä." }, { status: 400 });
    }

    if (trimmedSubject.length > 150) {
      return NextResponse.json(
        { error: "Aihe liian pitkä (max 150 merkkiä)." },
        { status: 400 },
      );
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { error: "Viesti liian pitkä (max 5000 merkkiä)." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Virheellinen sähköpostiosoite." },
        { status: 400 },
      );
    }

    // Tallennetaan tietokantaan päivitetyillä tiedoilla
    const { data: savedMessage, error: dbError } = await admin
      .from("contact_messages")
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        ip_address: ip,
        user_agent: userAgent,
        referer,
        language,
        country,
        region,
        city,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB INSERT ERROR:", dbError);

      return NextResponse.json(
        { error: "Viestin tallennus epäonnistui." },
        { status: 500 },
      );
    }

    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!recipientEmail) {
      console.error("CONTACT_RECEIVER_EMAIL puuttuu.");
      return NextResponse.json({ success: true });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "Duunify <yhteydenotot@duunify.com>",
        to: recipientEmail,
        replyTo: trimmedEmail,
        subject: `Uusi yhteydenotto: ${trimmedSubject}`,
        html: `
    <div style="font-family:sans-serif;max-width:600px;line-height:1.5;">
      <h2 style="color:#1e293b;">Uusi yhteydenotto</h2>

      <p><strong>Nimi:</strong> ${escapeHtml(trimmedName)}</p>
      <p><strong>Sähköposti:</strong> ${escapeHtml(trimmedEmail)}</p>
      <p><strong>Aihe:</strong> ${escapeHtml(trimmedSubject)}</p>

      <p><strong>Viesti:</strong></p>
      <p style="white-space:pre-wrap;background:#f8fafc;padding:10px;border-left:4px solid #cbd5e1;">
        ${escapeHtml(trimmedMessage)}
      </p>

      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e2e8f0;color:#475569;font-size:0.85rem;">
        <p><strong>Tekniset tiedot:</strong></p>
        <ul style="list-style:none;padding:0;">
          <li><strong>Sijainti:</strong> ${city}, ${region}, ${country}</li>
          <li><strong>IP-osoite:</strong> ${ip}</li>
          <li><strong>Kieli:</strong> ${language}</li>
          <li><strong>Selain:</strong> ${userAgent}</li>
          <li><strong>Referer:</strong> ${referer}</li>
        </ul>
      </div>

      <small style="color:#64748b;display:block;margin-top:20px;">
        Lähetetty Duunifyn yhteydenottolomakkeesta.
      </small>
    </div>
  `,
      });

      console.log("Resend response:", data);

      if (error) {
        console.error("Resend error:", error);
        throw error;
      }

      const { error: updateError } = await admin
        .from("contact_messages")
        .update({
          email_sent: true,
        })
        .eq("id", savedMessage.id);

      if (updateError) {
        console.error("DB UPDATE ERROR:", updateError);
      } else {
        console.log("email_sent päivitetty onnistuneesti.");
      }
    } catch (err) {
      console.error("EMAIL SEND ERROR:", err);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);

    return NextResponse.json(
      {
        error: "Odottamaton virhe.",
      },
      {
        status: 500,
      },
    );
  }
}
