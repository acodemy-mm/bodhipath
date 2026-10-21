"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function AuthPage() {
  const { signIn, signUp } = useAppStore();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || password.length < 4) {
      setError("အီးမေးလ်နှင့် စကားဝှက် (အနည်းဆုံး ၄ လုံး) လိုအပ်သည်။");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
        router.push("/onboarding");
      } else {
        await signIn(email, password);
        router.push("/home");
      }
    } catch {
      setError("ဝင်ရောက်မှု မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပါ။");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md animate-grow-in">
      <Link href="/" className="text-sm text-cream/50 hover:text-gold-soft">
        ← ဗောဓိလမ်း
      </Link>
      <h1 className="font-display mt-4 text-3xl text-gold-soft">
        {mode === "signup" ? "အကောင့်ဖွင့်ရန်" : "ဝင်ရောက်ရန်"}
      </h1>
      <p className="mt-1 text-sm text-cream/60">
        Demo mode — data is saved in this browser. Add Supabase env vars for
        cloud auth.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <label className="block text-sm">
            <span className="text-cream/70">အမည် · Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-mist bg-bg-soft/80 px-4 py-3 outline-none ring-gold/40 focus:ring-2"
              placeholder="ယောဂီ"
            />
          </label>
        )}
        <label className="block text-sm">
          <span className="text-cream/70">အီးမေးလ်</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-mist bg-bg-soft/80 px-4 py-3 outline-none ring-gold/40 focus:ring-2"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-cream/70">စကားဝှက်</span>
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-mist bg-bg-soft/80 px-4 py-3 outline-none ring-gold/40 focus:ring-2"
            required
          />
        </label>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gold py-3 font-medium text-ink transition hover:bg-gold-soft disabled:opacity-60"
        >
          {loading
            ? "…"
            : mode === "signup"
              ? "ဖွင့်မည် · Sign up"
              : "ဝင်မည် · Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="mt-6 w-full text-sm text-cream/60 hover:text-gold-soft"
      >
        {mode === "signup"
          ? "အကောင့်ရှိပြီးသားလား? ဝင်ရောက်ရန်"
          : "အကောင့်မရှိသေးဘူးလား? ဖွင့်ရန်"}
      </button>
    </section>
  );
}
