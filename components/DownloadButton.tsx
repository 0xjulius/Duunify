"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";

interface DownloadButtonProps {
  data: any[]; 
  fileName: string;
}

export default function DownloadButton({ data, fileName }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const csvContent = [
      ["Työtehtävä", "Työnantaja", "Hakupäivä"].join(","),
      ...data.map(row => [row.job_title, row.company, row.created_at].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
        <Download size={18} />
      </button>

      {isOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Raportin esikatselu</h3>
        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
      </div>

      <div className="space-y-4 max-h-150 overflow-y-auto mb-6">
        {data.map((app, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm space-y-1 border border-slate-100">
            <p><span className="font-bold text-slate-500">Työtehtävä:</span> {app.job_title}</p>
            <p><span className="font-bold text-slate-500">Työnantaja:</span> {app.company}</p>
            <p><span className="font-bold text-slate-500">Hakupäivä:</span> {app.created_at ? new Date(app.created_at).toLocaleDateString('fi-FI') : "Ei päivämäärää"}</p>
            {/* Tässä status näkyy modalissa */}
            <p><span className="font-bold text-slate-500">Status:</span> 
              <span className="ml-1 capitalize px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">
                {app.status || "Haettu"}
              </span>
            </p>
          </div>
        ))}
      </div>

            <button 
              onClick={handleDownload}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Lataa CSV-tiedostona
            </button>
          </div>
        </div>
      )}
    </>
  );
}