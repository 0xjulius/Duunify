export function CoverLetterSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
      </div>

      <div className="space-y-2.5 pt-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[92%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[96%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[85%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/5"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[88%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[94%]"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[75%]"></div>
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/5"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mt-2 shrink-0"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-[90%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}