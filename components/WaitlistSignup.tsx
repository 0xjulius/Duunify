"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error } = await supabase.from("waitlist").insert([{ email }]);

      if (error) throw error;

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Virhe tallennuksessa:", err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {status === "success" ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-400 text-white mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-6xl font-bold text-slate-900">Kiitos!</h3>
          <p className="mt-5 text-slate-600">
            Olet nyt listalla. Ilmoitamme heti, kun avaamme palvelun!
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            Lisää toinen sähköposti
          </button>
        </div>
      ) : (
        <>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Sähköpostiosoitteesi"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "Lähetetään..." : "Liity odotuslistalle"}
            </button>
          </form>

          {status === "error" && (
            <p className="mt-4 text-center text-red-500 text-sm font-medium">
              Sähköpostia ei voitu tallentaa. Tarkista yhteys tai kokeile
              uudelleen.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Maksuton
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Ei roskapostia
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Peru milloin
              vain
            </div>
          </div>
        </>
      )}
    </div>
  );
}
