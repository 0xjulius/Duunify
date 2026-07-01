"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  createCalendarEvent,
  CalendarEventType,
  ApplicationLite,
} from "@/lib/calendar";

export default function AddEventModal({
  isOpen,
  onClose,
  applications,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationLite[];
  onCreated: () => void;
}) {
  const [type, setType] = useState<CalendarEventType>("interview");
  const [title, setTitle] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Anna tapahtumalle otsikko.");
      return;
    }
    if (!date) {
      toast.error("Valitse päivämäärä.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      toast.error("Et ole kirjautunut sisään.");
      return;
    }

    const { error } = await createCalendarEvent({
      userId: user.id,
      type,
      title: title.trim(),
      applicationId: applicationId || null,
      eventDate: date,
      eventTime: time || null,
      notes: notes.trim() || null,
    });

    setSaving(false);

    if (error) {
      toast.error("Tallennus epäonnistui.");
      return;
    }

    toast.success("Tapahtuma lisätty.");
    setTitle("");
    setApplicationId("");
    setDate("");
    setTime("");
    setNotes("");
    onCreated();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,11,38,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-slate-900">Uusi tapahtuma</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {(["interview", "reminder", "other"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`text-xs font-semibold py-2 rounded-lg border transition ${
                  type === t
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {t === "interview"
                  ? "Haastattelu"
                  : t === "reminder"
                    ? "Muistutus"
                    : "Muu"}
              </button>
            ))}
          </div>

          <input
            placeholder="Otsikko, esim. Haastattelu - tekninen osio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm"
          />

          <select
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm bg-white"
          >
            <option value="">— Ei liitetty hakemukseen —</option>
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.company} · {a.job_title}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded-lg p-2.5 text-sm"
            />
          </div>

          <textarea
            placeholder="Muistiinpanot (valinnainen)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm h-20 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full h-11 rounded-xl text-white font-bold text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
        >
          {saving ? "Tallennetaan..." : "Lisää tapahtuma"}
        </button>
      </div>
    </div>
  );
}
