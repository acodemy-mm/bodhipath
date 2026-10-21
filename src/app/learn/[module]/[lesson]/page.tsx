"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BodhiScene } from "@/components/bodhi-scenes";
import {
  ArrowLeftIcon,
  BookIcon,
  CheckIcon,
  LockIcon,
  PlayIcon,
  SproutIcon,
} from "@/components/reference-icons";
import { getLesson, getLessonsForModule, getModule, quoteOfDay } from "@/lib/content";
import { TREE_THRESHOLDS } from "@/lib/gamification";
import { useAppStore } from "@/lib/store";

function renderContent(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display mt-6 text-2xl text-gold-soft">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      const text = line.slice(2);
      const html = text.replace(
        /\*\*(.+?)\*\*/g,
        "<strong class='text-gold-soft'>$1</strong>",
      );
      return (
        <li
          key={i}
          className="ml-4 list-disc text-cream/85"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="ml-4 list-decimal text-cream/85">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    if (!line.trim()) return <br key={i} />;
    return (
      <p key={i} className="text-cream/85 leading-relaxed">
        {line}
      </p>
    );
  });
}

export default function LessonPage() {
  const params = useParams<{ module: string; lesson: string }>();
  const lesson = getLesson(params.module, params.lesson);
  const mod = getModule(params.module);
  const { profile, completedLessonIds, completeLesson } = useAppStore();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);

  if (!lesson || !mod) {
    return (
      <p className="text-cream/70">
        သင်ခန်းစာ မတွေ့ပါ။{" "}
        <Link href="/learn" className="text-gold-soft">
          ပြန်သွားရန်
        </Link>
      </p>
    );
  }

  const locked = (profile?.merit_points ?? 0) < mod.unlock_merit;
  const done = completedLessonIds.includes(lesson.id);
  const moduleLessons = getLessonsForModule(mod.slug);
  const lessonIndex = moduleLessons.findIndex((item) => item.id === lesson.id);
  const level = (profile?.tree_stage ?? 0) + 1;
  const nextThreshold =
    TREE_THRESHOLDS[(profile?.tree_stage ?? 0) + 1] ??
    (profile?.merit_points ?? 0) + 200;
  const quote = quoteOfDay();
  const progressStep = done ? 2 : started ? 1 : 0;
  const dailyProgress = [
    { label: "Learn", icon: BookIcon },
    { label: "Practice", icon: SproutIcon },
    { label: "Exam", icon: CheckIcon },
    { label: "Learn", icon: BookIcon },
    { label: "Review", icon: LockIcon },
  ];

  if (locked) {
    return (
      <p className="text-cream/70">
        ဤ module အတွက် {mod.unlock_merit} merit လိုအပ်သည်။{" "}
        <Link href="/learn" className="text-gold-soft">
          ပြန်သွားရန်
        </Link>
      </p>
    );
  }

  function onComplete() {
    const result = completeLesson(lesson!.id);
    if (result.already) {
      setMessage("ဤသင်ခန်းစာကို ပြီးမြောက်ပြီးသား ဖြစ်သည်။");
    } else {
      setMessage(`သာဓု! +${result.merit} merit`);
      window.setTimeout(() => router.push("/learn"), 900);
    }
  }

  return (
    <article className="reference-shell reference-lesson animate-grow-in">
      <header className="reference-lesson-header">
        <Link href="/learn" className="reference-back" aria-label="Back to Learn">
          <ArrowLeftIcon />
        </Link>
        <div>
          <p className="reference-kicker">BODHI PATH</p>
          <h1>{mod.title_mm}</h1>
          <p>{mod.description_mm}</p>
        </div>
        <span className="reference-lesson-spacer" />
      </header>

      <div className="reference-xp-pill">
        <SproutIcon />
        Level {level} · {profile?.merit_points ?? 0} XP
      </div>

      <section className="reference-lesson-card">
        <div className="reference-lesson-art">
          <BodhiScene variant="lesson" />
          <span className="reference-lesson-count">
            {Math.max(1, lessonIndex + 1)} / {moduleLessons.length}
          </span>
        </div>
        <div className="reference-lesson-card-copy">
          <p className="reference-lesson-eyebrow">{lesson.title_en}</p>
          <h2>{lesson.title_mm}</h2>
          <p>{mod.description_mm} ကို ဖြည်းဖြည်းချင်း လေ့လာပြီး လက်တွေ့ကျင့်ပါ။</p>
          <span className="reference-duration">
            <PlayIcon /> {lesson.duration_mins} min
          </span>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setStarted(true)}
        className="reference-start-button"
      >
        <PlayIcon />
        {started ? "Continue Learning" : "Start Learning"}
        <ArrowLeftIcon className="reference-start-arrow" />
      </button>

      <section className="reference-daily-progress">
        <div className="reference-section-heading">
          <span>
            <SproutIcon />
            Today&apos;s Progress
          </span>
          <Link href="/home">See All</Link>
        </div>
        <div className="reference-progress-steps">
          {dailyProgress.map((item, index) => {
            const Icon = item.icon;
            const complete = index < progressStep;
            const current = index === progressStep;
            return (
              <div
                key={`${item.label}-${index}`}
                className={`reference-progress-step ${complete ? "is-complete" : ""} ${current ? "is-current" : ""}`}
              >
                <span>
                  {complete ? <CheckIcon /> : current ? <Icon /> : <LockIcon />}
                </span>
                <small>{item.label}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="reference-lesson-quote">
        <SproutIcon />
        <div>
          <p>{quote.text_mm}</p>
          <small>{quote.text_en}</small>
        </div>
      </section>

      {started && (
        <section className="reference-reading-card">
          <div className="reference-reading-content">{renderContent(lesson.content)}</div>
          <button
            type="button"
            onClick={onComplete}
            disabled={done}
            className="reference-complete-button"
          >
            {done ? "Lesson Complete" : "Complete Lesson · +10 XP"}
          </button>
          {message && <p className="reference-success-message">{message}</p>}
          <p className="reference-next-xp">
            {nextThreshold - (profile?.merit_points ?? 0)} XP to the next level
          </p>
        </section>
      )}
    </article>
  );
}
