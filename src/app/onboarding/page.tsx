"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { Goal } from "@/lib/types";

const GOALS: { id: Goal; mm: string; en: string; desc: string }[] = [
  {
    id: "meditation",
    mm: "တရားထိုင်ခြင်း",
    en: "Meditation",
    desc: "နေ့စဉ် သတိပဋ္ဌာန်နှင့် ပုတီး",
  },
  {
    id: "exam",
    mm: "စာမေးပွဲ ပြင်ဆင်ခြင်း",
    en: "Exam prep",
    desc: "အဘိဓမ္မာနှင့် MCQ",
  },
  {
    id: "both",
    mm: "နှစ်မျိုးလုံး",
    en: "Both",
    desc: "လေ့ကျင့် + သင်ယူ အပြည့်",
  },
];

export default function OnboardingPage() {
  const { profile, completeOnboarding } = useAppStore();
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [name, setName] = useState(profile?.display_name ?? "");

  function submit() {
    if (!goal) return;
    completeOnboarding(goal, name);
    router.push("/home");
  }

  return (
    <section className="mx-auto max-w-lg animate-grow-in">
      <h1 className="font-display text-3xl text-gold-soft">
        သင့်လမ်းကို ရွေးပါ
      </h1>
      <p className="mt-2 text-cream/65">
        Goal selection · ဗောဓိလမ်းတွင် ဘာကို အဓိကထားမလဲ။
      </p>

      <label className="mt-8 block text-sm">
        <span className="text-cream/70">အမည်</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-mist bg-bg-soft/80 px-4 py-3 outline-none ring-gold/40 focus:ring-2"
        />
      </label>

      <div className="mt-6 space-y-3">
        {GOALS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGoal(g.id)}
            className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
              goal === g.id
                ? "border-gold bg-leaf/30"
                : "border-mist bg-bg-soft/40 hover:border-leaf-bright/50"
            }`}
          >
            <span className="block font-medium text-cream">{g.mm}</span>
            <span className="text-sm text-gold-soft/80">{g.en}</span>
            <span className="mt-1 block text-sm text-cream/55">{g.desc}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!goal}
        onClick={submit}
        className="mt-8 w-full rounded-xl bg-gold py-3 font-medium text-ink disabled:opacity-40"
      >
        ဆက်လက် · Continue
      </button>
    </section>
  );
}
