"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  collapsed: boolean;
}

export default function AdminCard({ collapsed }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(data?.role === "admin");
      setLoading(false);
    }

    loadRole();
  }, []);

  if (loading || !isAdmin) return null;

  if (collapsed) {
    return (
      <Link
        href="/admin"
        title="Admin-paneeli"
        className="w-full flex justify-center p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
      >
        <Shield size={20} />
      </Link>
    );
  }

  return (
    <Link
      href="/admin"
      className="w-full block p-5 rounded-3xl bg-red-50 dark:bg-red-500/10 hover:shadow-md transition"
    >
      <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400">
        <Shield size={14} />
        Admin-paneeli
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">
        Hallitse käyttäjiä, lokeja ja järjestelmää.
      </p>
    </Link>
  );
}