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

  // 3. Poistetaan verkko-osoitteet
  cleaned = cleaned.replace(
    /\b(?:https?:\/\/|www\.)[^\s<>]+|\b[a-z0-9][-a-z0-9]+\.(?:fi|com|org|net|edu|gov|eu|io|me|info)\b[^\s]*/gi,
    "[VERKKOOSOITE_POISTETTU]"
  );

  // 4. Poistetaan puhelinnumerot (Sanarajat \b estävät numeroiden leikkautumisen leipätekstistä)
  cleaned = cleaned.replace(
    /\b(?:\+358|0)\s?\(?0?\)?\s?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/g,
    "[PUHELIN_POISTETTU]"
  );

  // 5. Poistetaan katuosoitteet JA postinumerot/toimipaikat
  // Korjattu: Sanarajat \b ja tarkennettu katuosien listaus (poistettu tupla-tie)
  cleaned = cleaned.replace(
    /\b([A-ZÅÄÖa-zåäö]{3,}(?:katu|tie|kuja|polku|kaari|ranta|rinne|väylä|aukea|toritori))\s+\d+(\s+[A-Za-z]\s+\d+)?\b/gi,
    "[OSOITE_POISTETTU]"
  );
  
  // Poistetaan myös suomalaiset postinumerot ja paikkakunnat (esim. 00100 Helsinki)
  cleaned = cleaned.replace(/\b\d{5}\s+[A-ZÅÄÖa-zåäö]+\b/g, "[POSTITOIMIPAIKKA_POISTETTU]");

  // 6. Poistetaan käyttäjän nimi turvallisesti
  if (userName && userName.trim().length > 0) {
    // Erotetaan nimi osiin myös yhdysmerkin (-) kohdalta
    const nameParts = userName.trim().split(/[\s-]+/);
    
    nameParts.forEach((part) => {
      if (part.length > 2) {
        // Escapatan erikoismerkit Regexiä varten (esim. väliviivat)
        const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const reg = new RegExp(`\\b${escapedPart}\\b`, "gi");
        cleaned = cleaned.replace(reg, "[HAKIJAN_NIMI]");
      }
    });
  }

  return cleaned;
}