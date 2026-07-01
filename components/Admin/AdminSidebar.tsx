"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowLeft,
  ShieldCheck,
  SquareActivity,
} from "lucide-react";

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, label: "Yleiskatsaus", href: "/admin" },
    { icon: Users, label: "Käyttäjät", href: "/admin/users" },
    { icon: Briefcase, label: "Hakemukset", href: "/admin/applications" },
    { icon: SquareActivity, label: "Tapahtumaloki", href: "/admin/logs" },
  ];

  return (
    <aside className="w-64 min-h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-slate-200 gap-2">
        <ShieldCheck size={20} className="text-[#6D67F2]" />
        <div>
          <h1 className="text-sm font-bold text-slate-900">Duunify Admin</h1>
          <p className="text-xs text-slate-400 truncate max-w-[160px]">
            {adminName}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 px-4 py-2.5"
        >
          <ArrowLeft size={16} />
          Takaisin sovellukseen
        </Link>
      </div>
    </aside>
  );
}
