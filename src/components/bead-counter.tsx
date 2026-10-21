"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { BEAD_TARGET } from "@/lib/gamification";

export function BeadCounter() {
  const { logPractice } = useAppStore();
  const [count, setCount] = useState(0);
  const [pop, setPop] = useState(false);
  const [done, setDone] = useState<{ merit: number } | null>(null);

  function tap() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    setPop(true);
    window.setTimeout(() => setPop(false), 180);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        /* ignore */
      }
    }

    if (next >= BEAD_TARGET) {
      const result = logPractice({ type: "beads", bead_count: next });
      setDone(result);
    }
  }

  function finishPartial() {
    if (count < 1) return;
    const result = logPractice({ type: "beads", bead_count: count });
    setDone(result);
  }

  function reset() {
    setCount(0);
    setDone(null);
  }

  const progress = Math.min(1, count / BEAD_TARGET);

  return (
    <div className="mx-auto max-w-md animate-grow-in text-center">
      <p className="mb-2 text-sm text-cream/60">ပုတီးစိပ် · Smart Beads</p>
      <p className="font-display text-5xl tabular-nums text-gold-soft">
        {count}
        <span className="text-2xl text-cream/40"> / {BEAD_TARGET}</span>
      </p>

      <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-gold transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={tap}
        disabled={Boolean(done)}
        className={`mx-auto mt-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-b from-leaf-bright to-leaf shadow-[0_12px_40px_rgba(61,122,74,0.45)] transition active:scale-95 disabled:opacity-60 ${
          pop ? "animate-bead-pop" : ""
        }`}
        aria-label="Tap bead"
      >
        <span className="font-display text-xl text-cream">တို့ပါ · Tap</span>
      </button>

      <div className="mt-8 flex justify-center gap-3">
        {!done && count > 0 && count < BEAD_TARGET && (
          <button
            type="button"
            onClick={finishPartial}
            className="rounded-xl border border-mist px-5 py-2 text-sm text-cream/80"
          >
            ယခု ပြီးဆုံးမည်
          </button>
        )}
        {(done || count > 0) && (
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-mist px-5 py-2 text-sm text-cream"
          >
            ပြန်စမည် · Reset
          </button>
        )}
      </div>

      {done && (
        <p className="mt-6 animate-grow-in text-gold-soft">
          သာဓု! +{done.merit} merit
          {count >= BEAD_TARGET ? " · ပုတီး ၁၀၈ ပြီးမြောက်" : ""}
        </p>
      )}

      <p className="mt-6 text-sm text-cream/50">
        ဖုန်းတွင် vibration ပံ့ပိုးပါက တို့တိုင်း တုန်ခါမည်။
      </p>
    </div>
  );
}
