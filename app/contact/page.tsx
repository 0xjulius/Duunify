"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import SimpleNavbar from "@/components/SimpleNav";

export default function ContactPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tähän voi kytkeä myöhemmin API-kutsun (esim. /api/contact)
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* TAUSTAPATTERNI – Täsmälleen etusivun arvoilla */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,27,75,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,27,75,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

         {/* NAV WAIT */}
         <SimpleNavbar />
   
         {/* NAV-VALMIS 
         <header className="duunify-modal sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
           <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D67F2] to-[#5750E0]" />
   
               <span className="duunify-display font-bold text-slate-900">
                 Duunify
               </span>
             </Link>
   
             <div className="flex items-center gap-5">
               <Link
                 href="/"
                 className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
               >
                 <ArrowLeft size={16} /> Palaa takaisin
               </Link>
   
               <button
                 onClick={() => setShowLogin(true)}
                 className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-transform active:scale-[0.98]"
                 style={{
                   background: "linear-gradient(135deg, #6D67F2, #5750E0)",
                 }}
               >
                 Aloita ilmaiseksi
               </button>
             </div>
           </div>
         </header >
         */}
   

      {/* PÄÄSISÄLTÖ */}
      <main className="duunify-modal max-w-6xl mx-auto px-6 pt-16 pb-24 relative z-10">
        {/* HITUSET JA OTSAKKEET */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-[#6D67F2] uppercase bg-[#6D67F2]/8 px-3 py-1.5 rounded-full">
            <MessageSquare size={12} /> Ota yhteyttä tiimiin
          </div>
          <h1 className="duunify-display mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Miten voimme auttaa?
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Vastaamme kaikkiin tiedusteluihin arkisin 24 tunnin sisällä.
          </p>
        </div>

        {/* VALKOINEN BOKSI – Korjattu grid-rakenne */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10 lg:p-12 w-full">
          <div className="flex flex-col lg:flex-row gap-10 w-full">
            {/* VASEN SIVUPALKKI – YHTEYSTIEDOT (Lisätty paddingia ja ilmaa) */}
            <aside className="w-full lg:w-[40%] space-y-8 shrink-0">
              <div className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100 space-y-8 w-full">
                <div>
                  <h3 className="duunify-mono text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-3.5">
                    Sähköposti
                  </h3>
                  <a
                    href="mailto:info@duunify.com"
                    className="text-lg font-semibold text-[#6D67F2] hover:underline flex items-center gap-2.5 break-all"
                  >
                    <Mail size={20} className="shrink-0" /> info@duunify.com 
                  </a>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Yleiset kysymykset, palaute ja yhteistyöehdotukset.
                  </p>
                </div>

                <hr className="border-slate-200/60" />

                <div>
                  <h3 className="duunify-mono text-[11px] tracking-wider uppercase font-bold text-slate-400 mb-3.5">
                    Asiakastuki
                  </h3>
                  <a
                    href="mailto:tuki@duunify.com"
                    className="text-lg font-semibold text-slate-900 hover:text-[#5750E0] flex items-center gap-2.5 transition-colors break-all"
                  >
                    <ShieldCheck
                      size={20}
                      className="text-emerald-500 shrink-0"
                    />{" "}
                    tuki@duunify.com
                  </a>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Ongelmatilanteet, käyttäjätilit ja tekninen apu.
                  </p>
                </div>
              </div>

              {/* LOMAKKEEN TURVALLISUUS-INFOLAATIKKO (Myös tähän hieman lisää tilaa) */}
              <div className="p-6 md:p-8 rounded-2xl border border-slate-100 bg-white shadow-sm flex gap-4 items-start w-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Suojattu yhteys
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Viestisi kryptataan SSL-yhteydellä. Emme koskaan käytä
                    sähköpostiasi markkinointiin ilman lupaasi.
                  </p>
                </div>
              </div>
            </aside>

            {/* OIKEA PUOLI – INTERAKTIIVINEN YHTEYDENOTTOLOMAKE */}
            <div className="w-full lg:w-[60%] flex-1">
              {submitted ? (
                <div className="h-full min-h-[350px] border border-slate-100 bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Send size={24} />
                  </div>
                  <h3 className="duunify-display text-xl font-bold text-slate-900 mb-2">
                    Viesti lähetetty onnistuneesti!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                    Kiitos yhteydenotostasi. Tiimimme käsittelee viestisi
                    mahdollisimman pian.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#6D67F2] hover:text-[#5750E0] underline"
                  >
                    Lähetä uusi viesti
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pl-1"
                    >
                      Nimi / Nimimerkki
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Matti Meikäläinen"
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-[#6D67F2] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pl-1"
                    >
                      Sähköpostiosoite
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="matti@esimerkki.fi"
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-[#6D67F2] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pl-1"
                    >
                      Viestisi
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Kirjoita kysymyksesi tai palautteesi tähän..."
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-[#6D67F2] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-sm font-bold text-white py-3.5 rounded-xl transition-all shadow-sm shadow-[#6D67F2]/10 active:scale-[0.99] flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #6D67F2, #5750E0)",
                    }}
                  >
                    <Send size={16} /> Lähetä viesti
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)} // <--- LISÄÄ TÄMÄ
      />
    </div>
  );
}
