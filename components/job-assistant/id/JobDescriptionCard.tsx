import { Briefcase } from "lucide-react";

interface JobDescriptionCardProps {
  notes?: string;
  description?: string;
}

export function JobDescriptionCard({ notes, description }: JobDescriptionCardProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 sm:px-8 py-5 border-b border-slate-200 dark:border-[#1F2937]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Briefcase size={18} className="text-slate-500" />
          </div>

          <div>
            <h2 className="font-bold">Työpaikkailmoitus</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tätä ilmoitusta käytetään räätälöinnin pohjana.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {notes && (
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {notes}
          </p>
        )}

        <div className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 max-h-[650px] overflow-y-auto pr-2">
          {description || "Ei tarkempaa kuvausta saatavilla."}
        </div>
      </div>
    </section>
  );
}