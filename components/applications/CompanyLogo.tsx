// components/applications/CompanyLogo.tsx
import React from 'react';

interface CompanyLogoProps {
  logo?: string | null;
  company: string;
}

export function CompanyLogo({ logo, company }: CompanyLogoProps) {
  const initials = company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (logo) {
    return (
      <img
        src={logo}
        alt={company}
        className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white border border-slate-100 dark:border-slate-800"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const hue = (company.charCodeAt(0) * 37) % 360;
  const bgColors = ["bg-violet-100", "bg-teal-100", "bg-rose-100", "bg-sky-100", "bg-amber-100", "bg-emerald-100"];
  const textColors = ["text-violet-700", "text-teal-700", "text-rose-700", "text-sky-700", "text-amber-700", "text-emerald-700"];
  
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${bgColors[hue % bgColors.length]} ${textColors[hue % textColors.length]}`}>
      {initials}
    </div>
  );
}