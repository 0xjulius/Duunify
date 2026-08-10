// lib/anonymize.ts

export function anonymizeText(text: string, userName?: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Poistetaan suomalainen henkilötunnus (DDMMYY-XXXX / DDMMYYAXXXX jne.)
  cleaned = cleaned.replace(
    /\b(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{2}[-+A-FU-Y]\d{3}[0-9A-FHJ-NPR-Y]\b/gi,
    "[HETU_POISTETTU]"
  );

  // 2. Poistetaan sähköpostiosoitteet
  cleaned = cleaned.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    "[SÄHKÖPOSTI_POISTETTU]"
  );

  // 3. Poistetaan puhelinnumerot (+358 40..., 040-1234567, 050 123 4567 jne.)
  cleaned = cleaned.replace(
    /(?:\+358|0)\s?\(?0?\)?\s?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
    "[PUHELIN_POISTETTU]"
  );

  // 4. Poistetaan katuosoitteet (esim. Mannerheimintie 12 A 4, Esimerkkikatu 5)
  cleaned = cleaned.replace(
    /\b([A-ZÅÄÖa-zåäö]+(?:katu|tie|kuja|polku|kaari|ranta|rinne|tie|väylä))\s+\d+(\s+[A-Za-z]\s+\d+)?\b/gi,
    "[OSOITE_POISTETTU]"
  );

  // 5. Poistetaan käyttäjän nimi (jos se on välitetty mukana)
  if (userName && userName.trim().length > 0) {
    const nameParts = userName.trim().split(/\s+/);
    nameParts.forEach((part) => {
      if (part.length > 2) {
        // Poistetaan nimen osat siten, ettei kirjainkoolla ole väliä
        const reg = new RegExp(`\\b${part}\\b`, "gi");
        cleaned = cleaned.replace(reg, "[HAKIJAN_NIMI]");
      }
    });
  }

  return cleaned;
}