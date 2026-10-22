"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Surface } from "@/components/gamification-ui";
import { BellIcon, BookIcon } from "@/components/reference-icons";
import { PRAYER_DOCUMENTS, PRESET_HABIT_PRAYER_IDS } from "@/lib/prayers";
import { useAppStore } from "@/lib/store";

const PLAN_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;

function formatClock(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function WorshipPlansPage() {
  const router = useRouter();
  const {
    profile,
    worshipPlans,
    activeWorshipPlanId,
    createWorshipPlan,
    setActiveWorshipPlan,
  } = useAppStore();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("06:30");
  const [notifyMinutes, setNotifyMinutes] = useState(5);
  const [weekdays, setWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [prayerIds, setPrayerIds] = useState<string[]>([
    ...PRESET_HABIT_PRAYER_IDS,
  ]);

  if (!profile) return null;

  function toggleDay(day: number) {
    setWeekdays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  }

  function togglePrayer(prayerId: string) {
    setPrayerIds((current) =>
      current.includes(prayerId)
        ? current.filter((id) => id !== prayerId)
        : [...current, prayerId],
    );
  }

  function savePlan() {
    if (!name.trim() || prayerIds.length === 0 || weekdays.length === 0) return;
    createWorshipPlan({
      name,
      time,
      weekdays,
      notifyMinutes,
      prayerIds,
    });
    router.push("/home");
  }

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Worship plans"
        description="Create a plan and follow it in your habit tracker"
      />

      <div className="grid gap-2">
        {worshipPlans.map((plan) => {
          const active = plan.id === activeWorshipPlanId;
          return (
            <button
              key={plan.id}
              type="button"
              className={`worship-plan-card ${active ? "is-active" : ""}`}
              onClick={() => setActiveWorshipPlan(plan.id)}
            >
              <div className="worship-plan-summary__top">
                <span className="worship-plan-time">{formatClock(plan.time)}</span>
                <span className="worship-plan-card__days">
                  {PLAN_DAYS.filter((_, day) => plan.weekdays.includes(day)).join(
                    " ",
                  )}
                </span>
              </div>
              <strong>{plan.name}</strong>
              <small>
                Notify {plan.notifyMinutes} min before · {plan.prayerIds.length}{" "}
                prayers
                {active ? " · Active habit" : ""}
              </small>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="gamify-button gamify-button--primary"
        onClick={() => setCreating((value) => !value)}
      >
        {creating ? "Close form" : "Create plan"}
      </button>

      {creating ? (
        <Surface className="grid gap-4 p-4">
          <label className="grid gap-1.5 text-sm">
            Plan name
            <input
              className="gamify-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Morning practice"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm">
              Time
              <input
                className="gamify-input"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              Notify before
              <select
                className="gamify-input"
                value={notifyMinutes}
                onChange={(event) => setNotifyMinutes(Number(event.target.value))}
              >
                {[0, 5, 10, 15, 30].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} min
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="reference-habit-days" role="group" aria-label="Plan days">
            {PLAN_DAYS.map((label, day) => (
              <button
                key={label}
                type="button"
                className={weekdays.includes(day) ? "is-active" : ""}
                aria-pressed={weekdays.includes(day)}
                onClick={() => toggleDay(day)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-cream">Prayer documents</p>
            {PRAYER_DOCUMENTS.map((prayer) => (
              <label key={prayer.id} className="reference-habit-pick">
                <input
                  type="checkbox"
                  checked={prayerIds.includes(prayer.id)}
                  onChange={() => togglePrayer(prayer.id)}
                />
                <span>
                  <strong>{prayer.title_mm}</strong>
                  <small>{prayer.title_en}</small>
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            className="gamify-button gamify-button--primary"
            onClick={savePlan}
            disabled={!name.trim() || prayerIds.length === 0 || weekdays.length === 0}
          >
            Save and use as habit
          </button>
        </Surface>
      ) : null}

      <Surface muted className="grid gap-2 p-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-cream">
          <BookIcon /> Others
        </p>
        <p className="text-sm text-text-secondary">
          Browse the full Buddhism prayer document list, then add items to a plan.
        </p>
        <Link href="/prayers" className="text-sm text-accent-merit-soft">
          View prayer documents
        </Link>
      </Surface>

      <p className="inline-flex items-center gap-2 text-xs text-text-tertiary">
        <BellIcon /> The active plan is the checklist on Home.
      </p>
    </section>
  );
}
