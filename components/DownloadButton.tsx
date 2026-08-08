"use client";

import { useState } from "react";
import { Download, X, Copy, Check } from "lucide-react";

interface DownloadButtonProps {
  data: any[]; 
  fileName: string;
}

// Apufunktio siistille päivämäärämuotoilulle CSV:ssä (DD.MM.YYYY HH:mm)
const formatDateForCSV = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Värikoodaus eri statuksille
const getStatusBadgeClass = (status: string) => {
  const s = status?.toLowerCase().trim();
  if (["haastattelu", "interview"].includes(s))
    return "bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/20";
  if (["tarjous", "offer"].includes(s))
    return "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20";
  if (["hylätty", "hylätyt", "rejected", "päättyneet"].includes(s))
    return "bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/20";
  if (["ei vastausta", "no response"].includes(s))
    return "bg-slate-50/50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-500/20";
  if (["suosikki", "tallennettu", "saved"].includes(s))
    return "bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/20";

  return "bg-blue-50/50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/30";
};

export default function DownloadButton({ data, fileName }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const headers = ["Työtehtävä", "Työnantaja", "Status", "Hakupäivä"];

    const rows = data.map((row) => [
      `"${(row.job_title || "").replace(/"/g, '""')}"`,
      `"${(row.company || "").replace(/"/g, '""')}"`,
      `"${(row.status || "Haettu").replace(/"/g, '""')}"`,
      `"${formatDateForCSV(row.applied_date || row.created_at)}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
        title="Lataa / Esikatsele"
      >
        <Download size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg dark:text-slate-50">Raportin esikatselu</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6 pr-1">
              {data.map((app, i) => {
                const titleKey = `${i}-title`;
                const companyKey = `${i}-company`;

                return (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm space-y-1.5 border border-slate-100 dark:border-slate-800">
                    
                    {/* Työtehtävä */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="min-w-0 truncate">
                        <span className="font-bold text-slate-500 dark:text-slate-400">Työtehtävä:</span>{" "}
                        {app.job_title || "-"}
                      </p>
                      {app.job_title && (
                        <button
                          onClick={() => handleCopy(app.job_title, titleKey)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors flex-shrink-0"
                          title="Kopioi työtehtävä"
                        >
                          {copiedKey === titleKey ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Työnantaja */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="min-w-0 truncate">
                        <span className="font-bold text-slate-500 dark:text-slate-400">Työnantaja:</span>{" "}
                        {app.company || "-"}
                      </p>
                      {app.company && (
                        <button
                          onClick={() => handleCopy(app.company, companyKey)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors flex-shrink-0"
                          title="Kopioi työnantaja"
                        >
                          {copiedKey === companyKey ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Hakupäivä */}
                    <p>
                      <span className="font-bold text-slate-500 dark:text-slate-400">Hakupäivä:</span>{" "}
                      {formatDateForCSV(app.applied_date || app.created_at) || "Ei päivämäärää"}
                    </p>

                    {/* Status Värikoodattuna */}
                    <p className="flex items-center">
                      <span className="font-bold text-slate-500 dark:text-slate-400">Status:</span> 
                      <span className={`ml-2 capitalize px-2 py-0.5 border rounded text-[11px] font-bold tracking-tight ${getStatusBadgeClass(app.status)}`}>
                        {app.status || "Haettu"}
                      </span>
                    </p>

                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleDownload}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Lataa CSV-tiedostona
            </button>
          </div>
        </div>
      )}
    </>
  );
}