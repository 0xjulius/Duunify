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
    // Rajoitetaan väärinkäyttöä IP-osoitteen perusteella
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await ratelimit.limit(`contact_${ip}`);

    if (!success) {
      return NextResponse.json(
        { error: "Liikaa yrityksiä. Yritä myöhemmin uudelleen." },
        { status: 429 },
      );
      }
      
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Virheelliset tiedot" },
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

    if (trimmedSubject.length > 150) {
      return NextResponse.json(
        { error: "Aihe liian pitkä (max 150 merkkiä)." },
        { status: 400 },
      );
    }

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        { error: "Kaikki kentät ovat pakollisia." },
        { status: 400 },
      );
    }

    if (trimmedName.length > 100) {
      return NextResponse.json({ error: "Nimi liian pitkä." }, { status: 400 });
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

    // 1. Tallennetaan viesti tietokantaan ensin — säilyy vaikka sähköposti epäonnistuisi
    const admin = createAdminClient();
    const { data: savedMessage, error: dbError } = await admin
      .from("contact_messages")
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Yhteydenottolomakkeen tallennus epäonnistui:", dbError);
      return NextResponse.json(
        { error: "Viestin tallennus epäonnistui. Yritä uudelleen." },
        { status: 500 },
      );
    }

    // 2. Lähetetään sähköposti Resendillä
    try {
      await resend.emails.send({
        from: "Duunify <yhteydenotot@duunify.com>", // vaatii vahvistetun domainin
        to: "julius.aalto@gmail.com",
        replyTo: trimmedEmail,
        subject: `Uusi yhteydenotto: ${trimmedSubject}`,
        html: `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2>Uusi yhteydenottolomake</h2>
      <p><strong>Nimi:</strong> ${escapeHtml(trimmedName)}</p>
      <p><strong>Sähköposti:</strong> ${escapeHtml(trimmedEmail)}</p>
      <p><strong>Aihe:</strong> ${escapeHtml(trimmedSubject)}</p>
      <p><strong>Viesti:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
      <hr />
      <p style="color: #94a3b8; font-size: 12px;">
        Lähetetty Duunify-yhteydenottolomakkeen kautta.
      </p>
    </div>
  `,
      });

      await admin
        .from("contact_messages")
        .update({ email_sent: true })
        .eq("id", savedMessage.id);
    } catch (emailError) {
      // Viesti on jo tallessa tietokannassa, joten emme epäonnista koko pyyntöä
      console.error("Sähköpostin lähetys epäonnistui:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Yhteydenottolomakkeen käsittely epäonnistui:", error);
    return NextResponse.json(
      { error: "Odottamaton virhe. Yritä myöhemmin uudelleen." },
      { status: 500 },
    );
  }
}
