"use client";

import { History } from "lucide-react";

export type HistoryItem = {
  id: string;
  event_type: string;
  old_status?: string | null;
  new_status?: string | null;
  description: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  Tallennettu: "text-amber-600 dark:text-amber-400 font-semibold",
  Haettu: "text-blue-600 dark:text-blue-400 font-semibold",
  Haastattelu: "text-purple-600 dark:text-purple-400 font-semibold",
  Hylätty: "text-slate-500 dark:text-red-400 font-semibold",
  Tarjous: "text-emerald-600 dark:text-emerald-400 font-bold",
};

function formatStatusText(status: string) {
  const cleanStatus = status.trim();
  const colorClass = STATUS_COLORS[cleanStatus] || "text-slate-600 dark:text-slate-300";
  return <span className={colorClass}>{cleanStatus}</span>;
}

function formatHistoryDescription(description: string, oldStatus?: string | null, newStatus?: string | null) {
  // 1. Jos meillä on erilliset status-kentät tallennettuna, käytetään niitä suoraan siistiin muotoiluun
  if (oldStatus && newStatus) {
    const isStatusChange = description.toLowerCase().includes("tila");
    const prefix = isStatusChange ? "Tila muuttui: " : "";
    return (
      <span>
        {prefix}
        {formatStatusText(oldStatus)}
        <span className="mx-1.5 text-slate-400 dark:text-slate-600">➔</span>
        {formatStatusText(newStatus)}
      </span>
    );
  }

  // 2. Varajärjestelmä: Parsitaan nuoli (➔ tai ->) suoraan tekstistä, jos kenttiä ei löydy erillisinä
  const arrow = description.includes("➔") ? "➔" : description.includes("->") ? "->" : null;
  if (!arrow) {
    return <span>{description}</span>;
  }

  const parts = description.split(arrow);
  const leftPart = parts[0].trim();
  const rightStatus = parts[1].trim();

  // Erotetaan vasemman puolen tekstistä viimeinen sana (oletettu vanha tila)
  const leftWords = leftPart.split(" ");
  const leftStatus = leftWords[leftWords.length - 1];
  const prefix = leftWords.slice(0, -1).join(" ");

  return (
    <span>
      {prefix} {formatStatusText(leftStatus)}
      <span className="mx-1.5 text-slate-400 dark:text-slate-600">{arrow}</span>
      {formatStatusText(rightStatus)}
    </span>
  );
}

function formatHistoryDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} klo ${formattedTime}`;
  } catch {
    return "";
  }
}

interface ApplicationHistoryProps {
  history: HistoryItem[];
}

export default function ApplicationHistory({ history }: ApplicationHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        Ei vielä tapahtumia historiassa.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Otsikko */}
      <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <History size={18} className="text-slate-500 dark:text-slate-400" />
        <h3 className="text-base font-semibold">Rekrytoinnin eteneminen</h3>
      </div>

      {/* Aikajana */}
      <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
        {history.map((item) => {
          // Päätellään otsikkoon näytettävä tila
          const activeStatus = item.new_status || item.description.split("➔").pop()?.trim() || "";

          return (
            <div key={item.id} className="relative">
              {/* Aikajanan pallura */}
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-900" />

              {/* Tapahtumarivi */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                <div className="space-y-1">
                  {/* Otsikko */}
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tila vaihdettu: {activeStatus ? formatStatusText(activeStatus) : ""}
                  </h4>
                  {/* Alarivin tarkempi kuvaus siirtymästä */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatHistoryDescription(item.description, item.old_status, item.new_status)}
                  </p>
                </div>

                {/* Aikaleima */}
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 self-start sm:self-center mt-1 sm:mt-0">
                  {formatHistoryDate(item.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}