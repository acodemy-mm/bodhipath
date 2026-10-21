"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BodhiTree } from "@/components/bodhi-tree";
import { useAppStore } from "@/lib/store";

export default function LandingPage() {
  const { profile, ready } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (profile?.onboarding_complete) router.replace("/home");
    else if (profile) router.replace("/onboarding");
  }, [ready, profile, router]);

  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center text-center">
      <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gold/80">
        Bodhi Path
      </p>
      <h1 className="font-display animate-grow-in text-5xl text-gold-soft md:text-6xl">
        ဗောဓိလမ်း
      </h1>
      <p className="mt-4 max-w-md text-cream/75">
        ဝိပဿနာ၊ အဘိဓမ္မာနှင့် နေ့စဉ် လေ့ကျင့်မှုကို ကုသိုလ်အမှတ်နှင့်
        ဗောဓိပင်ကြီးထွားမှုဖြင့် ပေါင်းစပ်ထားသော လမ်းကြောင်း။
      </p>
      <BodhiTree stage={2} merit={0} className="my-8" />
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/auth"
          className="rounded-xl bg-gold px-8 py-3 font-medium text-ink transition hover:bg-gold-soft"
        >
          စတင်ရန် · Begin
        </Link>
      </div>
    </section>
  );
}
