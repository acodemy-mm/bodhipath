"use client";

import Link from "next/link";
import {
  BadgeGrid,
  EmptyState,
  PageHeader,
  SectionHeading,
  StreakCard,
  Surface,
  StatCard,
} from "@/components/gamification-ui";
import { createGamificationSnapshot } from "@/lib/gamification-view";
import { useAppStore } from "@/lib/store";
import { BodhiTree } from "@/components/bodhi-tree";
import { TrophyIcon } from "@/components/reference-icons";

export default function ProfilePage() {
  const {
    profile,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
    completedLessonIds,
    signOut,
  } = useAppStore();

  if (!profile) return null;

  const snapshot = createGamificationSnapshot({
    profile,
    completedLessonIds,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
  });
  if (!snapshot) return null;

  const activity = [
    ...sessions.map((session) => ({
      id: session.id,
      date: session.created_at,
      label:
        session.type === "meditate"
          ? "တရားထိုင်"
          : session.type === "worship"
            ? session.worship_plan_name || "Worship"
            : "ပုတီး",
      detail:
        session.type === "worship"
          ? "Completed · 1 time"
          : `+${session.merit_awarded} merit`,
    })),
    ...quizAttempts.map((attempt) => ({
      id: attempt.id,
      date: attempt.created_at,
      label: "စာမေး",
      detail: `${attempt.score}/${attempt.total} · +${attempt.merit_awarded} merit`,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <section className="gamify-page section-page animate-grow-in">
      <PageHeader
        title="ပရိုဖိုင် · Profile"
        description={`${profile.display_name} · ${snapshot.tree.en}`}
      />

      <Surface strong className="grid justify-items-center gap-3 p-5 text-center">
        <p className="text-xl text-cream">{profile.display_name}</p>
        <p className="text-sm text-text-tertiary">{profile.email}</p>
        <p className="text-sm text-accent-merit-soft">
          ရည်မှန်းချက်:{" "}
          {profile.goal === "meditation"
            ? "တရားထိုင်ခြင်း"
            : profile.goal === "exam"
              ? "စာမေးပွဲ"
              : "နှစ်မျိုးလုံး"}
        </p>
        <BodhiTree
          stage={snapshot.stage}
          merit={snapshot.merit}
          className="scale-90"
        />
        <p className="text-sm text-text-secondary">
          {snapshot.tree.mm} · Level {snapshot.level}
        </p>
      </Surface>

      <div className="gamify-stat-grid">
        <StatCard label="Merit" value={snapshot.merit} />
        <StatCard
          label="သင်ခန်းစာ"
          value={`${snapshot.completedLessonCount}/${snapshot.lessonTotal}`}
        />
        <StatCard label="လေ့ကျင့်မှု" value={snapshot.practiceSessionCount} />
      </div>

      <StreakCard
        current={snapshot.currentStreak}
        longest={snapshot.longestStreak}
        week={snapshot.week}
      />

      <section className="grid gap-3">
        <SectionHeading>
          <TrophyIcon /> တံဆိပ်များ · Badges
        </SectionHeading>
        <BadgeGrid badges={snapshot.badges} />
      </section>

      <section className="grid gap-3">
        <SectionHeading>မကြာသေးမီ လုပ်ဆောင်ချက်</SectionHeading>
        {activity.length === 0 ? (
          <EmptyState>မရှိသေးပါ — လေ့ကျင့်မှု စတင်ပါ။</EmptyState>
        ) : (
          <div className="grid gap-2">
            {activity.map((item) => (
              <Surface key={item.id} muted className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="text-sm text-cream">{item.label}</span>
                <span className="text-right text-xs text-text-tertiary">
                  <span className="block">{item.detail}</span>
                  <span className="block">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </span>
              </Surface>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2 pt-2">
        <Link
          href="/home"
          className="gamify-button gamify-button--secondary"
        >
          အိမ်သို့
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            window.location.href = "/";
          }}
          className="gamify-button gamify-button--quiet"
        >
          ထွက်ရန် · Sign out
        </button>
      </div>
    </section>
  );
}
