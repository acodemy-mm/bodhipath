"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Surface } from "@/components/gamification-ui";
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
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="သင့်လမ်းကို ရွေးပါ"
        description="Goal selection · ဗောဓိလမ်းတွင် ဘာကို အဓိကထားမလဲ။"
      />

      <Surface className="grid gap-5 p-4">
        <label className="grid gap-1.5 text-sm">
          <span className="text-text-secondary">အမည်</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="gamify-input"
          />
        </label>

        <div className="grid gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(g.id)}
              className={`gamify-choice ${
                goal === g.id ? "is-selected" : ""
              }`}
              aria-pressed={goal === g.id}
            >
              <span className="block font-medium text-cream">{g.mm}</span>
              <span className="text-sm text-accent-merit-soft">{g.en}</span>
              <span className="mt-1 block text-sm text-text-secondary">
                {g.desc}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!goal}
          onClick={submit}
          className="gamify-button gamify-button--primary w-full"
        >
          ဆက်လက် · Continue
        </button>
      </Surface>
    </section>
  );
}
