export type Flashcard = {
  id: string;
  front_mm: string;
  front_en: string;
  back_mm: string;
  back_en: string;
  hint?: string;
};

export type DictionaryEntry = {
  id: string;
  pali: string;
  spelling: string;
  myanmar: string;
  english: string;
  meaning: string;
  voice_tone: string;
  category: string;
  example_mm?: string;
  example_en?: string;
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

export const PALI_DICTIONARY: DictionaryEntry[] = [
  {
    id: "d1",
    pali: "Namo",
    spelling: "Namo",
    myanmar: "ရှိခိုးပါ၏",
    english: "Homage; reverence",
    meaning:
      "A word of respect placed before a name or a sacred phrase. It offers homage rather than a greeting between friends.",
    voice_tone: "NAH-mo. Stress the first syllable. The final o is short.",
    category: "Greeting",
    example_mm: "Namo tassa bhagavato…",
    example_en: "Homage to the Blessed One…",
  },
  {
    id: "d2",
    pali: "Buddho",
    spelling: "Buddho",
    myanmar: "ဘုရား",
    english: "The Buddha; the Awakened One",
    meaning:
      "The awakened teacher. In recitation, Buddho is the vocative form used when calling the Buddha to mind.",
    voice_tone: "BUD-dho. Hold the double d briefly. Stress the first syllable. The final o is short.",
    category: "Triple Gem",
  },
  {
    id: "d3",
    pali: "Dhammo",
    spelling: "Dhammo",
    myanmar: "တရား",
    english: "The Dhamma; teaching; truth",
    meaning:
      "The teaching of the Buddha, and also the truth that teaching points to. Dhammo is the vocative form used in homage.",
    voice_tone: "DHAM-mo. Dh is a breathy d, not an English th. Stress the first syllable.",
    category: "Triple Gem",
  },
  {
    id: "d4",
    pali: "Sangho",
    spelling: "Sangho",
    myanmar: "သံဃာ",
    english: "The Sangha; community of practitioners",
    meaning:
      "The community of disciples who practice the path. Sangho is the vocative form used when paying respect.",
    voice_tone: "SANG-gho. Ng sounds like the end of “sing”, then a soft g. Stress the first syllable.",
    category: "Triple Gem",
  },
  {
    id: "d5",
    pali: "Sati",
    spelling: "Sati",
    myanmar: "သတိ",
    english: "Mindfulness; awareness",
    meaning:
      "Remembering the present object of attention. Sati stays with the body, feeling, mind, or a teaching without drifting off.",
    voice_tone: "SA-ti. Both vowels are short. Stress the first syllable. The final i is brief.",
    category: "Practice",
  },
  {
    id: "d6",
    pali: "Ānāpāna",
    spelling: "Ānāpāna",
    myanmar: "အာနာပါန",
    english: "Mindfulness of in-and-out breathing",
    meaning:
      "Attention to the in-breath and the out-breath. The long ā marks a vowel that is held.",
    voice_tone: "aa-NAA-paa-na. Hold each ā as a long “ah”. Stress the second syllable.",
    category: "Practice",
  },
  {
    id: "d7",
    pali: "Vedanā",
    spelling: "Vedanā",
    myanmar: "ဝေဒနာ",
    english: "Feeling; sensation",
    meaning:
      "The feeling tone of an experience: pleasant, unpleasant, or neutral. It is not the story about the feeling.",
    voice_tone: "veh-dah-NAA. The final ā is long. Stress the last syllable.",
    category: "Vipassana",
  },
  {
    id: "d8",
    pali: "Citta",
    spelling: "Citta",
    myanmar: "စိတ်",
    english: "Mind; consciousness",
    meaning:
      "The mind that knows an object. In Abhidhamma, citta is a moment of knowing, not a permanent self.",
    voice_tone: "CHIT-ta. Hold the double t. Both vowels are short. Stress the first syllable.",
    category: "Abhidhamma",
  },
  {
    id: "d9",
    pali: "Kusala",
    spelling: "Kusala",
    myanmar: "ကုသိုလ်",
    english: "Wholesome; skillful",
    meaning:
      "A mind or action that is healthy and skillful. Kusala is the quality counted as merit on the path.",
    voice_tone: "ku-SA-la. Stress the middle syllable. All three vowels are short.",
    category: "Ethics",
  },
  {
    id: "d10",
    pali: "Mettā",
    spelling: "Mettā",
    myanmar: "မေတ္တာ",
    english: "Loving-kindness",
    meaning:
      "A wish for beings to be well, free of clinging and ill will. The long ā keeps the word from sounding like “meta”.",
    voice_tone: "MET-taa. Hold the double t. The final ā is long. Stress the first syllable.",
    category: "Brahmavihāra",
  },
  {
    id: "d11",
    pali: "Samādhi",
    spelling: "Samādhi",
    myanmar: "သမာဓိ",
    english: "Concentration; collectedness",
    meaning:
      "The mind gathered on one object. Samādhi is steady attention, not a forced grip.",
    voice_tone: "sa-MAA-dhi. The ā is long. Stress the middle syllable. The final i is short.",
    category: "Practice",
  },
  {
    id: "d12",
    pali: "Paññā",
    spelling: "Paññā",
    myanmar: "ပညာ",
    english: "Wisdom; insight",
    meaning:
      "Seeing things as they are. The ññ is one sound, closer to “ny” than to a plain n.",
    voice_tone: "pun-NYAA. Ññ sounds like the “ny” in “canyon”. The final ā is long.",
    category: "Practice",
  },
  {
    id: "d13",
    pali: "Sīla",
    spelling: "Sīla",
    myanmar: "သီလ",
    english: "Virtue; moral conduct",
    meaning:
      "Ethical training that protects oneself and others. The long ī distinguishes it from a short i.",
    voice_tone: "SEE-la. The ī is a long “ee”. Stress the first syllable.",
    category: "Ethics",
  },
  {
    id: "d14",
    pali: "Dukkha",
    spelling: "Dukkha",
    myanmar: "ဒုက္ခ",
    english: "Suffering; unsatisfactoriness",
    meaning:
      "The stress of life that cannot fully satisfy. It covers pain, change, and the unease of conditioned things.",
    voice_tone: "DUK-kha. Hold the double k. The kh is a breathy k. Stress the first syllable.",
    category: "Four Noble Truths",
  },
  {
    id: "d15",
    pali: "Bodhi",
    spelling: "Bodhi",
    myanmar: "ဗောဓိ",
    english: "Awakening; enlightenment",
    meaning:
      "Waking up to the way things are. Bodhi names both the awakening and the tree associated with it.",
    voice_tone: "BOH-dhi. The o is short and open. Stress the first syllable. The final i is short.",
    category: "Path",
  },
];

export function getDictionaryEntry(id: string) {
  return PALI_DICTIONARY.find((entry) => entry.id === id);
}

export function searchDictionary(query: string): DictionaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return PALI_DICTIONARY;
  return PALI_DICTIONARY.filter((entry) => {
    const haystack = [
      entry.pali,
      entry.myanmar,
      entry.english,
      entry.spelling,
      entry.meaning,
      entry.voice_tone,
      entry.category,
      entry.example_mm ?? "",
      entry.example_en ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

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
