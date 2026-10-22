"use client";

import { useMemo, useState } from "react";
import {
  EmptyState,
  PageHeader,
  Surface,
} from "@/components/gamification-ui";
import { BookIcon } from "@/components/reference-icons";
import { searchDictionary } from "@/lib/learning-tools";

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const results = useMemo(() => searchDictionary(query), [query]);
  const active = results.find((entry) => entry.id === activeId) ?? results[0];

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Pāli Dictionary"
        description="ပါဠိစကားလုံးများကို ရှာဖွေ · အဓိပ္ပာယ်ကြည့်ရှုပါ"
      />

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">
          Search words
        </span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          placeholder="Pāli, Myanmar, or English…"
          className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted px-3.5 py-3 text-sm text-cream outline-none placeholder:text-text-tertiary focus:border-border-strong"
        />
      </label>

      {results.length === 0 ? (
        <EmptyState>
          No matches for “{query}”. Try another spelling or English meaning.
        </EmptyState>
      ) : (
        <>
          <Surface strong className="grid gap-3 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
                <BookIcon />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
                  {active.category}
                </p>
                <h2 className="font-display text-2xl text-cream">{active.pali}</h2>
                <p className="mt-1 text-sm text-cream">{active.myanmar}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {active.english}
                </p>
              </div>
            </div>
            {(active.example_mm || active.example_en) && (
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3 text-sm">
                {active.example_mm && (
                  <p className="text-cream">{active.example_mm}</p>
                )}
                {active.example_en && (
                  <p className="mt-1 text-text-tertiary">{active.example_en}</p>
                )}
              </div>
            )}
          </Surface>

          <div className="grid gap-2">
            <p className="text-xs text-text-tertiary">
              {results.length} word{results.length === 1 ? "" : "s"}
            </p>
            {results.map((entry) => {
              const selected = entry.id === active.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  className={`gamify-choice ${selected ? "is-selected" : ""}`}
                >
                  <strong className="block text-sm text-cream">
                    {entry.pali}
                  </strong>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {entry.myanmar} · {entry.english}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
