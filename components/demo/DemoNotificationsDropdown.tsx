"use client";

import { useState } from "react";
import { Bell, Check, Trash2, Calendar, Briefcase, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "interview" | "status" | "deadline";
};

const INITIAL_DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Haastattelukutsu!",
    message: "Yritys Nordea kutsui sinut haastatteluun tehtävään Senior Developer.",
    time: "10 min sitten",
    read: false,
    type: "interview",
  },
  {
    id: "2",
    title: "Hakemuksen tila päivitetty",
    message: "Hakemuksesi kohteeseen Wolt (Product Designer) on siirretty tilaan 'Arvioitavana'.",
    time: "2 tuntia sitten",
    read: false,
    type: "status",
  },
  {
    id: "3",
    title: "Määräaika lähestyy",
    message: "Hakuohjelman 'KONE - Lead Engineer' hakuaihe päättyy huomenna.",
    time: "1 päivä sitten",
    read: true,
    type: "deadline",
  },
];

export default function DemoNotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_DEMO_NOTIFICATIONS
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "interview":
        return <Calendar className="size-4 text-violet-500" />;
      case "status":
        return <Briefcase className="size-4 text-indigo-500" />;
      case "deadline":
        return <Sparkles className="size-4 text-amber-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition outline-none cursor-pointer">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#181b26] border-slate-200 dark:border-slate-800 shadow-xl p-2"
      >
        {/* Yläpalkki */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Ilmoitukset
            </span>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                {unreadCount} uutta
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition"
                title="Merkitse kaikki luetuiksi"
              >
                <Check size={14} />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition"
                title="Tyhjennä ilmoitukset"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/80 my-1" />

        {/* Ilmoituslista */}
        <div className="max-h-80 overflow-y-auto space-y-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Ei ilmoituksia
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition focus:bg-slate-50 dark:focus:bg-slate-800/50 ${
                  !n.read
                    ? "bg-indigo-50/50 dark:bg-indigo-500/5"
                    : "opacity-75"
                }`}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}