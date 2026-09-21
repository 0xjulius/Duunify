"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useModal } from "@/components/logout/ModalProvider";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

import NotificationsDropdown from "@/components/NotificationsDropdown"; // Importataan uusi komponentti

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const { showLogout } = useModal();

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    }
    getUser();
  }, []);

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Käyttäjä";

  return (
    <header className="h-20 w-full bg-white/80 dark:bg-[#12141c]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Vasen puoli / Tyhjä tila */}
      <div className="flex items-center gap-4" />

      {/* Oikea puoli: Ilmoitukset & Profiilivalikko */}
      <div className="flex items-center gap-3">
        {/* Erillinen Ilmoitukset-komponentti */}
        <NotificationsDropdown />

        {/* Profiilivalikko */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition outline-none cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : user?.email ? (
                user.email[0].toUpperCase()
              ) : (
                <User size={18} />
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 capitalize">
                {userName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {user?.email}
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
                {user?.email}
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

            <DropdownMenuItem
              onClick={() => showLogout(userName)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition"
            >
              <LogOut size={16} />
              Kirjaudu ulos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}