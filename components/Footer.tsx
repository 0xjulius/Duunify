"use client";

import Link from "next/link";
import { FiMail, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: "Tuote",
      links: [
        { label: "Ominaisuudet", href: "/#ominaisuudet" },
        { label: "Yleiskatsaus", href: "/#dashboard" },
        { label: "Kokeile demoa", href: "/demo" },
      ],
    },
    {
      title: "Tietoa",
      links: [
        { label: "Yhteystiedot", href: "/contact" },
        { label: "Tietosuoja", href: "/privacy" },
        { label: "Käyttöehdot", href: "/tos" },
      ],
    },
    {
      title: "Tili",
      links: [
        { label: "Liity odotuslistalle", href: "" },
      ],
    },
  ];

  return (
     <footer
      className="duunify-modal relative overflow-hidden"
      style={{
        background: "linear-gradient(165deg, #6D67F2 0%, #5750E0 60%, #4A44C7 100%)",
      }}
    >
        <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brändi + kuvaus */}
           <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="duunify-display font-bold text-[#5750E0] text-sm">D</span>
              </div>
              <span className="duunify-display font-bold text-white text-lg">
                Duunify
              </span>
            </Link>
            <p className="text-sm text-indigo-100/80 leading-relaxed max-w-xs mb-5">
              Työhakemusten hallinta, joka näyttää missä oikeasti menet.
              Automaattinen täyttö, älykäs kalenteri ja visuaalinen
              yleiskatsaus samassa paikassa.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                aria-label="Sähköposti"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#6D67F2] hover:border-[#6D67F2]/30 transition"
              >
                <FiMail size={16} />
              </Link>
              
              <Link
                href="https://linkedin.com/in/juliusaalto"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#6D67F2] hover:border-[#6D67F2]/30 transition"
              >
                <FiLinkedin size={16} />
              </Link>
              
              
              <Link
                href="https://github.com/0xjulius"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#6D67F2] hover:border-[#6D67F2]/30 transition"
              >
                <FiGithub size={16} />
              </Link>
            </div>
          </div>

          {/* Linkkisarakkeet */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="duunify-mono text-lg font-bold uppercase tracking-wider text-amber-300/90 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-indigo-100/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alaosa: copyright + oikeudelliset linkit uudelleen kompaktisti */}
          <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-indigo-100/70">
          <p>© {currentYear} Duunify | 0xjulius | Kaikki oikeudet pidätetään.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Tietosuoja
            </Link>
            <Link href="/tos" className="hover:text-white transition-colors">
              Käyttöehdot
            </Link>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Tehty Suomessa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}