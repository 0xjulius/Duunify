import { Sparkles, Target, WandSparkles, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";

export function InfoSidebar() {
  return (
    <div className="space-y-6">
      {/* DUUNIFY INFO */}
      <section className="rounded-3xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/[0.06] p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles size={19} />
          </div>

          <div>
            <h2 className="font-bold text-indigo-900 dark:text-indigo-300">
              Mitä Duunify tekee?
            </h2>

            <p className="text-sm text-indigo-800/70 dark:text-indigo-200/70 mt-2 leading-relaxed">
              Duunify analysoi työpaikkailmoituksen ja vertaa sitä CV:si
              sekä nykyisen saatekirjeesi sisältöön.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex gap-3 text-sm">
            <Target size={17} className="text-indigo-500 mt-0.5 shrink-0" />
            <span className="text-indigo-900/80 dark:text-indigo-200/80">
              Tunnistaa työpaikan tärkeimmät vaatimukset.
            </span>
          </div>

          <div className="flex gap-3 text-sm">
            <WandSparkles size={17} className="text-indigo-500 mt-0.5 shrink-0" />
            <span className="text-indigo-900/80 dark:text-indigo-200/80">
              Korostaa kokemustasi, joka sopii juuri tähän tehtävään.
            </span>
          </div>

          <div className="flex gap-3 text-sm">
            <FileText size={17} className="text-indigo-500 mt-0.5 shrink-0" />
            <span className="text-indigo-900/80 dark:text-indigo-200/80">
              Säilyttää saatekirjeesi persoonallisen tyylin.
            </span>
          </div>
        </div>
      </section>

      {/* PRIVACY INFO */}
      <section className="rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06] p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h2 className="font-bold text-emerald-900 dark:text-emerald-300">
              Tietosuoja ja anonymisointi
            </h2>

            <p className="text-sm text-emerald-800/70 dark:text-emerald-200/70 mt-2 leading-relaxed">
              Suojaamme yksityisyyttäsi automaattisesti ennen tietojen lähettämistä tekoälylle.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex gap-3 text-sm">
            <CheckCircle2 size={17} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-emerald-900/80 dark:text-emerald-200/80">
              Poistaa henkilötunnukset ja puhelinnumerot.
            </span>
          </div>

          <div className="flex gap-3 text-sm">
            <CheckCircle2 size={17} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-emerald-900/80 dark:text-emerald-200/80">
              Korvaa nimesi, sähköpostisi ja katuosoitteesi suojatulla tunnisteella.
            </span>
          </div>

          <div className="flex gap-3 text-sm">
            <CheckCircle2 size={17} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-emerald-900/80 dark:text-emerald-200/80">
              Vain varsinainen osaamisesi ja työkokemuksesi välitetään tekoälylle.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}