"use client";

import Link from "next/link";
import { MODULES, getLessonsForModule } from "@/lib/content";
import { useAppStore } from "@/lib/store";

const TRACK_LABEL: Record<string, string> = {
  vipassana: "ဝိပဿနာ",
  abhidhamma: "အဘိဓမ္မာ",
  pali: "ပါဠိ",
};

export default function LearnPage() {
  const { profile, completedLessonIds } = useAppStore();
  const merit = profile?.merit_points ?? 0;

  return (
    <section className="animate-grow-in">
      <h1 className="font-display text-3xl text-gold-soft">သင်ယူရန် · Learn</h1>
      <p className="mt-2 text-cream/65">
        ကုသိုလ်အမှတ်ဖြင့် အဆင့်လိုက် ဖွင့်လှစ်သော သင်ခန်းစာများ
      </p>

      <div className="mt-8 space-y-4">
        {MODULES.map((mod) => {
          const locked = merit < mod.unlock_merit;
          const lessons = getLessonsForModule(mod.slug);
          const doneCount = lessons.filter((l) =>
            completedLessonIds.includes(l.id),
          ).length;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border px-5 py-4 ${
                locked
                  ? "border-mist/40 bg-bg-deep/40 opacity-70"
                  : "border-mist bg-bg-soft/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold/70">
                    {TRACK_LABEL[mod.track]}
                  </p>
                  <h2 className="font-display text-xl text-cream">
                    {mod.title_mm}
                  </h2>
                  <p className="text-sm text-cream/55">{mod.title_en}</p>
                  <p className="mt-1 text-sm text-cream/70">
                    {mod.description_mm}
                  </p>
                </div>
                {locked ? (
                  <span className="rounded-lg bg-mist px-3 py-1 text-xs text-cream/70">
                    {mod.unlock_merit} merit လိုအပ်
                  </span>
                ) : (
                  <span className="text-xs text-gold-soft">
                    {doneCount}/{lessons.length} ပြီး
                  </span>
                )}
              </div>

              {!locked && (
                <ul className="mt-4 space-y-2 border-t border-mist pt-3">
                  {lessons.map((lesson) => {
                    const done = completedLessonIds.includes(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learn/${mod.slug}/${lesson.slug}`}
                          className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-mist"
                        >
                          <span>
                            <span className="block text-cream">
                              {lesson.title_mm}
                            </span>
                            <span className="text-xs text-cream/50">
                              {lesson.title_en} · {lesson.duration_mins} မိနစ်
                            </span>
                          </span>
                          <span className="text-sm text-gold-soft">
                            {done ? "ပြီးပြီ" : "ဖတ်မည်"}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
