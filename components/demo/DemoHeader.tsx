"use client";

import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import DemoNotificationsDropdown from "@/components/demo/DemoNotificationsDropdown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoHeaderProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onExitDemo?: () => void;
}

export default function DemoHeader({
  userName = "Maija Meikäläinen",
  userEmail = "maija.meikalainen@demo.fi",
  avatarUrl,
  onExitDemo,
}: DemoHeaderProps) {
  return (
    <header className="h-20 w-full bg-white/80 dark:bg-[#12141c]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Vasen puoli: Demo-badge */}
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles size={13} />
          Demoversio
        </span>
      </div>

      {/* Oikea puoli: Ilmoitukset & Profiilivalikko */}
      <div className="flex items-center gap-3">
        <DemoNotificationsDropdown />

        {/* Profiilivalikko */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition outline-none cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : userName ? (
                userName[0].toUpperCase()
              ) : (
                <User size={18} />
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 capitalize">
                {userName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {userEmail}
              </span>
            </div>

            <ChevronDown size={16} className="text-slate-400 ml-0.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl bg-white dark:bg-[#181b26] border-slate-200 dark:border-slate-800 shadow-xl p-1.5"
          >
            <DropdownMenuLabel className="sm:hidden font-normal px-3 py-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate capitalize">
                {userName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {userEmail}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="sm:hidden bg-slate-100 dark:bg-slate-800" />

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
              >
                <Settings size={16} className="text-slate-400" />
                Asetukset
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

            {onExitDemo ? (
              <DropdownMenuItem
                onClick={onExitDemo}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition"
              >
                <LogOut size={16} />
                Poistu demosta
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition"
                >
                  <LogOut size={16} />
                  Poistu demosta
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}