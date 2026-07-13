"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";
import SimpleNavbar from "@/components/SimpleNav";

export default function ContactPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Viestin lähetys epäonnistui.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      console.error(error);
      setErrorMsg("Verkkovirhe. Tarkista yhteytesi ja yritä uudelleen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,27,75,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,27,75,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <SimpleNavbar />

      <main className="duunify-modal max-w-4xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="mb-10 text-center">
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

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10 lg:p-12 w-full max-w-2xl mx-auto">
          {submitted ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center text-center w-full">
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
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-4 py-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Honeypot: Piilotettu kenttä boteille */}
              <div style={{ display: "none" }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
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
                    maxLength={100}
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
              </div>

              <div className="w-full">
                <label
                  htmlFor="subject"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pl-1"
                >
                  Aihe
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  maxLength={150}
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Esim. Kysymys tilauksesta"
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
                  maxLength={5000}
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
                disabled={submitting}
                className="w-full text-sm font-bold text-white py-3.5 rounded-xl transition-all shadow-sm shadow-[#6D67F2]/10 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #6D67F2, #5750E0)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Lähetetään...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Lähetä viesti
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center pt-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <p className="text-xs text-slate-400">
                  Viestisi kryptataan SSL-yhteydellä. Emme käytä sähköpostiasi
                  markkinointiin ilman lupaasi.
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
      />
    </div>
  );
}
