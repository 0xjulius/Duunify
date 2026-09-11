import { Bookmark, Send, Users, XCircle, Trophy, Briefcase } from "lucide-react";

type Application = {
  status: string;
};

export default function ApplicationStats({
  applications,
  loading,
}: {
  applications: Application[];
  loading: boolean;
}) {
  // Skeleton-latausnäkymä 6 kortilla
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 animate-pulse shadow-sm"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 w-full">
              <div className="h-4 w-6 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Tilastojen laskenta
  const total = applications.length;
  const saved = applications.filter((a) => a.status === "Tallennettu").length;
  const applied = applications.filter((a) => a.status === "Haettu").length;
  const interviewing = applications.filter((a) => a.status === "Haastattelu").length;
  const rejected = applications.filter((a) => a.status === "Hylätty").length;
  const offers = applications.filter((a) => a.status === "Tarjous").length;

  const stats = [
    {
      label: "Yhteensä",
      value: total,
      icon: <Briefcase className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
      bg: "bg-slate-100 dark:bg-slate-800/50",
      border: "border-slate-200 dark:border-slate-700",
    },
    {
      label: "Tallennettu",
      value: saved,
      icon: <Bookmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
    },
    {
      label: "Haettu",
      value: applied,
      icon: <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-100 dark:border-blue-500/20",
    },
    {
      label: "Haastattelu",
      value: interviewing,
      icon: <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-100 dark:border-purple-500/20",
    },
    {
      label: "Hylätty",
      value: rejected,
      icon: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-100 dark:border-red-500/20",
    },
    {
      label: "Tarjous",
      value: offers,
      icon: <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-white dark:bg-slate-900 border ${stat.border} rounded-2xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}>{stat.icon}</div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}