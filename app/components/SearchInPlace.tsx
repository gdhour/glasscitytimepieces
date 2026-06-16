"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useVoiceInput } from "@/lib/useVoiceInput";
import { type InventoryWatch } from "../collectionWatches";
import InventoryGrid from "./InventoryGrid";
import WatchListingCard from "./WatchListingCard";

type RankResult = { slug: string; reason: string };
type RankResponse = { intro: string; results: RankResult[]; degraded?: boolean };

const SUGGESTIONS = [
  "Titanium and under $2,000",
  "Something with a standout dial",
  "A versatile everyday automatic",
  "A bold piece that starts conversations",
];

export default function SearchInPlace({
  watches,
}: {
  watches: readonly InventoryWatch[];
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  // null = browse mode (show the category grid); set = show ranked results.
  const [response, setResponse] = useState<RankResponse | null>(null);
  const [errored, setErrored] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const bySlug = useMemo(() => {
    const map = new Map<string, InventoryWatch>();
    for (const w of watches) if (w.slug) map.set(w.slug, w);
    return map;
  }, [watches]);

  async function runSearch(raw: string) {
    const q = raw.trim();
    if (!q || loading) return;
    setLoading(true);
    setErrored(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rank: true, query: q }),
      });
      if (!res.ok) throw new Error("unavailable");
      const data = (await res.json()) as RankResponse;
      setResponse(data);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch {
      setErrored(true);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }

  const { voiceState, toggle } = useVoiceInput((transcript) => {
    setQuery(transcript);
    runSearch(transcript);
  });

  function clearSearch() {
    setQuery("");
    setResponse(null);
    setErrored(false);
  }

  const matched = response
    ? response.results
        .map((r) => ({ watch: bySlug.get(r.slug), reason: r.reason }))
        .filter((m): m is { watch: InventoryWatch; reason: string } => Boolean(m.watch))
    : [];

  let content: ReactNode;
  if (loading) {
    content = (
      <p className="animate-pulse text-sm text-[var(--muted)]">
        Searching the collection…
      </p>
    );
  } else if (response) {
    content = (
      <div className="space-y-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="max-w-2xl font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[var(--foreground)]">
            {response.intro ||
              (matched.length
                ? "Here are the closest pieces."
                : "I couldn’t find a match — tell me more?")}
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--steel)] transition-colors hover:text-[var(--foreground)]"
          >
            Clear ✕
          </button>
        </div>

        {response.degraded && (
          <p className="text-xs text-[var(--muted)]">
            Showing current inventory — conversational ranking is briefly unavailable.
          </p>
        )}

        {matched.length > 0 ? (
          <div className="space-y-20">
            {matched.map(({ watch, reason }, i) => (
              <WatchListingCard
                key={`${watch.brand}-${watch.reference}`}
                watch={watch}
                reason={reason || undefined}
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-sm p-8 sm:p-10">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[var(--foreground)]">
              No exact match — let’s refine.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Try a different style, budget, or occasion — or browse the full
              collection by category.
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 rounded-sm border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--purple)]/25"
            >
              Browse all inventory
            </button>
          </div>
        )}
      </div>
    );
  } else {
    content = <InventoryGrid watches={watches} />;
  }

  return (
    <>
      <div className="mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
          Conversational search
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--steel)]">
          Describe what you’re after — a style, a budget, an occasion — and the
          collection reorders itself to fit. No filters required.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="mt-5"
        >
          <div className="flex items-center gap-2 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-2 shadow-lg shadow-black/40">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                voiceState === "listening"
                  ? "Listening…"
                  : "e.g. a titanium daily under $2,000"
              }
              className="flex-1 bg-transparent px-3 py-2 text-base text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
              aria-label="Describe the watch you want"
            />
            {voiceState !== "unsupported" && (
              <button
                type="button"
                onClick={toggle}
                aria-label={
                  voiceState === "listening" ? "Stop listening" : "Speak your search"
                }
                className={`rounded p-2 transition-colors ${
                  voiceState === "listening"
                    ? "text-red-400 hover:text-red-300"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {voiceState === "listening" ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="4" className="animate-pulse" />
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="1" width="6" height="9" rx="3" />
                    <path d="M2 7.5A6 6 0 0 0 14 7.5" />
                    <line x1="8" y1="13.5" x2="8" y2="15.5" />
                    <line x1="5.5" y1="15.5" x2="10.5" y2="15.5" />
                  </svg>
                )}
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-bronze rounded-sm px-6 py-2.5 text-sm font-medium disabled:opacity-40"
            >
              Search
            </button>
          </div>
        </form>

        {!response && !loading && (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <span className="text-xs text-[var(--muted)]">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  runSearch(s);
                }}
                className="rounded-sm border border-[var(--border)] px-3.5 py-1.5 text-xs text-[var(--steel)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {errored && (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Conversational search is unavailable right now — browse by category below.
          </p>
        )}
      </div>

      <div ref={resultsRef}>{content}</div>
    </>
  );
}
