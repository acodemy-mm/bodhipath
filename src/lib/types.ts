export type Goal = "meditation" | "exam" | "both";

export type PracticeType = "meditate" | "beads" | "worship";

export type ModuleTrack = "vipassana" | "abhidhamma" | "pali";

export interface Profile {
  id: string;
  display_name: string;
  goal: Goal | null;
  onboarding_complete: boolean;
  merit_points: number;
  streak_current: number;
  streak_longest: number;
  last_practice_date: string | null;
  tree_stage: number;
  email?: string;
}

export interface Module {
  id: string;
  slug: string;
  title_mm: string;
  title_en: string;
  track: ModuleTrack;
  order_index: number;
  unlock_merit: number;
  description_mm: string;
  description_en: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  module_slug: string;
  slug: string;
  title_mm: string;
  title_en: string;
  content: string;
  duration_mins: number;
  order_index: number;
}

export interface Quote {
  id: string;
  text_mm: string;
  text_en: string;
}

export interface Badge {
  id: string;
  slug: string;
  title_mm: string;
  title_en: string;
  description_mm: string;
  description_en: string;
}

export interface QuizQuestion {
  id: string;
  prompt_mm: string;
  prompt_en: string;
  choices: string[];
  correct_index: number;
  explanation_mm: string;
  explanation_en: string;
  order_index: number;
}

export interface PracticeSession {
  id: string;
  type: PracticeType;
  duration_sec?: number;
  bead_count?: number;
  merit_awarded: number;
  worship_plan_id?: string;
  worship_plan_name?: string;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  total: number;
  merit_awarded: number;
  created_at: string;
}

export type HabitPlanMode = "preset" | "custom";

export interface WorshipPlan {
  id: string;
  name: string;
  /** Local time as HH:mm */
  time: string;
  /** Weekdays starting Sunday: 0=SU … 6=SA */
  weekdays: number[];
  notifyMinutes: number;
  prayerIds: string[];
}

export interface AppState {
  profile: Profile | null;
  completedLessonIds: string[];
  earnedBadgeSlugs: string[];
  sessions: PracticeSession[];
  quizAttempts: QuizAttempt[];
  habitPlanMode: HabitPlanMode;
  habitSelectedPrayerIds: string[];
  /** Local time as HH:mm */
  habitTime: string;
  /** Weekdays starting Sunday: 0=S … 6=S */
  habitWeekdays: number[];
  worshipPlans: WorshipPlan[];
  activeWorshipPlanId: string;
  /** Map of local YYYY-MM-DD → completed prayer document ids */
  habitCompletions: Record<string, string[]>;
  /** Map of YYYY-MM-DD:planId → ISO start time for the current worship round */
  worshipDayStarts: Record<string, string>;
}
