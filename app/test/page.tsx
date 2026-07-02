// app/test/page.tsx
"use client";

import React, { useState } from "react";
import AddAttachment from "@/components/applications/AddAttachment";
import { supabase } from "@/lib/supabase"; // Tuodaan valmis objekti tästä tiedostosta

export default function TestPage() {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setStatusMsg(null);

    try {
      // 1. Haetaan kirjautunut käyttäjä käyttäen suoraan supabase-objektia
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Sinun täytyy olla kirjautunut sisään tallentaaksesi.");
      }

      let cvUrl = null;

      // 2. Jos tiedosto on valittu, ladataan se
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from("attachments")
          .upload(fileName, file);

        if (storageError) {
          throw new Error(`Tiedoston lataus epäonnistui: ${storageError.message}`);
        }

        cvUrl = storageData.path;
      }

      // 3. Tallennetaan rivi tietokantaan
      const { error: dbError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_title: "Testinimike",     
          company_name: "Testiyritys",  
          notes: notes || null,
          cv_url: cvUrl,
          status: "Lähetetty"
        });

      if (dbError) {
        throw dbError;
      }

      setStatusMsg({ type: "success", text: "Hakemus ja liite tallennettu onnistuneesti Supabaseen!" });
      setNotes("");
      setFile(null);

    } catch (error: any) {
      console.error(error);
      setStatusMsg({ type: "error", text: error.message || "Tallennus epäonnistui." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-slate-50 min-h-screen">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
        <h1 className="text-xl font-bold text-slate-900">
          Testaa tallennusta Supabaseen
        </h1>

        {/* Komponentti */}
        <AddAttachment
          notes={notes}
          setNotes={setNotes}
          file={file}
          setFile={setFile}
        />

        {/* TILAVIESTIT (Onnistui / Epäonnistui) */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                : "bg-red-50 text-red-800 border border-red-100"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* TALLENNA-NAPPI */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Tallennetaan...
            </>
          ) : (
            "Tallenna hakemus"
          )}
        </button>

        {/* REAALIAIKAINEN DATA-IKKUNA */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs flex flex-col gap-2">
          <p className="font-bold text-indigo-400 border-b border-slate-800 pb-1 uppercase tracking-wider">
            Lomakkeen tila:
          </p>
          <div>
            <span className="text-slate-400">Notes:</span>
            <p className="mt-1 text-white bg-slate-800 p-2 rounded-lg whitespace-pre-wrap">
              {notes || "Tyhjä"}
            </p>
          </div>
          <div>
            <span className="text-slate-400">File:</span>
            <p className="mt-1 text-white">
              {file ? `📄 ${file.name}` : "Ei tiedostoa"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
