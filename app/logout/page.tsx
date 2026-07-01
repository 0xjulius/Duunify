"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, ArrowLeft } from "lucide-react";

function LogoutContent() {
  const searchParams = useSearchParams();
  const alreadyDone = searchParams.get("done") === "1";

  const [signingOut, setSigningOut] = useState(false);
  const [done, setDone] = useState(alreadyDone);
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Jos tultiin suoraan modaalin kautta, käyttäjä on jo signed-out —
    // ei näytetä nimeä, ohjataan vain suoraan etusivulle viiveellä.
    if (alreadyDone) {
      const timeout = setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1400);
      return () => clearTimeout(timeout);
    }

    supabase.auth.getUser().then(({ data }) => {
      const name =
        data.user?.user_metadata?.full_name ||
        data.user?.user_metadata?.name ||
        (data.user?.email ? data.user.email.split("@")[0] : "");
      setDisplayName(name);
    });
  }, [alreadyDone, router]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);

    await supabase.auth.signOut();

    setSigningOut(false);
    setDone(true);

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,27,75,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(30,27,75,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="duunify-modal relative w-full max-w-sm">
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D67F2] to-[#5750E0]" />
            <span className="duunify-display font-bold text-slate-900">
              Duunify
            </span>
          </div>

          {done ? (
            <>
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <LogOut size={22} className="text-emerald-600" />
              </div>
              <h1 className="duunify-display text-xl font-bold text-slate-900">
                Uloskirjautuminen onnistui
              </h1>
              <p className="text-slate-500 text-[14px] mt-2">
                Nähdään pian{displayName ? `, ${displayName}` : ""} 👋
              </p>
            </>
          ) : (
            <>
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
              >
                <LogOut size={22} className="text-white" />
              </div>

              <h1 className="duunify-display text-xl font-bold text-slate-900">
                Kirjaudutaanko ulos?
              </h1>
              <p className="text-slate-500 text-[14px] mt-2 leading-relaxed">
                {displayName
                  ? `Olet kirjautuneena sisään käyttäjänä ${displayName}.`
                  : "Istuntosi suljetaan tällä laitteella."}
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full h-12 rounded-xl text-white font-bold text-[14px] transition-transform active:scale-[0.99] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
                >
                  {signingOut ? "Kirjaudutaan ulos..." : "Kirjaudu ulos"}
                </button>

                <button
                  onClick={() => router.back()}
                  disabled={signingOut}
                  className="w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition font-semibold text-[14px] text-slate-700 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <ArrowLeft size={16} />
                  Peruuta
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Duunify © 2026
        </p>
      </div>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={null}>
      <LogoutContent />
    </Suspense>
  );
}