import { PageHeader } from "@/components/gamification-ui";
import { LeafIcon, PlayIcon, TargetIcon } from "@/components/reference-icons";
import Link from "next/link";

export default function PracticeHubPage() {
  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="လေ့ကျင့်ရန် · Practice"
        description="တရားထိုင်ခြင်းနှင့် ပုတီးစိပ်ခြင်း"
      />

      <div className="grid gap-3">
        <Link
          href="/practice/meditate"
          className="gamify-surface gamify-surface--interactive grid gap-3 p-5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
            <LeafIcon />
          </span>
          <h2 className="font-display text-2xl text-cream">တရားထိုင်ခြင်း</h2>
          <p className="text-sm text-accent-merit-soft">Guided Meditation Timer</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            ၅ / ၁၀ / ၁၅ မိနစ် အချိန်မှတ်တမ်းနှင့် ကုသိုလ်အမှတ်
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-merit">
            <PlayIcon className="h-4 w-4" /> Begin a calm session
          </span>
        </Link>
        <Link
          href="/practice/beads"
          className="gamify-surface gamify-surface--interactive grid gap-3 p-5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
            <TargetIcon />
          </span>
          <h2 className="font-display text-2xl text-cream">ပုတီးစိပ်</h2>
          <p className="text-sm text-accent-merit-soft">Smart Beads</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            မျက်နှာပြင် တို့ခြင်း · vibration (ရှိလျှင်)
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-merit">
            <TargetIcon className="h-4 w-4" /> Reach 108 beads
          </span>
        </Link>
      </div>
    </section>
  );
}
