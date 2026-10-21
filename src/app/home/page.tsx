"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  BookIcon,
  ChestIcon,
  FireIcon,
  LeafIcon,
  PlayIcon,
  SproutIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/reference-icons";
import { LESSONS, quoteOfDay } from "@/lib/content";
import { TREE_THRESHOLDS } from "@/lib/gamification";
import { useAppStore } from "@/lib/store";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export default function HomePage() {
  const { profile, sessions, completedLessonIds, earnedBadgeSlugs } =
    useAppStore();
  const quote = quoteOfDay();

  if (!profile) return null;

  const stage = profile.tree_stage;
  const level = stage + 1;
  const currentThreshold = TREE_THRESHOLDS[stage] ?? 0;
  const nextThreshold =
    TREE_THRESHOLDS[stage + 1] ?? currentThreshold + 200;
  const levelProgress = Math.min(
    100,
    Math.max(
      0,
      ((profile.merit_points - currentThreshold) /
        Math.max(1, nextThreshold - currentThreshold)) *
        100,
    ),
  );
  const practicedToday =
    profile.last_practice_date === new Date().toISOString().slice(0, 10);
  const nextLesson =
    LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
    LESSONS[0];
  const activeDays = Math.min(7, profile.streak_current);

  return (
    <section className="reference-shell reference-home animate-grow-in">
      <header className="reference-header">
        <div>
          <p className="reference-kicker">BODHI PATH</p>
          <h1 className="reference-brand">ဗောဓိလမ်း</h1>
          <p className="reference-welcome">
            မင်္ဂလာပါ၊ {profile.display_name} · Keep growing mindfully.
          </p>
        </div>
        <Link
          href="/profile"
          className="reference-avatar"
          aria-label="Open profile"
        >
          <UserIcon />
        </Link>
      </header>

      <div className="reference-hero">
        <Image
          src="/bodhi-forest.jpg"
          alt="A peaceful Bodhi Path meditation scene in a green forest"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 31rem"
          className="reference-hero-image"
        />
      </div>

      <section className="reference-level-card">
        <div className="reference-level-row">
          <span className="reference-level-icon">
            <LeafIcon />
          </span>
          <span>
            <span className="reference-level-title">Level {level}</span>
            <span className="reference-level-subtitle">Mindful Learner</span>
          </span>
          <span className="reference-chest">
            <ChestIcon />
            {earnedBadgeSlugs.length > 0 && (
              <span className="reference-notification">
                {earnedBadgeSlugs.length}
              </span>
            )}
          </span>
        </div>
        <div className="reference-progress-track">
          <span style={{ width: `${levelProgress}%` }} />
        </div>
        <div className="reference-progress-meta">
          <span>
            {profile.merit_points} / {nextThreshold} XP
          </span>
          <span>{nextThreshold - profile.merit_points} to grow</span>
        </div>
      </section>

      <Link
        href={`/learn/${nextLesson.module_slug}/${nextLesson.slug}`}
        className="reference-lesson-link"
      >
        <span className="reference-action-icon">
          <TargetIcon />
        </span>
        <span className="reference-lesson-copy">
          <strong>{nextLesson.title_mm}</strong>
          <small>{nextLesson.title_en} · Continue your path</small>
        </span>
        <span className="reference-circle-arrow">
          <ArrowRightIcon />
        </span>
      </Link>

      <div className="reference-quick-grid">
        <ReferenceQuickLink
          href="/learn"
          label="Learn"
          icon={<SproutIcon />}
          badge={completedLessonIds.length || undefined}
        />
        <ReferenceQuickLink
          href="/practice"
          label="Practice"
          icon={<TargetIcon />}
        />
        <ReferenceQuickLink
          href="/exam"
          label="Exam"
          icon={<StarIcon />}
        />
        <ReferenceQuickLink
          href="/profile"
          label="Profile"
          icon={<TrophyIcon />}
        />
      </div>

      <section className="reference-streak-card">
        <div className="reference-streak-heading">
          <span className="reference-streak-icon">
            <FireIcon />
          </span>
          <span>
            <strong>Daily Streak</strong>
            <small>{practicedToday ? "Keep going! You're doing great!" : "A small step today is enough."}</small>
          </span>
          <span className="reference-streak-count">
            <FireIcon /> {profile.streak_current} days
          </span>
        </div>
        <div className="reference-week">
          {WEEK.map((day, index) => {
            const active = index < activeDays;
            return (
              <span key={`${day}-${index}`} className={active ? "is-active" : ""}>
                <b>{active ? <LeafIcon /> : index + 1}</b>
                <small>{day}</small>
              </span>
            );
          })}
        </div>
      </section>

      <section className="reference-quote-card">
        <LeafIcon />
        <div>
          <p>{quote.text_mm}</p>
          <small>{quote.text_en}</small>
        </div>
        <BookIcon />
      </section>

      <div className="reference-home-footer">
        <Link href="/practice" className="reference-primary-button">
          <PlayIcon /> Continue practice
        </Link>
        <span>
          {sessions.length} practice sessions · {completedLessonIds.length} lessons complete
        </span>
      </div>
    </section>
  );
}

function ReferenceQuickLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link href={href} className="reference-quick-link">
      {badge ? <span className="reference-quick-badge">{badge}</span> : null}
      <span className="reference-quick-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
