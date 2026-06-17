"use client";

import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Settings,
  UserCircle2,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
          J
        </div>

        <div className="ml-3">
          <h1 className="text-lg font-bold text-slate-900">
            Duunify
          </h1>

          <p className="text-xs text-slate-500">
            Työhakemusten hallintatyökalu
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-medium transition cursor-pointer">
            <LayoutDashboard size={18} />
            Koontinäyttö
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <Briefcase size={18} />
            Hakemukset
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <BarChart3 size={18} />
            Tilastot
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <Settings size={18} />
            Asetukset
          </button>

        </div>
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
          <UserCircle2
            size={42}
            className="text-slate-400"
          />

          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate">
              John Doe
            </p>

            <p className="text-sm text-slate-500 truncate">
              john@example.com
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}