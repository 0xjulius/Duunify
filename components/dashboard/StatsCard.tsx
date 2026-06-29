type StatsCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "violet";
};

const COLORS = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatsCardProps) {
  const palette = COLORS[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${palette.bg} ${palette.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
