import type { Badge, Lesson, Module, QuizQuestion, Quote } from "./types";

export const MODULES: Module[] = [
  {
    id: "m1",
    slug: "anapana",
    title_mm: "အာနာပါန",
    title_en: "Anapana",
    track: "vipassana",
    order_index: 1,
    unlock_merit: 0,
    description_mm: "ထွက်သက်ဝင်သက်ကို အာရုံပြုခြင်း",
    description_en: "Mindfulness of breathing",
  },
  {
    id: "m2",
    slug: "kaya",
    title_mm: "ကာယာနုပဿနာ",
    title_en: "Kayānupassanā",
    track: "vipassana",
    order_index: 2,
    unlock_merit: 50,
    description_mm: "ခန္ဓာကိုယ်ကို ရှုမှတ်ခြင်း",
    description_en: "Contemplation of the body",
  },
  {
    id: "m3",
    slug: "vedana",
    title_mm: "ဝေဒနာနုပဿနာ",
    title_en: "Vedanānupassanā",
    track: "vipassana",
    order_index: 3,
    unlock_merit: 150,
    description_mm: "ခံစားမှုကို ရှုမှတ်ခြင်း",
    description_en: "Contemplation of feelings",
  },
  {
    id: "m4",
    slug: "abhidhamma-intro",
    title_mm: "အဘိဓမ္မာ အခြေခံ",
    title_en: "Abhidhamma Basics",
    track: "abhidhamma",
    order_index: 4,
    unlock_merit: 100,
    description_mm: "စိတ်၊ စေတသိက် အကျဉ်း",
    description_en: "Mind and mental factors intro",
  },
  {
    id: "m5",
    slug: "pali-basics",
    title_mm: "ပါဠိ အခြေခံ",
    title_en: "Pali Basics",
    track: "pali",
    order_index: 5,
    unlock_merit: 80,
    description_mm: "ပါဠိစကားလုံးနှင့် သဒ္ဒါ အတို",
    description_en: "Basic Pali vocabulary",
  },
];

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    module_id: "m1",
    module_slug: "anapana",
    slug: "breath-basics",
    title_mm: "ထွက်သက်ဝင်သက်",
    title_en: "Breath Basics",
    content: `## အာနာပါန အခြေခံ

ထိုင်ရာတွင် ကျောရိုးကို တည့်မတ်စွာ ထားပါ။ နှာခေါင်းဖျားတွင် လေထွက်လေဝင်ကို သတိပြုပါ။

1. ဝင်သက်ကို သိ
2. ထွက်သက်ကို သိ
3. စိတ်လွင့်သွားလျှင် ပြန်ယူလာပါ

နေ့စဉ် ၅–၁၀ မိနစ် စတင်ပါ။`,
    duration_mins: 8,
    order_index: 1,
  },
  {
    id: "l2",
    module_id: "m1",
    module_slug: "anapana",
    slug: "counting-breath",
    title_mm: "ရေတွက်ခြင်း",
    title_en: "Counting Breath",
    content: `## ရေတွက်နည်း

ဝင်သက်–ထွက်သက် တစ်စုံကို ၁ ဟု ရေတွက်ပါ။ ၁ မှ ၁၀ အထိ ရောက်လျှင် ၁ သို့ ပြန်စပါ။

ရေတွက်မှားလျှင် ပြန်စပါ—ဒေါသမထားဘဲ ပြန်စတင်ခြင်းသည် လေ့ကျင့်မှု ဖြစ်သည်။`,
    duration_mins: 10,
    order_index: 2,
  },
  {
    id: "l3",
    module_id: "m2",
    module_slug: "kaya",
    slug: "posture-awareness",
    title_mm: "ကိုယ်အနေအထား",
    title_en: "Posture Awareness",
    content: `## ကာယာနုပဿနာ

ထိုင်၊ ရပ်၊ လမ်းလျှောက်၊ လဲလျောင်း—ကိုယ်အနေအထားကို သိအောင် ရှုပါ။

“ထိုင်နေသည်”, “လမ်းလျှောက်နေသည်” ဟု စိတ်ထဲတွင် တိတိကျကျ သိပါ။`,
    duration_mins: 12,
    order_index: 1,
  },
  {
    id: "l4",
    module_id: "m3",
    module_slug: "vedana",
    slug: "feeling-tone",
    title_mm: "ခံစားမှုအရသာ",
    title_en: "Feeling Tone",
    content: `## ဝေဒနာ

သုခ၊ ဒုက္ခ၊ ဥပေက္ခာ—ခံစားမှု သုံးမျိုးကို စောင့်ကြည့်ပါ။

မဖမ်းမဆုပ်။ ပေါ်လာသည်ကို မြင်၊ ပျောက်သွားသည်ကို မြင်။`,
    duration_mins: 15,
    order_index: 1,
  },
  {
    id: "l5",
    module_id: "m4",
    module_slug: "abhidhamma-intro",
    slug: "citta-overview",
    title_mm: "စိတ် အကျဉ်း",
    title_en: "Citta Overview",
    content: `## စိတ် (Citta)

အဘိဓမ္မာတွင် စိတ်သည် အာရုံကို သိသော သဘောဖြစ်သည်။ စေတသိက်များနှင့် အတူတကွ ဖြစ်ပေါ်သည်။

ယနေ့ — “သိခြင်း” ကို သတိပြုပါ။`,
    duration_mins: 10,
    order_index: 1,
  },
  {
    id: "l6",
    module_id: "m5",
    module_slug: "pali-basics",
    slug: "greetings",
    title_mm: "နှုတ်ဆက်စကား",
    title_en: "Greetings",
    content: `## ပါဠိ စကားလုံး

- **Namo** — ရှိခိုးပါ၏
- **Buddho** — ဘုရား
- **Dhammo** — တရား
- **Sangho** — သံဃာ

“Namo tassa bhagavato arahato sammāsambuddhassa” ကို ဖြည်းဖြည်း ရွတ်ဆို ကြည့်ပါ။`,
    duration_mins: 8,
    order_index: 1,
  },
];

export const QUOTES: Quote[] = [
  {
    id: "q1",
    text_mm: "စိတ်ကို စောင့်ရှောက်သူသည် မိမိကိုယ်ကို စောင့်ရှောက်သူ ဖြစ်၏။",
    text_en: "One who guards the mind guards oneself.",
  },
  {
    id: "q2",
    text_mm: "အနည်းငယ်သော ကုသိုလ်သည်လည်း အကျိုးကြီးနိုင်၏။",
    text_en: "Even a little merit can bear great fruit.",
  },
  {
    id: "q3",
    text_mm: "ယနေ့ တစ်မိနစ် တရားထိုင်ခြင်းသည် မနက်ဖြန်၏ အစ ဖြစ်၏။",
    text_en: "One minute of practice today is the start of tomorrow.",
  },
  {
    id: "q4",
    text_mm: "ဒေါသကို မေတ္တာဖြင့် အောင်နိုင်၏။",
    text_en: "Anger is conquered by loving-kindness.",
  },
  {
    id: "q5",
    text_mm: "သတိရှိသောသူသည် ပျော်ရွှင်၏။",
    text_en: "The mindful one lives happily.",
  },
];

export const BADGES: Badge[] = [
  {
    id: "b1",
    slug: "first-sit",
    title_mm: "ပထမဆုံး ထိုင်ခြင်း",
    title_en: "First Sit",
    description_mm: "ပထမဆုံး တရားထိုင်မှု ပြီးမြောက်ခြင်း",
    description_en: "Complete your first meditation",
  },
  {
    id: "b2",
    slug: "seven-day",
    title_mm: "၇ ရက် စတြိက်",
    title_en: "7-Day Streak",
    description_mm: "၇ ရက် ဆက်တိုက် လေ့ကျင့်ခြင်း",
    description_en: "Maintain a 7-day practice streak",
  },
  {
    id: "b3",
    slug: "bead-round",
    title_mm: "ပုတီး ၁၀၈",
    title_en: "Bead Round",
    description_mm: "ပုတီး ၁၀၈ လုံး ပြီးမြောက်ခြင်း",
    description_en: "Complete 108 bead taps",
  },
  {
    id: "b4",
    slug: "scholar",
    title_mm: "အဘိဓမ္မာ ပညာရှင်",
    title_en: "Abhidhamma Scholar",
    description_mm: "သင်ခန်းစာ တစ်ခု ပြီးမြောက်ခြင်း",
    description_en: "Complete a learning lesson",
  },
  {
    id: "b5",
    slug: "exam-ready",
    title_mm: "စာမေးပွဲ အဆင်သင့်",
    title_en: "Exam Ready",
    description_mm: "နမူနာ စာမေးပွဲ ပြီးမြောက်ခြင်း",
    description_en: "Finish the sample quiz",
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    id: "qq1",
    prompt_mm: "ဝိပဿနာ၏ အဓိက ရည်ရွယ်ချက်မှာ အဘယ်နည်း။",
    prompt_en: "What is the main aim of Vipassana?",
    choices: ["ကုသိုလ် ရရန်", "ဟုတ်တိုင်းမှန်စွာ သိရန်", "ချမ်းသာရန်", "နာမည်ကြီးရန်"],
    correct_index: 1,
    explanation_mm: "ဝိပဿနာသည် ဟုတ်တိုင်းမှန်သော သဘောကို သိမြင်ရန် ဖြစ်သည်။",
    explanation_en: "Vipassana aims at seeing things as they truly are.",
    order_index: 1,
  },
  {
    id: "qq2",
    prompt_mm: "အာနာပါနတွင် အာရုံပြုသော အရာမှာ။",
    prompt_en: "In Ānāpāna, attention rests on:",
    choices: ["အရသာ", "ထွက်သက်ဝင်သက်", "အသံ", "အလင်း"],
    correct_index: 1,
    explanation_mm: "နှာခေါင်းဖျားရှိ လေထွက်လေဝင်ကို အာရုံပြုသည်။",
    explanation_en: "Attention rests on the in-and-out breath.",
    order_index: 2,
  },
  {
    id: "qq3",
    prompt_mm: "ကုသိုလ် ဆိုသည်မှာ။",
    prompt_en: "Merit (kusala) means:",
    choices: ["မကောင်းမှု", "ကောင်းမှု စိတ်နှင့် အကျင့်", "ငွေကြေး", "အိပ်စက်ခြင်း"],
    correct_index: 1,
    explanation_mm: "ကုသိုလ်သည် ကောင်းသော စိတ်နှင့် အကျင့်ဖြစ်သည်။",
    explanation_en: "Merit refers to wholesome mind and action.",
    order_index: 3,
  },
  {
    id: "qq4",
    prompt_mm: "Namo ၏ အဓိပ္ပာယ်မှာ။",
    prompt_en: "Namo means:",
    choices: ["သွားပါ", "ရှိခိုးပါ၏", "စားပါ", "ပြေးပါ"],
    correct_index: 1,
    explanation_mm: "Namo သည် ရိုသေရှိခိုးခြင်းကို ဆိုလိုသည်။",
    explanation_en: "Namo means homage or reverence.",
    order_index: 4,
  },
  {
    id: "qq5",
    prompt_mm: "ဝေဒနာ သုံးမျိုးမှာ။",
    prompt_en: "The three feeling tones are:",
    choices: [
      "သုခ ဒုက္ခ ဥပေက္ခာ",
      "လိုဘ ဒေါသ မောဟ",
      "စိတ် စေတသိက် ရုပ်",
      "သီလ သမာဓိ ပညာ",
    ],
    correct_index: 0,
    explanation_mm: "သုခ၊ ဒုက္ခ၊ ဥပေက္ခာ ဟူ၍ ခံစားမှု သုံးမျိုး ရှိသည်။",
    explanation_en: "Pleasant, unpleasant, and neutral feeling.",
    order_index: 5,
  },
  {
    id: "qq6",
    prompt_mm: "ဘောဓိပင် ကြီးထွားရန် လိုအပ်သည်မှာ။",
    prompt_en: "To grow the Bodhi Tree you need:",
    choices: ["ငွေ", "ကုသိုလ်အမှတ် (Merit)", "ပုံများ", "အင်တာနက်သာ"],
    correct_index: 1,
    explanation_mm: "လေ့ကျင့်မှုမှ ရသော ကုသိုလ်အမှတ်များဖြင့် ပင်ကြီးထွားသည်။",
    explanation_en: "Merit points from practice grow the tree.",
    order_index: 6,
  },
  {
    id: "qq7",
    prompt_mm: "စတြိက် (Streak) ၏ ရည်ရွယ်ချက်မှာ။",
    prompt_en: "Streaks encourage:",
    choices: [
      "တစ်ခါတည်း လေ့ကျင့်ခြင်း",
      "နေ့စဉ် ဆက်တိုက် လေ့ကျင့်ခြင်း",
      "မလေ့ကျင့်ခြင်း",
      "ပြိုင်ဆိုင်ခြင်းသာ",
    ],
    correct_index: 1,
    explanation_mm: "နေ့စဉ် ဆက်တိုက် လေ့ကျင့်ရန် အားပေးသည်။",
    explanation_en: "They encourage consistent daily practice.",
    order_index: 7,
  },
  {
    id: "qq8",
    prompt_mm: "ပုတီးစိပ်ခြင်းသည် အဓိကအားဖြင့်။",
    prompt_en: "Bead practice mainly supports:",
    choices: [
      "အာရုံစူးစိုက်မှုနှင့် ရွတ်ဆိုခြင်း",
      "ပြေးခြင်း",
      "ဈေးဝယ်ခြင်း",
      "ဂိမ်းကစားခြင်း",
    ],
    correct_index: 0,
    explanation_mm: "ပုတီးသည် အာရုံစူးစိုက်မှုနှင့် ရွတ်ဆိုမှုကို ကူညီသည်။",
    explanation_en: "Beads support focus and recitation.",
    order_index: 8,
  },
];

export function quoteOfDay(): Quote {
  const day = Math.floor(Date.now() / 86_400_000) % QUOTES.length;
  return QUOTES[day];
}

export function quoteEvery(intervalMs: number, now = Date.now()): Quote {
  const slot = Math.floor(now / intervalMs) % QUOTES.length;
  return QUOTES[slot];
}

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}

export function getLessonsForModule(moduleSlug: string) {
  return LESSONS.filter((l) => l.module_slug === moduleSlug).sort(
    (a, b) => a.order_index - b.order_index,
  );
}

export function getLesson(moduleSlug: string, lessonSlug: string) {
  return LESSONS.find(
    (l) => l.module_slug === moduleSlug && l.slug === lessonSlug,
  );
}
