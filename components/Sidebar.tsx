"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "@/components/logout/ModalProvider";

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

// Siirretään navigaatiolinkit taulukkoon, jotta niitä voi käyttää sekä mobiilissa että työpöydällä
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Yleiskatsaus", href: "/dashboard" },
  { icon: Briefcase, label: "Hakemukset", href: "/applications" },
  { icon: Calendar, label: "Kalenteri", href: "/calendar" },
  { icon: StarPlus, label: "Suosikit", href: "/favorites" },
  { icon: SquareActivity, label: "Toimintaloki", href: "#" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMore, setShowMore] = useState(false);
  const [mounted, setMounted] = useState(false); // Estää Next.js hydration errorit
  
  const { showLogout } = useModal();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar");
    if (saved === "collapsed") setCollapsed(true);

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar", collapsed ? "collapsed" : "expanded");
    }
  }, [collapsed, mounted]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Varmistetaan, ettei serveri yritä renderöidä väärää näkymää ennen asiakaspuolen latausta
  if (!mounted) return <div className="w-20 min-h-screen bg-white/80 border-r border-slate-200" />;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Vieras";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  // --- MOBIILI: kiinteä, koko leveyden alanavigaatio ---
  if (isMobile) {
    const primaryItems = NAV_ITEMS.slice(0, 4);

    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-16">
            {primaryItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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

        {/* "Lisää"-arkki: Asetukset, Pro, oikea käyttäjä, uloskirjautuminen */}
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
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowMore(false)}
                >
                  <Settings size={18} />
                  <span className="text-sm font-medium">Asetukset</span>
                </Link>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-[36px] h-[36px] rounded-full object-cover shrink-0" />
                ) : (
                  <UserCircle2 size={36} className="text-slate-400 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate text-sm">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                </div>
                {user && (
                  <button
                    onClick={() => {
                      setShowMore(false);
                      showLogout(displayName); // Kutsutaan oikeaa logout-modaalia
                    }}
                    title="Kirjaudu ulos"
                    className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition shrink-0"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="h-16" />
      </>
    );
  }

// --- TYÖPÖYTÄ: supistettava sivupalkki ---
  const sidebarCollapsed = collapsed;

  return (
    <aside className={`transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"} min-h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col`}>
      
      {/* HEADER: Täällä on nyt vain logo ja supistuspainike */}
      <div className="relative h-20 flex items-center px-5 border-b border-slate-200">
        {!sidebarCollapsed && (
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-900">Duunify</h1>
            <p className="text-xs text-slate-500">Työhakemusten hallinta</p>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100 transition text-slate-500"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* NAVIGATION: Pysyy keskellä */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem 
            key={item.href} 
            icon={<item.icon size={18} />} 
            label={item.label} 
            href={item.href} 
            collapsed={sidebarCollapsed} 
          />
        ))}
      </nav>

      {/* PRO UPSELL */}
      <div className="px-4 pb-4">
        {sidebarCollapsed ? (
          <Link href="/settings#pro" title="Hanki Duunify Pro" className="w-full flex justify-center p-3.5 rounded-2xl bg-[#EEF2FF] text-indigo-600">
            <Sparkles size={20} />
          </Link>
        ) : (
          <Link href="/settings#pro" className="block p-5 rounded-3xl bg-[#EEF2FF] hover:shadow-md transition">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Sparkles size={14} /> Duunify Pro
            </div>
            <p className="text-sm text-slate-700 mt-3">Rajattomat hakemukset ja automaattinen täyttö.</p>
          </Link>
        )}
      </div>

      {/* USER & LOGOUT: Nyt oikeassa paikassa alhaalla */}
      <div className="p-4 border-t border-slate-200">
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} p-3 rounded-2xl bg-slate-50`}>
          {avatarUrl ? (
            <img src={avatarUrl} className="w-[42px] h-[42px] rounded-full object-cover shrink-0" alt="Avatar" />
          ) : (
            <UserCircle2 size={42} className="text-slate-400 shrink-0" />
          )}
          
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{displayName}</p>
              <p className="text-sm text-slate-500 truncate">{displayEmail}</p>
            </div>
          )}

          {user && !sidebarCollapsed && (
            <button 
              onClick={() => showLogout(displayName)} 
              title="Kirjaudu ulos" 
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition shrink-0"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, collapsed }: { icon: React.ReactNode; label: string; href: string; collapsed: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link href={href} className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl transition ${active ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}