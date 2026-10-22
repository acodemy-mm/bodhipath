import { notFound } from "next/navigation";
import { PageHeader, Surface } from "@/components/gamification-ui";
import { getPrayer } from "@/lib/prayers";

export default async function PrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prayer = getPrayer(id);
  if (!prayer) notFound();

  const sections = [
    {
      label: "Opening",
      body: "Sit comfortably and take three quiet breaths. Bring the mind to this prayer before the words begin.",
    },
    {
      label: "Recitation",
      body: prayer.body_mm,
      translation: prayer.body_en,
    },
    {
      label: "Reflection",
      body: "Pause after the recitation. Stay with the feeling of respect for a few breaths, without adding extra thoughts.",
    },
    {
      label: "Closing",
      body: "Offer the merit of this recitation to all beings, then return to the day with a calm mind.",
    },
  ];

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader title={prayer.title_mm} description={prayer.title_en} />

      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
        {prayer.tags.join(" · ")}
        {prayer.duration_mins ? ` · ~${prayer.duration_mins} min` : ""}
      </p>

      <div className="grid gap-3">
        {sections.map((section) => (
          <Surface key={section.label} className="grid gap-2 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
              {section.label}
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-cream">
              {section.body}
            </p>
            {section.translation ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                {section.translation}
              </p>
            ) : null}
          </Surface>
        ))}
      </div>
    </section>
  );
}
