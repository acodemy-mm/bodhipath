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
  treeStageFromMerit,
} from "./gamification";
import type {
  AppState,
  Goal,
  PracticeType,
  Profile,
} from "./types";

const STORAGE_KEY = "bodhi-path-mvp-v1";

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

function loadState(): AppState {
  if (typeof window === "undefined") {
    return {
      profile: null,
      completedLessonIds: [],
      earnedBadgeSlugs: [],
      sessions: [],
      quizAttempts: [],
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* ignore */
  }
  return {
    profile: null,
    completedLessonIds: [],
    earnedBadgeSlugs: [],
    sessions: [],
    quizAttempts: [],
  };
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
};

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>({
    profile: null,
    completedLessonIds: [],
    earnedBadgeSlugs: [],
    sessions: [],
    quizAttempts: [],
  });

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
      void password; // demo mode: password accepted for UX parity with Supabase
      persist(() => ({
        profile: emptyProfile({
          email,
          display_name: displayName || email.split("@")[0],
          onboarding_complete: false,
        }),
        completedLessonIds: [],
        earnedBadgeSlugs: [],
        sessions: [],
        quizAttempts: [],
      }));
    },
    [persist],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      void password;
      persist((prev) => {
        if (prev.profile?.email === email) return prev;
        return {
          profile: emptyProfile({
            email,
            display_name: email.split("@")[0],
            onboarding_complete: false,
          }),
          completedLessonIds: [],
          earnedBadgeSlugs: [],
          sessions: [],
          quizAttempts: [],
        };
      });
    },
    [persist],
  );

  const signOut = useCallback(() => {
    persist(() => ({
      profile: null,
      completedLessonIds: [],
      earnedBadgeSlugs: [],
      sessions: [],
      quizAttempts: [],
    }));
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
          (input.bead_count ?? 0) >= BEAD_TARGET ? MERIT.beads : Math.min(3, Math.floor((input.bead_count ?? 0) / 36));
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
              earnedBadgeSlugs: awardBadges(prev.profile, prev.earnedBadgeSlugs, {
                quiz: true,
              }),
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

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      profile: state.profile,
      completedLessonIds: state.completedLessonIds,
      earnedBadgeSlugs: state.earnedBadgeSlugs,
      sessions: state.sessions,
      quizAttempts: state.quizAttempts,
      signUp,
      signIn,
      signOut,
      completeOnboarding,
      logPractice,
      completeLesson,
      submitQuiz,
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
