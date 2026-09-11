"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  PlusCircle, 
  FileText, // Päivitetty ikoni tähän
  BarChart3, 
  Sparkles 
} from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Käsitellään animaation tilat
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const firstName = userName ? userName.split(" ")[0] : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Tummennettu tausta */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modaalin runko */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Yläpalkin koristelu */}
        <div className="h-3 w-full" style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }} />
        
        {/* Sulkemispainike */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Sulje"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-[#6D67F2]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tervetuloa Duunifyyn{firstName ? `, ${firstName}` : ""}!
            </h2>
          </div>
          
          <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">
            Hienoa nähdä sinut täällä! Jotta pääset sujuvasti alkuun työnhaun hallinnassa, kokosimme alle kolme tärkeintä askelta.
          </p>

          {/* Ohjeistukset */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Lisää ensimmäinen hakemuksesi</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Aloita klikkaamalla sivun ylälaidasta <strong>"Uusi hakemus"</strong>. Voit tallentaa työpaikan tiedot, linkin ilmoitukseen ja omat muistiinpanosi.
                </p>
              </div>
            </div>

            {/* KORJATTU OSIO: Saatekirjeen luominen */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Luo vakuuttava saatekirje</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Anna sovelluksen auttaa sinua luomaan räätälöityjä saatekirjeitä eri hakemuksiin. Säästät aikaa ja erotut positiivisesti joukosta!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Pysy kartalla tilastoista</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Kojelaudan yläosassa näet yhteenvedon työnhaustasi. Se auttaa hahmottamaan, kuinka moni hakemus johtaa haastatteluun.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl text-white font-bold text-[15px] transition-all active:scale-[0.985] shadow-[0_4px_12px_rgba(109,103,242,0.2)] hover:shadow-[0_6px_16px_rgba(109,103,242,0.3)]"
              style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
            >
              Aloita käyttö
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}