"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard } from "lucide-react";

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
  const greeting = getGreeting();
  const now = new Date();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "käyttäjä";
        setUserName(fullName.split(" ")[0]);
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  return (
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center gap-2">
        {greeting},
        {isLoading ? (
          <div className="h-9 w-32 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        ) : (
          <span>{userName} 👋</span>
        )}
      </h1>

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        {now.toLocaleDateString("fi-FI", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}{" "}
        • Klo {now.getHours()}:{now.getMinutes().toString().padStart(2, "0")}
      </p>

      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-200 to-violet-600 dark:from-indigo-400 dark:to-violet-700 p-3.5 rounded-2xl shadow-md">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Yleiskatsaus</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm xl:text-md font-medium">
            Työnhakusi yhdellä silmäyksellä
          </p>
        </div>
      </div>
    </header>
  );
}