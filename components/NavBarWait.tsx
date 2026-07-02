"use client";

import { useState } from "react";

export default function NavBarWait() {

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D67F2] to-[#5750E0]" />
            <span className="font-bold text-slate-900">Duunify</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#ominaisuudet" className="hover:text-slate-900">
              Ominaisuudet
            </a>
            <a href="#dashboard" className="hover:text-slate-900">
              Yleiskatsaus
            </a>
            <a href="#miten-toimii" className="hover:text-slate-900">
              Miten toimii
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <p
              className="text-sm font-medium text-slate-600 px-4 py-2"
            >
              Kiinnostuitko?
            </p>
            <button
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6D67F2, #5750E0)",
              }}
            >
              Hae mukaan!
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
