import {
  Sparkles,
  Wrench,
  Bug,
  ShieldCheck,
  Zap,
} from "lucide-react";

export type ChangelogType =
  | "feature"
  | "improvement"
  | "fix"
  | "security"
  | "performance";

export interface ChangelogEntry {
  version: string;
  date: string;
  type: ChangelogType;
  title: string;
  description: string;
}

export const changelog: ChangelogEntry[] = [
  {
    version: "v1.3.0",
    date: "13.7.2026",
    type: "feature",
    title: "Työnhakuindeksi",
    description:
      "Lisättiin uusi työnhakuindeksi, joka kertoo työnhakusi tehokkuuden vertaamalla aktiivisia hakemuksia hylkäyksiin.",
  },
  {
    version: "v1.2.0",
    date: "12.7.2026",
    type: "improvement",
    title: "Parempi mobiilikokemus",
    description:
      "Info-painikkeet toimivat nyt dialogina mobiilissa ja käyttöliittymää parannettiin pienillä näytöillä.",
  },
  {
    version: "v1.1.0",
    date: "10.7.2026",
    type: "fix",
    title: "Dashboard-korjaukset",
    description:
      "Korjattiin aktiivisuusmittari sekä useita käyttöliittymävirheitä.",
  },
];

export const changelogBadges = {
  feature: {
    icon: Sparkles,
    text: "Uusi ominaisuus",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  improvement: {
    icon: Wrench,
    text: "Parannus",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  fix: {
    icon: Bug,
    text: "Bugikorjaus",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  security: {
    icon: ShieldCheck,
    text: "Tietoturva",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  performance: {
    icon: Zap,
    text: "Suorituskyky",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
};