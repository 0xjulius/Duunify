"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
// Oletetaan, että sinulla on jokin LoginModal-komponentti
import LoginModal from "@/components/LoginModal";

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Tarkistetaan nykyinen teema sivun latautuessa
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  // Vaihdetaan teemaa ja päivitetään HTML-elementin luokka
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D67F2] to-[#5750E0] flex items-center justify-center">
              <span className="duunify-display font-bold text-white text-lg leading-none">D</span>
            </div>
            <span className="duunify-display font-bold text-indigo-500 dark:text-indigo-400 text-lg">Duunify</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Yleiskatsaus
            </a>
            <a href="#ominaisuudet" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Ominaisuudet
            </a>
            <a href="#miten-toimii" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Miten toimii
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Teemanvaihtokytkin */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              aria-label="Vaihda teemaa"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors"
            >
              Kirjaudu
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-transform active:scale-[0.98] shadow-sm"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Aloita <span className="hidden">ilmaiseksi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modaalin näyttäminen tilan perusteella */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}