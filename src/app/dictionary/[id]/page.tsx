import { notFound } from "next/navigation";
import { PageHeader, Surface } from "@/components/gamification-ui";
import { getDictionaryEntry } from "@/lib/learning-tools";

export default async function DictionaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getDictionaryEntry(id);
  if (!entry) notFound();

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader title={entry.pali} description={entry.myanmar} />

      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
        {entry.category}
      </p>

      <div className="grid gap-3">
        <Surface className="grid gap-2 p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
            Spelling
          </p>
          <p className="font-display text-2xl text-cream">{entry.spelling}</p>
          <p className="text-sm text-text-secondary">{entry.myanmar}</p>
        </Surface>

        <Surface className="grid gap-2 p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
            Meaning
          </p>
          <p className="text-sm leading-relaxed text-cream">{entry.english}</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            {entry.meaning}
          </p>
          {entry.example_mm || entry.example_en ? (
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3 text-sm">
              {entry.example_mm ? (
                <p className="text-cream">{entry.example_mm}</p>
              ) : null}
              {entry.example_en ? (
                <p className="mt-1 text-text-tertiary">{entry.example_en}</p>
              ) : null}
            </div>
          ) : null}
        </Surface>

        <Surface className="grid gap-2 p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
            Voice tone
          </p>
          <p className="text-sm leading-relaxed text-cream">{entry.voice_tone}</p>
        </Surface>
      </div>
    </section>
  );
}
