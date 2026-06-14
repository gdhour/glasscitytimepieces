"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };
type Product = { name: string; price: string; image: string; url: string };

const SUGGESTIONS = [
  "An everyday dress watch under $8k",
  "Something with a green dial",
  "A bold piece that starts conversations",
  "A first serious mechanical watch",
];

// The concierge emits root-relative paths for both images (/collection/…)
// and links (/watch/SLUG), so we allow same-origin relative paths and
// http(s) URLs but strip script-executing schemes (javascript:, data:,
// vbscript:, …) that would otherwise render as a clickable XSS vector.
function safeUrl(u: string): string {
  const v = u.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return /^https?:\/\//i.test(v) ? v : "";
}

function parseProducts(content: string): { text: string; products: Product[] } {
  const products: Product[] = [];
  let text = content.replace(/\[\[product:([^\]]*)\]\]/g, (_, body: string) => {
    const [name, price, image, url] = body.split("|").map((s) => s.trim());
    if (name)
      products.push({
        name,
        price: price ?? "",
        image: safeUrl(image ?? ""),
        url: safeUrl(url ?? ""),
      });
    return "";
  });
  text = text.replace(/\[\[product:[^\]]*$/, "").trim();
  return { text, products };
}

export default function WatchSearch() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function runSearch(query: string) {
    const text = query.trim();
    if (!text || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, search: true }),
      });
      if (!res.ok || !res.body) throw new Error("unavailable");
      setLoading(false);
      setMessages((cur) => [...cur, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((cur) => {
          const msgs = [...cur];
          const last = msgs[msgs.length - 1];
          if (last?.role === "assistant") {
            return [...msgs.slice(0, -1), { role: "assistant" as const, content: last.content + chunk }];
          }
          return msgs;
        });
        bottomRef.current?.scrollIntoView({ block: "end" });
      }
      reader.releaseLock();
    } catch {
      setLoading(false);
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: "Something went wrong — please try again in a moment." },
      ]);
    }
  }

  const started = messages.length > 0;

  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <header className={started ? "mb-10" : "mb-10 pt-8 text-center"}>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
          Conversational search
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl">
          Tell me what you&apos;re looking for.
        </h1>
        {!started && (
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--steel)]">
            Describe the watch you want — a vibe, an occasion, a budget — and I&apos;ll pull the
            closest pieces from the collection, with a reason.
          </p>
        )}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(input);
        }}
        className="sticky top-20 z-20"
      >
        <div className="flex items-center gap-2 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-2 shadow-lg shadow-black/40">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search the collection…"
            className="flex-1 bg-transparent px-3 py-2 text-base text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-bronze rounded-sm px-6 py-2.5 text-sm font-medium disabled:opacity-40"
          >
            Search
          </button>
        </div>
      </form>

      {!started && (
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => runSearch(s)}
              className="rounded-sm border border-[var(--border)] px-3.5 py-1.5 text-xs text-[var(--steel)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-12 space-y-10">
        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <p key={i} className="text-sm text-[var(--muted)]">
                <span className="text-[var(--bronze)]">You asked:</span> {msg.content}
              </p>
            );
          }
          const { text, products } = parseProducts(msg.content);
          return (
            <div key={i} className="space-y-6">
              {text && (
                <p className="max-w-2xl font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[var(--foreground)]">
                  {text}
                </p>
              )}
              {products.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p, j) => {
                    const card = (
                      <>
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.name}
                            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        )}
                        <div className="p-5">
                          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light leading-tight text-[var(--foreground)]">
                            {p.name}
                          </h3>
                          {p.price && (
                            <p className="mt-2 text-sm font-medium text-[var(--bronze)]">{p.price}</p>
                          )}
                          {p.url && (
                            <span className="mt-3 inline-block text-xs font-medium text-[var(--steel-bright)]">
                              View details →
                            </span>
                          )}
                        </div>
                      </>
                    );
                    return p.url ? (
                      <Link
                        key={j}
                        href={p.url}
                        className="surface-card group block overflow-hidden rounded-sm"
                      >
                        {card}
                      </Link>
                    ) : (
                      <div key={j} className="surface-card group block overflow-hidden rounded-sm">
                        {card}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {loading && <p className="animate-pulse text-sm text-[var(--muted)]">Searching the collection…</p>}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}
