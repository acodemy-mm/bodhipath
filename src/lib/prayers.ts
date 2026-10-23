import rawPrayers from "@/data/phayarsar-prayers.json";

export type PrayerVerse = {
  content: string;
  pronunciation: string;
};

export type PrayerDocument = {
  id: string;
  title_mm: string;
  title_en: string;
  about: string;
  verses: PrayerVerse[];
  body_mm: string;
  body_en: string;
  duration_mins?: number;
  tags: string[];
};

type RawPrayer = {
  id: string;
  title: string;
  about: string;
  body: PrayerVerse[];
};

function excerpt(about: string) {
  const line = about
    .split("\n")
    .map((part) => part.trim())
    .find(Boolean);
  if (!line) return "";
  if (line.length <= 88) return line;
  return `${line.slice(0, 88).trimEnd()}…`;
}

/** PhayarSar prayer documents. https://github.com/KyawTheMonkey/PhayarSar */
export const PRAYER_DOCUMENTS: PrayerDocument[] = (rawPrayers as RawPrayer[]).map(
  (prayer) => {
    const verses = prayer.body.map((verse) => ({
      content: verse.content,
      pronunciation: verse.pronunciation,
    }));
    return {
      id: prayer.id,
      title_mm: prayer.title,
      title_en: excerpt(prayer.about),
      about: prayer.about,
      verses,
      body_mm: verses.map((verse) => verse.content).join("\n\n"),
      body_en: verses
        .map((verse) => verse.pronunciation)
        .filter(Boolean)
        .join("\n"),
      tags: ["PhayarSar"],
    };
  },
);

const BY_ID = new Map(PRAYER_DOCUMENTS.map((prayer) => [prayer.id, prayer]));

/** Earlier starter ids, kept so saved habit plans still resolve. */
const LEGACY_PRAYER_IDS: Record<string, string> = {
  "prayer-namo": "သြကာသ",
  "prayer-triple-gem": "သရဏဂုံ",
  "prayer-metta": "မေတ္တသုတ်",
  "prayer-five-precepts": "ငါးပါးသီလ",
  "prayer-buddha-qualities": "ဘုရားဂုဏ်တော်",
  "prayer-dhamma-qualities": "တရားဂုဏ်တော်",
  "prayer-sangha-qualities": "သံဃာဂုဏ်တော်",
};

export const PRESET_HABIT_PRAYER_IDS = [
  "ငါးပါးသီလ",
  "ဘုရားဂုဏ်တော်",
  "မေတ္တသုတ်",
] as const;

export function getPrayer(id: string) {
  return BY_ID.get(LEGACY_PRAYER_IDS[id] ?? id);
}

export function getNextPrayer(id: string) {
  const current = getPrayer(id);
  if (!current) return undefined;
  const index = PRAYER_DOCUMENTS.findIndex((item) => item.id === current.id);
  if (index < 0) return undefined;
  return PRAYER_DOCUMENTS[index + 1];
}

export function getPrayersByIds(ids: string[]) {
  return ids
    .map((id) => getPrayer(id))
    .filter((prayer): prayer is PrayerDocument => Boolean(prayer));
}
