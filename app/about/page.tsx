import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BrandLogo from "../components/BrandLogo";
import OpenAvidorButton from "../components/OpenAvidorButton";

export const metadata: Metadata = {
  title: "About Mir — Glass City Timepieces",
  description:
    "Glass City Timepieces is a personally curated watch practice based in Toledo, Ohio. Mir Ali on collecting, curation, and why every piece here earned its place.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="guilloche pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_0%,var(--glow-purple)_0%,transparent_60%),linear-gradient(180deg,var(--surface)_0%,var(--background)_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
            About
          </p>
          <h1 className="mt-5 max-w-2xl font-[family-name:var(--font-cormorant)] text-4xl font-light leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            A collector's practice, not a retail operation.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--steel)] sm:text-lg">
            Glass City Timepieces is one person with a point of view, a network of trusted sources, and a genuine belief that the right watch changes how you move through the world.
          </p>
        </div>
      </section>

      {/* Portrait + story */}
      <section className="border-b border-[var(--border)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20 xl:grid-cols-[420px_minmax(0,1fr)]">

            {/* Portrait photo */}
            <div className="flex flex-col gap-6">
              <div className="surface-card relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--surface-elevated)]">
                <Image
                  src="/collection/mir-ali-portrait.jpg"
                  alt="Mir Ali — Glass City Timepieces"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
              </div>
              <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)]">
                {[
                  { label: "Based in", value: "Toledo, Ohio" },
                  { label: "Interests", value: "Arts · Cars · Travel · Marathons" },
                  { label: "Call", value: "419-975-9754", href: "tel:+14199759754" },
                  { label: "Email", value: "info@glasscitytimepieces.com", href: "mailto:info@glasscitytimepieces.com" },
                ].map(({ label, value, href }) => (
                  <div key={label} className="bg-[var(--surface-elevated)] px-5 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block text-sm font-medium text-[var(--bronze)] hover:text-[var(--bronze-soft)] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-[var(--steel-bright)]">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Story */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                  The curator
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                  Mir Ali
                </h2>
              </div>

              <blockquote className="border-l-2 border-[var(--bronze)] pl-5 font-[family-name:var(--font-cormorant)] text-lg font-light leading-relaxed text-[var(--foreground)] sm:text-xl">
                Every great timepiece has a story — and so does this one. I
                founded Glass City Timepieces for those who wear their passions
                on their wrist. Whether you live for the race, the dive, the
                flight, or the stars, there&apos;s a watch made for the life
                you live.
              </blockquote>

              <div className="space-y-5 text-sm leading-relaxed text-[var(--steel)]">
                <p>
                  I am a native Ohioan and have been in Toledo for over thirty years. Most people don't know the city the way I do: the Toledo Museum of Art is genuinely world class, the jazz tradition is deep and real, and the art scene is more alive than most cities twice its size. My passions have always run wide — the arts, fast and beautiful cars, global travel, running marathons, family life. The watches arrived later, but they fit: a mechanical watch is one of the few objects that sits at the intersection of engineering, design, history, and craft simultaneously. My love of the arts is reflected in the pieces I choose.
                </p>
                <p>
                  My obsession with watches started earlier than most — with a book. John Christopher's <em>The White Mountains</em> features a mechanical watch as one of its central objects: a relic from a world before the Tripods, passed between characters as a symbol of what had been lost and what might still be recovered. I read it young, and something about a small precise machine that kept its own time — quietly, without permission — stayed with me. It took decades before I understood why. Glass City Timepieces is what that thread became.
                </p>
                <p>
                  I started buying seriously, then selling pieces I'd outgrown, then sourcing for other collectors. Every step reinforced the same instinct: the right watch is worth seeking out, and most people never find it because nobody guides them toward it honestly.
                </p>
                <p>
                  Everything here has been personally considered. I don't list a watch I wouldn't stand behind in a room of serious collectors. The inventory is small by design — I'd rather have five pieces I believe in than fifty that are just available.
                </p>
                <p>
                  I built Avidor, this site's AI concierge, to extend the same standard of advice to anyone who visits — whether you're buying your first mechanical watch or your fortieth. It draws on the same knowledge base I use when I'm evaluating a piece for my own collection.
                </p>
                <p>
                  Consultations happen by Google Meet. No obligation, no rush. If you have a question about something on the site or something you're hunting for elsewhere, reach out.
                </p>
              </div>

              <a
                href="https://calendar.app.google/CbYQvnCDFULo9PNx7"
                target="_blank"
                rel="noreferrer"
                className="btn-bronze w-fit rounded-sm px-6 py-3 text-sm font-medium"
              >
                Schedule a consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
              How I curate
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
              What earns a place here.
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {[
                {
                  title: "Dial character",
                  description: "A dial that rewards close inspection — texture, color, finishing detail, or a complication that earns its presence on the face.",
                },
                {
                  title: "Movement story",
                  description: "In-house calibers, historically significant movements, unusual escapements, or technical achievements that the case doesn't fully reveal.",
                },
                {
                  title: "Proportions on the wrist",
                  description: "Case geometry and lug-to-lug that suits the human wrist. I have little patience for watches that wear badly regardless of what's inside.",
                },
                {
                  title: "Honest value",
                  description: "Something that does its job better than its peers, or offers a level of craft that the price doesn't fully explain.",
                },
              ].map(({ title, description }) => (
                <div key={title} className="bg-[var(--surface-elevated)] p-6">
                  <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avidor callout */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--bronze)]">
                Avidor
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[var(--foreground)] sm:text-4xl">
                An AI concierge built for collectors.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--steel)]">
                Avidor started as a tool I built for myself — a way to manage collection notes, track references, and answer the questions that come up constantly when you're evaluating a watch. I opened it to visitors because the same questions come up for everyone: sizing, condition, value, alternatives.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--steel)]">
                Ask it anything. It knows the inventory in detail and has broad horological knowledge for anything outside it. When a conversation moves toward a transaction, it brings me in directly.
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-full rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-6 sm:p-8">
                <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[var(--foreground)]">
                  &ldquo;Whether you&apos;re searching for your first mechanical watch, your next grail, or just browsing — I&apos;m here.&rdquo;
                </p>
                <p className="mt-4 text-xs text-[var(--muted)]">— Avidor, Glass City Timepieces AI concierge</p>
                <OpenAvidorButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
