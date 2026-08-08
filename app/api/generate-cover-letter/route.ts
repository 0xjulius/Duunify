import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API-avain puuttuu konfiguraatiosta." },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { jobTitle, company, jobDescription, userBaseCoverLetter } =
      await req.json();

    const prompt = `
Olet huipputason uravalmentaja ja rekrytointiasiantuntija. Tehtäväsi on kirjoittaa erittäin laadukas, uskottava ja tarkasti kyseiseen työtehtävään kohdennettu työhakemus.

LÄHTÖTIEDOT:
TYÖPAIKKAILMOITUS:
- Tehtävänimike: ${jobTitle}
- Yritys: ${company}
- Kuvaus: ${jobDescription || "Ei erillistä kuvausta"}

HAKIJAN POHJASAATEKIRJE / TAUSTATIEDOT:
${userBaseCoverLetter || "Hakijalla on vahva perusosaaminen ja motivaatio kehittyä alalla."}

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

2. KOULUTUS (Education):
    - Käytä Koulutus väliotsikkoa lihavoituna, jonka jälkeen riviväli ja leipätekstillä kerrotaan koulutuksesta.
   - Kuvaa koulutusta työn kannalta relevantista näkökulmasta (mitä osaamista se on tuonut ja miten se tukee tehtävää).

3. TYÖKOKEMUS JA KÄYTÄNNÖN OSAAMINEN (Work Experience and Practical Skills):
Käytä Työkokemus ja käytännön osaaminen väliotsikkoa lihavoituna, jonka jälkeen riviväli ja leipätekstillä kerrotaan työkokemuksesta.
   - Yhdistä aiempi kokemus uuden tehtävän vaatimuksiin.
   - Kerro mitä hyötyä aiemmasta kokemuksesta on uudessa roolissa (esim. asiakaspalvelu -> viestintä ja käyttäjätuki, projektit -> vastuunotto ja toimitus).

4. SOVELTUVUUS TEHTÄVÄÄN (Why do I feel I am suitable for this role? | Miksi koen olevani sopiva tähän tehtävään?) lihavoituna, jonka jälkeen riviväli:
   - Luo selkeä osio, jossa on 5-6 sisällöllisesti eri näkökulmasta kirjoitettua bullet pointia (esim. Strong technical foundation, Analytical problem-solving, Quality-oriented mindset, Continuous learning).
   - Jokaisen bullet pointin tulee vastata kysymykseen: "Mitä hyötyä tästä on työnantajalle?"
   - Bullet pointin title tulee olla boldattuna, jonka jälkeen boldaus pois ja lyhyt selitys, miksi hakija on vahva juuri tässä osa-alueessa.

5. LOPETUS:
   - Tiivis ja vahva päätöskappale. Kokoa tärkeimmät vahvuudet, vahvista kiinnostus ja osoita halua keskustella tehtävästä tarkemmin haastattelussa.
   - Älä kirjoita ystävällisiä loppulauseita, kuten "Kiitos ajastanne" tai omia yhteystietoja. Älä lisää allekirjoitusta.

---

LUPAUS JA LOPPUTULOS:
Palauta VASTAUKSEKSI AINOASTAAN valmis, valmiiksi muotoiltu työhakemus suomeksi. Älä sisällytä mitään johdantotekstejä, analyysejä, terveisiä tai selityksiä prosessista – vain pelkkä hakemusteksti, jonka hakija voi kopioida suoraan käyttöön.

- ÄLÄ lisää tekstin alkuun hakijan yhteystietoja, päivämäärää, otsikkoa "Saatekirje" tai sivunumeroa (koska ylätunniste luodaan automaattisesti käyttöliittymässä).
- Yrityksen nimi ja paikkakunta tulee olla lihavoituna.
- Aloita teksti TARKALLEEN seuraavalla muodolla:
Lihavoituna tämä rivi ${company}, <Paikkakunta> + RIVIVÄLI
Normaalitekstinä tämä rivi${jobTitle}

- Tämän jälkeen riviväli ja aloita varsinainen hakemusteksti (ensimmäinen kappale).
`;

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

      // Varamallina käytetään nykyistä toimivaa flash-lite -versiota
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

    // Käsitellään 429 Kiintiöylitys erikseen
    if (error?.status === 429 || error?.message?.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Palvelussa on tilapäistä ruuhkaa (kiintiöraja saavutettu). Odota 30 sekuntia ja yritä uudelleen.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message || "Saatekirjeen generointi epäonnistui palvelimella.",
      },
      { status: 500 },
    );
  }
}