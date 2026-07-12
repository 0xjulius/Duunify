"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { X, Link2 } from "lucide-react";
import {
  createCalendarEvent,
  CalendarEventType,
  ApplicationLite,
} from "@/lib/calendar";

export default function AddEventModal({
  open,
  onOpenChange,
  applications: propApplications,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications?: ApplicationLite[];
  onSuccess: () => void;
}) {
  const [type, setType] = useState<CalendarEventType>("interview");
  const [title, setTitle] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [applications, setApplications] = useState<ApplicationLite[]>(propApplications || []);

  useEffect(() => {
    if (open) {
      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setDate(`${year}-${month}-${day}`);

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }
  }, [open]);

  useEffect(() => {
    if (propApplications && propApplications.length > 0) {
      setApplications(propApplications);
      return;
    }

    async function loadApplicationsFallback() {
      if (!open) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .select("id, company, job_title")
        .eq("user_id", user.id)
        .order("company", { ascending: true });

      if (!error && data) {
        setApplications(data as ApplicationLite[]);
      }
    }

    loadApplicationsFallback();
  }, [open, propApplications]);

  if (!open) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

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
    setNotes("");
    onSuccess();
    handleClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Otsikko */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">Uusi tapahtuma</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tyyppivalinta */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl transition-colors">
            {(["interview", "reminder", "other"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`text-xs font-semibold py-2 rounded-lg transition-all ${
                  type === t
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
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

          {/* Otsikkokenttä */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tapahtuman nimi</label>
            <input
              placeholder="esim. Tekninen haastattelu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Liitä hakemukseen */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Link2 size={12} className="text-slate-400 dark:text-slate-500" />
              Liitä työpaikkahakemukseen
            </label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            >
              <option value="" className="dark:bg-slate-950">— Ei liitetty hakemukseen —</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id} className="dark:bg-slate-950">
                  {a.company} · {a.job_title}
                </option>
              ))}
            </select>
          </div>

          {/* Päivä ja aika */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Päivämäärä</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Kellonaika</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              />
            </div>
          </div>

          {/* Muistiinpanot */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Muistiinpanot</label>
            <textarea
              placeholder="Lisätietoja, osoite, linkit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm h-20 resize-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Tallennuspainike */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full h-11 rounded-xl text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? "Tallennetaan..." : "Lisää tapahtuma"}
        </button>
      </div>
    </div>
  );
}