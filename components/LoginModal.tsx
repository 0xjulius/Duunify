"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { translateAuthError } from "@/lib/auth-errors";
import { createLog } from "@/lib/logger";

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Kysymysmerkki tekee siitä valinnaisen
}) {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const flipped = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function login() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(translateAuthError(error.message));
      await createLog({
        action: "login_failed",
        details: `Failed login attempt for email: ${email}`,
        category: "auth",
        status: "failure",
      });
      setLoading(false);
      return;
    }

    toast.success("Tervetuloa takaisin 👋");

    if (onSuccess) {
      onSuccess();
    }

    onClose();
    router.push("/dashboard");
    router.refresh();
  }

  async function register() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // Tämä ohjaa käyttäjän vahvistuksen jälkeen suoraan dashboardille
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Tarkista sähköpostisi.");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(13, 11, 38, 0.7)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .duunify-modal { font-family: 'Inter', sans-serif; }
        .duunify-display { font-family: 'Space Grotesk', sans-serif; }
        .duunify-mono { font-family: 'JetBrains Mono', monospace; }
        .duunify-perspective { perspective: 2400px; }
        .duunify-card-inner {
          position: relative;
          display: grid;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .duunify-card-inner.is-flipped { transform: rotateY(180deg); }
        /* Both faces share the same grid cell, so the card auto-sizes to
           whichever face (login or register) is taller — nothing clips. */
        .duunify-face-stack { grid-area: 1 / 1; min-width: 0; }
        .duunify-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .duunify-face-back { transform: rotateY(180deg); }
        .duunify-perforation {
          background-image: radial-gradient(circle, rgba(13,11,38,0) 0, rgba(13,11,38,0) 3px, transparent 3px);
        }
      `}</style>

      <div
        className="duunify-modal duunify-perspective w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`duunify-card-inner ${flipped ? "is-flipped" : ""}`}>
          {/* ---------- FRONT FACE: brand left / login right ---------- */}
          <div
            className="duunify-face duunify-face-stack w-full rounded-[28px] overflow-hidden shadow-2xl bg-white grid md:grid-cols-[44%_56%]"
            aria-hidden={flipped}
          >
            <BrandPanel
              side="left"
              serial="00482"
              eyebrow="Avoin tunnus"
              heading="Duunify"
              tagline="Hallitse projektejasi, seuraa hakemuksia ja kasvata bisnestäsi samassa paikassa."
              footer={
                <Quote
                  text="Tämä on paras tapa hallita omaa työtäni."
                  name="Julupertsa"
                  role="Power user"
                />
              }
            />

            <div className="relative p-8 md:p-12 flex flex-col justify-center">
              <Perforation side="left" />
              <FormShell
                heading="Tervetuloa takaisin"
                sub="Kirjaudu sisään päästäksesi hallintapaneeliin."
              >
                <GoogleButton label="Jatka Googlella" />
                <Divider label="tai" />
                <form
                  className="space-y-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <TextField
                    label="Sähköpostiosoite"
                    type="email"
                    placeholder="etunimi@yritys.fi"
                    value={email}
                    onChange={setEmail}
                  />
                  <TextField
                    label="Salasana"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                  />
                  <PrimaryButton
                    label="Kirjaudu sisään"
                    onClick={login}
                    loading={loading}
                  />
                </form>
                <SwitchLine
                  prompt="Eikö sinulla ole vielä tunnusta?"
                  action="Luo tunnus"
                  onClick={() => setMode("register")}
                />
              </FormShell>
            </div>
          </div>

          {/* ---------- BACK FACE: register left / brand right ---------- */}
          <div
            className="duunify-face duunify-face-stack duunify-face-back w-full rounded-[28px] overflow-hidden shadow-2xl bg-white grid md:grid-cols-[56%_44%]"
            aria-hidden={!flipped}
          >
            <div className="relative p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <Perforation side="right" />
              <FormShell
                heading="Luo tunnus"
                sub="Aloita ilmaiseksi — ei vaadi luottokorttia."
              >
                <GoogleButton label="Rekisteröidy Googlella" />
                <Divider label="tai" />
                <form
                  className="space-y-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <TextField
                    label="Koko nimi"
                    type="text"
                    placeholder="Maija Meikäläinen"
                    value={fullName}
                    onChange={setFullName}
                  />
                  <TextField
                    label="Sähköpostiosoite"
                    type="email"
                    placeholder="etunimi@yritys.fi"
                    value={email}
                    onChange={setEmail}
                  />
                  <TextField
                    label="Salasana"
                    type="password"
                    placeholder="Vähintään 8 merkkiä"
                    value={password}
                    onChange={setPassword}
                  />
                  <PrimaryButton
                    label="Luo tunnus"
                    onClick={register}
                    loading={loading}
                  />
                </form>
                <SwitchLine
                  prompt="Oliko sinulla sittenkin tunnus?"
                  action="Siirry kirjautumiseen"
                  onClick={() => setMode("login")}
                />
              </FormShell>
            </div>

            <BrandPanel
              side="right"
              className="order-1 md:order-2"
              serial="00483"
              eyebrow="Uusi tunnus"
              heading="Duunify"
              tagline="Liity tuhansien tekijöiden joukkoon ja löydä seuraava projektisi tänään."
              footer={<StatsRow />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Sub-components ---------------------------- */

function BrandPanel({
  side,
  serial,
  eyebrow,
  heading,
  tagline,
  footer,
  className = "",
}) {
  return (
    <div
      className={`relative p-10 md:p-12 flex flex-col justify-between text-white overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(165deg, #211A5C 0%, #181440 55%, #120F33 100%)",
      }}
    >
      {/* faint blueprint grid texture, not a generic blur-blob */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 duunify-mono text-[11px] tracking-[0.18em] text-amber-300/90 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {eyebrow} · Nro {serial}
        </div>

        <h2 className="duunify-display mt-4 text-3xl font-bold tracking-tight">
          {heading}
        </h2>
        <p className="mt-4 text-indigo-100/80 text-[15px] leading-relaxed max-w-[30ch]">
          {tagline}
        </p>
      </div>

      <div className="relative z-10">{footer}</div>

      {/* stamp seal, lower corner — a wink at "job ticket" */}
      <div
        className={`absolute bottom-8 ${side === "left" ? "right-8" : "left-8"} hidden md:flex`}
      >
        <div className="w-16 h-16 rounded-full border border-dashed border-amber-300/40 flex items-center justify-center rotate-[-12deg]">
          <span className="duunify-mono text-[8px] tracking-widest text-amber-300/60 text-center leading-tight">
            DUUNIFY
            <br />
            OY
          </span>
        </div>
      </div>
    </div>
  );
}

function Perforation({ side }) {
  // Dashed seam with punch-hole notches, evoking a torn ticket stub.
  const edgeClass =
    side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2";
  return (
    <div
      className={`hidden md:flex absolute top-6 bottom-6 w-px ${edgeClass} flex-col items-center justify-between`}
      aria-hidden="true"
    >
      <span className="w-3 h-3 rounded-full bg-[#EEF0FB]" />
      <div className="flex-1 border-l border-dashed border-slate-200 w-px" />
      <span className="w-3 h-3 rounded-full bg-[#EEF0FB]" />
    </div>
  );
}

function FormShell({ heading, sub, children }) {
  return (
    <div className="max-w-sm w-full mx-auto space-y-5">
      <div>
        <h3 className="duunify-display text-2xl font-bold text-slate-900">
          {heading}
        </h3>
        <p className="text-slate-500 mt-1.5 text-[14px]">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function GoogleButton({ label }) {
  return (
    <button
      type="button"
      className="w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-semibold text-[14px] text-slate-700 flex items-center justify-center gap-2.5"
    >
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}

function Divider({ label }) {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-100" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-2.5 duunify-mono text-[10px] tracking-widest uppercase text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

function TextField({ label, type, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium text-slate-600 mb-1.5 block">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full h-12 rounded-xl bg-slate-50 px-4 text-[14px] text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-[#A5A1F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D67F2]/15 transition"
      />
    </label>
  );
}

function PrimaryButton({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      type="submit"
      className="w-full h-12 rounded-xl text-white font-bold text-[14px] transition-transform active:scale-[0.99]"
      style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
    >
      {loading ? "Odota..." : label}
    </button>
  );
}

function SwitchLine({ prompt, action, onClick }) {
  return (
    <p className="text-center text-[13.5px] text-slate-600 pt-1">
      {prompt}{" "}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-[#6D67F2] hover:text-[#5750E0] hover:underline"
      >
        {action}
      </button>
    </p>
  );
}

function Quote({ text, name, role }) {
  return (
    <div className="bg-white/[0.06] p-5 rounded-2xl border border-white/10">
      <p className="text-white/90 text-[14px] italic leading-relaxed">
        "{text}"
      </p>
      <div className="flex items-center mt-3.5 gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500" />
        <div>
          <p className="text-[12.5px] font-bold leading-tight">{name}</p>
          <p className="text-[11px] text-indigo-200/70 leading-tight">{role}</p>
        </div>
      </div>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { value: "2 400+", label: "aktiivista projektia" },
    { value: "98 %", label: "asiakastyytyväisyys" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white/[0.06] p-4 rounded-2xl border border-white/10"
        >
          <p className="duunify-display text-xl font-bold text-amber-300">
            {s.value}
          </p>
          <p className="text-[11px] text-indigo-200/70 mt-0.5 leading-snug">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
