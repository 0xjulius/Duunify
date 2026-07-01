"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, X } from "lucide-react";

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

  if (!isOpen) return null;

  async function handleConfirm() {
    if (signingOut) return;
    setSigningOut(true);

    await supabase.auth.signOut();

    onClose();
    router.push("/logout?done=1");
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13, 11, 38, 0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600;700&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      <div
        className="duunify-modal relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={18} />
        </button>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
        >
          <LogOut size={20} className="text-white" />
        </div>

        <h2 className="duunify-display text-lg font-bold text-slate-900">
          Kirjaudutaanko ulos?
        </h2>
        <p className="text-slate-500 text-[14px] mt-1.5 leading-relaxed">
          {displayName
            ? `Olet kirjautuneena sisään käyttäjänä ${displayName}.`
            : "Istuntosi suljetaan tällä laitteella."}
        </p>

        <div className="mt-6 flex gap-2.5">
          <button
            onClick={onClose}
            disabled={signingOut}
            className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 transition font-semibold text-[14px] text-slate-700 disabled:opacity-60"
          >
            Peruuta
          </button>
          <button
            onClick={handleConfirm}
            disabled={signingOut}
            className="flex-1 h-11 rounded-xl text-white font-bold text-[14px] transition-transform active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
          >
            {signingOut ? "Hetki..." : "Kirjaudu ulos"}
          </button>
        </div>
      </div>
    </div>
  );
}