"use client";

import { useState, useEffect } from "react";
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
  MoreHorizontal,
  X,
} from "lucide-react";
import { DEMO_USER } from "@/lib/demo-data";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Yleiskatsaus", href: "/demo" },
  { icon: Briefcase, label: "Hakemukset", href: "#" },
  { icon: Calendar, label: "Kalenteri", href: "#" },
  { icon: StarPlus, label: "Suosikit", href: "#" },
  { icon: SquareActivity, label: "Toimintaloki", href: "#" },
];

export default function DemoSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- MOBIILI: kiinteä, koko leveyden alanavigaatio ---
  if (isMobile) {
    // Ensimmäiset 4 kohdetta suoraan näkyviin, loput "Lisää"-valikon taakse
    const primaryItems = NAV_ITEMS.slice(0, 4);

    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-16">
            {primaryItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition ${
                    active ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-medium leading-none">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMore(true)}
              className="flex flex-col items-center justify-center gap-1 text-slate-500"
            >
              <MoreHorizontal size={20} />
              <span className="text-[10px] font-medium leading-none">Lisää</span>
            </button>
          </div>
        </nav>

        {/* "Lisää"-arkki: Asetukset, Pro, käyttäjä, poistu demosta */}
        {showMore && (
          <div
            className="fixed inset-0 z-50 flex items-end"
            style={{ background: "rgba(13, 11, 38, 0.5)" }}
            onClick={() => setShowMore(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-slate-900">Lisää</p>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 mb-4">
                <Link
                  href="/settings#pro"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#EEF2FF] text-indigo-700"
                  onClick={() => setShowMore(false)}
                >
                  <Sparkles size={18} />
                  <span className="font-semibold text-sm">Duunify Pro</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowMore(false)}
                >
                  <Settings size={18} />
                  <span className="text-sm font-medium">Asetukset</span>
                </Link>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-2">
                <UserCircle2 size={36} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate text-sm">
                    {DEMO_USER.full_name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{DEMO_USER.email}</p>
                </div>
                <Link
                  href="/"
                  title="Poistu demosta"
                  className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition shrink-0"
                >
                  <LogOut size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tilan varaus, ettei sisältö jää alanavigaation alle */}
        <div className="h-16" />
      </>
    );
  }

  // --- TYÖPÖYTÄ: alkuperäinen supistettava sivupalkki ---
  const sidebarCollapsed = collapsed;

  return (
    <aside
      className={`${sidebarCollapsed ? "w-20" : "w-64"} min-h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col transition-all duration-300`}
    >
      <div className="relative h-20 flex items-center px-5 border-b border-slate-200">
        {!sidebarCollapsed && (
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
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl transition ${
                active ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        <div
          className={`${sidebarCollapsed ? "flex justify-center p-3.5" : "p-5"} rounded-2xl bg-[#EEF2FF]`}
        >
          <Sparkles size={sidebarCollapsed ? 20 : 14} className="text-indigo-600" />
          {!sidebarCollapsed && (
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
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} p-3 rounded-2xl bg-slate-50`}>
          <UserCircle2 size={42} className="text-slate-400 shrink-0" />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{DEMO_USER.full_name}</p>
              <p className="text-sm text-slate-500 truncate">{DEMO_USER.email}</p>
            </div>
          )}
          {!sidebarCollapsed && (
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