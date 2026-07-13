import { changelog, changelogBadges } from "@/lib/changelog";

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mitä uutta Duunifyssa?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Julkaisemme jatkuvasti uusia ominaisuuksia, parannuksia ja
          bugikorjauksia tehdäksemme työnhaustasi entistä sujuvampaa.
        </p>
      </div>

      <div className="relative space-y-10 border-l-2 border-slate-200 pl-8 dark:border-slate-800">
        {changelog.map((item) => {
          const badge = changelogBadges[item.type];
          const Icon = badge.icon;

          return (
            <article
              key={item.version}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute -left-[42px] top-8 h-4 w-4 rounded-full border-4 border-white bg-indigo-600 dark:border-slate-950" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {item.version}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h2>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                  >
                    <Icon size={13} />
                    {badge.text}
                  </span>

                  <span className="text-sm text-slate-500">
                    {item.date}
                  </span>
                </div>
              </div>

              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}