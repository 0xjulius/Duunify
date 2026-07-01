"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  StarPlus,
  Settings,
  Calendar,
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sparkles,
  SquareActivity,
} from "lucide-react";
import { DEMO_USER } from "@/lib/demo-data";

export default function DemoSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} min-h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col transition-all duration-300`}
    >
      <div className="relative h-20 flex items-center px-5 border-b border-slate-200">
        {!collapsed && (
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-900">Duunify</h1>
            <p className="text-xs text-slate-500">Demo-tila</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100 transition text-slate-500"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {[
          { icon: LayoutDashboard, label: "Yleiskatsaus", href: "/demo" },
          { icon: Briefcase, label: "Hakemukset", href: "#" },
          { icon: Calendar, label: "Kalenteri", href: "#" },
          { icon: StarPlus, label: "Suosikit", href: "#" },
          { icon: SquareActivity, label: "Toimintaloki", href: "#" },
        ].map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl transition ${
                active ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        <div
          className={`${collapsed ? "flex justify-center p-3.5" : "p-5"} rounded-2xl bg-[#EEF2FF]`}
        >
          <Sparkles size={collapsed ? 20 : 14} className="text-indigo-600" />
          {!collapsed && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mt-2">
                Duunify Pro
              </p>
              <p className="text-sm text-slate-700 mt-2">
                Tämä on esikatselu — kirjaudu sisään kokeillaksesi oikeasti.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 rounded-2xl bg-slate-50`}>
          <UserCircle2 size={42} className="text-slate-400 shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{DEMO_USER.full_name}</p>
              <p className="text-sm text-slate-500 truncate">{DEMO_USER.email}</p>
            </div>
          )}
          {!collapsed && (
            <Link
              href="/"
              title="Poistu demosta"
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition shrink-0"
            >
              <LogOut size={18} />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}