import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: number | string;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "violet";
  trend?: number;
};

const COLORS = {
  blue: {
    bg: "bg-blue-50/60 dark:bg-blue-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-blue-100 dark:border-blue-500/20",
  },
  green: {
    bg: "bg-emerald-50/60 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-500/20",
  },
  amber: {
    bg: "bg-amber-50/60 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-500/20",
  },
  red: {
    bg: "bg-red-50/60 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-100 dark:border-red-500/20",
  },
  violet: {
    bg: "bg-violet-50/60 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-500/20",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
}: StatsCardProps) {
  const palette = COLORS[color];

  return (
    <div className="relative group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette.bg} ${palette.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {subtitle && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}