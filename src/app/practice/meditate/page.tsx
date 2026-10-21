import Link from "next/link";
import { MeditationTimer } from "@/components/meditation-timer";

export default function MeditatePage() {
  return (
    <section>
      <Link
        href="/practice"
        className="text-sm text-cream/50 hover:text-gold-soft"
      >
        ← လေ့ကျင့်ရန်
      </Link>
      <h1 className="font-display mt-4 text-center text-3xl text-gold-soft">
        တရားထိုင်ခြင်း
      </h1>
      <p className="mb-8 text-center text-sm text-cream/55">
        ထွက်သက်ဝင်သက်ကို အာရုံပြု၍ ထိုင်ပါ
      </p>
      <MeditationTimer />
    </section>
  );
}
