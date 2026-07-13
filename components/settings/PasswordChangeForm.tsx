"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { translateAuthError } from "@/lib/auth-errors";
import { Loader2 } from "lucide-react";

// Hyödynnetään samaa vahvuustarkistusta kuin LoginModalissa
function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passedCount = Object.values(checks).filter(Boolean).length;
  return { checks, passedCount };
}

export default function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const { checks, passedCount } = getPasswordStrength(newPassword);
  const meetsRequirements =
    checks.length && checks.lowercase && checks.uppercase && checks.number;

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!meetsRequirements) {
      toast.error("Salasana ei täytä turvaohjeita. Tarkista vaatimukset.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Salasanat eivät täsmää.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSaving(false);

    if (error) {
      toast.error(translateAuthError(error.message));
      return;
    }

    toast.success("Salasana vaihdettu onnistuneesti.");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 dark:text-slate-500 mb-1.5">
            Uusi salasana
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={saving}
            className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 transition disabled:opacity-50"
          />
          
          {/* Vahvuusmittari, joka näkyy kun kirjoitetaan */}
          {newPassword.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      meetsRequirements ? "bg-emerald-500" : passedCount >= 2 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(passedCount / 4) * 100}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${meetsRequirements ? "text-emerald-500" : "text-slate-400"}`}>
                  {meetsRequirements ? "Valmis" : "Keskeneräinen"}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
                <li className={checks.length ? "text-emerald-600" : "text-slate-400"}>
                  {checks.length ? "✓" : "○"} Vähintään 8 merkkiä
                </li>
                <li className={checks.uppercase ? "text-emerald-600" : "text-slate-400"}>
                  {checks.uppercase ? "✓" : "○"} Iso kirjain (A–Z)
                </li>
                <li className={checks.lowercase ? "text-emerald-600" : "text-slate-400"}>
                  {checks.lowercase ? "✓" : "○"} Pieni kirjain (a–z)
                </li>
                <li className={checks.number ? "text-emerald-600" : "text-slate-400"}>
                  {checks.number ? "✓" : "○"} Numero (0–9)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-slate-400 dark:text-slate-500 mb-1.5">
            Vahvista uusi salasana
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={saving}
            className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 transition disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving || !meetsRequirements || !confirmPassword}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
          style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Päivitetään...
            </>
          ) : (
            "Päivitä salasana"
          )}
        </button>
      </div>
    </form>
  );
}