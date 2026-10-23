"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyStreak,
  BEAD_TARGET,
  MEDITATE_MIN_SECONDS,
  MERIT,
  todayISODate,
  treeStageFromMerit,
} from "./gamification";
import { getPrayer, PRESET_HABIT_PRAYER_IDS } from "./prayers";
import type {
  AppState,
  Goal,
  HabitPlanMode,
  PracticeType,
  Profile,
  WorshipPlan,
} from "./types";

const STORAGE_KEY = "bodhi-path-mvp-v2";
const LEGACY_STORAGE_KEY = "bodhi-path-mvp-v1";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function emptyProfile(partial?: Partial<Profile>): Profile {
  return {
    id: partial?.id ?? uid("user"),
    display_name: partial?.display_name ?? "ယောဂီ",
    goal: partial?.goal ?? null,
    onboarding_complete: partial?.onboarding_complete ?? false,
    merit_points: partial?.merit_points ?? 0,
    streak_current: partial?.streak_current ?? 0,
    streak_longest: partial?.streak_longest ?? 0,
    last_practice_date: partial?.last_practice_date ?? null,
    tree_stage: partial?.tree_stage ?? 0,
    email: partial?.email,
  };
}

function starterWorshipPlan(partial?: Partial<WorshipPlan>): WorshipPlan {
  return {
    id: partial?.id ?? "plan-starter",
    name: partial?.name ?? "Starter",
    time: partial?.time ?? "06:00",
    weekdays: partial?.weekdays ?? [0, 1, 2, 3, 4, 5, 6],
    notifyMinutes: partial?.notifyMinutes ?? 5,
    prayerIds: partial?.prayerIds?.length
      ? partial.prayerIds
      : [...PRESET_HABIT_PRAYER_IDS],
  };
}

function emptyHabitState(): Pick<
  AppState,
  | "habitPlanMode"
  | "habitSelectedPrayerIds"
  | "habitTime"
  | "habitWeekdays"
  | "worshipPlans"
  | "activeWorshipPlanId"
  | "habitCompletions"
  | "worshipDayStarts"
> {
  const starter = starterWorshipPlan();
  return {
    habitPlanMode: "preset",
    habitSelectedPrayerIds: starter.prayerIds,
    habitTime: starter.time,
    habitWeekdays: starter.weekdays,
    worshipPlans: [starter],
    activeWorshipPlanId: starter.id,
    habitCompletions: {},
    worshipDayStarts: {},
  };
}

function emptyAppState(partial?: Partial<AppState>): AppState {
  return {
    profile: null,
    completedLessonIds: [],
    earnedBadgeSlugs: [],
    sessions: [],
    quizAttempts: [],
    ...emptyHabitState(),
    ...partial,
  };
}

function normalizeState(raw: Partial<AppState> | null | undefined): AppState {
  const habits = emptyHabitState();
  const fallbackPlan = starterWorshipPlan({
    time: raw?.habitTime || habits.habitTime,
    weekdays: Array.isArray(raw?.habitWeekdays)
      ? raw.habitWeekdays
      : habits.habitWeekdays,
    prayerIds: raw?.habitSelectedPrayerIds?.length
      ? raw.habitSelectedPrayerIds
      : habits.habitSelectedPrayerIds,
  });
  const worshipPlans = Array.isArray(raw?.worshipPlans)
    ? raw.worshipPlans
    : [fallbackPlan];
  const active =
    worshipPlans.find((plan) => plan.id === raw?.activeWorshipPlanId) ??
    worshipPlans[0];

  return emptyAppState({
    profile: raw?.profile ?? null,
    completedLessonIds: raw?.completedLessonIds ?? [],
    earnedBadgeSlugs: raw?.earnedBadgeSlugs ?? [],
    sessions: raw?.sessions ?? [],
    quizAttempts: raw?.quizAttempts ?? [],
    habitPlanMode: raw?.habitPlanMode ?? habits.habitPlanMode,
    habitSelectedPrayerIds: active?.prayerIds ?? habits.habitSelectedPrayerIds,
    habitTime: active?.time ?? habits.habitTime,
    habitWeekdays: active?.weekdays ?? habits.habitWeekdays,
    worshipPlans,
    activeWorshipPlanId: active?.id ?? "",
    habitCompletions: raw?.habitCompletions ?? {},
    worshipDayStarts:
      raw?.worshipDayStarts && typeof raw.worshipDayStarts === "object"
        ? raw.worshipDayStarts
        : {},
  });
}

function loadState(): AppState {
  if (typeof window === "undefined") {
    return emptyAppState();
  }
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw) as Partial<AppState>);
  } catch {
    /* ignore */
  }
  return emptyAppState();
}

function awardBadges(
  profile: Profile,
  earned: string[],
  events: {
    meditated?: boolean;
    beadsComplete?: boolean;
    lesson?: boolean;
    quiz?: boolean;
  },
): string[] {
  const next = new Set(earned);
  if (events.meditated) next.add("first-sit");
  if (events.beadsComplete) next.add("bead-round");
  if (events.lesson) next.add("scholar");
  if (events.quiz) next.add("exam-ready");
  if (profile.streak_current >= 7) next.add("seven-day");
  return Array.from(next);
}

type StoreValue = {
  ready: boolean;
  profile: Profile | null;
  completedLessonIds: string[];
  earnedBadgeSlugs: string[];
  sessions: AppState["sessions"];
  quizAttempts: AppState["quizAttempts"];
  habitPlanMode: HabitPlanMode;
  habitSelectedPrayerIds: string[];
  habitTime: string;
  habitWeekdays: number[];
  worshipPlans: WorshipPlan[];
  activeWorshipPlanId: string;
  habitCompletions: Record<string, string[]>;
  worshipDayStarts: Record<string, string>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  completeOnboarding: (goal: Goal, displayName: string) => void;
  logPractice: (input: {
    type: PracticeType;
    duration_sec?: number;
    bead_count?: number;
  }) => { merit: number };
  completeLesson: (lessonId: string) => { merit: number; already: boolean };
  submitQuiz: (score: number, total: number) => { merit: number };
  setHabitPlanMode: (mode: HabitPlanMode) => void;
  setHabitSelectedPrayers: (prayerIds: string[]) => void;
  setHabitTime: (time: string) => void;
  toggleHabitWeekday: (day: number) => void;
  toggleHabitCompletion: (prayerId: string) => void;
  startWorshipDay: (planId: string) => void;
  completeWorshipDay: (planId: string) => void;
  restartWorshipDay: (planId: string) => void;
  createWorshipPlan: (input: Omit<WorshipPlan, "id">) => void;
  updateWorshipPlan: (planId: string, input: Omit<WorshipPlan, "id">) => void;
  deleteWorshipPlan: (planId: string) => void;
  setActiveWorshipPlan: (planId: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(emptyAppState());

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const persist = useCallback((updater: (prev: AppState) => AppState) => {
    setState(updater);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      void password;
      persist(() =>
        emptyAppState({
          profile: emptyProfile({
            email,
            display_name: displayName || email.split("@")[0],
            onboarding_complete: false,
          }),
        }),
      );
    },
    [persist],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      void password;
      persist((prev) => {
        if (prev.profile?.email === email) return prev;
        return emptyAppState({
          profile: emptyProfile({
            email,
            display_name: email.split("@")[0],
            onboarding_complete: false,
          }),
        });
      });
    },
    [persist],
  );

  const signOut = useCallback(() => {
    persist(() => emptyAppState());
  }, [persist]);

  const completeOnboarding = useCallback(
    (goal: Goal, displayName: string) => {
      persist((prev) => {
        if (!prev.profile) return prev;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            goal,
            display_name: displayName || prev.profile.display_name,
            onboarding_complete: true,
          },
        };
      });
    },
    [persist],
  );

  const applyMerit = useCallback(
    (
      prev: AppState,
      merit: number,
      badgeEvents: Parameters<typeof awardBadges>[2],
    ): AppState => {
      if (!prev.profile) return prev;
      const streak = applyStreak({
        last_practice_date: prev.profile.last_practice_date,
        streak_current: prev.profile.streak_current,
        streak_longest: prev.profile.streak_longest,
      });
      const merit_points = prev.profile.merit_points + merit;
      const profile: Profile = {
        ...prev.profile,
        merit_points,
        tree_stage: treeStageFromMerit(merit_points),
        last_practice_date: streak.last_practice_date,
        streak_current: streak.streak_current,
        streak_longest: streak.streak_longest,
      };
      return {
        ...prev,
        profile,
        earnedBadgeSlugs: awardBadges(
          profile,
          prev.earnedBadgeSlugs,
          badgeEvents,
        ),
      };
    },
    [],
  );

  const logPractice = useCallback(
    (input: {
      type: PracticeType;
      duration_sec?: number;
      bead_count?: number;
    }) => {
      let awarded = 0;
      if (input.type === "meditate") {
        awarded =
          (input.duration_sec ?? 0) >= MEDITATE_MIN_SECONDS ? MERIT.meditate : 5;
      } else {
        awarded =
          (input.bead_count ?? 0) >= BEAD_TARGET
            ? MERIT.beads
            : Math.min(3, Math.floor((input.bead_count ?? 0) / 36));
      }

      persist((prev) => {
        if (!prev.profile) return prev;
        const next = applyMerit(prev, awarded, {
          meditated: input.type === "meditate",
          beadsComplete: (input.bead_count ?? 0) >= BEAD_TARGET,
        });
        return {
          ...next,
          sessions: [
            {
              id: uid("sess"),
              type: input.type,
              duration_sec: input.duration_sec,
              bead_count: input.bead_count,
              merit_awarded: awarded,
              created_at: new Date().toISOString(),
            },
            ...next.sessions,
          ].slice(0, 50),
        };
      });

      return { merit: awarded };
    },
    [applyMerit, persist],
  );

  const completeLesson = useCallback(
    (lessonId: string) => {
      let merit = 0;
      let already = false;
      persist((prev) => {
        if (!prev.profile) return prev;
        if (prev.completedLessonIds.includes(lessonId)) {
          already = true;
          return prev;
        }
        merit = MERIT.lesson;
        const next = applyMerit(prev, merit, { lesson: true });
        return {
          ...next,
          completedLessonIds: [...next.completedLessonIds, lessonId],
        };
      });
      return { merit, already };
    },
    [applyMerit, persist],
  );

  const submitQuiz = useCallback(
    (score: number, total: number) => {
      const merit = score > 0 ? MERIT.quiz : 0;
      persist((prev) => {
        if (!prev.profile) return prev;
        const next = merit
          ? applyMerit(prev, merit, { quiz: true })
          : {
              ...prev,
              earnedBadgeSlugs: awardBadges(
                prev.profile,
                prev.earnedBadgeSlugs,
                { quiz: true },
              ),
            };
        return {
          ...next,
          quizAttempts: [
            {
              id: uid("quiz"),
              score,
              total,
              merit_awarded: merit,
              created_at: new Date().toISOString(),
            },
            ...next.quizAttempts,
          ].slice(0, 20),
        };
      });
      return { merit };
    },
    [applyMerit, persist],
  );

  const setHabitPlanMode = useCallback(
    (mode: HabitPlanMode) => {
      persist((prev) => ({
        ...prev,
        habitPlanMode: mode,
        habitSelectedPrayerIds:
          mode === "preset"
            ? [...PRESET_HABIT_PRAYER_IDS]
            : prev.habitSelectedPrayerIds.length
              ? prev.habitSelectedPrayerIds
              : [...PRESET_HABIT_PRAYER_IDS],
      }));
    },
    [persist],
  );

  const setHabitTime = useCallback(
    (time: string) => {
      persist((prev) => ({ ...prev, habitTime: time || "06:00" }));
    },
    [persist],
  );

  const toggleHabitWeekday = useCallback(
    (day: number) => {
      persist((prev) => {
        const selected = new Set(prev.habitWeekdays);
        if (selected.has(day)) selected.delete(day);
        else selected.add(day);
        return {
          ...prev,
          habitWeekdays: [0, 1, 2, 3, 4, 5, 6].filter((value) =>
            selected.has(value),
          ),
        };
      });
    },
    [persist],
  );

  const setHabitSelectedPrayers = useCallback(
    (prayerIds: string[]) => {
      persist((prev) => ({
        ...prev,
        habitPlanMode: "custom",
        habitSelectedPrayerIds: prayerIds,
      }));
    },
    [persist],
  );

  const applyActivePlan = (plan: WorshipPlan, prev: AppState): AppState => ({
    ...prev,
    activeWorshipPlanId: plan.id,
    habitTime: plan.time,
    habitWeekdays: plan.weekdays,
    habitSelectedPrayerIds: plan.prayerIds,
    habitPlanMode: plan.id === "plan-starter" ? "preset" : "custom",
  });

  const createWorshipPlan = useCallback(
    (input: Omit<WorshipPlan, "id">) => {
      persist((prev) => {
        const plan: WorshipPlan = {
          ...input,
          id: uid("plan"),
          prayerIds: input.prayerIds.length
            ? input.prayerIds
            : [...PRESET_HABIT_PRAYER_IDS],
          weekdays: input.weekdays.length ? input.weekdays : [0, 1, 2, 3, 4, 5, 6],
          name: input.name.trim() || "My plan",
          notifyMinutes: Math.max(0, input.notifyMinutes),
        };
        const worshipPlans = [...prev.worshipPlans, plan];
        if (prev.worshipPlans.length === 0) {
          return applyActivePlan(plan, { ...prev, worshipPlans });
        }
        return { ...prev, worshipPlans };
      });
    },
    [persist],
  );

  const updateWorshipPlan = useCallback(
    (planId: string, input: Omit<WorshipPlan, "id">) => {
      persist((prev) => {
        const worshipPlans = prev.worshipPlans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                ...input,
                id: planId,
                name: input.name.trim() || plan.name,
                prayerIds: input.prayerIds.length ? input.prayerIds : plan.prayerIds,
                weekdays: input.weekdays.length ? input.weekdays : plan.weekdays,
                notifyMinutes: Math.max(0, input.notifyMinutes),
              }
            : plan,
        );
        const updated = worshipPlans.find((plan) => plan.id === planId);
        if (!updated) return prev;
        if (prev.activeWorshipPlanId === planId) {
          return applyActivePlan(updated, { ...prev, worshipPlans });
        }
        return { ...prev, worshipPlans };
      });
    },
    [persist],
  );

  const deleteWorshipPlan = useCallback(
    (planId: string) => {
      persist((prev) => {
        const worshipPlans = prev.worshipPlans.filter((plan) => plan.id !== planId);
        if (prev.activeWorshipPlanId !== planId) {
          return { ...prev, worshipPlans };
        }
        const next = worshipPlans[0];
        if (!next) {
          return { ...prev, worshipPlans, activeWorshipPlanId: "" };
        }
        return applyActivePlan(next, { ...prev, worshipPlans });
      });
    },
    [persist],
  );

  const setActiveWorshipPlan = useCallback(
    (planId: string) => {
      persist((prev) => {
        const plan = prev.worshipPlans.find((item) => item.id === planId);
        if (!plan) return prev;
        return applyActivePlan(plan, prev);
      });
    },
    [persist],
  );

  const toggleHabitCompletion = useCallback(
    (prayerId: string) => {
      persist((prev) => {
        if (!prev.profile) return prev;
        const today = todayISODate();
        const current = new Set(prev.habitCompletions[today] ?? []);
        const wasEmpty = current.size === 0;
        if (current.has(prayerId)) current.delete(prayerId);
        else current.add(prayerId);

        const habitCompletions = {
          ...prev.habitCompletions,
          [today]: Array.from(current),
        };

        // First habit completion of the day advances the practice streak.
        if (wasEmpty && current.size > 0) {
          const streak = applyStreak({
            last_practice_date: prev.profile.last_practice_date,
            streak_current: prev.profile.streak_current,
            streak_longest: prev.profile.streak_longest,
          });
          return {
            ...prev,
            habitCompletions,
            profile: {
              ...prev.profile,
              last_practice_date: streak.last_practice_date,
              streak_current: streak.streak_current,
              streak_longest: streak.streak_longest,
            },
            earnedBadgeSlugs: awardBadges(
              {
                ...prev.profile,
                streak_current: streak.streak_current,
              },
              prev.earnedBadgeSlugs,
              {},
            ),
          };
        }

        return { ...prev, habitCompletions };
      });
    },
    [persist],
  );

  const startWorshipDay = useCallback(
    (planId: string) => {
      persist((prev) => {
        const plan = prev.worshipPlans.find((item) => item.id === planId);
        if (!plan) return prev;
        const key = `${todayISODate()}:${planId}`;
        if (prev.worshipDayStarts[key]) return prev;
        return {
          ...prev,
          worshipDayStarts: {
            ...prev.worshipDayStarts,
            [key]: new Date().toISOString(),
          },
        };
      });
    },
    [persist],
  );

  const completeWorshipDay = useCallback(
    (planId: string) => {
      persist((prev) => {
        if (!prev.profile) return prev;
        const plan = prev.worshipPlans.find((item) => item.id === planId);
        if (!plan) return prev;
        const today = todayISODate();
        const key = `${today}:${planId}`;
        const startedAt = prev.worshipDayStarts[key];
        if (!startedAt) return prev;
        const latestSession = prev.sessions.find(
          (session) =>
            session.type === "worship" &&
            session.worship_plan_id === planId &&
            session.created_at.slice(0, 10) === today,
        );
        const roundFinished = Boolean(
          latestSession && latestSession.created_at >= startedAt,
        );

        const previousIds = prev.habitCompletions[today] ?? [];
        const prayerIds = plan.prayerIds.map((id) => getPrayer(id)?.id ?? id);
        const completedIds = Array.from(new Set([...previousIds, ...prayerIds]));
        const habitCompletions = {
          ...prev.habitCompletions,
          [today]: completedIds,
        };
        let next: AppState = { ...prev, habitCompletions };
        if (previousIds.length === 0 && completedIds.length > 0) {
          const streak = applyStreak({
            last_practice_date: prev.profile.last_practice_date,
            streak_current: prev.profile.streak_current,
            streak_longest: prev.profile.streak_longest,
          });
          next = {
            ...next,
            profile: {
              ...prev.profile,
              last_practice_date: streak.last_practice_date,
              streak_current: streak.streak_current,
              streak_longest: streak.streak_longest,
            },
            earnedBadgeSlugs: awardBadges(
              { ...prev.profile, streak_current: streak.streak_current },
              prev.earnedBadgeSlugs,
              {},
            ),
          };
        }
        if (roundFinished) return next;
        return {
          ...next,
          sessions: [
            {
              id: uid("sess"),
              type: "worship" as const,
              merit_awarded: 0,
              worship_plan_id: plan.id,
              worship_plan_name: plan.name,
              created_at: new Date().toISOString(),
            },
            ...next.sessions,
          ].slice(0, 50),
        };
      });
    },
    [persist],
  );

  const restartWorshipDay = useCallback(
    (planId: string) => {
      persist((prev) => {
        const plan = prev.worshipPlans.find((item) => item.id === planId);
        if (!plan) return prev;
        const today = todayISODate();
        const key = `${today}:${planId}`;
        if (!prev.worshipDayStarts[key]) return prev;
        const prayerIds = new Set(
          plan.prayerIds.map((id) => getPrayer(id)?.id ?? id),
        );
        const { [key]: _startedAt, ...worshipDayStarts } = prev.worshipDayStarts;
        return {
          ...prev,
          worshipDayStarts,
          habitCompletions: {
            ...prev.habitCompletions,
            [today]: (prev.habitCompletions[today] ?? []).filter(
              (id) => !prayerIds.has(id),
            ),
          },
        };
      });
    },
    [persist],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      profile: state.profile,
      completedLessonIds: state.completedLessonIds,
      earnedBadgeSlugs: state.earnedBadgeSlugs,
      sessions: state.sessions,
      quizAttempts: state.quizAttempts,
      habitPlanMode: state.habitPlanMode,
      habitSelectedPrayerIds: state.habitSelectedPrayerIds,
      habitTime: state.habitTime,
      habitWeekdays: state.habitWeekdays,
      worshipPlans: state.worshipPlans,
      activeWorshipPlanId: state.activeWorshipPlanId,
      habitCompletions: state.habitCompletions,
      worshipDayStarts: state.worshipDayStarts,
      signUp,
      signIn,
      signOut,
      completeOnboarding,
      logPractice,
      completeLesson,
      submitQuiz,
      setHabitPlanMode,
      setHabitSelectedPrayers,
      setHabitTime,
      toggleHabitWeekday,
      toggleHabitCompletion,
      startWorshipDay,
      completeWorshipDay,
      restartWorshipDay,
      createWorshipPlan,
      updateWorshipPlan,
      deleteWorshipPlan,
      setActiveWorshipPlan,
    }),
    [
      ready,
      state,
      signUp,
      signIn,
      signOut,
      completeOnboarding,
      logPractice,
      completeLesson,
      submitQuiz,
      setHabitPlanMode,
      setHabitSelectedPrayers,
      setHabitTime,
      toggleHabitWeekday,
      toggleHabitCompletion,
      startWorshipDay,
      completeWorshipDay,
      restartWorshipDay,
      createWorshipPlan,
      updateWorshipPlan,
      deleteWorshipPlan,
      setActiveWorshipPlan,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
