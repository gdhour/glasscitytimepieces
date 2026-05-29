"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AskWatchDetail = {
  watchContext?: string;
  prompt?: string;
};

type VisitorPreferences = {
  visitorPurpose?: string;
  currentWrist?: string;
  experienceLevel?: string;
  stylePreferences?: string;
  budgetRange?: string;
  preferredCaseSize?: string;
  strapPreference?: string;
  watchesLiked: string[];
  watchesDisliked: string[];
};

type StoredChatSession = {
  messages?: ChatMessage[];
  watchContext?: string;
};

const preferenceStorageKey = "gct:cogsworth-preferences";
const sessionStorageKey = "gct:cogsworth-session";

const emptyPreferences: VisitorPreferences = {
  watchesLiked: [],
  watchesDisliked: [],
};

function hasRememberedPreferences(preferences: VisitorPreferences) {
  return Boolean(
    preferences.visitorPurpose ||
      preferences.currentWrist ||
      preferences.experienceLevel ||
      preferences.stylePreferences ||
      preferences.budgetRange ||
      preferences.preferredCaseSize ||
      preferences.strapPreference ||
      preferences.watchesLiked.length > 0 ||
      preferences.watchesDisliked.length > 0,
  );
}

function createStarterMessages(preferences: VisitorPreferences): ChatMessage[] {
  if (hasRememberedPreferences(preferences)) {
    const remembered = [
      preferences.currentWrist ? `wearing ${preferences.currentWrist}` : null,
      preferences.budgetRange ? `looking around ${preferences.budgetRange}` : null,
      preferences.stylePreferences ? `liking ${preferences.stylePreferences}` : null,
      preferences.preferredCaseSize
        ? `being comfortable around ${preferences.preferredCaseSize}`
        : null,
    ]
      .filter(Boolean)
      .join(" and ");

    return [
      {
        role: "assistant",
        content: `Welcome back. Last time you mentioned ${remembered || "a few watch preferences"}. Want to keep exploring that lane?`,
      },
    ];
  }

  return [
    {
      role: "assistant",
      content:
        "Hello, I’m Cogsworth.\n\nMir originally built me to help curate and manage his own collection, then decided to share me with fellow enthusiasts visiting Glass City Timepieces.\n\nWhether you’re searching for your first mechanical watch, your next grail, or just browsing, I’m happy to help.\n\nBefore we dive in, I’m curious: what brings you to GCT today? And just as importantly, what’s on your wrist right now?\n\nDon’t be shy if it’s a Garmin or Apple Watch. Mir wears a Garmin whenever he’s running, cycling, or chasing his kids between tournaments.",
    },
  ];
}

function parseStoredPreferences(): VisitorPreferences {
  if (typeof window === "undefined") {
    return emptyPreferences;
  }

  try {
    const stored = window.localStorage.getItem(preferenceStorageKey);
    if (!stored) {
      return emptyPreferences;
    }

    const parsed = JSON.parse(stored) as Partial<VisitorPreferences>;

    return {
      visitorPurpose: parsed.visitorPurpose,
      currentWrist: parsed.currentWrist,
      experienceLevel: parsed.experienceLevel,
      stylePreferences: parsed.stylePreferences,
      budgetRange: parsed.budgetRange,
      preferredCaseSize: parsed.preferredCaseSize,
      strapPreference: parsed.strapPreference,
      watchesLiked: Array.isArray(parsed.watchesLiked) ? parsed.watchesLiked : [],
      watchesDisliked: Array.isArray(parsed.watchesDisliked)
        ? parsed.watchesDisliked
        : [],
    };
  } catch {
    return emptyPreferences;
  }
}

function parseStoredSession(): StoredChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.sessionStorage.getItem(sessionStorageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as StoredChatSession;
    if (!Array.isArray(parsed.messages)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function cleanPreferenceText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function mergeUnique(values: string[], nextValue?: string) {
  const cleaned = nextValue ? cleanPreferenceText(nextValue) : "";
  if (!cleaned) {
    return values;
  }

  return [...new Set([...values, cleaned])].slice(-6);
}

function matchAfter(text: string, pattern: RegExp) {
  const match = text.match(pattern)?.[1];
  return match ? cleanPreferenceText(match) : undefined;
}

function extractPreferenceUpdates(
  content: string,
  current: VisitorPreferences,
): VisitorPreferences {
  const lower = content.toLowerCase();
  const next: VisitorPreferences = {
    ...current,
    watchesLiked: [...current.watchesLiked],
    watchesDisliked: [...current.watchesDisliked],
  };

  const wrist =
    matchAfter(content, /(?:on my wrist(?: is)?|wearing|i wear|daily(?:ing)?)(?:\s+an?|\s+my)?\s+([^.!?\n,]{2,80})/i) ??
    (lower.includes("garmin")
      ? "Garmin"
      : lower.includes("apple watch")
        ? "Apple Watch"
        : undefined);
  if (wrist) next.currentWrist = wrist;

  if (lower.includes("first mechanical") || lower.includes("new to mechanical")) {
    next.experienceLevel = "new to mechanical watches";
    next.visitorPurpose = next.visitorPurpose ?? "searching for a first mechanical watch";
  } else if (lower.includes("grail")) {
    next.visitorPurpose = "searching for a grail watch";
  } else if (lower.includes("just browsing") || lower.includes("browsing")) {
    next.visitorPurpose = "browsing";
  } else if (lower.includes("collector") || lower.includes("collecting")) {
    next.experienceLevel = "collector";
  }

  const budget = content.match(
    /(?:budget(?: is)?|under|below|around|about|up to|between)\s+\$?\d[\d,]*(?:\s*(?:-|and|to)\s*\$?\d[\d,]*)?/i,
  )?.[0];
  if (budget) next.budgetRange = cleanPreferenceText(budget);

  const caseSize = content.match(/\b(?:prefer|like|comfortable with|wear)\s+(?:around\s+)?(\d{2}\s?mm(?:\s*-\s*\d{2}\s?mm)?)/i)?.[1];
  if (caseSize) next.preferredCaseSize = cleanPreferenceText(caseSize);

  const strap = content.match(/\b(bracelet|rubber strap|leather strap|nato|canvas strap|integrated bracelet)\b/i)?.[1];
  if (strap) next.strapPreference = cleanPreferenceText(strap);

  const styleMatches = [
    "diver",
    "dress watch",
    "chronograph",
    "gmt",
    "skeleton",
    "field watch",
    "vintage",
    "modern",
    "ceramic",
    "blue dial",
  ].filter((style) => lower.includes(style));
  if (styleMatches.length > 0) {
    next.stylePreferences = mergeUnique(
      next.stylePreferences ? next.stylePreferences.split(", ") : [],
      styleMatches.join(", "),
    ).join(", ");
  }

  next.watchesLiked = mergeUnique(
    next.watchesLiked,
    matchAfter(content, /(?:i like|i love|interested in|drawn to)\s+([^.!?\n]{2,100})/i),
  );
  next.watchesDisliked = mergeUnique(
    next.watchesDisliked,
    matchAfter(content, /(?:i dislike|i hate|not a fan of|don't like|do not like)\s+([^.!?\n]{2,100})/i),
  );

  return next;
}

function isAskWatchEvent(event: Event): event is CustomEvent<AskWatchDetail> {
  return "detail" in event;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visitorPreferences, setVisitorPreferences] =
    useState<VisitorPreferences>(() => parseStoredPreferences());
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const storedSession = parseStoredSession();
    if (storedSession?.messages) {
      return storedSession.messages;
    }

    return createStarterMessages(parseStoredPreferences());
  });
  const [input, setInput] = useState("");
  const [watchContext, setWatchContext] = useState<string | undefined>(
    () => parseStoredSession()?.watchContext,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleAskWatch = (event: Event) => {
      if (!isAskWatchEvent(event)) {
        return;
      }

      const context = event.detail.watchContext;
      const prompt =
        event.detail.prompt ??
        (context ? `Tell me about ${context}.` : "Tell me about this watch.");

      setOpen(true);
      setWatchContext(context);
      setInput(prompt);
    };

    window.addEventListener("gct:ask-watch", handleAskWatch);

    return () => {
      window.removeEventListener("gct:ask-watch", handleAskWatch);
    };
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages, open]);

  useEffect(() => {
    window.localStorage.setItem(
      preferenceStorageKey,
      JSON.stringify(visitorPreferences),
    );
  }, [visitorPreferences]);

  useEffect(() => {
    window.sessionStorage.setItem(
      sessionStorageKey,
      JSON.stringify({ messages, watchContext }),
    );
  }, [messages, watchContext]);

  const buttonLabel = useMemo(
    () => (open ? "Close Cogsworth" : "Ask Cogsworth"),
    [open],
  );

  async function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const content = input.trim();
    if (!content || loading) {
      return;
    }

    const nextPreferences = extractPreferenceUpdates(content, visitorPreferences);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setVisitorPreferences(nextPreferences);
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          watchContext,
          visitorPreferences: nextPreferences,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Cogsworth is unavailable right now.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ??
            "I’m not certain from the approved details. I’ll have Mir follow up directly.",
        },
      ]);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Cogsworth is unavailable right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3">
      {open ? (
        <section
          aria-label="Cogsworth, Glass City Timepieces AI concierge"
          className="w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-sm border border-[var(--border-strong)] bg-[rgba(10,7,16,0.96)] shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <div className="border-b border-[var(--border)] p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--bronze)]">
              Cogsworth
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-cormorant)] text-xl font-light text-[var(--foreground)]">
              AI concierge
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Collector-trained guidance for Glass City Timepieces. Mir confirms buying details directly.
            </p>
          </div>

          <div className="max-h-[22rem] space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-sm px-3 py-2 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-[var(--surface-elevated)] text-[var(--steel-bright)]"
                    : "ml-8 bg-[var(--purple)]/45 text-[var(--foreground)]"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="rounded-sm bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--muted)]">
                Thinking through the details…
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {error ? (
            <p className="border-t border-[var(--border)] px-4 py-2 text-xs leading-relaxed text-[var(--bronze-soft)]">
              {error}
            </p>
          ) : null}

          <form onSubmit={sendMessage} className="border-t border-[var(--border)] p-3">
            <label className="sr-only" htmlFor="concierge-message">
              Message Cogsworth
            </label>
            <textarea
              id="concierge-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="Ask about sizing, condition, full set, shipping, or fit..."
              className="min-h-20 w-full resize-none rounded-sm border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--bronze)]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const freshPreferences = parseStoredPreferences();
                  setMessages(createStarterMessages(freshPreferences));
                  setInput("");
                  setError(null);
                  setWatchContext(undefined);
                  window.sessionStorage.removeItem(sessionStorageKey);
                }}
                className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--steel-bright)]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem(preferenceStorageKey);
                  window.sessionStorage.removeItem(sessionStorageKey);
                  setVisitorPreferences(emptyPreferences);
                  setMessages(createStarterMessages(emptyPreferences));
                  setInput("");
                  setError(null);
                  setWatchContext(undefined);
                }}
                className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--steel-bright)]"
              >
                Forget my preferences
              </button>
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="btn-bronze rounded-sm px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="btn-bronze rounded-full px-5 py-3 text-sm font-medium shadow-xl shadow-black/40"
        aria-expanded={open}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
