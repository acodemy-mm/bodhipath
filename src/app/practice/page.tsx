import Link from "next/link";

export default function PracticeHubPage() {
  return (
    <section className="animate-grow-in">
      <h1 className="font-display text-3xl text-gold-soft">
        လေ့ကျင့်ရန် · Practice
      </h1>
      <p className="mt-2 text-cream/65">
        တရားထိုင်ခြင်းနှင့် ပုတီးစိပ်ခြင်း
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/practice/meditate"
          className="rounded-2xl border border-mist bg-bg-soft/50 p-6 transition hover:border-gold/40 hover:bg-bg-soft"
        >
          <h2 className="font-display text-2xl text-cream">တရားထိုင်ခြင်း</h2>
          <p className="mt-1 text-sm text-gold-soft">Guided Meditation Timer</p>
          <p className="mt-3 text-sm text-cream/60">
            ၅ / ၁၀ / ၁၅ မိနစ် အချိန်မှတ်တမ်းနှင့် ကုသိုလ်အမှတ်
          </p>
        </Link>
        <Link
          href="/practice/beads"
          className="rounded-2xl border border-mist bg-bg-soft/50 p-6 transition hover:border-gold/40 hover:bg-bg-soft"
        >
          <h2 className="font-display text-2xl text-cream">ပုတီးစိပ်</h2>
          <p className="mt-1 text-sm text-gold-soft">Smart Beads</p>
          <p className="mt-3 text-sm text-cream/60">
            မျက်နှာပြင် တို့ခြင်း · vibration (ရှိလျှင်)
          </p>
        </Link>
      </div>
    </section>
  );
}
