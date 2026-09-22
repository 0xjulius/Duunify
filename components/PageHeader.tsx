// components/PageHeader.tsx
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  isDemo?: boolean;
}

export default function PageHeader({ title, description, icon: Icon, isDemo }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl text-white shadow-sm shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {isDemo && (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-medium">
              Demo
            </span>
          )}
        </div>
      </div>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
          {description}
        </p>
      )}
    </div>
  );
}