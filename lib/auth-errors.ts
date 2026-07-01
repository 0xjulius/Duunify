// lib/auth-errors.ts

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Väärä sähköposti tai salasana.",
  "Email not confirmed": "Vahvista sähköpostiosoitteesi ennen kirjautumista.",
  "User already registered": "Tällä sähköpostiosoitteella on jo tunnus.",
  "Password should be at least 6 characters":
    "Salasanan tulee olla vähintään 6 merkkiä.",
  "Unable to validate email address: invalid format":
    "Sähköpostiosoite on virheellinen.",
  "Email rate limit exceeded":
    "Liikaa yrityksiä. Yritä hetken kuluttua uudelleen.",
  "For security purposes, you can only request this after":
    "Odota hetki ennen uutta yritystä.",
  "New password should be different from the old password":
    "Uuden salasanan tulee olla eri kuin vanha salasana.",
};

export function translateAuthError(message: string): string {
  if (AUTH_ERROR_MESSAGES[message]) {
    return AUTH_ERROR_MESSAGES[message];
  }

  // Some Supabase messages include dynamic parts (e.g. a countdown number),
  // so match by prefix for those.
  const partialMatch = Object.entries(AUTH_ERROR_MESSAGES).find(([key]) =>
    message.startsWith(key)
  );

  if (partialMatch) {
    return partialMatch[1];
  }

  // Fallback: show something generic rather than raw English
  return "Jotain meni pieleen. Yritä uudelleen.";
}