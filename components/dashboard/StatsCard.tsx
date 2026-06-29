import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "violet";
  trend?: number;
};

const COLORS = {
  blue: { bg: "bg-blue-50/60", text: "text-indigo-600", border: "border-blue-100" },
  green: { bg: "bg-emerald-50/60", text: "text-emerald-600", border: "border-emerald-100" },
  amber: { bg: "bg-amber-50/60", text: "text-amber-600", border: "border-amber-100" },
  red: { bg: "bg-red-50/60", text: "text-red-600", border: "border-red-100" },
  violet: { bg: "bg-violet-50/60", text: "text-violet-600", border: "border-violet-100" },
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
    <div
      className={`
        group rounded-2xl border ${palette.border} bg-white p-6 shadow-sm 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300/50
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs font-medium text-slate-500 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${palette.bg} ${palette.text} flex-shrink-0 ml-4`}>
          {icon}
        </div>
      </div>
    </div>
  );
}