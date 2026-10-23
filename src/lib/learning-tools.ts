export type Flashcard = {
  id: string;
  front_mm: string;
  front_en: string;
  back_mm: string;
  back_en: string;
  hint?: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  merit: number;
  level: number;
  streak: number;
  isYou?: boolean;
};

export const FLASHCARDS: Flashcard[] = [
  {
    id: "fc1",
    front_mm: "အာနာပါန",
    front_en: "Ānāpāna",
    back_mm: "ထွက်သက်ဝင်သက်ကို အာရုံပြုခြင်း",
    back_en: "Mindfulness of breathing",
    hint: "Vipassana · Breath",
  },
  {
    id: "fc2",
    front_mm: "သတိ",
    front_en: "Sati",
    back_mm: "သတိရှိခြင်း · အာရုံစူးစိုက်မှု",
    back_en: "Mindfulness · present awareness",
    hint: "Core quality",
  },
  {
    id: "fc3",
    front_mm: "ကုသိုလ်",
    front_en: "Kusala",
    back_mm: "ကောင်းသော စိတ်နှင့် အကျင့်",
    back_en: "Wholesome mind and action (merit)",
    hint: "Merit",
  },
  {
    id: "fc4",
    front_mm: "Namo",
    front_en: "Namo",
    back_mm: "ရှိခိုးပါ၏ · ရိုသေခြင်း",
    back_en: "Homage · reverence",
    hint: "Pāli greeting",
  },
  {
    id: "fc5",
    front_mm: "ဝေဒနာ",
    front_en: "Vedanā",
    back_mm: "ခံစားမှု · သုခ ဒုက္ခ ဥပေက္ခာ",
    back_en: "Feeling tone · pleasant, unpleasant, neutral",
    hint: "Contemplation",
  },
  {
    id: "fc6",
    front_mm: "စိတ်",
    front_en: "Citta",
    back_mm: "အာရုံကို သိသော သဘော",
    back_en: "Mind · that which knows an object",
    hint: "Abhidhamma",
  },
  {
    id: "fc7",
    front_mm: "Buddho",
    front_en: "Buddho",
    back_mm: "ဘုရား · သိမြင်သောသူ",
    back_en: "The Buddha · the Awakened One",
    hint: "Triple Gem",
  },
  {
    id: "fc8",
    front_mm: "မေတ္တာ",
    front_en: "Mettā",
    back_mm: "ချစ်ခင်မှု · မေတ္တာစိတ်",
    back_en: "Loving-kindness",
    hint: "Brahmavihāra",
  },
];

export function buildLeaderboard(input: {
  displayName: string;
  merit: number;
  level: number;
  streak: number;
}): LeaderboardEntry[] {
  const peers: LeaderboardEntry[] = [
    { id: "p1", name: "သုခ", merit: 420, level: 4, streak: 12 },
    { id: "p2", name: "မေတ္တာ", merit: 310, level: 3, streak: 9 },
    { id: "p3", name: "သတိ", merit: 180, level: 3, streak: 5 },
    { id: "p4", name: "ပညာ", merit: 95, level: 2, streak: 3 },
    { id: "p5", name: "သမာဓိ", merit: 60, level: 2, streak: 2 },
    {
      id: "you",
      name: input.displayName,
      merit: input.merit,
      level: input.level,
      streak: input.streak,
      isYou: true,
    },
  ];

  return peers.sort((a, b) => b.merit - a.merit || b.streak - a.streak);
}
