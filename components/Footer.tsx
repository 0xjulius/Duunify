"use client";

import Link from "next/link"; // 1. Tuodaan Next.js:n Link-komponentti

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="duunify-modal border-t border-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div>
          <span className="font-bold text-slate-900">Duunify</span>
          <span className="ml-2">© {currentYear} Kaikki oikeudet pidätetään.</span>
        </div>
        <div className="flex gap-6">
          {/* 2. Muutettu <a> -> <Link> sisäiselle sivulle */}
          <Link href="/privacy" className="hover:text-slate-900">
            Tietosuoja
          </Link>
          
          {/* Ankkurit (#) voivat jäädä tavallisiksi <a>-tageiksi */}
          <Link href="/tos" className="hover:text-slate-900">
            Käyttöehdot
          </Link>
          
          <Link href="/contact" className="hover:text-slate-900">
            Yhteystiedot
          </Link>
        </div>
      </div>
    </footer>
  );
}