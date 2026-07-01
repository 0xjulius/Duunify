"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { translateAuthError } from "@/lib/auth-errors";

export default function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      toast.error("Salasanan tulee olla vähintään 8 merkkiä.");
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

    toast.success("Salasana vaihdettu.");
    setNewPassword("");
    setConfirmPassword("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm border px-3 py-1.5 rounded-lg font-medium"
      >
        Vaihda salasana
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <input
        type="password"
        placeholder="Uusi salasana"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border rounded-lg p-2 text-sm"
      />
      <input
        type="password"
        placeholder="Vahvista uusi salasana"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border rounded-lg p-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? "Tallennetaan..." : "Tallenna"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-sm border px-3 py-1.5 rounded-lg font-medium"
        >
          Peruuta
        </button>
      </div>
    </div>
  );
}