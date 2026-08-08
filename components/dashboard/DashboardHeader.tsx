"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 9) return "Hyvää huomenta";
  if (hour < 12) return "Hyvää aamupäivää";
  if (hour < 14) return "Hyvää päivää";
  if (hour < 18) return "Hyvää iltapäivää";
  if (hour < 22) return "Hyvää iltaa";
  return "Hyvää myöhäisiltaa";
};

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);

  const greeting = getGreeting();

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 10000);

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "käyttäjä";
        setUserName(fullName.split(" ")[0]);
      }
      setIsLoading(false);
    };

    getUser();
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now
    ? now.toLocaleDateString("fi-FI", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const formattedTime = now
    ? `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    : "";

  return (
    <header className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          {greeting},
          {isLoading ? (
            <span className="h-8 w-28 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md inline-block" />
          ) : (
            <span>{userName} 👋</span>
          )}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Tässä on tilannekatsaus työnhakuusi
        </p>
      </div>

      {now && (
        <div className="text-xs md:text-sm font-medium text-slate-400 dark:text-slate-500 capitalize">
          {formattedDate} • Klo {formattedTime}
        </div>
      )}
    </header>
  );
}