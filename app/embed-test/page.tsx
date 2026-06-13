import type { Metadata } from "next";
import Script from "next/script";

// Internal validation page for the Revantex embed widget running on the
// real GCT domain. Kept out of search indexes and the site nav — reach
// it directly at /embed-test.
export const metadata: Metadata = {
  title: "Revantex embed test (internal)",
  robots: { index: false, follow: false },
};

const REVANTEX_TENANT = "b9fe5fc9-925f-4eab-8b11-d95112e1f012";

const CHECKS = [
  "The “Ask Avidor” bubble appears bottom-right, in Avidor's brand colors.",
  "Open it — the greeting streams in from revantex.com (cross-origin).",
  "Ask “tell me about the Blacktrack” — the listing photo should render in the reply.",
  "Ask “which one is a limited edition?” — should answer the Bell & Ross, 131/500.",
  "Ask “what's the case size on the Rado?” — should answer 43mm from inventory.",
  "Say “I'd like to buy it, reach me at you@email.com” — a lead email should hit mir@glasscitytimepieces.com.",
  "Tap the mic (Chrome/Safari) and speak a question — voice input should transcribe.",
];

export default function EmbedTestPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
        Internal · not linked publicly
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
        Revantex embed test
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--steel)]">
        This page loads the Revantex Concierge widget exactly the way a customer would —
        a single script tag pointing at <code className="text-[var(--bronze-soft)]">revantex.com</code>,
        running cross-origin on the live GCT domain. The site&apos;s own Avidor (bottom-right on
        every other page) is untouched; only this page carries the Revantex version.
      </p>

      <div className="mt-8 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          What to check
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--steel)]">
          {CHECKS.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="text-[var(--bronze)]">›</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-[var(--muted)]">
        Embed snippet under test:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-sm border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs text-[var(--steel)]">
        {`<script src="https://revantex.com/embed.js"\n        data-tenant="${REVANTEX_TENANT}" async></script>`}
      </pre>

      {/* The embed itself — afterInteractive injects a real <script> tag;
          the widget's currentScript fallback locates it by data-tenant. */}
      <Script
        src="https://revantex.com/embed.js"
        data-tenant={REVANTEX_TENANT}
        strategy="afterInteractive"
      />
    </main>
  );
}
