// components/admin/UsersTable.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Search, Trash2, ShieldCheck, Shield, Bell, BellOff } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  applicationCount: number;
}

// Päivitetty vastaamaan page.tsx:n välittämää initialNotifySettings-propia
export default function UsersTable({ 
  users: initial,
  currentAdminId,
  initialNotifySettings
}: { 
  users: UserRow[];
  currentAdminId: string;
  initialNotifySettings: boolean;
}) {
  const [users, setUsers] = useState(initial);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Alustetaan tila suoraan korjatusta propsista
  const [notifyNewUsers, setNotifyNewUsers] = useState(initialNotifySettings);
  const [updatingNotify, setUpdatingNotify] = useState(false);

  const filtered = users.filter((u) =>
    (u.email + (u.full_name || "")).toLowerCase().includes(query.toLowerCase())
  );

  async function handleNotificationToggle(checked: boolean) {
    if (!currentAdminId) return;
    setUpdatingNotify(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({ notify_new_users: checked })
      .eq("id", currentAdminId);

    setUpdatingNotify(false);

    if (error) {
      toast.error("Asetuksen tallennus epäonnistui.");
      return;
    }

    setNotifyNewUsers(checked);
    toast.success(checked ? "Sähköposti-ilmoitukset päällä 🚀" : "Ilmoitukset poistettu käytöstä.");
  }

  async function toggleRole(user: UserRow) {
    const newRole = user.role === "admin" ? "user" : "admin";

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", user.id);

    if (error) {
      toast.error("Roolin muutos epäonnistui.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    toast.success(
      newRole === "admin" ? "Käyttäjästä tehtiin admin." : "Admin-oikeus poistettu."
    );
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (!res.ok) {
      toast.error("Käyttäjän poisto epäonnistui.");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast.success("Käyttäjä poistettu.");
    setDeleteTarget(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Etsi käyttäjää..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={notifyNewUsers}
            disabled={updatingNotify}
            onChange={(e) => handleNotificationToggle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
          />
          <div className="flex items-center gap-1.5 text-slate-600">
            {notifyNewUsers ? <Bell size={15} className="text-indigo-600" /> : <BellOff size={15} />}
            <span>Ilmoita uusista käyttäjistä sähköpostilla</span>
          </div>
        </label>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
            <th className="px-4 py-3 font-medium">Käyttäjä</th>
            <th className="px-4 py-3 font-medium">Rooli</th>
            <th className="px-4 py-3 font-medium">Hakemuksia</th>
            <th className="px-4 py-3 font-medium">Liittynyt</th>
            <th className="px-4 py-3 font-medium text-right">Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{u.full_name || "—"}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    u.role === "admin"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {u.role === "admin" ? "Admin" : "Käyttäjä"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{u.applicationCount}</td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(u.created_at).toLocaleDateString("fi-FI")}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => toggleRole(u)}
                    title={u.role === "admin" ? "Poista admin-oikeus" : "Tee adminiksi"}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {u.role === "admin" ? <Shield size={16} /> : <ShieldCheck size={16} />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(u)}
                    title="Poista käyttäjä"
                    className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,11,38,0.5)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-slate-900">Poista käyttäjä?</h3>
            <p className="text-sm text-slate-500 mt-2">
              Tämä poistaa pysyvästi käyttäjän <strong>{deleteTarget.email}</strong>{" "}
              ja kaikki hänen hakemuksensa, tapahtumansa ja historiesa. Toimintoa
              ei voi perua.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold"
              >
                Peruuta
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {deleting ? "Poistetaan..." : "Poista pysyvästi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}