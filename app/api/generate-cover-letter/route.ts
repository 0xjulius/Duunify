// TÄRKEÄÄ: tämä importti PITÄÄ olla ennen "pdf-parse":n tuontia.
// Se rekisteröi pdf-parse:n sisäisesti käyttämän pdfjs-dist-workerin oikein
// Node.js/Next.js-ympäristössä. Ilman tätä webpack ei löydä pdf.worker.mjs-tiedostoa
// palvelimen bundlatuista chunkeista ja parsinta epäonnistuu virheeseen
// "Setting up fake worker failed: Cannot find module '...pdf.worker.mjs'".
import "pdf-parse/worker";

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { anonymizeText } from "@/lib/anonymize";
import { createClient } from "@supabase/supabase-js";

// Supabase-asiakas taustatiedostojen turvalliseen hakuun
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API-avain puuttuu konfiguraatiosta." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const {
      jobTitle,
      company,
      jobDescription,
      userBaseCoverLetter,
      userId,
      letterFilename,
      userName,
      location = "Paikkakunta",
    } = body;

    let extractedLetterText = "";

    // 1. HAETAAN JA PARSITAAN PDF SUPABASE STORAGESTA
    if (userId && letterFilename) {
      try {
        const storagePath = `${userId}/letter_${letterFilename}`;
        console.log(`[PDF DEBUG] Haetaan tiedostoa polusta: ${storagePath}`);
        
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("documents")
          .download(storagePath);

        if (!downloadError && fileData) {
          const buffer = Buffer.from(await fileData.arrayBuffer());

          if (letterFilename.toLowerCase().endsWith(".pdf")) {
            console.log("[PDF DEBUG] Aloitetaan PDF-tiedoston parsinta...");
            const { PDFParse } = await import("pdf-parse");
            const parser = new PDFParse({ data: buffer });

            try {
              const parsedPdf = await parser.getText();
              extractedLetterText = parsedPdf.text;

              console.log("==========================================");
              console.log("✅ PDF PARSITTU ONNISTUNEESTI!");
              console.log(`Sivumäärä: ${parsedPdf.pages?.length ?? "tuntematon"}`);
              console.log(`Tekstin pituus: ${extractedLetterText.length} merkkiä`);
              console.log("==========================================");
            } finally {
              await parser.destroy();
            }
          } else {
            extractedLetterText = buffer.toString("utf-8");
            console.log("✅ TEKSTITIEDOSTO LUETTU ONNISTUNEESTI!");
          }
        } else if (downloadError) {
          console.error("❌ Tiedoston lataus epäonnistui Storagesta:", downloadError.message);
        }
      } catch (fileErr) {
        console.error("❌ Virhe PDF:n käsittelyssä/parsinnassa:", fileErr);
      }
    } else {
      console.log("ℹ️ Ei tiedostoa määriteltynä (userId tai letterFilename puuttuu).");
    }

    const rawBaseCoverLetter = extractedLetterText || userBaseCoverLetter || "";

    // 2. ANONYMISOINTI
    const safeBaseCoverLetter = anonymizeText(rawBaseCoverLetter, userName);
    const safeJobDescription = anonymizeText(jobDescription);

    // 3. PROMPTI GEMINILLE
    const prompt = `
Olet huipputason uravalmentaja ja rekrytointiasiantuntija. Tehtäväsi on kirjoittaa erittäin laadukas, uskottava ja tarkasti kyseiseen työtehtävään kohdennettu työhakemus.

LÄHTÖTIEDOT:
TYÖPAIKKAILMOITUS:
- Tehtävänimike: ${jobTitle}
- Yritys: ${company}
- Kuvaus: ${safeJobDescription || "Ei erillistä kuvausta"}

HAKIJAN POHJASAATEKIRJE / TAUSTATIEDOT:
${safeBaseCoverLetter || "Hakijalla on vahva perusosaaminen ja motivaatio kehittyä alalla."}

---

ANALYYSI JA TAUSTAOHJEET (Noudata näitä sisäisesti):
1. Tunnista työpaikkailmoituksesta tärkeimmät vastuut sekä mitä osaamista työnantaja todellisuudessa etsii.
2. Yhdistä hakijan tausta suoraan näihin tarpeisiin ja korosta konkreettista hyötyä työnantajalle.
3. REHELLISYYS: Älä KOSKAAN keksi hakijalle työkokemusta, taitoja, sertifikaatteja tai koulutusta, joita ei ole mainittu taustatiedoissa. Käsittele puuttuva kokemus oppimiskyvyn ja vahvan perustan kautta. Älä yritä tehdä juniorista senioria.
4. TYYLI: Kirjoita ammattimaisesti, luonnollisesti ja itsevarman realistisesti. Vältä tyhjiä adjektiiveja (esim. passionate, motivated, hardworking, excellent), ellei niitä perustella konkreettisin näytöin. Tekstin tulee kuulostaa ajattelevan ihmisen – ei tekoälyn – kirjoittamalta.

---

HAKEMUKSEN RAKENNE JA SISÄLTÖ:

1. JOHDANTO:
   - Kerro mitä tehtävää haet ja osoita aitoa kiinnostusta yritystä/tehtävää kohtaan.
   - Yhdistä tehtävä heti hakijan osaamiseen ja kerro, miksi hakija on kiinnostava työnantajalle. Vältä geneerisiä aloituksia.

1.1 ALOITUS:
    - Lihavoituna ensimmäinen rivi: **${company}, ${location}**
    - Riviväli
    - Toinen rivi: ${jobTitle}
    - Lisää tämän jälkeen kaksi tyhjää riviä ja jatka hakemuksen varsinaisella sisällöllä.

2. KOULUTUS:
   - Käytä otsikkona täsmälleen Markdown-muotoa: ## Koulutus
   - Kuvaa koulutusta työn kannalta relevantista näkökulmasta (mitä osaamista se on tuonut ja miten se tukee tehtävää).

3. TYÖKOKEMUS JA KÄYTÄNNÖN OSAAMINEN:
   - Käytä otsikkona täsmälleen Markdown-muotoa: ## Työkokemus ja käytännön osaaminen
   - Yhdistä aiempi kokemus uuden tehtävän vaatimuksiin.
   - Kerro mitä hyötyä aiemmasta kokemuksesta on uudessa roolissa.

4. SOVELTUVUUS TEHTÄVÄÄN:
   - Käytä otsikkona täsmälleen Markdown-muotoa: ## Miksi koen olevani sopiva tähän tehtävään?
   - Luo selkeä osio, jossa on 5-6 sisällöllisesti eri näkökulmasta kirjoitettua bullet pointia.
   - Jokaisen bullet pointin tulee vastata kysymykseen: "Mitä hyötyä tästä on työnantajalle?"
   - Bullet pointin title tulee olla boldattuna, jonka jälkeen boldaus pois ja lyhyt selitys.

5. LOPETUS:
   - Tiivis ja vahva päätöskappale. Kokoa tärkeimmät vahvuudet, vahvista kiinnostus ja osoita halua keskustella tehtävästä tarkemmin haastattelussa.
   - Älä kirjoita ystävällisiä loppulauseita, kuten "Kiitos ajastanne" tai omia yhteystietoja. Älä lisää allekirjoitusta.

---

LUPAUS JA LOPPUTULOS:
Palauta VASTAUKSEKSI AINOASTAAN valmis, valmiiksi muotoiltu työhakemus suomeksi. Älä sisällytä mitään johdantotekstejä, analyysejä, terveisiä tai selityksiä prosessista.
`;

    // [DEBUG] Tämä on kirjaimellisesti se sisältö, joka lähetetään Geminille
    // (contents: prompt alla). Tästä näet 100% varmasti mitä Gemini vastaanottaa.
    console.log("==========================================");
    console.log("[PROMPT DEBUG] LOPULLINEN GEMINILLE LÄHETETTÄVÄ PROMPTI:");
    console.log(prompt);
    console.log("==========================================");

    // 4. GEMINI-KUTSU (Käytetään pyydettyjä 3.5-malleja)
    let response;
    let usedModel = "gemini-3.5-flash";

    try {
      response = await ai.models.generateContent({
        model: usedModel,
        contents: prompt,
      });
    } catch (primaryError: any) {
      console.warn(
        `Ensisijainen malli (${usedModel}) epäonnistui, yritetään varamallia...`,
        primaryError?.message
      );

      usedModel = "gemini-3.5-flash-lite";
      try {
        response = await ai.models.generateContent({
          model: usedModel,
          contents: prompt,
        });
      } catch (fallbackError: any) {
        throw fallbackError;
      }
    }

    return NextResponse.json({ coverLetter: response.text });
  } catch (error: any) {
    console.error("Gemini API backend virhe:", error);

    if (error?.status === 429 || error?.message?.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Palvelussa on tilapäistä ruuhkaa (kiintiöraja saavutettu). Odota 30 sekuntia ja yritä uudelleen.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message || "Saatekirjeen generointi epäonnistui palvelimella.",
      },
      { status: 500 }
    );
  }
}