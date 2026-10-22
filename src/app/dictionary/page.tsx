"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, PageHeader } from "@/components/gamification-ui";
import { ArrowRightIcon } from "@/components/reference-icons";
import { searchDictionary } from "@/lib/learning-tools";

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDictionary(query), [query]);

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
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pāli, Myanmar, or English…"
          className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted px-3.5 py-3 text-sm text-cream outline-none placeholder:text-text-tertiary focus:border-border-strong"
        />
      </label>

      {results.length === 0 ? (
        <EmptyState>
          No matches for “{query}”. Try another spelling or English meaning.
        </EmptyState>
      ) : (
        <div className="grid gap-2">
          <p className="text-xs text-text-tertiary">
            {results.length} word{results.length === 1 ? "" : "s"}
          </p>
          {results.map((entry) => (
            <Link
              key={entry.id}
              href={`/dictionary/${entry.id}`}
              className="gamify-choice flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <strong className="block text-sm text-cream">{entry.pali}</strong>
                <span className="mt-1 block text-xs text-text-secondary">
                  {entry.myanmar} · {entry.english}
                </span>
              </span>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(243,213,106,0.16)] text-[var(--gold-soft)]"
                aria-hidden
              >
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
