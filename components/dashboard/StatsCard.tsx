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
    <div className="relative group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Titelin koko palautettu normaaliksi, helpompi lukea */}
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          {/* Value on iso, mutta ei liian massiivinen */}
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        {/* Ikonin tausta on pehmeämpi */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette.bg} ${palette.text}`}>
          {icon}
        </div>
      </div>

      {/* Alaosa selkeämmäksi */}
      <div className="mt-4 flex items-center gap-2">
        {subtitle && (
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        )}
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}