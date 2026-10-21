"use client";

import Link from "next/link";
import { BADGES } from "@/lib/content";
import { useAppStore } from "@/lib/store";
import { BodhiTree } from "@/components/bodhi-tree";
import { treeLabel } from "@/lib/gamification";

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

  const label = treeLabel(profile.tree_stage);

  return (
    <section className="animate-grow-in">
      <h1 className="font-display text-3xl text-gold-soft">
        ပရိုဖိုင် · Profile
      </h1>

      <div className="mt-6 rounded-2xl border border-mist bg-bg-soft/40 p-6 text-center">
        <p className="text-xl text-cream">{profile.display_name}</p>
        <p className="text-sm text-cream/50">{profile.email}</p>
        <p className="mt-2 text-sm text-gold-soft">
          ရည်မှန်းချက်:{" "}
          {profile.goal === "meditation"
            ? "တရားထိုင်ခြင်း"
            : profile.goal === "exam"
              ? "စာမေးပွဲ"
              : "နှစ်မျိုးလုံး"}
        </p>
        <BodhiTree
          stage={profile.tree_stage}
          merit={profile.merit_points}
          className="mt-4 scale-90"
        />
        <p className="text-sm text-cream/60">
          {label.mm} · စတြိက် {profile.streak_current} (အရှည်ဆုံး{" "}
          {profile.streak_longest})
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Merit" value={String(profile.merit_points)} />
        <Stat label="သင်ခန်းစာ" value={String(completedLessonIds.length)} />
        <Stat label="လေ့ကျင့်မှု" value={String(sessions.length)} />
      </div>

      <h2 className="font-display mt-10 text-lg text-gold-soft">တံဆိပ်များ</h2>
      <ul className="mt-3 space-y-2">
        {BADGES.map((b) => {
          const earned = earnedBadgeSlugs.includes(b.slug);
          return (
            <li
              key={b.slug}
              className={`rounded-xl border px-4 py-3 ${
                earned
                  ? "border-gold/40 bg-leaf/20"
                  : "border-mist/40 bg-bg-deep/30 opacity-50"
              }`}
            >
              <p className="text-cream">{b.title_mm}</p>
              <p className="text-xs text-cream/55">
                {b.title_en} — {b.description_mm}
              </p>
            </li>
          );
        })}
      </ul>

      <h2 className="font-display mt-10 text-lg text-gold-soft">
        မကြာသေးမီ လုပ်ဆောင်ချက်
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-cream/70">
        {sessions.slice(0, 5).map((s) => (
          <li key={s.id} className="rounded-lg bg-mist/40 px-3 py-2">
            {s.type === "meditate" ? "တရားထိုင်" : "ပုတီး"} · +{s.merit_awarded}{" "}
            · {new Date(s.created_at).toLocaleString()}
          </li>
        ))}
        {quizAttempts.slice(0, 3).map((q) => (
          <li key={q.id} className="rounded-lg bg-mist/40 px-3 py-2">
            စာမေး {q.score}/{q.total} · +{q.merit_awarded}
          </li>
        ))}
        {sessions.length === 0 && quizAttempts.length === 0 && (
          <li className="text-cream/45">မရှိသေးပါ — လေ့ကျင့်မှု စတင်ပါ။</li>
        )}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/home"
          className="rounded-xl border border-mist px-5 py-2 text-cream"
        >
          အိမ်သို့
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            window.location.href = "/";
          }}
          className="rounded-xl bg-mist px-5 py-2 text-cream/80"
        >
          ထွက်ရန် · Sign out
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-mist bg-bg-soft/30 px-4 py-3 text-center">
      <p className="font-display text-2xl text-gold-soft">{value}</p>
      <p className="text-xs text-cream/55">{label}</p>
    </div>
  );
}
