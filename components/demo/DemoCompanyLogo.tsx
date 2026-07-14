"use client";

import React, { useState } from 'react';

interface DemoCompanyLogoProps {
  logo?: string | null;
  company: string;
}

export function DemoCompanyLogo({ company }: DemoCompanyLogoProps) {
  const [imgExtension, setImgExtension] = useState<"png" | "jpg" | "failed">("png");

  const cleanName = company
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a");
  
  // Valitaan tiedostopolku sen mukaan, kumpaa päätettä ollaan yrittämässä
  const localLogoUrl = `/demo-logos/${cleanName}.${imgExtension}`;

  const initials = company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Jos molemmat päätteet epäonnistuivat, näytetään kirjain-avatar
  if (imgExtension === "failed" || !company) {
    const hue = (company?.charCodeAt(0) * 37 || 0) % 360;
    const bgColors = [
      "bg-violet-100 dark:bg-violet-950/40", 
      "bg-teal-100 dark:bg-teal-950/40", 
      "bg-rose-100 dark:bg-rose-950/40", 
      "bg-sky-100 dark:bg-sky-950/40", 
      "bg-amber-100 dark:bg-amber-950/40", 
      "bg-emerald-100 dark:bg-emerald-950/40"
    ];
    const textColors = [
      "text-violet-700 dark:text-violet-400", 
      "text-teal-700 dark:text-teal-400", 
      "text-rose-700 dark:text-rose-400", 
      "text-sky-700 dark:text-sky-400", 
      "text-amber-700 dark:text-amber-400", 
      "text-emerald-700 dark:text-emerald-400"
    ];
    
    return (
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${bgColors[hue % bgColors.length]} ${textColors[hue % textColors.length]}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={localLogoUrl}
      alt={company}
      className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-slate-800"
      onError={() => {
        if (imgExtension === "png") {
          // Jos .png ei toiminut, kokeillaan ladata sama kuva .jpg-muodossa
          setImgExtension("jpg");
        } else {
          // Jos .jpg-kuvakin epäonnistuu, siirrytään kirjain-avatariin
          setImgExtension("failed");
        }
      }}
    />
  );
}