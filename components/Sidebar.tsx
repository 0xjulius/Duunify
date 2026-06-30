"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar");

    if (saved === "collapsed") {
      setCollapsed(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sidebar",
      collapsed ? "collapsed" : "expanded"
    );
  }, [collapsed]);

  const sidebarCollapsed = isMobile || collapsed;

  return (
    <aside
      className={`
        ${
          sidebarCollapsed ? "w-20" : "w-64"
        }
        min-h-screen
        sticky
        top-0
        bg-white/80
        backdrop-blur-xl
        border-r
        border-slate-200
        flex
        flex-col
        transition-all
        duration-300
      `}
    >
      {/* HEADER */}
      <div className="relative h-20 flex items-center px-5 border-b border-slate-200">
        {!sidebarCollapsed && (
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-900">
              Duunify
            </h1>

            <p className="text-xs text-slate-500">
              Työhakemusten hallinta
            </p>
          </div>
        )}

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              p-2
              rounded-lg
              hover:bg-slate-100
              transition
              text-slate-500
            "
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Yleiskatsaus"
            href="/dashboard"
            collapsed={sidebarCollapsed}
          />

          <SidebarItem
            icon={<Briefcase size={18} />}
            label="Hakemukset"
            href="/applications"
            collapsed={sidebarCollapsed}
          />

          <SidebarItem
            icon={<Calendar size={18} />}
            label="Kalenteri"
            href="/calendar"
            collapsed={sidebarCollapsed}
          />

          <SidebarItem 
            icon={<StarPlus size={18} />}
            label="Suosikit"
            href="/favorites"
            collapsed={sidebarCollapsed}
          />
        </div>
      </nav>

      {/* SETTINGS */}
      <div className="px-4 pb-2">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Asetukset"
          href="/settings"
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* USER */}
      <div className="p-4 border-t border-slate-200">
        <div
          className={`
            flex items-center
            ${
              sidebarCollapsed
                ? "justify-center"
                : "gap-3"
            }
            p-3
            rounded-2xl
            bg-slate-50
          `}
        >
          <UserCircle2
            size={42}
            className="text-slate-400"
          />

          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">
                John Doe
              </p>

              <p className="text-sm text-slate-500 truncate">
                john@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        w-full
        flex
        items-center
        ${
          collapsed
            ? "justify-center"
            : "gap-3"
        }
        px-4
        py-3
        rounded-xl
        transition

        ${
          active
            ? "bg-indigo-50 text-indigo-600 font-medium"
            : "text-slate-600 hover:bg-slate-100"
        }
      `}
    >
      {icon}

      {!collapsed && <span>{label}</span>}
    </Link>
  );
}