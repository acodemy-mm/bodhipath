import Link from "next/link";
import { BeadCounter } from "@/components/bead-counter";

export default function BeadsPage() {
  return (
    <section>
      <Link
        href="/practice"
        className="text-sm text-cream/50 hover:text-gold-soft"
      >
        ← လေ့ကျင့်ရန်
      </Link>
      <h1 className="font-display mt-4 text-center text-3xl text-gold-soft">
        ပုတီးစိပ်
      </h1>
      <p className="mb-8 text-center text-sm text-cream/55">
        တို့တိုင်း တစ်လုံး · ၁၀၈ လုံး ပန်းတိုင်
      </p>
      <BeadCounter />
    </section>
  );
}
