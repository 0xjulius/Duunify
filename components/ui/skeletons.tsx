// components/ui/skeletons.tsx

export function StatsSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

export function ImpactRatingSkeleton() {
  return (
    <div className="relative flex h-[166px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse">
      <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="flex items-end gap-3">
        <div className="h-12 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse ${className || "h-[300px]"}`}>
      <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded mb-6" />
      <div className="h-[200px] w-full bg-slate-50 dark:bg-slate-800 rounded" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse">
      <div className="h-6 w-1/4 bg-slate-100 dark:bg-slate-800 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-50 dark:bg-slate-800 rounded-lg" />
        ))}
      </div>
    </div>
  );
}