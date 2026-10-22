"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookIcon,
  ChestIcon,
  FireIcon,
  LeafIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  BellIcon,
} from "@/components/reference-icons";
import { quoteOfDay } from "@/lib/content";
import { TREE_THRESHOLDS, todayISODate } from "@/lib/gamification";
import { getPrayersByIds } from "@/lib/prayers";
import { useAppStore } from "@/lib/store";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const PLAN_DAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

function formatClock(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function HomePage() {
  const {
    profile,
    earnedBadgeSlugs,
    worshipPlans,
    activeWorshipPlanId,
    habitCompletions,
    toggleHabitCompletion,
  } = useAppStore();
  const quote = quoteOfDay();

  const todayKey = todayISODate();
  const todayWeekday = new Date().getDay();
  const activePlan =
    worshipPlans.find((plan) => plan.id === activeWorshipPlanId) ??
    worshipPlans[0];
  const scheduledToday = activePlan
    ? activePlan.weekdays.includes(todayWeekday)
    : false;
  const todayDone = habitCompletions[todayKey] ?? [];

  const activePrayerIds = useMemo(
    () => activePlan?.prayerIds ?? [],
    [activePlan],
  );

  const habitPrayers = useMemo(
    () => getPrayersByIds(activePrayerIds),
    [activePrayerIds],
  );

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
  const practicedToday = profile.last_practice_date === todayKey;
  const activeDays = Math.min(7, profile.streak_current);
  const doneCount = habitPrayers.filter((prayer) =>
    todayDone.includes(prayer.id),
  ).length;

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
          href="/notifications"
          className="reference-avatar"
          aria-label="Open notifications"
        >
          <BellIcon />
          <span className="reference-avatar-badge" aria-hidden>
            2
          </span>
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

      <section className="reference-habit-card">
        <div className="reference-habit-heading">
          <strong>Worship plans</strong>
          <Link href="/worship-plans">See all</Link>
        </div>

        {activePlan ? (
          <div className="worship-plan-summary">
            <div className="worship-plan-summary__top">
              <span className="worship-plan-time">{formatClock(activePlan.time)}</span>
              <div className="reference-habit-days" aria-label="Plan days">
                {PLAN_DAYS.map((label, day) => (
                  <span
                    key={`${label}-${day}`}
                    className={
                      activePlan.weekdays.includes(day) ? "is-active" : ""
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <h2>{activePlan.name}</h2>
            <p>
              <BellIcon /> Notify {activePlan.notifyMinutes} min before
              <span>
                <BookIcon /> {activePlan.prayerIds.length} Prayers
              </span>
            </p>
          </div>
        ) : null}

        <div className="worship-plan-progress">
          Habit tracker · {doneCount}/{habitPrayers.length} complete today
        </div>

        {!scheduledToday ? (
          <p className="reference-habit-rest">
            This plan is not scheduled today.
          </p>
        ) : (
          <ul className="reference-habit-list">
            {habitPrayers.map((prayer) => {
              const checked = todayDone.includes(prayer.id);
              return (
                <li key={prayer.id}>
                  <label
                    className={`reference-habit-item ${checked ? "is-done" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleHabitCompletion(prayer.id)}
                    />
                    <span>
                      <strong>{prayer.title_mm}</strong>
                      <small>{prayer.title_en}</small>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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

      <section className="reference-home-quote" aria-label="Daily quote">
        <p>&ldquo;{quote.text_mm}&rdquo;</p>
        <small>{quote.text_en}</small>
      </section>

      <div className="reference-quick-grid">
        <ReferenceQuickLink
          href="/prayers"
          label="Prayers"
          icon={<BookIcon />}
        />
        <ReferenceQuickLink
          href="/practice/flashcards"
          label="Flashcards"
          icon={<TargetIcon />}
        />
        <ReferenceQuickLink
          href="/dictionary"
          label="Dictionary"
          icon={<StarIcon />}
        />
        <ReferenceQuickLink
          href="/leaderboard"
          label="Leaderboard"
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
            <small>
              {practicedToday
                ? "Keep going! You're doing great!"
                : "A small step today is enough."}
            </small>
          </span>
          <span className="reference-streak-count">
            <FireIcon /> {profile.streak_current} days
          </span>
        </div>
        <div className="reference-week">
          {WEEK.map((day, index) => {
            const active = index < activeDays;
            return (
              <span
                key={`${day}-${index}`}
                className={active ? "is-active" : ""}
              >
                <b>{active ? <LeafIcon /> : index + 1}</b>
                <small>{day}</small>
              </span>
            );
          })}
        </div>
      </section>
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
