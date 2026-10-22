export type PrayerDocument = {
  id: string;
  title_mm: string;
  title_en: string;
  body_mm: string;
  body_en: string;
  duration_mins?: number;
  tags: string[];
};

/** Starter Buddhism prayer / recollection documents for Habit Tracker. */
export const PRAYER_DOCUMENTS: PrayerDocument[] = [
  {
    id: "prayer-namo",
    title_mm: "နမော တဿ",
    title_en: "Namo Tassa",
    body_mm:
      "နမော တဿ ဘဂဝတော အရဟတော သမ္မာသမ္ဗုဒ္ဓဿ။\n\nဘုရားသခင်အား ရိုသေရှိခိုးပါ၏။",
    body_en:
      "Namo tassa bhagavato arahato sammāsambuddhassa.\n\nHomage to the Blessed One, the Worthy One, the Perfectly Enlightened One.",
    duration_mins: 2,
    tags: ["morning", "homage", "preset"],
  },
  {
    id: "prayer-triple-gem",
    title_mm: "ရတနာသုံးပါး ရှိခိုး",
    title_en: "Refuge in the Triple Gem",
    body_mm:
      "ဗုဒ္ဓံ သရဏံ ဂစ္ဆာမိ။\nဓမ္မံ သရဏံ ဂစ္ဆာမိ။\nသံဃံ သရဏံ ဂစ္ဆာမိ။",
    body_en:
      "I go for refuge to the Buddha.\nI go for refuge to the Dhamma.\nI go for refuge to the Sangha.",
    duration_mins: 3,
    tags: ["morning", "refuge", "preset"],
  },
  {
    id: "prayer-metta",
    title_mm: "မေတ္တာ ဖြန့်ခြင်း",
    title_en: "Metta Recollection",
    body_mm:
      "သဗ္ဗေ သတ္တာ သုခိတာ ဟောန္တု။\n\nသတ္တဝါအားလုံး ချမ်းသာကြပါစေ။",
    body_en:
      "May all beings be happy.\nMay all beings be free from suffering.\nMay all beings live in peace.",
    duration_mins: 5,
    tags: ["evening", "metta", "preset"],
  },
  {
    id: "prayer-five-precepts",
    title_mm: "ငါးပါးသီလ",
    title_en: "Five Precepts",
    body_mm:
      "ပါဏာတိပါတာ ဝေရမဏိ သိက္ခာပဒံ သမာဒိယာမိ။\n\nမသတ်ဖြတ်ခြင်း၊ မခိုးယူခြင်း၊ မလွဲမှားသော ကာမမှု၊ မလိမ်ညာခြင်း၊ မူးယစ်ဆေး မသုံးခြင်း။",
    body_en:
      "I undertake the training to abstain from killing, stealing, sexual misconduct, false speech, and intoxicants.",
    duration_mins: 4,
    tags: ["ethics", "daily"],
  },
  {
    id: "prayer-anapana",
    title_mm: "အာနာပါန သတိ",
    title_en: "Ānāpāna Mindfulness",
    body_mm:
      "ထွက်သက်ကို သိ၊ ဝင်သက်ကို သိ။\nစိတ်လွင့်သွားလျှင် ပြန်ယူလာ။",
    body_en:
      "Know the out-breath. Know the in-breath.\nWhen the mind wanders, gently return.",
    duration_mins: 10,
    tags: ["practice", "breath"],
  },
  {
    id: "prayer-gratitude",
    title_mm: "ကျေးဇူးတင်ခြင်း",
    title_en: "Gratitude Recollection",
    body_mm:
      "မိဘ၊ ဆရာ၊ မိတ်ဆွေနှင့် သတ္တဝါအားလုံးအား ကျေးဇူးတင်ပါ၏။",
    body_en:
      "I give thanks to parents, teachers, friends, and all beings who support this path.",
    duration_mins: 3,
    tags: ["evening", "gratitude"],
  },
  {
    id: "prayer-buddha-qualities",
    title_mm: "ဘုရားဂုဏ်တော်",
    title_en: "Buddha Qualities",
    body_mm:
      "ဣတိပိ သော ဘဂဝါ အရဟံ သမ္မာသမ္ဗုဒ္ဓေါ…\n\nဘုရားသည် အရဟံ၊ သမ္မာသမ္ဗုဒ္ဓ၊ ဝိဇ္ဇာစရဏသမ္ပန္န ဖြစ်၏။",
    body_en:
      "Indeed, the Blessed One is accomplished, fully enlightened, perfect in knowledge and conduct…",
    duration_mins: 5,
    tags: ["homage", "study"],
  },
  {
    id: "prayer-dhamma-qualities",
    title_mm: "တရားဂုဏ်တော်",
    title_en: "Dhamma Qualities",
    body_mm:
      "သွာက္ခာတော ဘဂဝတာ ဓမ္မော…\n\nတရားသည် ကောင်းစွာ ဟောကြားအပ်သော တရားဖြစ်၏။",
    body_en:
      "The Dhamma is well-expounded by the Blessed One, visible here and now, inviting one to come and see…",
    duration_mins: 4,
    tags: ["homage", "study"],
  },
  {
    id: "prayer-sangha-qualities",
    title_mm: "သံဃာဂုဏ်တော်",
    title_en: "Sangha Qualities",
    body_mm:
      "သုပ္ပဋိပန္နော ဘဂဝတော သာဝကသံဃော…\n\nဘုရား၏ တပည့်သံဃာသည် ကောင်းစွာ ကျင့်သော သံဃာဖြစ်၏။",
    body_en:
      "The Sangha of the Blessed One’s disciples is practicing the good way, the straight way…",
    duration_mins: 4,
    tags: ["homage", "study"],
  },
  {
    id: "prayer-evening-review",
    title_mm: "ညနေ ပြန်လည်သုံးသပ်",
    title_en: "Evening Review",
    body_mm:
      "ယနေ့ ပြုခဲ့သော ကုသိုလ်ကို သတိရ။\nမကောင်းမှုရှိလျှင် ဝန်ချတောင်းပန်ပြီး မနက်ဖြန် ပိုကောင်းအောင် ကြိုးစားမည်။",
    body_en:
      "Recall today’s wholesome acts.\nIf there was harm, acknowledge it and resolve to do better tomorrow.",
    duration_mins: 5,
    tags: ["evening", "reflection"],
  },
];

export const PRESET_HABIT_PRAYER_IDS = [
  "prayer-namo",
  "prayer-triple-gem",
  "prayer-metta",
] as const;

export function getPrayer(id: string) {
  return PRAYER_DOCUMENTS.find((prayer) => prayer.id === id);
}

export function getPrayersByIds(ids: string[]) {
  return ids
    .map((id) => getPrayer(id))
    .filter((prayer): prayer is PrayerDocument => Boolean(prayer));
}
