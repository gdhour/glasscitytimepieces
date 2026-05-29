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

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "I’m Cogsworth. Ask me about the current Rado, sizing, condition, set contents, shipping, or how a piece fits your taste. I’ll keep it direct and collector-minded.",
  },
];

function isAskWatchEvent(event: Event): event is CustomEvent<AskWatchDetail> {
  return "detail" in event;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [watchContext, setWatchContext] = useState<string | undefined>();
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

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
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
                  setMessages(starterMessages);
                  setInput("");
                  setError(null);
                  setWatchContext(undefined);
                }}
                className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--steel-bright)]"
              >
                Reset
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
