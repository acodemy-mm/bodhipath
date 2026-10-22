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
import { PRESET_HABIT_PRAYER_IDS } from "./prayers";
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
  const worshipPlans = raw?.worshipPlans?.length
    ? raw.worshipPlans
    : [fallbackPlan];
  const activeWorshipPlanId = worshipPlans.some(
    (plan) => plan.id === raw?.activeWorshipPlanId,
  )
    ? raw!.activeWorshipPlanId!
    : worshipPlans[0].id;
  const active =
    worshipPlans.find((plan) => plan.id === activeWorshipPlanId) ??
    worshipPlans[0];

  return emptyAppState({
    profile: raw?.profile ?? null,
    completedLessonIds: raw?.completedLessonIds ?? [],
    earnedBadgeSlugs: raw?.earnedBadgeSlugs ?? [],
    sessions: raw?.sessions ?? [],
    quizAttempts: raw?.quizAttempts ?? [],
    habitPlanMode: raw?.habitPlanMode ?? habits.habitPlanMode,
    habitSelectedPrayerIds: active.prayerIds,
    habitTime: active.time,
    habitWeekdays: active.weekdays,
    worshipPlans,
    activeWorshipPlanId: active.id,
    habitCompletions: raw?.habitCompletions ?? {},
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
  createWorshipPlan: (input: Omit<WorshipPlan, "id">) => void;
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
        return applyActivePlan(plan, {
          ...prev,
          worshipPlans: [...prev.worshipPlans, plan],
        });
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
      createWorshipPlan,
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
      createWorshipPlan,
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
