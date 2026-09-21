"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  displayName,
}: {
  isOpen: boolean;
  onClose: () => void;
  displayName?: string;
}) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    if (signingOut) return;
    setSigningOut(true);

    await supabase.auth.signOut();

    onClose();
    router.push("/logout?done=1");
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-[24px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-7 shadow-2xl">
        <DialogHeader className="flex flex-col items-start gap-0 text-left">
          {/* Ikoni */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
          >
            <LogOut size={20} className="text-white" />
          </div>

          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Kirjaudutaanko ulos?
          </DialogTitle>

          <DialogDescription className="text-slate-500 dark:text-slate-400 text-[14px] mt-1.5 leading-relaxed">
            {displayName
              ? `Olet kirjautuneena sisään käyttäjänä ${displayName}.`
              : "Istuntosi suljetaan tällä laitteella."}
          </DialogDescription>
        </DialogHeader>

        {/* Toimintapainikkeet */}
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={onClose}
            disabled={signingOut}
            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 transition font-semibold text-[14px] text-slate-700 dark:text-slate-300 disabled:opacity-60 cursor-pointer"
          >
            Peruuta
          </button>
          <button
            onClick={handleConfirm}
            disabled={signingOut}
            className="flex-1 h-11 rounded-xl text-white font-bold text-[14px] transition-transform active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-sm"
            style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
          >
            {signingOut ? "Hetki..." : "Kirjaudu ulos"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}