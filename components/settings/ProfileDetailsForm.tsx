"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ProfileDetailsForm({
  initialPhone,
  initialLocation,
}: {
  initialPhone: string;
  initialLocation: string;
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [location, setLocation] = useState(initialLocation);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (phone.length > 20) {
      toast.error("Puhelinnumero liian pitkä.");
      return;
    }
    if (location.length > 60) {
      toast.error("Sijainti liian pitkä.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { phone, location },
    });

    setSaving(false);

    if (error) {
      toast.error("Tallennus epäonnistui.");
      return;
    }

    toast.success("Tiedot tallennettu.");
  }

  return (
    <>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Puhelinnumero"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
        <input
          placeholder="Sijainti"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
      >
        {saving ? "Tallennetaan..." : "Tallenna muutokset"}
      </button>
    </>
  );
}