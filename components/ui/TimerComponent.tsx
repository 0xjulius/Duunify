"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function ProfessionalFomoTimer() {
  // Asetetaan maali tasan 7 päivän päähän tästä hetkestä
  const [targetDate] = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [timeLeft, setTimeLeft] = useState({ paivat: 7, tunnit: 0, minuutit: 0, sekunnit: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const nyt = new Date().getTime();
      const erotus = targetDate.getTime() - nyt;

      if (erotus <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        paivat: Math.floor(erotus / (1000 * 60 * 60 * 24)),
        tunnit: Math.floor((erotus % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minuutit: Math.floor((erotus % (1000 * 60 * 60)) / (1000 * 60)),
        sekunnit: Math.floor((erotus % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full max-w-xl mx-auto my-4 p-8 text-center relative overflow-hidden">
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
        Avaamme julkisen pääsyn palveluun pian. Unohda sekavat taulukkolaskennat ja ota hakuprosessisi haltuun.
      </p>

      {/* Numerot */}
      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-6">
        {[
          { label: "Päivää", value: timeLeft.paivat },
          { label: "Tuntia", value: timeLeft.tunnit },
          { label: "Minuuttia", value: timeLeft.minuutit },
          { label: "Sekuntia", value: timeLeft.sekunnit },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-4xl font-light tracking-tight text-slate-900 font-mono tabular-nums">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-2">
              {item.label}
            </span>
          </div>
        ))}
  </div>
  </div>
  );
}