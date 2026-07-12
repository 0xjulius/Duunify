"use client";

import { TrendingUp, TrendingDown, Eye } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: number | string;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "violet";
  trend?: number;
  onClick?: () => void;
};

const COLORS = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    title: "text-blue-700 dark:text-blue-400",
    value: "text-blue-900 dark:text-blue-300",
    text: "text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
  },

  green: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "text-emerald-700 dark:text-emerald-300",
    value: "text-emerald-900 dark:text-emerald-200",
    text: "text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
  },

  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    title: "text-amber-700 dark:text-amber-300",
    value: "text-amber-900 dark:text-amber-200",
    text: "text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
  },

  red: {
    bg: "bg-red-50 dark:bg-red-500/10",
    title: "text-red-700 dark:text-red-400",
    value: "text-red-900 dark:text-red-300",
    text: "text-red-600 dark:text-red-400",
    hoverBorder: "hover:border-red-500 dark:hover:border-red-400",
  },

  violet: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    title: "text-violet-700 dark:text-violet-300",
    value: "text-violet-900 dark:text-violet-200",
    text: "text-violet-600 dark:text-violet-400",
    hoverBorder: "hover:border-violet-500 dark:hover:border-violet-400",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
  onClick,
}: StatsCardProps) {
  const palette = COLORS[color];

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`w-full relative group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90
dark:bg-slate-900/80
backdrop-blur-xl p-6 shadow-sm transition-all duration-300 text-left ${
        onClick
          ? `cursor-pointer hover:shadow-md ${palette.hoverBorder}`
          : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold ${palette.title}`}>{title}</p>

          <h2
            className={`mt-1 text-3xl font-bold ${palette.value} dark:drop-shadow-[0_0_10px_rgba(255,255,255,.08)]`}
          >
            {value}
          </h2>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${palette.bg} ${palette.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {subtitle && (
            <p className="text-sm text-slate-400 dark:text-slate-400">
              {subtitle}
            </p>
          )}

          {trend !== undefined && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                trend >= 0
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>

        {onClick && (
          <Eye
            size={14}
            className={`opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ${palette.text}`}
          />
        )}
      </div>
    </Component>
  );
}
