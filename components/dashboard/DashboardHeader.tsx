"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { LayoutDashboard } from "lucide-react";

// Lisätty apufunktio tervehdykselle
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
  const [isLoading, setIsLoading] = useState(true); // Lisätty lataustila
  const greeting = getGreeting();
  const now = new Date();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "käyttäjä";
        setUserName(fullName.split(' ')[0]);
      }
      setIsLoading(false); // Lataus valmis
    };
    getUser();
  }, []);

  return (
    <header className="mb-8">
      {/* Tervehdys - Skeleton-efekti latauksen aikana */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        {greeting}, 
        {isLoading ? (
          <div className="h-9 w-32 animate-pulse bg-slate-200 rounded-lg"></div>
        ) : (
          <span>{userName} 👋</span>
        )}
      </h1>
      
      {/* Päivämäärä */}
      <p className="text-slate-500 text-lg mb-6">
        {now.toLocaleDateString('fi-FI', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })} • Klo {now.getHours()}:{now.getMinutes().toString().padStart(2, '0')}
      </p>

      {/* Otsikko ja ikoni */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3.5 rounded-2xl shadow-md">
          <LayoutDashboard className="h-9 w-9 text-white" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">Koontinäyttö</h2>
          <p className="mt-1 text-slate-500 text-[17px]">
            Työnhakusi yhdellä silmäyksellä
          </p>
        </div>
      </div>
    </header>
  );
}