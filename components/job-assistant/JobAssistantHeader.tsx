import { Sparkles } from "lucide-react";

export function JobAssistantHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <Sparkles size={23} />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Työnhakuavustaja
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Räätälöi hakemuksesi valitsemaasi työpaikkaan.
          </p>
        </div>
      </div>

      <p className="max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
        Valitse tallentamasi työpaikkailmoitus. Duunify käyttää ilmoitusta,
        CV:täsi ja pohjasaatekirjettäsi räätälöidyn saatekirjeen muodostamiseen.
      </p>
    </div>
  );
}
